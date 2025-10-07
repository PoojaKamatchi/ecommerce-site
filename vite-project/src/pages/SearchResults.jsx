import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function SearchResults() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/products/search?query=${query}`);
        setProducts(Array.isArray(res.data) ? res.data : []); // safety check
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchProducts();
  }, [query]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search results for "{query}"</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover mb-2"
              />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
