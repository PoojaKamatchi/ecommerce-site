import jwt from "jsonwebtoken";

<<<<<<< HEAD
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
=======
export const generateToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // You can keep 12h if you prefer
>>>>>>> f0b32b8050cd2de5a13571b4b7a9a483de636611
  });
};
