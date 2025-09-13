// frontend/src/data/products.js
export async function fetchProducts() {
  const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";
  const res = await fetch(`${base}/api/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchProductBySlug(slug) {
  const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";
  const res = await fetch(`${base}/api/products/slug/${slug}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}
