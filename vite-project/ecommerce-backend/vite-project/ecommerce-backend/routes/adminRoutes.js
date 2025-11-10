import express from "express";
import {
  registerAdmin,
  adminLogin,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getAllUsers,
  getAllOrders,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);

// ✅ Category routes (no subcategory)
router.post("/category", addCategory);
router.get("/category", getCategories);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

export default router;
