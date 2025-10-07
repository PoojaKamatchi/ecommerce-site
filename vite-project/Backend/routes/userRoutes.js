import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser); // User register
router.post("/login", loginUser);       // User login

export default router;
