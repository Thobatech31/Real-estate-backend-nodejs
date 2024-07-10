const express = require("express");
const {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  uploadImages,
} = require("../controller/postController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/create", authMiddleware, createPost);
// router.post("/create", authMiddleware, isAdmin, createPost);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
router.get("/all", getAllPosts);
router.get("/:id", getPost);

router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
// router.put("/:id", authMiddleware, isAdmin, updatePost);
// router.delete("/:id", authMiddleware, isAdmin, deletePost);

module.exports = router;
