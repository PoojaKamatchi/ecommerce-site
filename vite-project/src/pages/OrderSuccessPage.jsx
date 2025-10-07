import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load order details.");
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
          ✅ Order Confirmed!
        </h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
