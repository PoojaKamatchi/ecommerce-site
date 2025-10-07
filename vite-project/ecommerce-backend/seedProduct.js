// seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js"; // ✅ adjust if your model path differs

dotenv.config();

const products = [
  {
    name: "Kurti",
    price: 1200,
    category: "ethnic-wear",
    image: "https://i.pinimg.com/736x/ab/8f/01/ab8f01c5dce8b71efb3d09d6b23d5c55.jpg",
  },
  {
    name: "Saree",
    price: 2500,
    category: "ethnic-wear",
    image: "https://i.pinimg.com/736x/ab/8f/02/ab8f02d4c7f5b1e9a0c5f1234a6c7d88.jpg",
  },
  {
    name: "Menswear 1",
    price: 800,
    category: "menswear",
    image: "https://i.pinimg.com/736x/fa/8a/3c/fa8a3c2b2527a7a83bec8759dc612b3f.jpg",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
};

seedProducts();
