// src/Home.jsx
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; // import your CartContext hook

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // get addToCart from CartContext
  const popularRef = useRef(null);

  const [visibleProducts, setVisibleProducts] = useState([]);

  const categories = [
    { name: "Ethnic Wear", img: "https://i.pinimg.com/736x/ab/8f/34/ab8f34b0c08f9b3f5dbbd7022cfa0e5f.jpg", route: "/ethnic-wear" },
    { name: "Western Dresses", img: "https://i.pinimg.com/736x/da/3a/ac/da3aaced4f0b6e330b9b35493e6080d4.jpg", route: "/western-dresses" },
    { name: "Menswear", img: "https://i.pinimg.com/736x/fa/8a/3c/fa8a3c2b2527a7a83bec8759dc612b3f.jpg", route: "/menswear" },
    { name: "Footwear", img: "https://i.pinimg.com/736x/39/10/b5/3910b56d70fa56a42343d91041dcf3f8.jpg", route: "/footwear" },
    { name: "Home Decor", img: "https://i.pinimg.com/736x/fd/d4/78/fdd47830baf5acc03a2b01fcc9cb9b47.jpg", route: "/home-decor" },
    { name: "Beauty", img: "https://i.pinimg.com/736x/0d/62/3a/0d623a9caa9d3540f9cbad09f7229581.jpg", route: "/beauty" },
    { name: "Accessories", img: "https://i.pinimg.com/736x/49/8e/f3/498ef3252f767df78048c5eb3f8db044.jpg", route: "/accessories" },
    { name: "Grocery", img: "https://i.pinimg.com/736x/85/85/47/858547ebe5166351c744c563432c0238.jpg", route: "/grocery" },
  ];

  const popularProducts = [
    { _id: "1", name: "Elegant Dress", img: "https://i.pinimg.com/736x/7c/ae/1c/7cae1cd9c1b8e3dafb4d4ce2ccf91f3b.jpg", price: 1599 },
    { _id: "2", name: "Trendy Shoes", img: "https://i.pinimg.com/736x/02/89/32/028932d80aa46818ad9738398ffce861.jpg", price: 1799 },
    { _id: "3", name: "Leather Bag", img: "https://i.pinimg.com/1200x/12/b7/1b/12b71b20f626a2d3d6e492aa9f7e1b50.jpg", price: 799 },
    { _id: "4", name: "Home Decor Lamp", img: "https://i.pinimg.com/1200x/bc/6e/1b/bc6e1b9bbde3089cce79889ccff2e4af.jpg", price: 1399 },
  ];

  const handleNavigate = (route) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToPopular = () => {
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: "smooth" });
      popularRef.current.classList.add("highlight");
      setTimeout(() => {
        popularRef.current.classList.remove("highlight");
      }, 1000);
    }
  };

  // Intersection Observer for product cards animation
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
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900">
     
{/* Hero Section */}
<section
  className="relative flex items-center justify-center h-screen text-center text-white overflow-hidden"
>
  {/* Scrolling Background */}
  <div className="absolute inset-0 w-full h-full bg-cover bg-center animate-backgroundScroll" style={{ backgroundImage: "url('https://i.pinimg.com/736x/b5/3b/f1/b53bf1fd71eeadcf0ac907ec47a933cf.jpg'), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')" }}></div>

  {/* Overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

  {/* Content card */}
  <div className="relative z-10 max-w-4xl px-8 py-20 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl transform opacity-0 animate-fadeUp">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-textFade">
      Welcome to{" "}
      <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        HappyShopping
      </span>
    </h1>

    <p className="text-lg sm:text-xl md:text-2xl mb-8 italic drop-shadow-md animate-textFade delay-200">
      "Shop smart, live stylishly!"
    </p>

    <button
      onClick={handleScrollToPopular}
      className="relative inline-block px-8 py-4 font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg hover:scale-105 transition-transform duration-300 group overflow-hidden"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></span>
      <span className="relative z-10">Shop Now</span>
    </button>
  </div>

  {/* Tailwind animation classes */}
  <style>
    {`
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeUp { animation: fadeUp 1s ease forwards; }

      @keyframes textFade {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-textFade { animation: textFade 1s ease forwards; animation-delay: 0.3s; }

      @keyframes backgroundScroll {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-backgroundScroll {
        background-size: 200% 100%;
        animation: backgroundScroll 20s linear infinite;
      }
    `}
  </style>
</section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleNavigate(category.route)}
              className="flex flex-col items-center transition-transform duration-300 hover:scale-105 cursor-pointer w-24 sm:w-28 md:w-32"
            >
              <div className="w-full h-24 sm:h-28 md:h-32 mb-2 sm:mb-4 rounded-full shadow-lg overflow-hidden flex items-center justify-center">
                <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-center text-gray-700 font-medium text-sm sm:text-base md:text-base">{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section ref={popularRef} className="py-12 md:py-16 bg-gray-100 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-8 md:mb-10">Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map((product, index) => (
              <div
                key={product._id}
                data-index={index}
                className={`product-card bg-white rounded-xl shadow-md p-4 transform transition-all duration-700 ${
                  visibleProducts.includes(index.toString()) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="h-40 sm:h-44 md:h-40 mb-4 overflow-hidden rounded-lg">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg sm:text-lg md:text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300 w-full"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeUp { animation: fadeUp 1s ease-out forwards; }

          .highlight {
            background-color: #fff9c4;
            transition: background-color 1s ease;
          }
        `}
      </style>
    </div>
  );
}
