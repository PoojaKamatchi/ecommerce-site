import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/api/orders/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && Array.isArray(res.data)) {
          setOrders(res.data.reverse());
        } else {
          toast.warn("No orders found.");
        }
      } catch (error) {
        console.error("Fetch Orders Error:", error);
        toast.error("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 text-lg font-semibold">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="mb-4 text-lg">No orders yet. Start shopping now!</p>
        <a
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Go Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 md:px-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        My Orders
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {orders.map((order, index) => (
          <div
            key={order._id || index}
            className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100 hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-indigo-700">
                Order #{index + 1}
              </h2>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status || "Processing"}
              </span>
            </div>

            <p className="text-gray-600 mb-1">
              <strong>Name:</strong> {order.name}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Mobile:</strong> {order.mobile}
            </p>
            <p className="text-gray-600 mb-3">
              <strong>Address:</strong> {order.address}
            </p>

            <div className="border-t border-gray-200 mt-3 pt-3">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Items:</h3>
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-gray-700 border-b border-gray-100 py-1"
                >
                  <span>{item.product?.name?.en || "Unnamed Product"}</span>
                  <span>
                    ₹ {item.price} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-3 pt-3">
              <p className="flex justify-between text-gray-800 font-semibold">
                <span>Subtotal:</span>
                <span>₹ {order.totalAmount}</span>
              </p>
              <p className="flex justify-between text-gray-800">
                <span>Shipping:</span>
                <span>₹ {order.shippingCharge}</span>
              </p>
              <p className="flex justify-between text-indigo-700 font-bold text-lg mt-1">
                <span>Total:</span>
                <span>₹ {order.totalAmount + (order.shippingCharge || 0)}</span>
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Payment Method:{" "}
              <span className="font-medium text-gray-700">
                {order.paymentMethod || "COD"}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              Ordered On:{" "}
              <span className="font-medium text-gray-700">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
