"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardCards from "../components/admin/DashboardCards";
import LeadTable from "../components/admin/LeadTable";
import { AdminPageHeader, ErrorState, LoadingSkeleton } from "../components/admin/AdminUI";
import { adminApi } from "../services/adminApi";

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <DashboardContent />
    </AdminLayout>
  );
}

function DashboardContent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  function load({ clearError = true } = {}) {
    if (clearError) {
      setError("");
    }
    adminApi.dashboard().then(setData).catch((err) => setError(err.message));
  }

  useEffect(() => {
    adminApi.dashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A concise view of ONIRIA City lead activity, appointments and follow-ups."
      />
      {error && <ErrorState message={error} onRetry={() => load()} />}
      {!data && !error ? <LoadingSkeleton type="cards" /> : data && (
        <>
          <DashboardCards data={data} />
          <section className="adminPanel adminDashboardSection">
            <h2>Recent Enquiries</h2>
            <LeadTable leads={data.recent_enquiries || []} />
          </section>
          <div className="adminDashboardGrid">
            <section className="adminPanel">
              <h2>Upcoming Appointments</h2>
              <p>Consultations and site visits appear in their dedicated pages.</p>
            </section>
            <section className="adminPanel">
              <h2>Follow-ups Requiring Attention</h2>
              <p>{data.follow_ups_due_today ? `${data.follow_ups_due_today} follow-ups are due today.` : "No follow-ups due today."}</p>
            </section>
          </div>
        </>
      )}
    </>
  );
}
