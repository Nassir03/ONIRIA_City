"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import LeadFilters from "../../components/admin/LeadFilters";
import LeadTable from "../../components/admin/LeadTable";
import { adminApi } from "../../services/adminApi";

export default function AdminLeadsPage() {
  const [filters, setFilters] = useState({ sort: "newest" });
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load(params = filters) {
    setError("");
    try {
      setData(await adminApi.leads(params));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;
    adminApi
      .leads({ sort: "newest" })
      .then((result) => {
        if (active) {
          setData(result);
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

  return (
    <AdminLayout title="Leads">
      <LeadFilters filters={filters} onChange={setFilters} onSubmit={(event) => { event.preventDefault(); load(filters); }} />
      {error && <div className="adminError">{error}</div>}
      {!data ? <div className="adminLoading">Loading leads...</div> : <LeadTable leads={data.items} />}
    </AdminLayout>
  );
}
