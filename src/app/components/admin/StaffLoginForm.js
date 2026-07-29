"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../../services/adminApi";

export default function StaffLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.login(form);
      router.replace("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="adminLoginForm" onSubmit={submit}>
      <label>
        Staff email
        <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      </label>
      <label>
        Password
        <input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
      </label>
      {error && <p className="adminError">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
