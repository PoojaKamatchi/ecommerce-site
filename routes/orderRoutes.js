// routes/orderRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import {
  createOrder,
  getUserOrders,
  cancelOrder,
  uploadPaymentScreenshot,
} from "../controllers/orderController.js";

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/create", protect, createOrder);
router.get("/user", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.post("/:id/upload-screenshot", protect, upload.single("screenshot"), uploadPaymentScreenshot);

export default router;
