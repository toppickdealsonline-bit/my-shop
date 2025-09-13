// src/hooks/useAuth.js
import { useState, useEffect } from "react";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function useAuth() {
  const [user, setUser] = useState(() => load("auth_current", null));

  useEffect(() => save("auth_current", user), [user]);

  function login(email, phone, password) {
    const users = load("auth_users", {});
    const id = email || phone;
    if (!id || !password) return { ok: false, msg: "Missing credentials" };
    if (!users[id] || users[id].password !== password) {
      return { ok: false, msg: "User not found or wrong password" };
    }
    setUser(users[id]);
    return { ok: true };
  }

  function signup(email, phone, password) {
    const users = load("auth_users", {});
    const id = email || phone;
    if (!id || !password) return { ok: false, msg: "Missing credentials" };
    if (users[id]) return { ok: false, msg: "User already exists" };
    users[id] = { id, email, phone, password, name: id.split("@")[0] || id };
    save("auth_users", users);
    setUser(users[id]);
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return { user, login, signup, logout };
}
