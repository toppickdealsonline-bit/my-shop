// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*
 Props expected by App.jsx:
  - logo (string) : path to logo image, e.g. "/logo.PNG"
  - wishlistCount (number)
  - cartCount (number)
  - onCartClick (fn) // opens cart drawer
*/
export default function Header({
  logo = "/logo.PNG",
  wishlistCount = 0,
  cartCount = 0,
  onCartClick = () => {},
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand-left">
          <Link to="/" className="brand-link" aria-label="TopPickDeals home">
            <img src={logo} alt="TopPickDeals" className="site-logo" />
            <span className="site-title">TopPickDeals</span>
          </Link>
        </div>

        <div className="hero-controls">
          {/* small search inline - submits navigate to / with query param (optional) */}
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // navigate to home with query params (or filter client-side)
                  navigate(
                    `/?q=${encodeURIComponent(search)}&cat=${encodeURIComponent(
                      category
                    )}`
                  );
                }
              }}
            />
            <select
              className="search-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Beauty">Beauty</option>
            </select>
          </div>
        </div>

        <div className="actions-right">
          <button
            className="icon-btn"
            title="Wishlist"
            onClick={() => navigate("/wishlist")}
          >
            ♡<span className="badge">{wishlistCount}</span>
          </button>

          <button
            className="icon-btn"
            title="Cart"
            onClick={() => {
              // open cart drawer provided by App
              onCartClick();
            }}
          >
            🧾
            <span className="badge">{cartCount}</span>
          </button>

          <button
            className="signin-btn"
            onClick={() => {
              // go to login page
              navigate("/login");
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
