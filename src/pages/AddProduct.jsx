import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Optional: if you want Tamil transliteration
// import { ReactTransliterate } from "react-transliterate";
// import "react-transliterate/dist/index.css";

const AddProduct = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    nameEn: "",
    nameTa: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imageFile: null,
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admin/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      toast.error("⚠️ Failed to fetch categories!");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files?.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, imageFile: file, imageUrl: "" }));
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "imageUrl") {
      setForm((prev) => ({ ...prev, imageUrl: value, imageFile: null }));
      setImagePreview(value);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.nameEn.trim() || !form.price || !form.stock || !form.category) {
      toast.warn("Please fill in all required fields!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post(
        "http://localhost:5000/api/auth/admin/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("✅ Product added successfully!");
      setForm({
        nameEn: "",
        nameTa: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        imageFile: null,
        imageUrl: "",
      });
      setImagePreview(null);
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "❌ Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-3xl p-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          🛒 Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English + Tamil Name */}
          <div className="grid sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="nameEn"
              value={form.nameEn}
              onChange={handleChange}
              placeholder="Product Name (English)"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
              required
            />
            {/* Uncomment below if using transliterate */}
            {/* <ReactTransliterate
              value={form.nameTa}
              onChangeText={(text) => setForm((prev) => ({ ...prev, nameTa: text }))}
              lang="ta"
              placeholder="பொருள் பெயர் (தமிழ்)"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none bg-gray-50"
            /> */}
            <input
              type="text"
              name="nameTa"
              value={form.nameTa}
              onChange={handleChange}
              placeholder="Product Name (Tamil)"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Image URL + File */}
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Paste Image URL"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
            />
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                onError={(e) => (e.target.src = "/fallback.png")}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-xl shadow-md border-2 border-gray-200"
              />
            </div>
          )}

          {/* Price + Stock */}
          <div className="grid sm:grid-cols-2 gap-6">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
              required
            />
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
              required
            />
          </div>

          {/* Category */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name?.en} / {cat.name?.ta || ""}
              </option>
            ))}
          </select>

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
            rows="4"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full transition-all duration-300 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-4 rounded-xl shadow-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "⏳ Adding..." : "✨ Add Product"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default AddProduct;
