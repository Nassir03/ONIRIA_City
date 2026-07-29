import Link from "next/link";

export default function LeadTable({ leads }) {
  if (!leads?.length) {
    return <div className="adminEmpty">No leads match the current filters.</div>;
  }

  return (
    <div className="adminTableWrap">
      <table className="adminTable">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Interest</th>
            <th>Source</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Score</th>
            <th>Created</th>
            <th>Next Follow-Up</th>
            <th>Open</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.lead_id}>
              <td>{lead.reference || `Lead ${lead.lead_id}`}</td>
              <td>{lead.customer || "Unknown"}</td>
              <td>{lead.phone || "-"}</td>
              <td>{lead.email || "-"}</td>
              <td>{lead.interest || "-"}</td>
              <td>{lead.source || "-"}</td>
              <td>{lead.status || "-"}</td>
              <td>{lead.assigned_staff || "Unassigned"}</td>
              <td>{lead.lead_score ?? 0}</td>
              <td>{lead.created_date ? new Date(lead.created_date).toLocaleDateString() : "-"}</td>
              <td>{lead.next_follow_up ? new Date(lead.next_follow_up).toLocaleString() : "-"}</td>
              <td>
                <Link href={`/admin/leads/${lead.lead_id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
