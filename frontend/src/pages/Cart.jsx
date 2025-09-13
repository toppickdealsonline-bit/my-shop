// src/pages/Cart.jsx
import React from "react";

export default function Cart({ cart, updateQty, removeFromCart, checkout }) {
  const items = Object.values(cart);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Cart ({items.length})</h2>
      {items.length === 0 ? (
        <div className="text-gray-600">Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex gap-4 items-center bg-white p-3 rounded shadow"
            >
              <img
                src={it.images[0]}
                className="w-20 h-20 object-cover rounded"
                alt={it.title}
              />
              <div className="flex-1">
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">${it.price} each</div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => updateQty(it.id, it.qty - 1)}
                  >
                    -
                  </button>
                  <div className="px-3">{it.qty}</div>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => updateQty(it.id, it.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    className="ml-3 text-sm text-red-600"
                    onClick={() => removeFromCart(it.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${(it.price * it.qty).toFixed(2)}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center bg-white p-4 rounded shadow">
            <div className="font-semibold">Subtotal</div>
            <div className="text-lg font-bold">
              ${items.reduce((s, it) => s + it.price * it.qty, 0).toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={checkout}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
