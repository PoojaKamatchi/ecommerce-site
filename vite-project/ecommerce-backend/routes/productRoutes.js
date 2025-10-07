import express from "express";
import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProductStock,
  searchProducts 
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", addProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.patch("/stock/:id", updateProductStock);
router.get("/search", searchProducts);
export default router;
