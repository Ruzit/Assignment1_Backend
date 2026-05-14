const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart || { userId: req.user._id, products: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        products: [{ productId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId,
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params; // productId

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === id,
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    product.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params; // productId

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== id,
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart summary fetched successfully",
        data: {
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    const totalItems = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const totalPrice = cart.products.reduce(
      (sum, item) => sum + item.quantity * item.productId.price,
      0,
    );

    res.status(200).json({
      success: true,
      message: "Cart summary fetched successfully",
      data: {
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart summary",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getCartSummary,
  clearCart,
};
