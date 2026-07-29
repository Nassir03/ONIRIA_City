"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { adminApi } from "../../../services/adminApi";

const reasons = [
  ["forgot_password", "Forgot password"],
  ["forgot_staff_email", "Forgot staff email"],
  ["email_address_changed", "Email address has changed"],
  ["no_access_to_registered_email", "No longer has access to registered email"],
  ["account_locked", "Account locked"],
  ["other", "Other"],
];

export default function RecoveryRequestForm({ defaultReason = "forgot_staff_email" }) {
  const searchParams = useSearchParams();
  const initialReason = searchParams.get("reason") || defaultReason;
  const [form, setForm] = useState({
    full_name: "",
    known_email: "",
    phone: "",
    staff_identifier: "",
    department: "",
    claimed_role: "",
    recovery_reason: initialReason,
    preferred_contact_method: "phone",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim ? value.trim() : value]));
      if (!payload.known_email) {
        delete payload.known_email;
      }
      const result = await adminApi.recoveryRequest(payload);
      setSuccess(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="adminLoginForm adminRecoveryForm" onSubmit={submit}>
      <label>Full name<input required value={form.full_name} onChange={(event) => update("full_name", event.target.value)} /></label>
      <label>Known email, optional<input type="email" value={form.known_email} onChange={(event) => update("known_email", event.target.value)} /></label>
      <label>Phone number<input required value={form.phone} onChange={(event) => update("phone", event.target.value)} /></label>
      <label>Staff ID, optional<input value={form.staff_identifier} onChange={(event) => update("staff_identifier", event.target.value)} /></label>
      <label>Department or role<input value={form.department} onChange={(event) => update("department", event.target.value)} /></label>
      <label>Claimed role<input value={form.claimed_role} onChange={(event) => update("claimed_role", event.target.value)} /></label>
      <label>
        Recovery reason
        <select value={form.recovery_reason} onChange={(event) => update("recovery_reason", event.target.value)}>
          {reasons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label>
        Preferred contact method
        <select value={form.preferred_contact_method} onChange={(event) => update("preferred_contact_method", event.target.value)}>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </label>
      <label>Message<textarea rows={4} value={form.message} onChange={(event) => update("message", event.target.value)} /></label>
      {error && <p className="adminError">{error}</p>}
      {success && <p className="adminSuccess">{success}</p>}
      <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Recovery Request"}</button>
      <div className="adminAuthLinks">
        <Link href="/admin/login">Return to Staff Login</Link>
      </div>
    </form>
  );
}
