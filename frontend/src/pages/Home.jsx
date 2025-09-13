// frontend/src/pages/Home.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Home({
  products = [],
  loading = false,
  error = null,
  addToCart = () => {},
  addToWishlist = () => {},
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((p) => p.category || "Uncategorized"))
      ),
    ],
    [products]
  );

  const filtered = products.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (q && !`${p.title} ${p.desc}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  if (loading) return <div className="container">Loading products…</div>;
  if (error)
    return <div className="container">Failed to load products: {error}</div>;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left">
            <h1>TopPickDeals — Great finds, everyday prices</h1>
            <p>
              Curated selection across categories. Fast shipping & easy returns.
            </p>
            <a href="#products" className="cta">
              Shop now
            </a>
          </div>

          <div className="hero-preview">
            <img src="/cable box 1.jpg" alt="Featured" />
            <div className="desc">Featured: Cable Management Box — ₹399</div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="search-row">
          <input
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <h2 className="h2" id="products">
          Products
        </h2>

        <div className="grid">
          {filtered.map((p) => (
            <article className="card" key={p.id}>
              <Link to={`/product/${p.slug}`} className="media-link">
                <div className="media">
                  <img src={p.images[0]} alt={p.title} />
                </div>
              </Link>

              <div className="body">
                <Link to={`/product/${p.slug}`} className="title">
                  {p.title}
                </Link>
                <div className="meta">{p.category}</div>
                <div className="price">₹{p.price}</div>

                <div className="actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(p)}
                  >
                    Add to cart
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => addToWishlist(p)}
                  >
                    ♡ Wishlist
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="muted">No products found.</div>
          )}
        </div>
      </div>
    </>
  );
}
