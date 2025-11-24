// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../components/CartContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    totalPrice,
    shippingCharge = 40,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return toast.error("Your cart is empty!");
    if (!name || !mobile || !address) return toast.warn("Please fill all fields.");

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const orderData = {
        cartItems: cartItems.map((item) => ({
          productId: item.product?._id,
          name: item.product?.name || "Unnamed Product",
          price: item.product?.price || 0,
          quantity: item.quantity || 1,
        })),
        name,
        mobile,
        address,
        totalAmount: totalPrice + shippingCharge,
        shippingCharge,
        paymentMethod,
      };

      const res = await axios.post(`${API_URL}/api/orders/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201 || res.status === 200) {
        // Clear cart after order
        await clearCart();
        toast.success("✅ Order placed successfully!", {
          onClose: () => navigate("/orders"),
          autoClose: 1500,
        });
      } else {
        toast.error("Something went wrong while placing order!");
      }
    } catch (err) {
      console.error("Order Place Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Shipping Form */}
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

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate("/payment")}
              className="flex-1 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Cart</h2>

          <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md">
            {cartItems.map((item) => {
              const product = item.product || {};
              const quantity = item.quantity || 1;
              return (
                <div
                  key={product._id || Math.random()}
                  className="flex justify-between items-center border-b pb-2 text-gray-700 gap-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name || "Unnamed Product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p>{product.name || "Unnamed Product"}</p>
                      <p>₹ {product.price || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        updateQuantity(product._id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 p-1 border rounded-md text-center"
                    />
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
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
