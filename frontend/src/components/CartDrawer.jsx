import React from "react";

export default function CartDrawer({
  open = false,
  onClose = () => {},
  cart = {},
  updateQty = () => {},
  removeItem = () => {},
  clearCart = () => {},
  total = "0.00",
}) {
  const items = Object.values(cart);

  return (
    <>
      <div className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-panel" role="dialog" aria-modal="true">
          <div className="cart-header">
            <h4>Your Cart</h4>
            <button onClick={onClose} className="close-btn">
              ✕
            </button>
          </div>

          <div className="cart-body">
            {items.length === 0 ? (
              <div className="center muted">Cart is empty</div>
            ) : (
              <ul className="cart-list">
                {items.map((it) => (
                  <li key={it.id} className="cart-item">
                    <img
                      src={it.images?.[0]}
                      alt={it.title}
                      className="cart-thumb"
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{it.title}</div>
                      <div className="muted">₹{it.price} each</div>
                      <div className="qty-row">
                        <button onClick={() => updateQty(it.id, it.qty - 1)}>
                          -
                        </button>
                        <div className="qty">{it.qty}</div>
                        <button onClick={() => updateQty(it.id, it.qty + 1)}>
                          +
                        </button>
                        <button
                          className="remove-link"
                          onClick={() => removeItem(it.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="cart-footer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>Subtotal</div>
              <div style={{ fontWeight: 700 }}>₹{total}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => alert("Checkout (mock)")}
              >
                Checkout
              </button>
              <button className="btn btn-ghost" onClick={clearCart}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="cart-backdrop" onClick={onClose} />
      </div>
    </>
  );
}
