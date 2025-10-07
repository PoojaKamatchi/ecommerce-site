// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // fixed key
    if (!token) {
      alert("⚠️ Please login to proceed with checkout.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleConfirmOrder = async () => {
    if (!address) {
      alert("Please add your address before confirming.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {
          items: cartItems.map((item) => ({
            productId: item.product?._id,
            quantity: item.quantity,
            price: item.product?.price,
          })),
          totalPrice,
          address,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        clearCart();
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to confirm order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Your cart is empty.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">🛒 Checkout</h2>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Order Summary</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between border-b py-2 text-gray-700"
              >
                <span>
                  {item.product?.name || "Unnamed Product"} × {item.quantity}
                </span>
                <span>₹{(item.product?.price || 0) * item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold text-lg mt-4">Total: ₹{totalPrice}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Delivery Address</h3>
          <textarea
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
          />
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-2">Payment Method</h3>
          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className="mr-2"
              />
              Online Payment
            </label>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
