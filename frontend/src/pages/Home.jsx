import React, { useMemo, useState } from "react";

export default function Home({
  products = [],
  addToCart = () => {},
  addToWishlist = () => {},
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = products.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (q && !`${p.title} ${p.desc}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

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
              {/* open product detail in new tab as requested */}
              <a
                href={`/product/${p.id}`}
                target="_blank"
                rel="noreferrer"
                className="media-link"
              >
                <div className="media">
                  <img src={p.images[0]} alt={p.title} />
                </div>
              </a>

              <div className="body">
                <a
                  href={`/product/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="title"
                >
                  {p.title}
                </a>
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
        </div>
      </div>
    </>
  );
}
