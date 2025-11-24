import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PaymentPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details");
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUPIPayment = (upiId) => {
    if (!order) return;
    const upiLink = `upi://pay?pa=${upiId}&pn=MyStoreName&am=${order.totalAmount}&cu=INR`;
    window.open(upiLink, "_blank");
    toast.info("Complete the payment in your UPI app and enter transaction ID in checkout.", { autoClose: 5000 });
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 font-semibold">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Pay Your Order</h2>
        <p className="text-gray-700 mb-2">Order ID: <strong>{order._id}</strong></p>
        <p className="text-gray-700 mb-4">Amount: <strong>₹ {order.totalAmount}</strong></p>

        <button onClick={() => handleUPIPayment("mybusiness@upi")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg mb-3 w-full">
          Pay via GPay
        </button>

        <button onClick={() => handleUPIPayment("mybusiness@paytm")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg w-full">
          Pay via Paytm
        </button>

        <p className="mt-4 text-sm text-gray-600">
          After payment, enter your transaction ID in checkout to confirm order.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
