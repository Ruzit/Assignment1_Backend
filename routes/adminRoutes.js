const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllCarts,
  deleteUser,
  updateUserRole,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// All admin routes require login + admin role
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/carts", protect, adminOnly, getAllCarts);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
