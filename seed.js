const mongoose = require("mongoose");
const dotenv = require("dotenv");
const product = require("./models/product");
const products = require("./data/products");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected for seeding");
  })
  .catch((error) => {
    console.error("Connection error:", error);
    process.exit(1);
  });

const importData = async () => {
  try {
    await product.deleteMany();
    await product.insertMany(products);
    console.log("Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

importData();
