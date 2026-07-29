export default function DashboardCards({ data }) {
  const cards = [
    ["Total Leads", data.total_leads],
    ["New Leads", data.new_leads],
    ["Contacted", data.contacted_leads],
    ["Qualified", data.qualified_leads],
    ["Priority", data.priority_leads],
    ["Brochures", data.brochure_requests],
    ["Consultations", data.consultation_requests],
    ["Site Visits", data.site_visit_requests],
    ["Due Today", data.follow_ups_due_today],
    ["Unassigned", data.unassigned_leads],
  ];

  return (
    <div className="adminCards">
      {cards.map(([label, value]) => (
        <article className="adminMetricCard" key={label}>
          <span>{label}</span>
          <strong>{value ?? 0}</strong>
        </article>
      ))}
    </div>
  );
}
