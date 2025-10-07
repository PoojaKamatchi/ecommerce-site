import express from "express";
import { registerAdmin, adminLogin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin); // Admin register
router.post("/login", adminLogin);       // Admin login

export default router;
