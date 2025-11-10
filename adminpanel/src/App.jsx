import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Reports from "./components/Reports";
import Login from "./pages/Login";
import AddCategory from "./pages/AddCategory";

function App() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect to admin login by default */}
        <Route path="/" element={<Navigate to="/admin/login" />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Panel Routes */}
        <Route
          path="/admin/*"
          element={
            <div className="flex w-full min-h-screen">
              <Sidebar />
              <div className="flex-1 p-6 bg-gray-100">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route
                    path="products"
                    element={<Products products={products} />}
                  />
                  <Route
                    path="products/add"
                    element={
                      <AddProduct
                        onProductAdded={(newProduct) =>
                          setProducts((prev) => [...prev, newProduct])
                        }
                      />
                    }
                  />
                  <Route path="orders" element={<Orders />} />
                  <Route path="users" element={<Users />} />
                  <Route path="reports" element={<Reports />} />
                  {/* ✅ Correct placement of AddCategory */}
                  <Route path="add-category" element={<AddCategory />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
