const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

// GET cart items
router.get("/", async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD item to cart (CREATE)
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if item already exists
    let item = await Cart.findOne({ productId });

    if (item) {
      item.quantity += quantity;
      await item.save();
      return res.json(item);
    }

    const newItem = new Cart({ productId, quantity });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE quantity
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await Cart.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.deleteOne();

    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
