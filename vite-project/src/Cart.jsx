import { useState } from "react";
import { useCart } from "./CartContext";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } =
    useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentSuccess(true);
      clearCart();
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1000);
  };

  if (paymentSuccess) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-400"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-green-900 mb-4">
          ✅ Payment Successful!
        </h2>
        <p className="text-lg text-gray-800 mb-8">
          Thank you for shopping with us 🎉
        </p>
        <a
          href="/"
          className="bg-white text-green-800 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-100"
        >
          Continue Shopping
        </a>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-10 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛒 Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Your cart is empty.
        </p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          {cartItems.map((item, index) => (
            <div
              key={item.product?._id || index}
              className="flex justify-between items-center border-b border-gray-200 py-4"
            >
              <div>
                <h4 className="text-lg font-semibold">
                  {item.product?.name || "Unnamed Product"}
                </h4>
                <p className="text-gray-600">₹{item.product?.price || 0}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product?._id, item.quantity - 1)
                    }
                    className="px-2 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product?._id, item.quantity + 1)
                    }
                    className="px-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-700">
                  ₹{(item.product?.price || 0) * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item.product?._id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-pink-300 to-yellow-200 shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              🎁 Special Offers for You
            </h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Get 10% off on orders above ₹1000</li>
              <li>Free delivery for today</li>
              <li>Buy 2 get 1 free on selected items</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              Total: ₹{totalPrice}
            </h3>
            <button
              onClick={handlePayment}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
