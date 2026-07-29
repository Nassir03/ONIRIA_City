const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:7000/api";

export function getAnonymousSessionId() {
  if (typeof window === "undefined") {
    return "";
  }
  const key = "oniria_anonymous_session_id";
  let sessionId = window.localStorage.getItem(key);
  if (!sessionId) {
    sessionId = `anon-${crypto.randomUUID()}`;
    window.localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function getCampaignAttribution() {
  if (typeof window === "undefined") {
    return {};
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    utm_content: params.get("utm_content") || null,
    utm_term: params.get("utm_term") || null,
    landing_page: window.location.pathname,
    referrer: document.referrer || null,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body?.error?.message || "Request failed");
  }
  return body.data;
}

export function submitEnquiry(payload, endpoint = "/enquiries") {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function askOniriaAI(payload) {
  return request("/ai/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
