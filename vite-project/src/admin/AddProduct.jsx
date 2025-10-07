import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setMessage("⚠️ You must be logged in as Admin or Seller.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Product Added Successfully!");
      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });

      // Redirect to dashboard after success
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "❌ Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🛒 Add New Product
        </h2>

        {message && (
          <div className="mb-4 text-center text-sm font-semibold text-red-600">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={product.stock}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={product.image}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Adding Product..." : "➕ Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
