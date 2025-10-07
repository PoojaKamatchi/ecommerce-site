// src/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer", // Default role
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = "http://localhost:5000/api/users/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Registered successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(data.message || "❌ Registration failed");
      }
    } catch (error) {
      toast.error("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full md:w-3/5 flex items-center justify-center p-8 bg-white shadow-2xl rounded-lg animate-slideIn">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Create an Account 📝
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* Only Buyer and Seller roles */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg transition duration-300 ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>

          <p className="text-center text-xs mt-4 text-gray-500">
            © 2025 ShopEase. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
