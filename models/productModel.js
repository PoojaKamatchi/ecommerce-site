import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      ta: { type: String },
    },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
