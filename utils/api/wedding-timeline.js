const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE && typeof window !== "undefined") {
  console.error(
    "[wedding-timeline] NEXT_PUBLIC_API_URL is not set — API calls will fail."
  );
}

const STATUS_TO_CODE = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  503: "SERVICE_UNAVAILABLE",
};

async function authedRequest(method, path, token, body) {
  const headers = { Authorization: `Bearer ${token}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let parsed = null;
    try {
      parsed = await response.json();
    } catch {
      parsed = {};
    }

    if (response.ok) {
      return { data: parsed, error: null };
    }

    const code = STATUS_TO_CODE[response.status] || "SERVER_ERROR";
    const message =
      (parsed && parsed.error) ||
      `Request failed with status ${response.status}`;
    return { data: null, error: { code, message } };
  } catch (err) {
    return {
      data: null,
      error: {
        code: "NETWORK_ERROR",
        message: err.message || "Network failure",
      },
    };
  }
}

export async function fetchTimeline(eventId, token) {
  return authedRequest("GET", `/event/${eventId}/wedding-timeline`, token);
}

export async function regenerateTimeline(eventId, token) {
  return authedRequest(
    "POST",
    `/event/${eventId}/wedding-timeline/regenerate`,
    token,
    {}
  );
}

export async function fetchEvents(token) {
  return authedRequest("GET", `/event`, token);
}

export async function markMilestoneComplete(eventId, milestoneId, token) {
  return authedRequest(
    "PATCH",
    `/event/${eventId}/wedding-timeline/${milestoneId}`,
    token,
    { status: "COMPLETED" }
  );
}

export async function updateEvent(eventId, payload, token) {
  return authedRequest("PUT", `/event/${eventId}`, token, payload);
}

export async function createEvent(payload, token) {
  return authedRequest("POST", "/event", token, payload);
}
