import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartPopup, setCartPopup] = useState(false);
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole || "");
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const buttonClass = "px-4 py-2 rounded-full transition font-medium";
  const activeClass = "bg-white text-gray-900 shadow-md";
  const inactiveClass = "bg-gray-400 text-gray-900 hover:bg-gray-500 shadow-md";

  return (
    <nav className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-black via-gray-700 to-gray-300 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold tracking-wide cursor-pointer">
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
                className="w-full px-4 py-2 rounded-l-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                style={{ backgroundColor: "white" }}
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

            {role === "seller" && localStorage.getItem("token") && (
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

            {/* Cart Icon */}
            <button
              onClick={() => setCartPopup(!cartPopup)}
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
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Popup */}
            {cartPopup && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white text-black rounded shadow-lg p-4 z-50">
                <h2 className="text-lg font-bold mb-2">Your Cart</h2>
                {cartItems?.length === 0 ? (
                  <p>Cart is empty</p>
                ) : (
                  <>
                    {cartItems?.map((item, index) => (
                      <div
                        key={item.product?._id || index}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <div>
                          <p className="font-semibold">
                            {item.product?.name || "Unnamed Product"}
                          </p>
                          <p>
                            ₹{item.product?.price || 0} × {item.quantity} = ₹
                            {(item.product?.price || 0) * item.quantity}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product?._id,
                                item.quantity - 1
                              )
                            }
                            className="px-2 py-1 bg-gray-300 rounded"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product?._id,
                                item.quantity + 1
                              )
                            }
                            className="px-2 py-1 bg-gray-300 rounded"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              removeFromCart(item.product?._id)
                            }
                            className="px-2 py-1 bg-red-500 text-white rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <p className="font-bold text-lg">
                        Total: ₹{totalPrice || 0}
                      </p>

                      {/* Proceed to Checkout */}
                      <button
                        onClick={() => {
                          setCartPopup(false);
                          navigate("/checkout");
                        }}
                        className="mt-2 w-full bg-green-600 text-white py-2 rounded"
                      >
                        Proceed to Checkout
                      </button>

                      <button
                        onClick={() => clearCart()}
                        className="mt-2 w-full bg-red-600 text-white py-2 rounded"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-700 px-4 py-2 space-y-2">
          <Link
            to="/"
            className={`block ${
              location.pathname === "/" ? activeClass : inactiveClass
            }`}
          >
            Home
          </Link>

          <Link
            to="/login"
            className={`block ${
              location.pathname === "/login" ? activeClass : inactiveClass
            }`}
          >
            Login
          </Link>

          {role === "seller" && localStorage.getItem("token") && (
            <Link
              to="/admin/dashboard"
              className={`block ${
                location.pathname === "/admin/dashboard"
                  ? activeClass
                  : inactiveClass
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
