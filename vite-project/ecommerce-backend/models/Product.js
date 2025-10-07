import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
