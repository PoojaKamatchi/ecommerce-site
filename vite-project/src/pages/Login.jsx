import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();

  // Only base URL — no /api/auth here
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [mode, setMode] = useState("login"); // login | register | otp | forgot | reset
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    userId: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.trim() });

  // ================== Auth Actions ==================
  const handleAuth = async () => {
    setLoading(true);
    try {
      // -------- Login --------
      if (mode === "login") {
        if (!form.email || !form.password)
          return toast.error("Email & Password required");

        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userName", res.data.user?.name || res.data.name);

        toast.success("✅ Login successful!");
        navigate("/");
      }

      // -------- Register --------
      if (mode === "register") {
        if (!form.name || !form.email || !form.password)
          return toast.error("All fields required");

        const res = await axios.post(`${API_URL}/api/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        toast.success("✅ Registered! OTP sent to email");
        setMode("otp");
        setOtpTimer(600);
        setForm({ ...form, userId: res.data.userId });
      }

      // -------- Forgot Password --------
      if (mode === "forgot") {
        if (!form.email) return toast.error("Enter email");

        const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
          email: form.email,
        });

        toast.success("✅ OTP sent to email");
        setMode("reset");
        setOtpTimer(600);
        setForm({ ...form, userId: res.data.userId });
      }

      // -------- Verify OTP --------
      if (mode === "otp") {
        if (!form.otp) return toast.error("Enter OTP");

        const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
          userId: form.userId,
          otp: form.otp,
        });

        localStorage.setItem("authToken", res.data.token);

        toast.success("✅ OTP verified! Logged in.");
        setMode("login");
        setForm({
          name: "",
          email: "",
          password: "",
          otp: "",
          userId: "",
          newPassword: "",
        });

        navigate("/");
      }

      // -------- Reset Password --------
      if (mode === "reset") {
        if (!form.otp || !form.newPassword)
          return toast.error("OTP & new password required");

        await axios.put(`${API_URL}/api/auth/reset-password`, {
          userId: form.userId,
          otp: form.otp,
          newPassword: form.newPassword,
        });

        toast.success("✅ Password reset successfully!");
        setMode("login");
        setForm({
          name: "",
          email: "",
          password: "",
          otp: "",
          userId: "",
          newPassword: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  // ================== OTP Timer ==================
  useEffect(() => {
    let timer;
    if (otpTimer > 0)
      timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [otpTimer]);

  useEffect(() => {
    if ((mode === "otp" || mode === "reset") && otpInputRef.current)
      otpInputRef.current.focus();
  }, [mode]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60),
      sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {mode === "register"
            ? "Register"
            : mode === "login"
            ? "Login"
            : mode === "otp"
            ? "Verify OTP"
            : mode === "forgot"
            ? "Forgot Password"
            : "Reset Password"}
        </h2>

        {(mode === "login" || mode === "register" || mode === "forgot") && (
          <>
            {mode === "register" && (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-lg mb-2"
              />
            )}

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg mb-2"
            />

            {(mode === "login" || mode === "register") && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg mb-2"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            )}

            {mode === "forgot" && (
              <p className="text-sm text-gray-500 mb-2">
                OTP will be sent to your email
              </p>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading
                ? "Processing..."
                : mode === "login"
                ? "Login"
                : mode === "register"
                ? "Register"
                : mode === "forgot"
                ? "Send OTP"
                : "Reset Password"}
            </button>
          </>
        )}

        {(mode === "otp" || mode === "reset") && (
          <>
            <input
              name="otp"
              ref={otpInputRef}
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg mb-2"
            />

            {mode === "reset" && (
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-lg mb-2"
              />
            )}

            {otpTimer > 0 && (
              <p className="text-sm text-gray-500 mb-2">
                Expires in: {formatTime(otpTimer)}
              </p>
            )}

            <button
              onClick={handleAuth}
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white ${
                loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading
                ? "Processing..."
                : mode === "otp"
                ? "Verify OTP"
                : "Reset Password"}
            </button>
          </>
        )}

        <div className="text-center mt-2 space-y-1">
          {mode !== "login" && (
            <p
              className="text-indigo-600 cursor-pointer"
              onClick={() => setMode("login")}
            >
              Login
            </p>
          )}
          {mode !== "register" && (
            <p
              className="text-indigo-600 cursor-pointer"
              onClick={() => setMode("register")}
            >
              Register
            </p>
          )}
          {mode !== "forgot" && (
            <p
              className="text-indigo-600 cursor-pointer"
              onClick={() => setMode("forgot")}
            >
              Forgot Password?
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
