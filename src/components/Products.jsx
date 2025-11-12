import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameTa: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    url: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // ✅ Search state
  const token = localStorage.getItem("adminToken");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load products!");
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Load products & categories on mount
  useEffect(() => {
    if (!token) {
      toast.error("❌ Admin token missing! Login required.");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle input changes for form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, imageFile: file, url: "" }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "url") setImagePreview(value);
    }
  };

  // Image source helper
  const getImageSource = (product) => {
    if (product.url) return product.url;
    if (product.image?.startsWith("http")) return product.image;
    if (product.image) return `http://localhost:5000${product.image}`;
    return "https://via.placeholder.com/200x150?text=No+Image";
  };

  // Category name helper
  const getCategoryName = (category) => {
    if (!category) return "Unknown";
    const catId = category._id ? category._id : category;
    const found = categories.find((c) => c._id === catId);
    return found ? `${found.name?.en} (${found.name?.ta || "-"})` : "Unknown";
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nameEn: product.name?.en || "",
      nameTa: product.name?.ta || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category?._id || product.category || "",
      description: product.description || "",
      url: product.image || "",
      imageFile: null,
    });
    setImagePreview(getImageSource(product));
  };

  // Save product
  const handleSave = async () => {
    if (!editingProduct) return;
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });

      await axios.put(
        `http://localhost:5000/api/auth/admin/products/${editingProduct._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Product updated successfully!");
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Product deleted!");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete product!");
    }
  };

  // Filter products based on search input
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name?.en.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchValue, products]);

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <ToastContainer position="top-center" autoClose={2000} />

      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-6">
        🛍️ Product List
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search Products..."
        className="border rounded-lg p-2 w-full mb-6"
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No products found!</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="bg-white text-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform border border-indigo-200"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={getImageSource(product)}
                alt={product.name?.en}
                className="rounded-xl h-40 w-full object-cover mb-3 border border-gray-300"
              />
              <h2 className="font-bold text-lg">
                {product.name?.en}{" "}
                <span className="text-indigo-600 text-sm font-semibold">
                  ({product.name?.ta})
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                Category:{" "}
                <span className="font-semibold text-gray-900">
                  {getCategoryName(product.category)}
                </span>
              </p>
              <p>💰 Price: ₹{product.price}</p>
              <p className="font-semibold text-gray-900">
                📦 Stock:{" "}
                <span
                  className={`${
                    product.stock <= 5
                      ? "text-red-500"
                      : product.stock <= 10
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {product.stock}
                </span>
              </p>
              {product.description && (
                <p className="text-gray-700 mt-2 text-sm italic">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 px-3 py-1 rounded-lg text-white hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
