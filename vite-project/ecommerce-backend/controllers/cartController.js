// backend/controllers/cartController.js
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ➤ ADD TO CART (NO STOCK REDUCTION HERE)
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Create cart if not exists
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    return res.status(200).json({ cart: populated });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({
      message: "Failed to add to cart",
      error: err.message,
    });
  }
};

// ➤ GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.json({ cart: { items: [] } });

    return res.json({ cart });
  } catch (err) {
    console.error("Get cart error:", err);
    return res.status(500).json({ message: "Error fetching cart" });
  }
};

// ➤ UPDATE QUANTITY
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await cart.save();
    const populated = await cart.populate("items.product");

    return res.json({ cart: populated });
  } catch (err) {
    console.error("Update cart error:", err);
    return res.status(500).json({
      message: "Failed to update cart",
      error: err.message,
    });
  }
};

// ➤ REMOVE ITEM (NO STOCK ADDING BACK)
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const populated = await cart.populate("items.product");

    return res.json({ cart: populated });
  } catch (err) {
    console.error("Remove error:", err);
    return res.status(500).json({ message: "Failed to remove item" });
  }
};

// ➤ CLEAR CART (NO STOCK LOGIC)
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart)
      return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    return res.json({ message: "Cart cleared", cart: { items: [] } });
  } catch (err) {
    console.error("Clear cart error:", err);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};
