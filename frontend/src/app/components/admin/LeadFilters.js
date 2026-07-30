export default function LeadFilters({ filters, onChange, onSubmit, onClear }) {
  function setValue(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <form className="adminFilters" onSubmit={onSubmit}>
      <input
        aria-label="Search leads"
        value={filters.q || ""}
        onChange={(event) => setValue("q", event.target.value)}
        placeholder="Search customer, reference, phone..."
      />
      <select value={filters.status || ""} onChange={(event) => setValue("status", event.target.value)}>
        <option value="">All statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Converted">Converted</option>
        <option value="Lost">Lost</option>
      </select>
      <select value={filters.sort || "newest"} onChange={(event) => setValue("sort", event.target.value)}>
        <option value="newest">Newest</option>
        <option value="score">Lead score</option>
      </select>
      <button type="submit">Apply</button>
      <button type="button" className="adminSecondaryButton" onClick={onClear}>Clear</button>
    </form>
  );
}
