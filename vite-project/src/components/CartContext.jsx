// src/components/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getToken = () => localStorage.getItem("authToken");

  // Recalculate totals
  useEffect(() => {
    const count = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
    const total = cartItems.reduce(
      (acc, i) => acc + ((i.product?.price || 0) * (i.quantity || 0)),
      0
    );
    setCartCount(count);
    setTotalPrice(total);
  }, [cartItems]);

  // Listen for clearCart event
  useEffect(() => {
    const handleClearCart = () => setCartItems([]);
    window.addEventListener("clearCart", handleClearCart);
    return () => window.removeEventListener("clearCart", handleClearCart);
  }, []);

  // Fetch cart items from backend
  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Normalize cart items safely
      const items = (res.data.items || []).map((item) => {
        const product = item.product || {};
        const name =
          product.name && typeof product.name === "object"
            ? product.name.en || product.name.ta || "Unnamed Product"
            : product.name || "Unnamed Product";
        return {
          ...item,
          product: { ...product, name },
          quantity: item.quantity || 1,
        };
      });

      setCartItems(items);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const token = getToken();
    if (!token) return alert("Please login first!");

    const existingItem = cartItems.find((i) => i.product?._id === product._id);

    try {
      let updatedCart = [];
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const res = await axios.put(
          `${API_URL}/api/cart/update`,
          { productId: product._id, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatedCart = res.data.items;
      } else {
        const res = await axios.post(
          `${API_URL}/api/cart/add`,
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatedCart = res.data.items;
      }

      const items = updatedCart.map((item) => {
        const product = item.product || {};
        const name =
          product.name && typeof product.name === "object"
            ? product.name.en || product.name.ta || "Unnamed Product"
            : product.name || "Unnamed Product";
        return { ...item, product, name, quantity: item.quantity || 1 };
      });

      setCartItems(items);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    const token = getToken();
    if (!token) return alert("Please login first!");
    try {
      const res = await axios.put(
        `${API_URL}/api/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = (res.data.items || []).map((item) => {
        const product = item.product || {};
        const name =
          product.name && typeof product.name === "object"
            ? product.name.en || product.name.ta || "Unnamed Product"
            : product.name || "Unnamed Product";
        return { ...item, product, name, quantity: item.quantity || 1 };
      });

      setCartItems(items);
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    const token = getToken();
    if (!token) return alert("Please login first!");
    try {
      const res = await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = (res.data.items || []).map((item) => {
        const product = item.product || {};
        const name =
          product.name && typeof product.name === "object"
            ? product.name.en || product.name.ta || "Unnamed Product"
            : product.name || "Unnamed Product";
        return { ...item, product, name, quantity: item.quantity || 1 };
      });

      setCartItems(items);
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    const token = getToken();
    if (!token) return alert("Please login first!");
    try {
      await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
