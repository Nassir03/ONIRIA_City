const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:7000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    const message = body?.error?.message || body?.detail || "Admin request failed";
    throw new Error(message);
  }
  return body.data;
}

export const adminApi = {
  login: (payload) =>
    request("/admin/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/admin/logout", { method: "POST" }),
  session: () => request("/admin/session"),
  dashboard: () => request("/admin/dashboard"),
  leads: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
    );
    return request(`/admin/leads${query.toString() ? `?${query}` : ""}`);
  },
  lead: (id) => request(`/admin/leads/${id}`),
  updateLead: (id, payload) =>
    request(`/admin/leads/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  assignLead: (id, staffId) =>
    request(`/admin/leads/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ staff_id: Number(staffId) }),
    }),
  addNote: (id, note) =>
    request(`/admin/leads/${id}/notes`, { method: "POST", body: JSON.stringify({ note }) }),
  addFollowUp: (id, payload) =>
    request(`/admin/leads/${id}/follow-up`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  list: (path) => request(`/admin/${path}`),
  staff: () => request("/admin/staff"),
  createStaff: (payload) =>
    request("/admin/staff", { method: "POST", body: JSON.stringify(payload) }),
  disableStaff: (id) => request(`/admin/staff/${id}/disable`, { method: "POST" }),
};
