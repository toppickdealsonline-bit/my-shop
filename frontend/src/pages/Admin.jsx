import React, { useState } from "react";

export default function Admin({ products = [], setProducts = () => {} }) {
  const [local, setLocal] = useState(products);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin — Products</h2>
      <div className="space-y-4">
        {local.map((p, i) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.category}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const copy = [...local];
                    copy.splice(i, 1);
                    setLocal(copy);
                  }}
                  className="px-2 py-1 border rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={() => setProducts(local)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Save to app
        </button>
      </div>
    </div>
  );
}
