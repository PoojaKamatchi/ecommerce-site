// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext.jsx";
import { WishlistProvider } from "./components/WishlistContext.jsx";

// Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ReviewsPage from "./pages/ReviewsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
<Route path="/categories" element={<CategoryPage />} />   {/* shows all categories */}
<Route path="/category/:id" element={<ProductPage />} />  {/* shows products of selected category */}

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
          <Footer />
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}
