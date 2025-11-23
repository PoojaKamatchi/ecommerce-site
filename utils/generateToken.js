import jwt from "jsonwebtoken";

export const generateToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // You can keep 12h if you prefer
  });
};
