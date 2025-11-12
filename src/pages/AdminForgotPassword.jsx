import React, { useState } from "react";
import axios from "axios";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = verify OTP & reset
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your admin email.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/admin/forgot-password",
        { email }
      );
      setMessage(data.message);
      setStep(2); // move to OTP verification step
    } catch (err) {
      console.error("Forgot password error:", err.response || err.message);
      setError(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP & reset password
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setError("Please enter OTP and new password.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/admin/reset-password-otp",
        { email, otp, password: newPassword }
      );
      setMessage(data.message);
      setError("");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      console.error("Reset password error:", err.response || err.message);
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter admin email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              Reset Password
            </button>
          </div>
        )}

        {message && (
          <p className="text-green-600 text-center mt-4 font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
