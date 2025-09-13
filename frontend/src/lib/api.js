// frontend/src/lib/api.js
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok)
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}`
    );
  return res.json();
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(
    `${API_BASE}/api/products/slug/${encodeURIComponent(slug)}`
  );
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
