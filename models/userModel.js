const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
   
    address: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Check if email is already exist
userSchema.statics.checkEmailAlreadyExist = async (email) => {
  const emailExists = await User.findOne({ email });
  if (emailExists) return emailExists;
};
//Check if username is already exist
userSchema.statics.checkUsernameAlreadyExist = async (username) => {
  const usernameExists = await User.findOne({ username });
  if (usernameExists) return usernameExists;
};

//Check if mobile is already exists
userSchema.statics.checkMobileAlreadyExist = async (mobile) => {
  const mobileExists = await User.findOne({ mobile });
  if (mobileExists) return mobileExists;
};

//for login function to match the hash password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Pssword reset token
userSchema.statics.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 times
  return resettoken;
};
//Export the model
// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);

module.exports = User;
