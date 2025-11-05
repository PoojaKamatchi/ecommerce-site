import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import Order from "../models/orderModel.js";

const router = express.Router();

// ✅ Create new order
router.post("/create", protect, async (req, res) => {
  try {
    const { items, address, name, mobile, totalAmount, shippingCharge } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: items,
      shippingAddress: address,
      totalAmount,
      shippingCharge,
      name,
      mobile,
      status: "Processing",
    });

    const createdOrder = await order.save();
    res.status(201).json({
      message: "Order created successfully",
      orderId: createdOrder._id,
    });
  } catch (error) {
    console.error("Order Create Error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// ✅ Get all orders (Admin)
router.get("/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// ✅ Get orders for logged-in user
router.get("/user", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("User Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

// ✅ Cancel order (Customer)
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Delivered")
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });

    order.status = "Cancelled";
    const updated = await order.save();

    // Optional: emit socket event
    req.io?.emit("order-cancelled", updated);

    res.json({ message: "Order cancelled successfully", order: updated });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

// ✅ Update order status (Admin)
router.put("/status/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status || order.status;
    const updated = await order.save();

    // Optional: emit socket event
    req.io?.emit("order-status-updated", updated);

    res.json(updated);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
