const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized token expired, Please login again");
    }
  } else {
    res.status(403);
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { _id, email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role != "admin") {
    res.status(401);
    throw new Error("You are not an admin user");
  } else {
    next();
  }
});
module.exports = { authMiddleware, isAdmin };
