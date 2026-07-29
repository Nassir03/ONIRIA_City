"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/adminApi";

export default function SubscribersPage() {
  const [filters, setFilters] = useState({ q: "", status: "", campaign: "" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load(nextFilters = filters) {
    setError("");
    try {
      setData(await adminApi.subscribers(nextFilters));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;
    adminApi
      .subscribers()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  function submit(event) {
    event.preventDefault();
    load(filters);
  }

  return (
    <AdminLayout title="Subscribers">
      {error && <div className="adminError">{error}</div>}
      <form className="adminFilters" onSubmit={submit}>
        <input placeholder="Search email" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} />
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="suppressed">Suppressed</option>
        </select>
        <input placeholder="Campaign" value={filters.campaign} onChange={(event) => setFilters({ ...filters, campaign: event.target.value })} />
        <button type="submit">Filter</button>
      </form>

      {!data ? <div className="adminLoading">Loading subscribers...</div> : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Source page</th>
                <th>UTM source</th>
                <th>UTM campaign</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {(data.items || []).map((item) => (
                <tr key={`${item.email}-${item.subscribed_at}`}>
                  <td>{item.email}</td>
                  <td>{item.status}</td>
                  <td>{item.source_page || "-"}</td>
                  <td>{item.utm_source || "-"}</td>
                  <td>{item.utm_campaign || "-"}</td>
                  <td>{item.subscribed_at || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.items?.length && <div className="adminEmpty">No subscribers found.</div>}
        </div>
      )}
    </AdminLayout>
  );
}
