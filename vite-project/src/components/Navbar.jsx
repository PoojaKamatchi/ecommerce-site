import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount = 0, fetchCart } = useCart();
  const { wishlist = [], fetchWishlist } = useWishlist();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchDebounceRef = useRef(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // User login state
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    fetchCart?.();
    fetchWishlist?.();

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    if (token && name) setUser({ name, token });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchCart, fetchWishlist]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/login");
  };

  // Debounced search
  useEffect(() => {
    if (!searchOpen) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/products/search?query=${encodeURIComponent(query.trim())}`
        );
        setSuggestions(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounceRef.current);
  }, [query, searchOpen, API_URL]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSuggestions([]);
  };

  const goToCart = () => navigate("/cart");
  const goToWishlistPage = () => {
    setWishlistOpen(false);
    navigate("/wishlist");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-black/70 shadow-lg" : "bg-black/60"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo + hamburger */}
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-md text-white hover:bg-white/10" onClick={() => setMobileOpen(s => !s)} aria-label="Toggle menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/" className="text-xl font-bold text-white">HappyShopping</Link>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link className={`text-sm px-3 py-2 rounded-md ${location.pathname === "/" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} to="/">Home</Link>
              <Link className={`text-sm px-3 py-2 rounded-md ${location.pathname === "/categories" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} to="/categories">Categories</Link>
              {user && role === "seller" && (
                <Link className="text-sm px-3 py-2 rounded-md text-white hover:bg-white/10" to="/admin/dashboard">Dashboard</Link>
              )}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button onClick={() => { setSearchOpen(true); setQuery(""); setSuggestions([]); }} className="p-2 rounded-full hover:bg-white/10 text-white" aria-label="Open search">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </button>

              {/* Wishlist */}
              <button onClick={goToWishlistPage} className="relative p-2 rounded-full hover:bg-white/10 text-white" aria-label="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.435 5.875a5.438 5.438 0 00-7.688 0L12 7.622l-1.747-1.747a5.438 5.438 0 00-7.688 7.688l1.747 1.747L12 21.435l7.688-7.688 1.747-1.747a5.438 5.438 0 000-7.688z" />
                </svg>
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-pink-600 rounded-full">{wishlist.length}</span>}
              </button>

              {/* Cart */}
              <button onClick={goToCart} className="relative p-2 rounded-full hover:bg-white/10 text-white" aria-label="Cart">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13L5.4 5M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">{cartCount}</span>}
              </button>

              {/* Profile/Login */}
              <div className="relative">
                {!user ? (
                  <button onClick={() => navigate("/login")} className="px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Login</button>
                ) : (
                  <>
                    <button onClick={() => setProfileOpen(s => !s)} className="p-2 rounded-full hover:bg-white/10 text-white">{user.name[0].toUpperCase()}</button>
                    <div className={`absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 origin-top-right ${profileOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95 pointer-events-none"}`}>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setProfileOpen(false)}>Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setProfileOpen(false)}>Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden mt-2 ${mobileOpen ? "block" : "hidden"}`}>
            <div className="px-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">Home</Link>
              <Link to="/categories" className="block px-3 py-2 rounded-md text-white hover:bg-white/10">Categories</Link>
              {!user && <button onClick={() => navigate("/login")} className="block w-full text-left px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Login</button>}
              {user && <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">Logout</button>}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
