"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { adminApi } from "../../services/adminApi";

export default function AccountRecoveryPage() {
  return (
    <AdminLayout title="Account Recovery">
      <AccountRecoveryContent />
    </AdminLayout>
  );
}

function AccountRecoveryContent() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const rows = await adminApi.recoveryRequests();
      setRequests(rows);
      if (selected) {
        setSelected(await adminApi.recoveryRequestDetail(selected.id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    adminApi
      .recoveryRequests()
      .then((rows) => {
        if (active) setRequests(rows);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function openRequest(id) {
    setError("");
    try {
      setSelected(await adminApi.recoveryRequestDetail(id));
      setNote("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function act(action) {
    if (!selected) return;
    setError("");
    try {
      if (action === "assign") await adminApi.assignRecoveryRequest(selected.id);
      if (action === "resolve") await adminApi.resolveRecoveryRequest(selected.id, note);
      if (action === "reject") await adminApi.rejectRecoveryRequest(selected.id, note);
      await load();
      setSelected(await adminApi.recoveryRequestDetail(selected.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="adminError">{error}</div>}
      {loading ? <div className="adminLoading">Loading recovery requests...</div> : (
        <div className="adminRecoveryGrid">
          <section className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Staff name</th>
                  <th>Reason</th>
                  <th>Phone</th>
                  <th>Known email</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.reference_number}</td>
                    <td>{item.full_name}</td>
                    <td>{item.recovery_reason}</td>
                    <td>{item.phone}</td>
                    <td>{item.known_email || "-"}</td>
                    <td>{item.created_at || "-"}</td>
                    <td>{item.status}</td>
                    <td>{item.assigned_admin_name || "-"}</td>
                    <td><button type="button" onClick={() => openRequest(item.id)}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!requests.length && <div className="adminEmpty">No recovery requests yet.</div>}
          </section>

          {selected && (
            <section className="adminDetailCard">
              <h2>{selected.reference_number}</h2>
              <dl>
                <dt>Submitted information</dt>
                <dd>{selected.full_name} · {selected.phone} · {selected.known_email || "No known email"}</dd>
                <dt>Department or role</dt>
                <dd>{selected.department || "-"} · {selected.claimed_role || "-"}</dd>
                <dt>Message</dt>
                <dd>{selected.message || "-"}</dd>
                <dt>Verification checklist</dt>
                <dd>Confirm identity, staff relationship, access channel, and administrator approval before sharing or updating staff email.</dd>
              </dl>

              <h2>Matching Staff Candidates</h2>
              <div className="adminTableWrap">
                <table className="adminTable">
                  <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Role</th></tr></thead>
                  <tbody>
                    {(selected.staff_candidates || []).map((candidate) => (
                      <tr key={candidate.id}>
                        <td>{candidate.full_name}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.is_active ? "Active" : "Disabled"}</td>
                        <td>{candidate.roles?.join(", ") || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!selected.staff_candidates?.length && <div className="adminEmpty">No candidate match found.</div>}
              </div>

              <label className="adminNoteField">
                Internal note
                <textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
              <div className="adminActions">
                <button type="button" onClick={() => act("assign")}>Assign to Me</button>
                <button type="button" onClick={() => act("resolve")}>Resolve</button>
                <button type="button" onClick={() => act("reject")}>Reject</button>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
