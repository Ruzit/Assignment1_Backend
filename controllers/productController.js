const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, sort } = req.query;

    let filter = {};

    // Validate price inputs
    if (minPrice && isNaN(Number(minPrice))) {
      return res.status(400).json({
        success: false,
        message: "minPrice must be a valid number",
      });
    }

    if (maxPrice && isNaN(Number(maxPrice))) {
      return res.status(400).json({
        success: false,
        message: "maxPrice must be a valid number",
      });
    }

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }

    // Search by name
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

    // Allowed sort options
    const allowedSortOptions = [
      "price_asc",
      "price_desc",
      "name_asc",
      "name_desc",
    ];

    if (sort && !allowedSortOptions.includes(sort)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid sort value. Use price_asc, price_desc, name_asc, or name_desc",
      });
    }

    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else if (sort === "name_asc") {
      sortOption.name = 1;
    } else if (sort === "name_desc") {
      sortOption.name = -1;
    }

    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

module.exports = {
  getProducts,
};
