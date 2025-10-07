// routes/cartRoutes.js
import express from "express";
import Cart from "../models/Cart.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user cart
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
  res.json(cart || { items: [], totalPrice: 0 });
});

// Add item to cart
router.post("/add", protect, async (req, res) => {
  const { productId, quantity, price } = req.body;

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = new Cart({ userId: req.user._id, items: [], totalPrice: 0 });

  const existing = cart.items.find((i) => i.productId.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  cart.totalPrice += price * quantity;
  await cart.save();

  res.json(cart);
});

// Clear cart after payment
router.delete("/clear", protect, async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user._id });
  res.json({ message: "Cart cleared" });
});

export default router;
