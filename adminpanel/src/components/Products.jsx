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
  const [searchValue, setSearchValue] = useState("");

  const token = localStorage.getItem("adminToken");

  // -----------------------------
  // Fetch Products
  // -----------------------------
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

  // -----------------------------
  // Fetch Categories
  // -----------------------------
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

  useEffect(() => {
    if (!token) {
      toast.error("❌ Admin token missing! Login required.");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, []);

  // -----------------------------
  // Handle Input Change
  // -----------------------------
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

  const getImageSource = (product) => {
    if (product.url) return product.url;
    if (product.image?.startsWith("http")) return product.image;
    if (product.image) return `http://localhost:5000${product.image}`;
    return "https://via.placeholder.com/200x150?text=No+Image";
  };

  const getCategoryName = (category) => {
    if (!category) return "Unknown";
    const catId = category._id ? category._id : category;
    const found = categories.find((c) => c._id === catId);
    return found ? `${found.name?.en} (${found.name?.ta || "-"})` : "Unknown";
  };

  // -----------------------------
  // OPEN EDIT POPUP
  // -----------------------------
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

  // -----------------------------
  // SAVE EDITED PRODUCT
  // -----------------------------
  const handleSave = async () => {
    if (!editingProduct) return;
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });

      await axios.put(
        `http://localhost:5000/api/admin/products/${editingProduct._id}`,
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

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("🗑️ Product deleted!");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete product!");
    }
  };

  // -----------------------------
  // Search Filter
  // -----------------------------
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

      {/* ----------------------------------------------------
          EDIT POPUP MODAL
      ---------------------------------------------------- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl w-11/12 md:w-1/2 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              ✏️ Edit Product
            </h2>

            <div className="flex justify-center mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-xl shadow"
              />
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="Product Name (English)"
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="text"
                name="nameTa"
                value={formData.nameTa}
                onChange={handleChange}
                placeholder="Product Name (Tamil)"
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full p-2 border rounded-lg"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name.en} ({c.name.ta})
                  </option>
                ))}
              </select>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border rounded-lg h-20"
              ></textarea>

              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-gray-400 rounded-lg text-white hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
