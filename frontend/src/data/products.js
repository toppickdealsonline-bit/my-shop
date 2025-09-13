// frontend/src/data/products.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(`${API_BASE}/api/products/${slug}`);
  if (!res.ok) return null;
  return res.json();
}
