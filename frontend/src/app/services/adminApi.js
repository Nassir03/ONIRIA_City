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
  forgotPassword: (payload) =>
    request("/admin/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) }),
  validateResetToken: (payload) =>
    request("/admin/auth/validate-reset-token", { method: "POST", body: JSON.stringify(payload) }),
  resetPassword: (payload) =>
    request("/admin/auth/reset-password", { method: "POST", body: JSON.stringify(payload) }),
  recoveryRequest: (payload) =>
    request("/admin/auth/recovery-request", { method: "POST", body: JSON.stringify(payload) }),
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
  recoveryRequests: () => request("/admin/account-recovery-requests"),
  recoveryRequestDetail: (id) => request(`/admin/account-recovery-requests/${id}`),
  updateRecoveryRequest: (id, payload) =>
    request(`/admin/account-recovery-requests/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  assignRecoveryRequest: (id, adminId) =>
    request(`/admin/account-recovery-requests/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ admin_id: adminId }),
    }),
  resolveRecoveryRequest: (id, resolutionNote) =>
    request(`/admin/account-recovery-requests/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ resolution_note: resolutionNote }),
    }),
  rejectRecoveryRequest: (id, resolutionNote) =>
    request(`/admin/account-recovery-requests/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ resolution_note: resolutionNote }),
    }),
  subscribers: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
    );
    return request(`/admin/newsletter/subscribers${query.toString() ? `?${query}` : ""}`);
  },
};
