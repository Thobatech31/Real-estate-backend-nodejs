const User = require("../models/userModel");
const Product = require("../models/postModel");

const uniqid = require("uniqid");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { param } = require("../routes/authRoute");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("./emailController");
const { welcomeEmailMessage } = require("../email_templates/welcomeEmail");
const {
  fogotPasswordEmailMessage,
} = require("../email_templates/fogotPasswordEmail");

const {
  loginSchema,
  registerSchema,
  changePasswordSchema,
} = require("../middlewares/authentication/users_validation_schema");
const { Error } = require("mongoose");

const createUser = asyncHandler(async (req, res) => {
  const { username, email, mobile } = req.body;
  //Check if username already exists in the DB
  const usernameExists = await User.checkUsernameAlreadyExist(username);
  if (usernameExists) {
    res.status(401).json({
      success: false,
      message: "Username Already Exists",
    });
  }
  //Check if email already exists in the DB
  const emailExists = await User.checkEmailAlreadyExist(email);
  if (emailExists) {
    res.status(401).json({
      success: false,
      message: "Email Already Exists",
    });
  }
  //Check if Mobile already exists in the DB
  const mobileExists = await User.checkMobileAlreadyExist(mobile);
  if (mobileExists) {
    res.status(401).json({
      success: false,
      message: "Phone No Already Exists",
    });
  }
  // const findUser = await User.findOne({ email: email });
  try {
    await registerSchema.validateAsync(req.body);
    const newUser = await User.create(req.body);
    const data = {
      to: email,
      text: "Hey User",
      subject: "Login Successfully",
      htm: welcomeEmailMessage(username),
    };
    sendMail(data);
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (err) {
    const error = new Error(err);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //checking if user exist or not
  const emailExists = await User.checkEmailAlreadyExist(email);
  if (!emailExists) {
    res.status(401).json({
      success: false,
      message: "Email Not Found In the Database",
    });
  }

  // throw new Error("Email Not Found In The Database");
  try {
    await loginSchema.validateAsync(req.body);
    const findUser = await User.findOne({ email: email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateUser = await User.findByIdAndUpdate(
        findUser?._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login Successfully",
        user: {
          _id: findUser?._id,
          firat_name: findUser?.first_name,
          last_name: findUser?.last_name,
          username: findUser?.username,
          email: findUser?.email,
          mobile: findUser?.mobile,
          address: findUser?.address,
          token: generateToken(findUser?._id),
        },
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    const error = new Error(err);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

//Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //checking if user exist or not
  //checking if user exist or not
  const emailExists = await User.checkEmailAlreadyExist(email);
  if (!emailExists) throw new Error("Email Not Found In The Db");
  try {
    await loginSchema.validateAsync(req.body);
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin")
      throw new Error("Not Authorised, you're Not Admin User");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateUser = await User.findByIdAndUpdate(
        findAdmin?._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "Login Successfully",
        user: {
          _id: findAdmin?._id,
          first_name: findAdmin?.first_name,
          last_name: findAdmin?.last_name,
          email: findAdmin?.email,
          mobile: findAdmin?.mobile,
          role: findAdmin?.role,
          token: generateToken(findAdmin?._id),
        },
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    throw new Error(err);
  }
});

//hANDLE REFRESH TOKEN
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.status(200).json({ accessToken });
  });
});

//Logout function


const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      updatedPassword: updatedPassword,
    });
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email",
    });
  }

  try {
    // Call createPasswordResetToken on the User model
    const token = await User.createPasswordResetToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();
    const mailData = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: fogotPasswordEmailMessage(process.env.STAGING_URL, token),
    };
    sendMail(mailData);
    res.status(200).json({
      success: true,
      message: "Forgot link has been sent to your Email successfully",
      token: token,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

//Logout function
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); //forbidden
});

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  logout
};
