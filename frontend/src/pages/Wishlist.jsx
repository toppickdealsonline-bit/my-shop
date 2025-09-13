// frontend/src/pages/Wishlist.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Wishlist({ items = [], remove = () => {} }) {
  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <h2>Your wishlist</h2>
      {items.length === 0 ? (
        <div className="muted">No items in wishlist.</div>
      ) : (
        <div className="grid">
          {items.map((it) => (
            <div className="card" key={it.id}>
              <Link to={`/product/${it.slug ?? it.id}`} className="media-link">
                <div className="media">
                  <img src={it.images[0]} alt={it.title} />
                </div>
              </Link>
              <div className="body">
                <Link to={`/product/${it.slug ?? it.id}`} className="title">
                  {it.title}
                </Link>
                <div className="meta">{it.category}</div>
                <div style={{ marginTop: "auto" }}>
                  <div className="price">₹{it.price}</div>
                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => remove(it.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
