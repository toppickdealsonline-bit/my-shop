// src/components/AddButtons.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AddButtons({
  product,
  onAddToCart,
  onAddToWishlist,
  user,
  small = false,
}) {
  const navigate = useNavigate();

  const addToCart = () => {
    if (!user) return navigate("/login");
    onAddToCart?.(product, 1);
  };
  const addToWishlist = () => {
    if (!user) return navigate("/login");
    onAddToWishlist?.(product);
  };

  if (small) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={addToCart}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
        >
          Add
        </button>
        <button
          onClick={addToWishlist}
          className="px-2 py-1 border rounded text-sm"
        >
          ♡
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={addToCart}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
      >
        Add to cart
      </button>
      <button onClick={addToWishlist} className="px-3 py-2 border rounded-md">
        Wishlist
      </button>
    </div>
  );
}
