// src/pages/Login.jsx
import React, { useEffect, useState } from "react";

/*
  Props:
    - onSignIn(user) : callback when sign in succeeds
    - asModal (bool)  : if true render as floating modal overlay (default false)
    - open (bool)     : when asModal=true, controls visibility
    - onClose()       : when asModal=true, called to request close
*/
export default function Login({
  onSignIn = () => {},
  asModal = false,
  open = false,
  onClose = () => {},
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  useEffect(() => {
    // clear errors when inputs change
    setErrors({});
  }, [email, phone, password]);

  function validate() {
    const e = {};
    // must provide either email or phone
    if (!email && !phone) {
      e.contact = "Please provide either an email or a phone number.";
    } else {
      if (email) {
        // basic email regex
        const re = /^\S+@\S+\.\S+$/;
        if (!re.test(email)) e.email = "Email looks invalid.";
      }
      if (phone) {
        // allow digits, +, -, spaces — basic check
        const digits = phone.replace(/[^0-9]/g, "");
        if (digits.length < 7) e.phone = "Phone number looks too short.";
      }
    }

    if (!password || password.length < 6)
      e.password = "Password must be at least 6 characters.";
    return e;
  }

  function handleSubmit(e) {
    e && e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) return;

    setSubmitting(true);
    // simulate request latency
    setTimeout(() => {
      const user = { email: email || null, phone: phone || null };
      try {
        localStorage.setItem("tpd_user_v1", JSON.stringify(user));
      } catch {}
      setSubmitting(false);
      onSignIn(user);
      // close modal if used as modal
      if (asModal && typeof onClose === "function") onClose();
    }, 700);
  }

  // forgot password handlers (mock)
  function sendForgot() {
    if (!forgotEmail) {
      setForgotMessage("Enter your email to receive reset instructions.");
      return;
    }
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(forgotEmail)) {
      setForgotMessage("Email seems invalid.");
      return;
    }
    setForgotMessage("Sending reset link...");
    setTimeout(() => {
      setForgotMessage(
        "If that address exists in our system, a reset link has been sent."
      );
    }, 900);
  }

  // shared small UI
  const Content = (
    <div className="login-card">
      <div className="login-brand">
        <img src="/logo.PNG" alt="TopPickDeals" className="login-logo" />
        <div>
          <div className="login-title">Sign in / Register</div>
          <div className="login-sub">
            Access your account — email or phone allowed.
          </div>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label">Email (optional)</label>
        <input
          className={`field-input ${errors.email ? "field-err" : ""}`}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
        />
        {errors.email && <div className="error-text">{errors.email}</div>}

        <label className="field-label">Phone (optional)</label>
        <input
          className={`field-input ${errors.phone ? "field-err" : ""}`}
          placeholder="+91-98765-43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          autoComplete="tel"
        />
        {errors.phone && <div className="error-text">{errors.phone}</div>}

        {errors.contact && <div className="error-text">{errors.contact}</div>}

        <label className="field-label">Password</label>
        <input
          className={`field-input ${errors.password ? "field-err" : ""}`}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />
        {errors.password && <div className="error-text">{errors.password}</div>}

        <div className="login-actions">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              // demo autofill
              setEmail("demo@example.com");
              setPhone("9999999999");
              setPassword("password");
            }}
          >
            Demo
          </button>

          <button
            type="button"
            className="link-btn"
            onClick={() => setForgotOpen((s) => !s)}
            aria-expanded={forgotOpen ? "true" : "false"}
          >
            Forgot password?
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
          By signing in you agree to TopPickDeals terms. This demo stores a
          minimal user object in localStorage only.
        </div>
      </form>

      {/* Forgot area */}
      {forgotOpen && (
        <div className="forgot-card">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Reset password</div>
          <div style={{ marginBottom: 8, color: "#374151" }}>
            Enter your email and we will send password reset instructions
            (demo).
          </div>
          <input
            className="field-input"
            placeholder="you@example.com"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            type="email"
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={sendForgot}
            >
              Send
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setForgotOpen(false);
                setForgotMessage("");
              }}
            >
              Cancel
            </button>
          </div>
          {forgotMessage && (
            <div style={{ marginTop: 8, color: "#065f46" }}>
              {forgotMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // If used as a modal overlay
  if (asModal) {
    if (!open) return null;
    return (
      <div
        className="modal-overlay"
        aria-modal="true"
        role="dialog"
        onMouseDown={(e) => {
          if (e.target.classList.contains("modal-overlay")) onClose();
        }}
      >
        <div className="modal-body">
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
          {Content}
        </div>
      </div>
    );
  }

  // default: full-page centered
  return <div className="login-viewport">{Content}</div>;
}
