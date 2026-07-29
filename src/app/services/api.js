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

function enrichEnquiryPayload(payload) {
  if (typeof window === "undefined") {
    return payload;
  }

  return {
    anonymous_session_id: payload.anonymous_session_id || getAnonymousSessionId(),
    page_path: payload.page_path || window.location.pathname,
    referral_url: payload.referral_url || document.referrer || null,
    campaign: {
      ...getCampaignAttribution(),
      ...(payload.campaign || {}),
    },
    ...payload,
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
    body: JSON.stringify(enrichEnquiryPayload(payload)),
  });
}

export function askOniriaAI(payload) {
  return request("/ai/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
