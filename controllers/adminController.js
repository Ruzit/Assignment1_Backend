const User = require("../models/User");
const Cart = require("../models/Cart");

// Admin: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Admin: get all users' carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "name email role")
      .populate("products.productId");

    res.status(200).json({
      success: true,
      message: "All carts fetched successfully",
      data: carts,
    });
  } catch (error) {
    console.error("Get all carts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch carts",
    });
  }
};

// Admin: delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Cart.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and related cart items deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// Admin: update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// Admin: update product quantity in a user's cart
const updateUserCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    const item = cart.products.find(
      (p) => p.productId.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in user's cart",
      });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId })
      .populate("userId", "name email role")
      .populate("products.productId");

    res.status(200).json({
      success: true,
      message: "User cart item updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Update user cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user cart item",
    });
  }
};

// Admin: remove product from a user's cart
const removeUserCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from user's cart successfully",
    });
  } catch (error) {
    console.error("Remove user cart item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from user cart",
    });
  }
};

// Admin: clear a specific user's cart
const clearUserCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { products: [] },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "User cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear user cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear user cart",
    });
  }
};

module.exports = {
  getAllUsers,
  getAllCarts,
  deleteUser,
  updateUserRole,
  updateUserCartItem,
  removeUserCartItem,
  clearUserCart,
};
