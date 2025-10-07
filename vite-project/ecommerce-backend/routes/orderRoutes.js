import express from "express";
import Order from "../models/orderModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new order
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalPrice, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalPrice,
      address,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get order by ID
router.get("/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
