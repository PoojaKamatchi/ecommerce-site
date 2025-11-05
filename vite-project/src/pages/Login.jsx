import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    try {
      const res = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Safely extract user info and token
      const { _id, token, name, email: userEmail } = res.data;

      if (!_id || !token) {
        console.error("Invalid response:", res.data);
        return alert("Unexpected server response. Please try again.");
      }

      // ✅ Save login data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", _id);
      localStorage.setItem("userName", name || "");
      localStorage.setItem("userEmail", userEmail || "");

      alert("Login successful!");
      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
