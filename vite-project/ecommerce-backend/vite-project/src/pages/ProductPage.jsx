import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";

export default function ProductPage() {
  const { id } = useParams(); // ✅ Category ID
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/category/${id}`);
        console.log("Fetched products:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProducts();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-teal-700 font-medium">Loading products...</div>;

  if (!products.length)
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        No products found in this category 😢
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-green-100 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-10">
        🛍️ Products in{" "}
        {products[0]?.category?.name?.ta || products[0]?.category?.name?.en || "this Category"}
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-md p-5 w-72 hover:shadow-2xl hover:scale-105 transition-transform duration-300 text-center border border-gray-100"
          >
            {/* ✅ Image fix */}
            <img
              src={
                p.image
                  ? p.image.startsWith("http")
                    ? p.image
                    : `${API_URL}${p.image}`
                  : "/placeholder.jpg"
              }
              alt={p.name?.en}
              className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
            />

            {/* ✅ Product name */}
            <h3 className="text-lg font-semibold text-gray-800">
              {p.name?.ta || p.name?.en}
            </h3>

            {/* ✅ Description */}
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {p.description || "No description available."}
            </p>

            {/* ✅ Price & Stock */}
            <p className="text-green-700 font-semibold mt-3 text-lg">₹{p.price}</p>
            <p
              className={`text-sm mt-1 ${
                p.stock > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}
            </p>

            {/* ✅ Buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => addToCart(p)}
                disabled={p.stock === 0}
                className={`flex-1 py-2 rounded-lg text-white transition ${
                  p.stock > 0
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(p)}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-2 transition"
              >
                ❤️ Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
