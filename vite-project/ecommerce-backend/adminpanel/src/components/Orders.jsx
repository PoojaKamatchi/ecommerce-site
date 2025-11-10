import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Use the correct admin token
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ Redirect if admin not logged in
        if (!token) {
          setError("Admin not authenticated. Please login again.");
          navigate("/admin/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/orders/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("adminToken");
            navigate("/admin/login");
            throw new Error("Session expired. Please login again.");
          } else {
            throw new Error(`Error: ${response.status}`);
          }
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Total Price</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">
                    {order.user?.name || "Unknown"}
                  </td>
                  <td className="py-3 px-4">
                    {order.items
                      ?.map((item) => `${item.name} (x${item.quantity})`)
                      .join(", ")}
                  </td>
                  <td className="py-3 px-4">₹{order.totalPrice}</td>
                  <td className="py-3 px-4">{order.status}</td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
