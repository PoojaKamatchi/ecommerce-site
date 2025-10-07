import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard({ refresh }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    if (!token) {
      console.error("Admin token missing!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const updateStock = async (id, change) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/products/${id}/stock`,
        { change },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(products.map(p => p._id === id ? res.data : p));
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter(p => p._id !== id)); // remove locally
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Product
        </Link>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found. Add some!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-bold mt-2">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="font-semibold mt-2">₹{product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => updateStock(product._id, 1)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  ➕ Increase
                </button>
                <button
                  onClick={() => updateStock(product._id, -1)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  ➖ Decrease
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
