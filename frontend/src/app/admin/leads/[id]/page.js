"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "../../../components/admin/AdminLayout";
import LeadDetails from "../../../components/admin/LeadDetails";
import LeadTimeline from "../../../components/admin/LeadTimeline";
import { adminApi } from "../../../services/adminApi";

export default function AdminLeadDetailPage() {
  const params = useParams();
  const leadId = params.id;

  return (
    <AdminLayout title={`Lead ${leadId}`}>
      <AdminLeadDetailContent leadId={leadId} />
    </AdminLayout>
  );
}

function AdminLeadDetailContent({ leadId }) {
  const [data, setData] = useState(null);
  const [staff, setStaff] = useState([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("Contacted");
  const [assignedTo, setAssignedTo] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const [lead, staffList] = await Promise.all([adminApi.lead(leadId), adminApi.staff().catch(() => [])]);
      setData(lead);
      setStaff(staffList);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([adminApi.lead(leadId), adminApi.staff().catch(() => [])])
      .then(([lead, staffList]) => {
        if (active) {
          setData(lead);
          setStaff(staffList);
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
  }, [leadId]);

  async function run(action) {
    setError("");
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {error && <div className="adminError">{error}</div>}
      {!data ? <div className="adminLoading">Loading lead...</div> : (
        <>
          <LeadDetails data={data} />
          <section className="adminActions">
            <label>
              Assign salesperson
              <select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
                <option value="">Select staff</option>
                {staff.map((member) => <option value={member.id} key={member.id}>{member.full_name}</option>)}
              </select>
              <button type="button" onClick={() => assignedTo && run(() => adminApi.assignLead(leadId, assignedTo))}>Assign</button>
            </label>
            <label>
              Change status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                {["New", "Contacted", "Interested", "Warm", "Qualified", "Consultation Booked", "Site Visit Booked", "Negotiation", "Converted", "Lost", "Follow-Up Required"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <button type="button" onClick={() => run(() => adminApi.updateLead(leadId, { lead_status: status }))}>Update</button>
            </label>
            <label>
              Next follow-up
              <input type="datetime-local" value={followUp} onChange={(event) => setFollowUp(event.target.value)} />
              <button type="button" onClick={() => followUp && run(() => adminApi.addFollowUp(leadId, { due_at: new Date(followUp).toISOString() }))}>Set</button>
            </label>
            <label className="adminActionFull">
              Internal note
              <textarea value={note} onChange={(event) => setNote(event.target.value)} />
              <button type="button" onClick={() => note && run(() => adminApi.addNote(leadId, note).then(() => setNote("")))}>Add Note</button>
            </label>
          </section>
          <LeadTimeline activities={data.activities} notes={data.notes} followUps={data.follow_ups} />
        </>
      )}
    </>
  );
}
