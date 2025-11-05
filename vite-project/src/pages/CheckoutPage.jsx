import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get data passed from CartPage
  const { cartItems = [], totalPrice = 0, shippingCharge = 40 } = location.state || {};

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ Handle place order
  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!name || !mobile || !address) {
      toast.warn("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        name,
        mobile,
        address,
        totalAmount: totalPrice,
        shippingCharge,
        paymentMethod,
      };

      const res = await axios.post(`${API_URL}/api/orders/create`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Order placed successfully!");
      setTimeout(() => {
        navigate("/orders"); // Redirect to orders page
      }, 2000);
    } catch (err) {
      console.error("Order Place Error:", err);
      toast.error("Failed to place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ If cart empty, redirect or show message
  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="mb-4">Your cart is empty. Go back and add some items!</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 md:px-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        Checkout Page
      </h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* 🏠 Shipping Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Details</h2>

          <label className="block mb-3">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700">Mobile Number</span>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your mobile number"
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700">Address</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows="3"
              placeholder="Enter your delivery address"
            />
          </label>

          <label className="block mb-3">
            <span className="text-gray-700">Payment Method</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </label>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        {/* 🧾 Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>

          <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between border-b pb-2">
                <span>{item.product.name?.en}</span>
                <span>₹ {item.product.price} × {item.quantity}</span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <p className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>₹ {totalPrice}</span>
          </p>
          <p className="flex justify-between text-gray-700">
            <span>Shipping:</span>
            <span>₹ {shippingCharge}</span>
          </p>

          <hr className="my-3" />

          <p className="flex justify-between text-indigo-700 font-bold text-lg">
            <span>Total:</span>
            <span>₹ {totalPrice + shippingCharge}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
