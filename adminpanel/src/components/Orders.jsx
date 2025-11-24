// src/admin/Orders.jsx  (or wherever your admin orders component is)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        window.location.href = "/login";
        return;
      }
      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const allOrders = res.data || [];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filterOrders = (status) => {
    setStatusFilter(status);
    if (status === "All") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === status));
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.put(`${API_URL}/api/orders/status/${id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${adminToken}` } });
      fetchOrders();
      toast.success("Order status updated!");
    } catch (err) {
      console.error("Update Status Error:", err);
      toast.error("Failed to update status");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.put(`${API_URL}/api/orders/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
      fetchOrders();
      toast.success("Order cancelled!");
    } catch (err) {
      console.error("Cancel Error:", err);
      toast.error("Failed to cancel order");
    }
  };

  const markPaid = async (id) => {
    if (!window.confirm("Mark this UPI order as Paid?")) return;
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.put(`${API_URL}/api/orders/${id}/mark-paid`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
      fetchOrders();
      toast.success("Order marked as Paid!");
    } catch (err) {
      console.error("Mark Paid Error:", err);
      toast.error("Failed to mark as Paid");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-600">Loading orders...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Orders Dashboard</h1>

      <div className="flex justify-center gap-4 mb-8">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
          <button key={status} onClick={() => filterOrders(status)} className={`px-5 py-2 rounded-md font-medium transition ${statusFilter === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No orders found.</div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">Order ID: {order._id}</h3>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className="mt-3 text-gray-700">
                <p><strong>User:</strong> {order.user?.name || order.name || "N/A"} ({order.user?.email || "N/A"})</p>
                <p><strong>Mobile:</strong> {order.mobile || "N/A"}</p>
                <p><strong>Address:</strong> {order.shippingAddress || "N/A"}</p>
                <p><strong>Payment Mode:</strong> {order.paymentMethod || "Cash on Delivery"}</p>
                {order.paymentMethod === "UPI" && <p><strong>UPI Txn ID:</strong> {order.upiTransactionId || "Not provided"}</p>}
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                <h4 className="font-medium mb-2">Items:</h4>
                {order.orderItems?.map((it, i) => (
                  <div key={i} className="flex justify-between text-gray-700 border-b border-gray-100 py-1">
                    <span>{it.name || "Unnamed Product"}</span>
                    <span>₹ {it.price} × {it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold">Total: ₹{order.totalAmount} (Shipping ₹{order.shippingCharge || 0})</p>
                <p><span className="font-medium text-blue-600">{order.status}</span></p>
              </div>

              {/* Payment screenshot preview */}
              {order.paymentScreenshot && (
                <div className="mt-4">
                  <p className="font-medium mb-2">Payment Screenshot:</p>
                  <img src={`${API_URL}${order.paymentScreenshot}`} alt="Payment Proof" className="w-40 h-40 object-cover rounded-lg border" />
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)} className="border p-2 rounded-md bg-gray-50">
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button onClick={() => cancelOrder(order._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Cancel</button>

                {order.status === "Pending" && order.paymentMethod === "UPI" && (
                  <button onClick={() => markPaid(order._id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
