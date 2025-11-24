// backend/controllers/wishlistController.js
import Wishlist from "../models/wishlistModel.js";

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ use authenticated user
    const wishlist = await Wishlist.findOne({ userId }).populate("products");
    return res.json({ wishlist: wishlist || { products: [] } });
  } catch (err) {
    console.error("Get wishlist error:", err);
    return res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from token
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = new Wishlist({ userId, products: [] });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await wishlist.populate("products");
    return res.json({ wishlist: populated });
  } catch (err) {
    console.error("Add wishlist error:", err);
    return res.status(500).json({ message: "Error adding to wishlist", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from token
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    const populated = await wishlist.populate("products");
    return res.json({ wishlist: populated });
  } catch (err) {
    console.error("Remove wishlist error:", err);
    return res.status(500).json({ message: "Error removing from wishlist", error: err.message });
  }
};
