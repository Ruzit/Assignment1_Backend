const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get all cart items with search and sort
const getCartItems = async (req, res) => {
  try {
    const { search, sort } = req.query;

    const allowedSortOptions = [
      "name_asc",
      "name_desc",
      "quantity_asc",
      "quantity_desc",
      "total_asc",
      "total_desc",
    ];

    if (sort && !allowedSortOptions.includes(sort)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid sort value. Use name_asc, name_desc, quantity_asc, quantity_desc, total_asc, or total_desc",
      });
    }

    let cartItems = await Cart.find().populate("productId");

    if (search) {
      cartItems = cartItems.filter((item) =>
        item.productId?.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (sort === "name_asc") {
      cartItems.sort((a, b) =>
        a.productId.name.localeCompare(b.productId.name),
      );
    } else if (sort === "name_desc") {
      cartItems.sort((a, b) =>
        b.productId.name.localeCompare(a.productId.name),
      );
    } else if (sort === "quantity_asc") {
      cartItems.sort((a, b) => a.quantity - b.quantity);
    } else if (sort === "quantity_desc") {
      cartItems.sort((a, b) => b.quantity - a.quantity);
    } else if (sort === "total_asc") {
      cartItems.sort(
        (a, b) =>
          a.productId.price * a.quantity - b.productId.price * b.quantity,
      );
    } else if (sort === "total_desc") {
      cartItems.sort(
        (a, b) =>
          b.productId.price * b.quantity - a.productId.price * a.quantity,
      );
    }

    res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      data: cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
    });
  }
};

// Add item to cart
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

    const existingItem = await Cart.findOne({ productId });

    // Check if the item already exists in the cart
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: existingItem,
      });
    }

    const newCartItem = new Cart({
      productId,
      quantity,
    });

    await newCartItem.save();

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: newCartItem,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item id",
      });
    }

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true },
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item id",
      });
    }

    const deletedItem = await Cart.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
    });
  }
};

// Get cart summary
const getCartSummary = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
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
    console.error("Error fetching cart summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart summary",
    });
  }
};

// Clear all cart items
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
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
