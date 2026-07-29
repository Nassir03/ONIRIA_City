"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "../../../services/adminApi";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(Boolean(token));
  const [valid, setValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    if (!token) {
      return;
    }
    adminApi
      .validateResetToken({ token })
      .then((result) => {
        if (active) {
          setValid(Boolean(result.valid));
          setChecking(false);
        }
      })
      .catch(() => {
        if (active) {
          setValid(false);
          setChecking(false);
        }
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await adminApi.resetPassword({ token, ...form });
      setSuccess(result.message);
      setTimeout(() => router.replace("/admin/login"), 1400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <div className="adminLoading">Checking reset link...</div>;
  }

  if (!valid) {
    return (
      <div className="adminLoginForm">
        <p className="adminError">This reset link is invalid or has expired.</p>
        <div className="adminAuthLinks">
          <Link href="/admin/forgot-password">Request a New Reset Link</Link>
          <Link href="/admin/login">Return to Staff Login</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="adminLoginForm" onSubmit={submit}>
      <label>
        New password
        <input type="password" required value={form.new_password} onChange={(event) => setForm({ ...form, new_password: event.target.value })} />
      </label>
      <PasswordStrengthIndicator password={form.new_password} />
      <label>
        Confirm new password
        <input type="password" required value={form.confirm_password} onChange={(event) => setForm({ ...form, confirm_password: event.target.value })} />
      </label>
      {error && <p className="adminError">{error}</p>}
      {success && <p className="adminSuccess">{success}</p>}
      <button type="submit" disabled={loading}>{loading ? "Changing..." : "Reset Staff Password"}</button>
      <div className="adminAuthLinks">
        <Link href="/admin/login">Return to Staff Login</Link>
      </div>
    </form>
  );
}
