// backend/routes/wishlistRoutes.js
import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT middleware

const router = express.Router();

// ✅ Protect all wishlist routes
router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);

export default router;
