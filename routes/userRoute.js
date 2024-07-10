const express = require("express");
const {
  getAuthUser,
  getUser,
  getAllUsers,
  deleteUser,
  updatedUser,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/me", authMiddleware, getAuthUser);
router.get("/get-all-users", getAllUsers);
router.get("/:id", authMiddleware, authMiddleware, getUser);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/edit-user/:id", authMiddleware, updatedUser);

module.exports = router;
