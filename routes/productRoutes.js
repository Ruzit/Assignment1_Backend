const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// GET products with filters
router.get("/", async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let filter = {};

    // Filter by name (case insensitive)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

module.exports = router;
