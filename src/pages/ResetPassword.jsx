import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams(); // ✅ extract token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle Password Reset
  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/admin/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message || "Password reset successful!");
      setError("");

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.response?.data?.message || "Invalid or expired token");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Reset Password
        </h2>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
        {message && (
          <div className="mb-4 text-green-600 font-medium">{message}</div>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
