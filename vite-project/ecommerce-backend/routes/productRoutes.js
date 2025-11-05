import express from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// 🛒 Public routes for customers
router.get("/", getProducts);
router.get("/category/:id", getProductsByCategory);
router.get("/:id", getProductById);

export default router;
