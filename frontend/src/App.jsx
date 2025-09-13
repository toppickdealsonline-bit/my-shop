// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CartDrawer from "./components/CartDrawer.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Wishlist from "./pages/Wishlist.jsx";

import { fetchProducts } from "./lib/api.js";

/* App: top-level state & data fetching */
export default function App() {
  // auth stored locally
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

  // products from backend
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setProductsLoading(true);
    fetchProducts()
      .then((items) => {
        if (!mounted) return;
        // normalize shape so UI expects .desc, .images, .slug etc.
        const normalized = items.map((p) => ({
          id: p.id,
          slug: p.slug ?? p.id,
          title: p.title,
          price: p.price,
          category: p.category,
          images: Array.isArray(p.images)
            ? p.images
            : p.images
            ? [p.images]
            : [],
          desc: p.description ?? p.desc ?? "",
          _raw: p,
        }));
        setProducts(normalized);
        setProductsError(null);
      })
      .catch((err) => {
        console.error("Failed fetching products:", err);
        setProductsError(err?.message ?? String(err));
      })
      .finally(() => {
        if (mounted) setProductsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // CART & WISHLIST persisted locally
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

  function findProductById(id) {
    return products.find((p) => p.id === id) || null;
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
                loading={productsLoading}
                error={productsError}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
              />
            }
          />

          <Route
            path="/product/:slug"
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
        findProductById={findProductById}
      />
    </div>
  );
}
