import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "./CartContext";

export default function CategoryPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data); // get products from DB
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-blue-100 py-10">
      <h2 className="text-center text-3xl font-bold text-blue-700 mb-8">
        Category Products
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow-lg rounded-xl p-4 w-64 transform hover:scale-105 transition duration-300"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-gray-600 mb-3">₹{p.price}</p>
            <button
              onClick={() => addToCart(p)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
