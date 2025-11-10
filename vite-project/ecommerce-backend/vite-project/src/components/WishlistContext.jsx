import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  // 🧾 Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId || !token) return;
      try {
        const { data } = await axios.get(`${API_URL}/api/wishlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(data.products || []);
      } catch (error) {
        console.error("❌ Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, [userId, token]);

  // ➕ Add product to wishlist
  const addToWishlist = async (product) => {
    if (!userId || !token) {
      alert("Please log in to add items to your wishlist ❤️");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/api/wishlist/add`,
        { userId, productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist((prev) => {
        const alreadyInList = prev.some((p) => p._id === product._id);
        return alreadyInList ? prev : [...prev, product];
      });

      console.log("✅ Added to wishlist:", data);
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
    }
  };

  // ❌ Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!userId || !token) return;
    try {
      await axios.delete(`${API_URL}/api/wishlist/remove/${productId}`, {
        data: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
    }
  };

  // 🧡 Check if product is already in wishlist
  const isInWishlist = (productId) =>
    wishlist.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
