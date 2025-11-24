import express from "express";
import upload from "../middleware/uploadCategory.js";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminCategoryController.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// IMPORTANT: protect admin endpoints
router.get("/", adminProtect, getCategories);
router.post("/", adminProtect, upload.single("image"), addCategory);
router.put("/:id", adminProtect, upload.single("image"), updateCategory);
router.delete("/:id", adminProtect, deleteCategory);

export default router;
