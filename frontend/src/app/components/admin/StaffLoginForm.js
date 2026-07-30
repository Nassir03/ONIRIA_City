"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "../../services/adminApi";

function EyeIcon({ hidden }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      {hidden ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.4 5.4A9.8 9.8 0 0 1 12 5c5 0 8.5 4.4 9.5 7a12.6 12.6 0 0 1-2.1 3.2" />
          <path d="M6.6 6.7A12.1 12.1 0 0 0 2.5 12c1 2.6 4.5 7 9.5 7a9.7 9.7 0 0 0 4.6-1.2" />
        </>
      ) : (
        <>
          <path d="M2.5 12c1-2.6 4.5-7 9.5-7s8.5 4.4 9.5 7c-1 2.6-4.5 7-9.5 7s-8.5-4.4-9.5-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export default function StaffLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await adminApi.login(form);
      setError("");
      if (typeof window !== "undefined") {
        window.location.replace("/admin");
        return;
      }
      router.replace("/admin");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form className="adminLoginForm" onSubmit={submit}>
      <label>
        Staff email
        <input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </label>
      <label>
        Password
        <span className="adminPasswordField">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            <EyeIcon hidden={showPassword} />
          </button>
        </span>
      </label>
      {error && <p className="adminError">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      <div className="adminAuthLinks">
        <Link href="/admin/forgot-password">Forgot Password?</Link>
        <Link href="/admin/forgot-email">Forgot Staff Email?</Link>
      </div>
    </form>
  );
}
