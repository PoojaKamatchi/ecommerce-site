import React from "react";
import { useWishlist } from "../components/WishlistContext";
import { useCart } from "../components/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  if (!wishlist.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-teal-50 to-green-100">
        <h2 className="text-3xl font-bold text-gray-700 mb-3">
          💖 Your Wishlist is Empty
        </h2>
        <p className="text-gray-500">
          Browse products and click ❤️ to add them here!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-green-100 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-10">
        💖 Your Wishlist
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {wishlist.map((item) => {
          const productId = item._id || item.productId;

          return (
            <div
              key={productId}
              className="bg-white rounded-2xl shadow-md p-5 w-72 hover:shadow-2xl hover:scale-105 transition-transform duration-300 text-center border border-gray-100"
            >
              {/* ✅ Product Image */}
              <img
                src={
                  item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `${API_URL}${item.image}`
                    : "/placeholder.jpg"
                }
                alt={item.name?.en}
                className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
              />

              {/* ✅ Product Name */}
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name?.ta || item.name?.en}
              </h3>

              {/* ✅ Product Description */}
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {item.description || "No description available."}
              </p>

              {/* ✅ Product Price */}
              <p className="text-green-700 font-semibold mt-3 text-lg">
                ₹{item.price}
              </p>

              {/* ✅ Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    addToCart(item);
                    removeFromWishlist(productId);
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(productId)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 transition"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
