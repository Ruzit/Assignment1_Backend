const express = require("express");
const router = express.Router();

const {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getCartSummary,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCartItems);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCartItem);
router.delete("/:id", protect, deleteCartItem);
router.get("/summary", protect, getCartSummary);
router.delete("/", protect, clearCart);

module.exports = router;
