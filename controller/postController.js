const Post = require("../models/postModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");
const {
  createPostSchema,
} = require("../middlewares/authentication/posts_validation_schema");
const { request } = require("http");

createPost = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const { id } = req.user; //logged(auth) in user id
    const newPost = await Post.create({ ...req.body, userId: id });
    res.json({
      success: true,
      message: "Post Created Successfully",
      post: { newPost },
    });
  } catch (error) {
    throw new Error(error);
  }
});

getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findPost = await Post.findById(id);
    res.json({
      success: true,
      message: "Post fetched successfully",
      post: findPost,
    });
  } catch (error) {
    throw new Error(error);
  }
});

getAllPosts = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Post.find(JSON.parse(queryStr));
    // let query = Post.find({
    //   queryStr: { $regex: new RegExp("^" + JSON.parse(queryStr), "i") },
    // });

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    let totalRecords = 0;
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const PostCount = await Post.countDocuments();
      if (skip >= PostCount)
        res.status(403).json({ message: "This Page does not exists" });
    }

    post = await query;
    totalRecords = await Post.countDocuments();
    res.json({
      success: true,
      message: "Posts Fetched Successfully",
      Posts: post,
      totalRecords: totalRecords,
    });
  } catch (error) {
    throw new Error(error);
  }
});

updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatePost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      success: true,
      message: "Post Update Successfully",
      post: updatePost,
    });
  } catch (error) {
    throw new Error(error);
  }
});

deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const auth_user_id = req.user.id; //logged in user id
  validateMongoDbId(id);
  const post = await Post.findById(id);
  if(!post) return res.status(403).json({
    success: false,
    message: "Post not Found, check param Id",
  });
  if (post.userId != auth_user_id)
    //checking if the post UserId is the equivallent to auth id
    return res.status(403).json({
      success: false,
      message: "You are not authorised to delete the post",
    });
  try {
    findPost = await Post.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});


const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findPost = await Post.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json({
      success: true,
      message: "Upload Successfully",
      findPost,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  uploadImages,
};
