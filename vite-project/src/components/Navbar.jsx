import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext.jsx";
import { useWishlist } from "./WishlistContext.jsx";
import axios from "axios";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, fetchCart } = useCart();
  const { wishlistItems, fetchWishlist } = useWishlist();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch cart count on load
  useEffect(() => {
    fetchCart();
  }, []);

  // Update wishlist count dynamically
  useEffect(() => {
    if (wishlistItems && wishlistItems.length >= 0) {
      setWishlistCount(wishlistItems.length);
    } else {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .get(`${API_URL}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setWishlistCount(res.data?.wishlist?.length || 0))
          .catch(() => setWishlistCount(0));
      }
    }
  }, [wishlistItems]);

  // Scroll effect + role detection
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole || "");

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  // Auto-close profile menu after 5s
  useEffect(() => {
    if (profileOpen) {
      const timer = setTimeout(() => setProfileOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [profileOpen]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Cart navigation
  const handleCartClick = () => navigate("/cart");

  // Wishlist navigation
  const handleWishlistClick = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to access your wishlist ❤️");
      navigate("/login");
    } else {
      navigate("/wishlist");
    }
  };

  // Tailwind classes
  const buttonClass = "px-4 py-2 rounded-full transition font-medium";
  const activeClass = "bg-white text-gray-900 shadow-md";
  const inactiveClass = "bg-gray-400 text-gray-900 hover:bg-gray-500 shadow-md";

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-black via-gray-700 to-gray-400 shadow-lg backdrop-blur-md"
          : "bg-gradient-to-r from-black via-gray-700 to-gray-300"
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide cursor-pointer">
            <Link to="/">HappyShopping</Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 px-4 hidden md:flex">
            <form onSubmit={handleSearch} className="w-full flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md bg-white"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Navbar Buttons */}
          <div className="flex items-center space-x-4 relative">
            <Link
              to="/"
              className={`${buttonClass} ${
                location.pathname === "/" ? activeClass : inactiveClass
              }`}
            >
              Home
            </Link>

            <Link
              to="/login"
              className={`${buttonClass} ${
                location.pathname === "/login" ? activeClass : inactiveClass
              }`}
            >
              Login
            </Link>

            {role === "seller" && localStorage.getItem("authToken") && (
              <Link
                to="/admin/dashboard"
                className={`${buttonClass} ${
                  location.pathname === "/admin/dashboard"
                    ? activeClass
                    : inactiveClass
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.78.755 6.879 2.047M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              <div
                className={`absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg py-2 z-50 transform transition-all duration-500 origin-top-right ${
                  profileOpen
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-3 scale-95 pointer-events-none"
                }`}
              >
                {[
                  ["Profile", "/profile"],
                  ["Orders", "/orders"],
                  ["Help / Customer Care", "/help"],
                  ["My Reviews", "/reviews"],
                  ["About Us", "/about"],
                  ["Privacy Policy", "/privacy"],
                  ["Settings", "/settings"],
                ].map(([label, path]) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2 rounded-full hover:bg-gray-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.435 5.875a5.438 5.438 0 00-7.688 0L12 7.622l-1.747-1.747a5.438 5.438 0 00-7.688 7.688l1.747 1.747L12 21.435l7.688-7.688 1.747-1.747a5.438 5.438 0 000-7.688z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-pink-600 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-full hover:bg-gray-500 transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13L5.4 5M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
