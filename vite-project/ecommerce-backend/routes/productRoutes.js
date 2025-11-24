import express from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

// 🔍 Search route must come first
router.get("/search", searchProducts);

// 🛒 Get products by category
router.get("/category/:id", getProductsByCategory);

// 🛍️ Get single product by ID
router.get("/:id", getProductById);

// 🛒 Get all products
router.get("/", getProducts);

export default router;
