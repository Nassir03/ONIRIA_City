"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/adminApi";

export default function AdminListPage({ title, endpoint }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.list(endpoint).then(setItems).catch((err) => setError(err.message));
  }, [endpoint]);

  return (
    <AdminLayout title={title}>
      {error && <div className="adminError">{error}</div>}
      {!items ? <div className="adminLoading">Loading {title.toLowerCase()}...</div> : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id || item.lead_id || JSON.stringify(item)}>
                  <td>{item.id || item.lead_id || "-"}</td>
                  <td>{item.enquiry_type || item.channel || item.source || item.current_status || "-"}</td>
                  <td>{item.status || item.current_status || "-"}</td>
                  <td>{item.created_at || item.created_date || item.follow_up_due_at || "-"}</td>
                  <td>{item.reference || item.customer || item.campaign || item.summary || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <div className="adminEmpty">No records yet.</div>}
        </div>
      )}
    </AdminLayout>
  );
}
