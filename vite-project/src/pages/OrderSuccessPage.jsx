// ✅ src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [shippingCharge, setShippingCharge] = useState(50);
  const [isPlacing, setIsPlacing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  // ✅ Prefill user details
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userDetails"));
      if (storedUser) {
        setName(storedUser.name || "");
        setMobile(storedUser.mobile || "");
      }
    } catch (err) {
      console.error("User data not found:", err);
    }
  }, []);

  // ✅ Place order
  const handlePlaceOrder = async () => {
    if (!address || !name || !mobile) {
      toast.error("Please fill in all details before placing the order");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setIsPlacing(true);
      const token = localStorage.getItem("authToken");

      const orderData = {
        name,
        mobile,
        address,
        items: cartItems.map((item) => ({
          productId: item.product?._id,
          name: item.product?.name,
          price: item.product?.price,
          quantity: item.quantity,
        })),
        shippingCharge,
        totalAmount: totalPrice + shippingCharge,
        paymentMethod: "Cash on Delivery",
      };

      const res = await axios.post(`${API_URL}/api/orders/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.orderId) {
        toast.success("✅ Order placed successfully!");
        clearCart();
        setTimeout(() => {
          navigate(`/order-success/${res.data.orderId}`);
        }, 1500);
      } else {
        toast.error("Something went wrong while placing order");
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-blue-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Checkout
        </h2>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700">Shipping Address</label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address here"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Cart Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Order Summary
          </h3>
          {cartItems.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.product?._id} className="flex justify-between py-2">
                  <span>{item.product?.name}</span>
                  <span>
                    ₹{item.product?.price} × {item.quantity}
                  </span>
                </li>
              ))}
              <li className="flex justify-between py-2 font-semibold text-gray-700">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </li>
              <li className="flex justify-between py-2 text-gray-600">
                <span>Shipping</span>
                <span>₹{shippingCharge}</span>
              </li>
              <li className="flex justify-between py-2 text-blue-700 font-bold">
                <span>Total</span>
                <span>₹{totalPrice + shippingCharge}</span>
              </li>
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-2">Your cart is empty</p>
          )}
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className={`w-full py-3 rounded-lg text-white font-bold transition ${
            isPlacing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPlacing ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
