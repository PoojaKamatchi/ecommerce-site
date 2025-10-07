// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/api/users/login`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", form.role);

        toast.success("✅ Login successful!");

        if (form.role === "seller") {
          navigate("/seller/dashboard");
        } else if (form.role === "buyer") {
          navigate("/");
        }
      } else {
        toast.error(data.message || "❌ Login failed");
      }
    } catch (error) {
      toast.error("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      <div className="hidden md:flex w-1/2 h-screen bg-gray-200 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1581091870629-3c96a2ff9d84?auto=format&fit=crop&w=800&q=80"
          alt="Login Illustration"
          className="w-3/4 h-auto rounded-lg shadow-lg animate-slideIn"
        />
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center p-8 bg-white shadow-2xl rounded-lg animate-slideIn">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login as Buyer or Seller to continue shopping.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-medium hover:underline cursor-pointer"
            >
              Register
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
