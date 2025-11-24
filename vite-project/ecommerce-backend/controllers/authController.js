import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import nodemailer from "nodemailer";

// ✅ Email transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================
// 1️⃣ Register new user & send OTP
// ========================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.create({ name, email, password, otp, otpExpire });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Email OTP",
    html: `<p>Hello ${name},</p><p>Your OTP for registration is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
  });

  res.status(201).json({ message: "OTP sent to your email", userId: user._id });
});

// ========================
// 2️⃣ Verify OTP
// ========================
export const verifyUserOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.json({ message: "OTP verified successfully", token });
});

// ========================
// 3️⃣ Login user
// ========================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ========================
// 4️⃣ Forgot password (send OTP)
// ========================
export const forgotUserPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpire = otpExpire;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Hello ${user.name},</p><p>Your OTP to reset password is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
  });

  res.json({ message: "OTP sent to your email", userId: user._id });
});

// ========================
// 5️⃣ Reset password
// ========================
export const resetUserPassword = asyncHandler(async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
});

// ========================
// 6️⃣ Get user profile
// ========================
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new Error("User not found");
  res.json(user);
});

// ========================
// 7️⃣ Update user profile (name, phone, profilePic, address, location)
// ========================
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, phone, profilePic, address, location } = req.body;

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profilePic) user.profilePic = profilePic;
  if (address) user.address = address;
  if (location) user.location = location;

  await user.save();
  res.json({ message: "Profile updated successfully" });
});

// ========================
// 8️⃣ Update only address & location
// ========================
export const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { street, city, state, pincode, lat, lng } = req.body;

  user.address = { street, city, state, pincode };
  user.location = lat && lng ? { lat, lng } : null;

  await user.save();
  res.json({ message: "Address updated successfully" });
});
