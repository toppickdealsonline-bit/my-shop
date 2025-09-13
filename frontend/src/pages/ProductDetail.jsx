// frontend/src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductBySlug } from "../lib/api.js";

export default function ProductDetail({
  addToCart = () => {},
  addToWishlist = () => {},
}) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchProductBySlug(slug);
        if (!mounted) return;
        if (!data) {
          setProduct(null);
        } else {
          const p = {
            id: data.id,
            slug: data.slug ?? data.id,
            title: data.title,
            price: data.price,
            category: data.category,
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
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <div className="container">Loading...</div>;
  if (!product)
    return (
      <div className="container">
        <h2>Product not found</h2>
      </div>
    );

  return (
    <div className="container" style={{ paddingTop: 20 }}>
      <div className="detail">
        <div>
          <img
            className="main-img"
            src={product.images[0]}
            alt={product.title}
          />
          <div className="thumbs">
            {product.images.map((im, i) => (
              <div key={i} className="thumb">
                <img src={im} alt={`${product.title} ${i}`} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>{product.title}</h2>
          <div className="muted">{product.category}</div>
          <div className="price" style={{ fontSize: 22 }}>
            ₹{product.price}
          </div>
          <p style={{ marginTop: 12 }}>{product.desc}</p>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product)}
            >
              Add to cart
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => addToWishlist(product)}
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
