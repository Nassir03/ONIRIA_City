"use client";

import Link from "next/link";
import { useState } from "react";
import { adminApi } from "../../../services/adminApi";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await adminApi.forgotPassword({ email });
      setSuccess(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="adminLoginForm" onSubmit={submit}>
      <label>
        Registered staff email
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      {error && <p className="adminError">{error}</p>}
      {success && <p className="adminSuccess">{success}</p>}
      <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Reset Instructions"}</button>
      <div className="adminAuthLinks">
        <Link href="/admin/login">Return to Staff Login</Link>
        <Link href="/admin/forgot-email?reason=no_access_to_registered_email">Contact Administrator</Link>
      </div>
    </form>
  );
}
