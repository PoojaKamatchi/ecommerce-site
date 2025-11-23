import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import nodemailer from "nodemailer";

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================
// Register & send OTP
// ========================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new Error("Provide all required fields");

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = Date.now() + 10 * 60 * 1000;

  const user = await User.create({ name, email, password, otp, otpExpire });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Email OTP",
    html: `<p>Hello ${name},</p><p>Your OTP is <b>${otp}</b> (expires in 10 minutes)</p>`,
  });

  res.status(201).json({ message: "OTP sent", userId: user._id });
});

// Verify OTP
export const verifyUserOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.otp !== otp || user.otpExpire < Date.now()) throw new Error("Invalid/expired OTP");

  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  const token = generateToken(user._id);
  res.json({ message: "OTP verified", token });
});

// Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
  } else {
    res.status(401);
    throw new Error("Invalid email/password");
  }
});

// Forgot password
export const forgotUserPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpire = otpExpire;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Hello ${user.name},</p><p>Your OTP is <b>${otp}</b> (expires in 10 minutes)</p>`,
  });

  res.json({ message: "OTP sent", userId: user._id });
});

// Reset password
export const resetUserPassword = asyncHandler(async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.otp !== otp || user.otpExpire < Date.now()) throw new Error("Invalid/expired OTP");

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new Error("User not found");
  res.json(user);
});

// ========================
// Update user profile (all-in-one: name, phone, profilePic, address, location)
// ========================
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const { name, phone, profilePic, address, location } = req.body;

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (profilePic) user.profilePic = profilePic;

  if (address) {
    const { street, city, state, pincode } = address;
    user.address = { street, city, state, pincode };
  }

  if (location) {
    const { lat, lng } = location;
    user.location = lat && lng ? { lat, lng } : null;
  }

  await user.save();
  res.json({ message: "Profile updated successfully", user });
});
