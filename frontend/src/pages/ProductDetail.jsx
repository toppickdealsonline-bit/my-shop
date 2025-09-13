// frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductBySlug } from "../data/products.js";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'%3ENo image%3C/text%3E%3C/svg%3E";

function normalizeImageUrl(img) {
  if (!img) return PLACEHOLDER;
  // If it's an absolute URL (http/https) return as-is
  if (/^https?:\/\//i.test(img)) return img;
  // If it's already starting with slash, consider it relative to VITE_API_BASE/public
  if (img.startsWith("/")) {
    const base = import.meta.env.VITE_API_BASE || "";
    // If base exists and looks like a URL, join it (no double slash)
    if (base) return `${base.replace(/\/$/, "")}${img}`;
    return img;
  }
  // otherwise return as-is
  return img;
}

export default function ProductDetail({
  addToCart = () => {},
  addToWishlist = () => {},
}) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImgIndex, setMainImgIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setProduct(null);
    setMainImgIndex(0);

    async function load() {
      try {
        const data = await fetchProductBySlug(slug);
        if (!mounted) return;
        if (!data) {
          setProduct(null);
          setError("Product not found");
        } else {
          // normalize product shape
          const p = {
            id: data.id,
            slug: data.slug ?? data.id,
            title: data.title,
            price: data.price,
            category: data.category ?? "Uncategorized",
            images: Array.isArray(data.images)
              ? data.images
              : data.images
              ? [data.images]
              : [],
            desc: data.description ?? data.desc ?? "",
            _raw: data,
          };
          setProduct(p);
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const imageUrls = useMemo(
    () => (product ? product.images.map(normalizeImageUrl) : [PLACEHOLDER]),
    [product]
  );

  if (loading)
    return (
      <div className="container" style={{ paddingTop: 20 }}>
        <h3>Loading product…</h3>
      </div>
    );

  if (error)
    return (
      <div className="container" style={{ paddingTop: 20 }}>
        <h2>{error}</h2>
        <p>
          <Link to="/">Back to shop</Link>
        </p>
      </div>
    );

  if (!product)
    return (
      <div className="container" style={{ paddingTop: 20 }}>
        <h2>Product not found</h2>
        <p>
          <Link to="/">Back to shop</Link>
        </p>
      </div>
    );

  const mainImage = imageUrls[mainImgIndex] || PLACEHOLDER;

  return (
    <div className="container" style={{ paddingTop: 20 }}>
      <div className="detail">
        <div>
          <img
            className="main-img"
            src={mainImage}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />

          <div className="thumbs" style={{ marginTop: 8 }}>
            {imageUrls.length > 0 ? (
              imageUrls.map((im, i) => (
                <button
                  key={i}
                  className="thumb"
                  onClick={() => setMainImgIndex(i)}
                  style={{
                    border:
                      i === mainImgIndex ? "2px solid #333" : "1px solid #ddd",
                    padding: 2,
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: 4,
                    marginRight: 6,
                  }}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img
                    src={im}
                    alt={`${product.title} ${i + 1}`}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </button>
              ))
            ) : (
              <div className="thumb">
                <img src={PLACEHOLDER} alt="placeholder" />
              </div>
            )}
          </div>
        </div>

        <div>
          <h2>{product.title}</h2>
          <div className="muted">{product.category}</div>

          <div className="price" style={{ fontSize: 22, marginTop: 8 }}>
            ₹{product.price}
          </div>

          <p style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
            {product.desc}
          </p>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={() =>
                addToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  images: imageUrls,
                })
              }
            >
              Add to cart
            </button>

            <button
              className="btn btn-ghost"
              onClick={() =>
                addToWishlist({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  images: imageUrls,
                })
              }
            >
              Add to wishlist
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <strong>Contact & Social</strong>
            <div className="muted">
              Instagram:{" "}
              <a
                href="https://instagram.com/TopPickDeals"
                target="_blank"
                rel="noreferrer"
              >
                @TopPickDeals
              </a>
            </div>
            <div className="muted">
              Support: +91-98765-43210 • Email: help@toppickdeals.example
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
