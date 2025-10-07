import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product) => {
    await addToCart(product);
    alert(`${product.name} added to cart ✅`);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {products.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            width: "200px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={p.imageUrl}
            alt={p.name}
            style={{ width: "100%", borderRadius: "8px", height: "150px", objectFit: "cover" }}
          />
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>₹{p.price}</p>
          <button
            onClick={() => handleAddToCart(p)}
            style={{
              background: "blue",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Product;
