import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  const { items, totalPrice, address, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  try {
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      address,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};
