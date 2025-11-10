import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
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

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Create Razorpay order on backend
      const res = await axios.post(
        `${API_URL}/api/payment/create-order`,
        { amount: order.totalAmount * 100, currency: "INR" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Your Store",
        description: "Order Payment",
        order_id: res.data.id,
        handler: async function (response) {
          // Confirm payment with backend
          await axios.put(
            `${API_URL}/api/orders/${orderId}/pay`,
            {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Payment Successful!");
          navigate(`/order-success/${orderId}`);
        },
        prefill: {
          name: order.name,
          contact: order.mobile,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  if (!order) return <p className="text-center mt-20">Loading order details...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Complete Your Payment</h2>
        <p className="text-gray-700 mb-2">Order ID: <strong>{orderId}</strong></p>
        <p className="text-gray-700 mb-4">Total Amount: <strong>₹ {order.totalAmount}</strong></p>
        <button
          onClick={handlePayment}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
