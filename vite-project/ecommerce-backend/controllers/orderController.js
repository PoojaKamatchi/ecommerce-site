// controllers/orderController.js
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import path from "path";
import fs from "fs";

// Create Order
// controllers/orderController.js (replace createOrder function with this)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Defensive parsing: cartItems might be a JSON string (if client sent wrong headers)
    let { name, mobile, address, cartItems, totalAmount, paymentMethod, shippingCharge = 0 } = req.body;

    if (typeof cartItems === "string") {
      try {
        cartItems = JSON.parse(cartItems);
      } catch (e) {
        cartItems = [];
      }
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.product?._id || item.productId,
      name: item.name || item.product?.name || "Unnamed Product",
      price: item.price || item.product?.price || 0,
      quantity: item.quantity || 1,
    }));

    const newOrder = new Order({
      user: userId,
      name,
      mobile,
      orderItems,
      shippingAddress: address,
      totalAmount,
      shippingCharge,
      paymentMethod: paymentMethod || "COD",
      status: paymentMethod === "UPI" ? "Pending" : "Processing",
    });

    await newOrder.save();
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};


// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({ path: "orderItems.productId", select: "name price" })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (order.status !== "Processing" && order.status !== "Pending")
      return res.status(400).json({ message: "Only Processing orders can be cancelled" });

    order.status = "Cancelled";
    await order.save();
    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Cannot cancel order", error: err.message });
  }
};

// Upload Payment Screenshot (for UPI)
export const uploadPaymentScreenshot = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (!req.file) return res.status(400).json({ message: "Screenshot is required" });

    // Save screenshot path
    order.paymentScreenshot = `/uploads/${req.file.filename}`;
    order.upiTransactionId = req.body.transactionId || null;
    order.status = "Processing"; // now admin can verify
    await order.save();

    res.json({ message: "Payment screenshot uploaded", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
