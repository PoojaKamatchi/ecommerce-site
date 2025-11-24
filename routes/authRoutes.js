import express from "express";
import {
  loginUser,
  registerUser,
  verifyUserOtp,
  forgotUserPassword,
  resetUserPassword,
} from "../controllers/userController.js";

import {
  adminLogin,
  verifyAdminOtp,
  forgotAdminPassword,
  resetAdminPassword,
} from "../controllers/adminController.js";

const router = express.Router();

// User routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify-otp", verifyUserOtp);
router.post("/forgot-password", forgotUserPassword);
router.put("/reset-password", resetUserPassword);

// Admin routes
router.post("/admin/login", adminLogin);
router.post("/admin/verify-otp", verifyAdminOtp);
router.post("/admin/forgot-password", forgotAdminPassword);
router.put("/admin/reset-password", resetAdminPassword);

export default router;
