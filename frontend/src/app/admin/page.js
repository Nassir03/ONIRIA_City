"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardCards from "../components/admin/DashboardCards";
import LeadTable from "../components/admin/LeadTable";
import { adminApi } from "../services/adminApi";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.dashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="adminError">{error}</div>}
      {!data ? <div className="adminLoading">Loading dashboard...</div> : (
        <>
          <DashboardCards data={data} />
          <section className="adminPanel">
            <h2>Recent Enquiries</h2>
            <LeadTable leads={data.recent_enquiries || []} />
          </section>
        </>
      )}
    </AdminLayout>
  );
}
