import { useEffect, useState } from "react";
import { fetchProducts } from "./data/products.js";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;

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
