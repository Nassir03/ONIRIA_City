export default function LeadDetails({ data }) {
  const lead = data.lead || {};
  const customer = data.customer || {};
  const summary = data.summary || {};

  return (
    <div className="adminDetailGrid">
      <section>
        <h2>Customer Information</h2>
        <p><span>Full name</span>{customer.full_name || summary.customer || lead.name || "-"}</p>
        <p><span>Email</span>{customer.email || summary.email || lead.email || "-"}</p>
        <p><span>Phone</span>{customer.phone || summary.phone || lead.phone || "-"}</p>
        <p><span>Country</span>{customer.country || "-"}</p>
        <p><span>Language</span>{customer.preferred_language || "-"}</p>
        <p><span>Preferred contact</span>{customer.preferred_contact_method || "-"}</p>
      </section>
      <section>
        <h2>Property Interest</h2>
        <p><span>Requested</span>{lead.property_interest || summary.interest || "-"}</p>
        <p><span>Bedrooms</span>{lead.bedroom_preference || "-"}</p>
        <p><span>Budget</span>{lead.budget_range || "-"}</p>
        <p><span>Buying purpose</span>{lead.buying_purpose || "-"}</p>
        <p><span>Timeline</span>{lead.purchase_timeframe || "-"}</p>
      </section>
      <section>
        <h2>Attribution</h2>
        <p><span>Source</span>{lead.source_platform || summary.source || "-"}</p>
        <p><span>Campaign</span>{lead.campaign_name || summary.campaign || "-"}</p>
        <p><span>UTM source</span>{lead.utm_source || "-"}</p>
        <p><span>Landing page</span>{lead.landing_page || "-"}</p>
        <p><span>Referral</span>{lead.referral_url || "-"}</p>
      </section>
      <section>
        <h2>Sales Information</h2>
        <p><span>Reference</span>{summary.reference || lead.reference_number || "-"}</p>
        <p><span>Score</span>{summary.lead_score ?? lead.lead_score ?? lead.score ?? 0}</p>
        <p><span>Status</span>{summary.status || lead.lead_status || lead.follow_up_status || "-"}</p>
        <p><span>Assigned</span>{summary.assigned_staff || "Unassigned"}</p>
        <p><span>Next follow-up</span>{lead.next_follow_up_at ? new Date(lead.next_follow_up_at).toLocaleString() : "-"}</p>
      </section>
    </div>
  );
}
