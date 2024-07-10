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
const sendEmail = require("./emailController");

const { Error } = require("mongoose");

const getAuthUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const singleUser = await User.findById(id).select("-password");
    if (!singleUser) throw new Error("User Not Found");
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: singleUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const singleUser = await User.findById(id).select("-password");
    if (!singleUser) throw new Error("User Not Found");
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: singleUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  let query = {};
  if (req.query.search) {
    query.$or = [
      { first_name: { $regex: req.query.search, $options: "i" } },
      { last_name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }
  const pageSize = req.query.limit || 10;
  const currentPage = req.query.page || 1;
  const skip = pageSize * (currentPage - 1);
  const totalUsers = await User.countDocuments();
  try {
    if (req.query.page) {
      if (skip >= totalUsers) throw new Error("This Page does not exists");
    }
    // const allUsers = await User.find().select("-password");
    const allUsers = await User.find(query) //we use FIND because user can have more than one order
      .sort({ createdAt: -1 })
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .select("-password")
      .select("-refreshToken");
    const ActiveUsers = allUsers.filter((st) => st.isBlocked == false);
    const NontActiveUsers = allUsers.filter((st) => st.isBlocked);

    // count the total number of return recods
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users: allUsers,
      totalPage: parseInt(pageSize),
      totalRecords: parseInt(totalUsers),
      page: parseInt(currentPage),
      activeUsers: ActiveUsers.length,
      notActiveUsers: NontActiveUsers.length,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user_id = req.params.id;
  const { id } = req.user;
  if (user_id != id)
    return res.status(401).json({
      success: false,
      message: "You are not the owner of this account",
    });
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(user_id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatedUser = asyncHandler(async (req, res) => {
  const user_id = req.params.id;
  const { id } = req.user; //logged in user id
  if (user_id != id) // checking if the user is the account real user
    return res.status(403).json({
      success: false,
      message: "You are not the owner of this account",
    });
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        first_name: req?.body?.first_name,
        last_name: req?.body?.last_name,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAuthUser,
  getUser,
  getAllUsers,
  deleteUser,
  updatedUser,
};
