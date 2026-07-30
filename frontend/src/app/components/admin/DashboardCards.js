import Link from "next/link";

export default function DashboardCards({ data }) {
  const cards = [
    ["Total Leads", data.total_leads, "/admin/leads", "LE", "Complete lead pipeline"],
    ["New Enquiries", data.new_leads, "/admin/enquiries", "EN", "Fresh client interest"],
    ["Scheduled Site Visits", data.site_visit_requests, "/admin/site-visits", "SV", "Visit requests"],
    ["Pending Consultations", data.consultation_requests, "/admin/consultations", "CO", "Consultation requests"],
    ["Brochure Requests", data.brochure_requests, "/admin/brochure-requests", "BR", "Download enquiries"],
    ["Follow-ups Due", data.follow_ups_due_today, "/admin/follow-ups", "FU", "Needs attention today"],
  ];

  return (
    <div className="adminCards">
      {cards.map(([label, value, href, icon, note]) => (
        <Link className="adminMetricCard" href={href} key={label}>
          <span className="adminMetricIcon" aria-hidden="true">{icon}</span>
          <span>{label}</span>
          <strong>{value ?? 0}</strong>
          <small>{note}</small>
        </Link>
      ))}
    </div>
  );
}
