import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";

// 🟢 Create New Order (Customer)
export const createOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, mobile, address, cartItems, totalAmount, shippingCharge } = req.body;

    if (!name || !mobile || !address || !cartItems?.length) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const newOrder = new Order({
      user: userId,
      name,
      mobile,
      address,
      cartItems,
      totalAmount,
      shippingCharge,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// 🟡 Get Orders for Logged-in User
export const getUserOrders = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 🔵 Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 🟠 Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// 🔴 Cancel Order (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ message: "Cannot cancel order" });
  }
};
