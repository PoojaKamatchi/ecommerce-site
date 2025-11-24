import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const popularRef = useRef(null);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setPopularProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setPopularProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchPopularProducts();
  }, []);

  // Scroll to Popular Section
  const handleScrollToPopular = () => {
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: "smooth" });
      popularRef.current.classList.add("highlight");
      setTimeout(() => popularRef.current.classList.remove("highlight"), 1000);
    }
  };

  // Reveal Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleProducts((prev) => [...prev, entry.target.dataset.index]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".product-card").forEach((el) => observer.observe(el));
  }, [popularProducts]);

  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO SECTION */}
      <section className="relative flex items-center justify-center h-screen text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center animate-backgroundScroll"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1650&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        <div className="relative z-10 max-w-4xl px-8 py-20 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl animate-fadeUp">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-textFade">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              HappyShopping
            </span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 italic drop-shadow-md animate-textGlow">
            “Shop smart, live stylishly!”
          </p>
          <button
            onClick={handleScrollToPopular}
            className="relative px-8 py-4 font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg hover:scale-105 transition-transform duration-300 group overflow-hidden"
          >
            <span className="relative z-10">Shop Now</span>
          </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Shop by Category
        </h2>
        {loadingCategories ? (
          <p className="text-center text-gray-600">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-600">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat) => {
              const nameEn = cat.name?.en || "Unnamed";
              const nameTa = cat.name?.ta || "";
              const imageUrl = cat.image?.startsWith("http")
                ? cat.image
                : `${API_URL}${cat.image}`;
              return (
                <div
                  key={cat._id}
                  onClick={() => navigate(`/category/${cat._id}`)}
                  className="cursor-pointer bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={imageUrl || "https://via.placeholder.com/200"}
                    alt={nameEn}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-base sm:text-lg">{nameEn}</h3>
                  {nameTa && (
                    <p className="text-gray-500 text-sm mt-1 font-medium">{nameTa}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* POPULAR PRODUCTS */}
      <section ref={popularRef} className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Popular Products</h2>
          {loadingProducts ? (
            <p className="text-center text-gray-600">Loading products...</p>
          ) : popularProducts.length === 0 ? (
            <p className="text-center text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {popularProducts.map((product, index) => (
                <div
                  key={product._id}
                  data-index={index}
                  className={`product-card bg-white rounded-xl shadow-md p-4 transform transition-all duration-700 ${
                    visibleProducts.includes(index.toString())
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  } hover:shadow-xl hover:-translate-y-1`}
                >
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name?.en}
                    className="w-full h-40 mb-4 object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold">{product.name?.en}</h3>
                  {product.name?.ta && (
                    <p className="text-sm text-gray-500">{product.name.ta}</p>
                  )}
                  <p className="text-gray-600">₹{product.price}</p>

                  {/* WISHLIST */}
                  <button
                    onClick={() =>
                      isWishlisted(product._id)
                        ? removeFromWishlist(product._id)
                        : addToWishlist(product)
                    }
                    className="mt-3 w-full border border-pink-500 text-pink-500 py-2 rounded-lg hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    {isWishlisted(product._id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
                  </button>

                  {/* ADD TO CART */}
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeUp {0% {opacity: 0; transform: translateY(20px);}100% {opacity: 1; transform: translateY(0);}}
        .animate-fadeUp { animation: fadeUp 1s ease-out forwards; }

        @keyframes textFade {0%{opacity:0.7;}50%{opacity:1;}100%{opacity:0.7;}}
        .animate-textFade { animation: textFade 2.5s ease-in-out infinite; }

        @keyframes textGlow {0%{text-shadow:0 0 10px #ff7ee7;}50%{text-shadow:0 0 30px #ffa6ff;}100%{text-shadow:0 0 10px #ff7ee7;}}
        .animate-textGlow { animation: textGlow 3s infinite alternate; }

        @keyframes backgroundScroll {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        .animate-backgroundScroll { background-size:200% 100%; animation: backgroundScroll 25s linear infinite; }

        .highlight { background-color: #fff9c4; transition: background-color 1s ease; }
      `}</style>
    </div>
  );
}
