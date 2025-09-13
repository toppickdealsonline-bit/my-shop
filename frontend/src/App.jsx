import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Wishlist from "./pages/Wishlist.jsx";

import { DEFAULT_PRODUCTS } from "./data/products.js";

/* App: safe, self-contained (no external hooks). */
export default function App() {
  // simple auth stub stored locally
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("tpd_user_v1");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  function signIn(u) {
    setUser(u);
    try {
      localStorage.setItem("tpd_user_v1", JSON.stringify(u));
    } catch {}
  }
  function signOut() {
    setUser(null);
    try {
      localStorage.removeItem("tpd_user_v1");
    } catch {}
  }

  const [products] = useState(DEFAULT_PRODUCTS);

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("tpd_cart_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem("tpd_wishlist_v1");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("tpd_cart_v1", JSON.stringify(cart));
    } catch {}
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("tpd_wishlist_v1", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // require auth helper (redirects to /login when not signed in)
  function requireAuth(action) {
    if (!user) {
      window.location.href = "/login";
      return false;
    }
    if (action) action();
    return true;
  }

  function addToCart(product, qty = 1) {
    if (!requireAuth()) return;
    setCart((c) => {
      const next = { ...c };
      if (!next[product.id]) next[product.id] = { ...product, qty: 0 };
      next[product.id].qty += qty;
      return next;
    });
    setCartOpen(true);
  }

  function addToWishlist(product) {
    if (!requireAuth()) return;
    setWishlist((w) => ({ ...w, [product.id]: product }));
  }

  function updateQty(id, qty) {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return c;
      next[id].qty = Math.max(0, qty);
      if (next[id].qty === 0) delete next[id];
      return next;
    });
  }

  function removeItem(id) {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  function total() {
    return Object.values(cart)
      .reduce((s, it) => s + it.price * it.qty, 0)
      .toFixed(2);
  }

  return (
    <div className="app-root">
      <Header
        logo="/logo.PNG"
        cartCount={Object.values(cart).reduce((n, it) => n + (it.qty || 0), 0)}
        wishlistCount={Object.keys(wishlist).length}
        onCartClick={() => setCartOpen((s) => !s)}
        user={user}
        onSignOut={signOut}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                products={products}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                addToCart={addToCart}
                addToWishlist={addToWishlist}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                onSignIn={(u) => {
                  signIn(u);
                  window.location.href = "/";
                }}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                items={Object.values(wishlist)}
                remove={(id) =>
                  setWishlist((w) => {
                    const n = { ...w };
                    delete n[id];
                    return n;
                  })
                }
              />
            }
          />
        </Routes>
      </main>

      <Footer
        contact="+91-98765-43210"
        instagram="https://instagram.com/TopPickDeals"
      />

      <CartDrawer
        open={!!cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        clearCart={clearCart}
        total={total()}
      />
    </div>
  );
}
