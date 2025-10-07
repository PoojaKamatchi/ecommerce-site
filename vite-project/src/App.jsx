import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Home";
import Cart from "./Cart";
import CategoryPage from "./CategoryPage";
import Login from "./Login";
import Products from "./components/Product";
import Register from "./Register";
import Users from "./Users";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import SearchResults from "./pages/SearchResults";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
export default function App() {
  const [refreshProducts, setRefreshProducts] = useState(false);

  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/users" element={<Users />} />
          
<Route path="/search" element={<SearchResults />} />
<Route path="/checkout" element={<CheckoutPage />} />
      
<Route path="/order-success/:orderId" element={<OrderSuccessPage />} />    <Route
            path="/admin/dashboard"
            element={<AdminDashboard refresh={refreshProducts} />}
          />
          <Route
            path="/admin/add-product"
            element={<AddProduct onAdd={() => setRefreshProducts(!refreshProducts)} />}
          />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}
