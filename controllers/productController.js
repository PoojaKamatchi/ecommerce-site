import Product from "../models/productModel.js";
import mongoose from "mongoose";

// 🛍️ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    const formatted = products.map((p) => ({
      ...p._doc,
      image: p.image?.startsWith("http")
        ? p.image
        : `${req.protocol}://${req.get("host")}${p.image}`,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// 🆕 Get products by Category
export const getProductsByCategory = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const products = await Product.find({ category: id }).populate("category", "name");
    const formatted = products.map((p) => ({
      ...p._doc,
      image: p.image?.startsWith("http")
        ? p.image
        : `${req.protocol}://${req.get("host")}${p.image}`,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("🔥 Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products by category" });
  }
};

// 🆕 Get single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const imagePath = product.image?.startsWith("http")
      ? product.image
      : `${req.protocol}://${req.get("host")}${product.image}`;

    res.json({ ...product._doc, image: imagePath });
  } catch (error) {
    console.error("🔥 Error fetching single product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// 🔍 Search products by name
export const searchProducts = async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === "") return res.json([]);

  try {
    const products = await Product.find({
      "name.en": { $regex: query.trim(), $options: "i" },
    }).populate("category", "name");

    const formatted = products.map((p) => ({
      ...p._doc,
      image: p.image?.startsWith("http")
        ? p.image
        : `${req.protocol}://${req.get("host")}${p.image}`,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("🔥 Error searching products:", error);
    res.status(500).json({ message: "Failed to search products", error: error.message });
  }
};
