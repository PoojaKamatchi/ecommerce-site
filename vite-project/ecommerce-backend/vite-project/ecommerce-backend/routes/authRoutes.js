import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserAddress,
  adminLogin,
  registerAdmin,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/address", protect, updateUserAddress);

// Admin routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", adminLogin);
router.get("/admin/users", adminProtect, getAllUsers);

export default router;
