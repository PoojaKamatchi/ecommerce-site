import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  registerUser,
  verifyUserOtp,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/verify-otp", verifyUserOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotUserPassword);
router.post("/reset-password", resetUserPassword);

// Protected
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
