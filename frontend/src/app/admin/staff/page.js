"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/adminApi";

export default function AdminStaffPage() {
  return (
    <AdminLayout title="Staff">
      <AdminStaffContent />
    </AdminLayout>
  );
}

function AdminStaffContent() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", roles: "sales_agent" });
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      setStaff(await adminApi.staff());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;
    adminApi
      .staff()
      .then((result) => {
        if (active) {
          setStaff(result);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function create(event) {
    event.preventDefault();
    try {
      await adminApi.createStaff({ ...form, roles: [form.roles] });
      setForm({ full_name: "", email: "", password: "", roles: "sales_agent" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="adminError">{error}</div>}
      <form className="adminFilters" onSubmit={create}>
        <input placeholder="Full name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input placeholder="Temporary password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <select value={form.roles} onChange={(event) => setForm({ ...form, roles: event.target.value })}>
          <option value="administrator">Administrator</option>
          <option value="sales_manager">Sales Manager</option>
          <option value="sales_agent">Sales Agent</option>
          <option value="marketing_staff">Marketing Staff</option>
          <option value="knowledge_editor">Knowledge Editor</option>
        </select>
        <button type="submit">Create Staff</button>
      </form>
      <div className="adminTableWrap">
        <table className="adminTable">
          <thead><tr><th>Name</th><th>Email</th><th>Roles</th><th>Active</th><th>Action</th></tr></thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td>{member.full_name}</td>
                <td>{member.email}</td>
                <td>{member.roles?.join(", ")}</td>
                <td>{member.is_active ? "Yes" : "No"}</td>
                <td><button type="button" onClick={() => adminApi.disableStaff(member.id).then(() => load())}>Disable</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
