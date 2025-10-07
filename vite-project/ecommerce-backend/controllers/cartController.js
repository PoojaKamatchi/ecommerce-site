import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) return res.status(200).json({ items: [], totalItems: 0, totalPrice: 0 });

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    res.status(200).json({ items: cart.items, totalItems, totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items.id(req.params.id)?.remove();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing cart item" });
  }
};
