const Cart = require("../models/cart");

// Get all cart items
const getCartItems = async (req, res) => {
  try {
    // const { search, sort } = req.query;

    const cartItems = await Cart.find().populate("productId");

    // // Search by product name
    // if (search) {
    //   cartItems = cartItems.filter((item) =>
    //     item.productId?.name.toLowerCase().includes(search.toLowerCase())
    //   );
    // }

    // // Sort cart items
    // if (sort === "name_asc") {
    //   cartItems.sort((a, b) => a.productId.name.localeCompare(b.productId.name));
    // } else if (sort === "name_desc") {
    //   cartItems.sort((a, b) => b.productId.name.localeCompare(a.productId.name));
    // } else if (sort === "quantity_asc") {
    //   cartItems.sort((a, b) => a.quantity - b.quantity);
    // } else if (sort === "quantity_desc") {
    //   cartItems.sort((a, b) => b.quantity - a.quantity);
    // } else if (sort === "total_asc") {
    //   cartItems.sort(
    //     (a, b) => a.productId.price * a.quantity - b.productId.price * b.quantity
    //   );
    // } else if (sort === "total_desc") {
    //   cartItems.sort(
    //     (a, b) => b.productId.price * b.quantity - a.productId.price * a.quantity
    //   );
    // }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const existingItem = await Cart.findOne({ productId });

    // Check if the item already exists in the cart
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const newCartItem = new Cart({
      productId,
      quantity,
    });

    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true },
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Failed to delete cart item" });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
};
