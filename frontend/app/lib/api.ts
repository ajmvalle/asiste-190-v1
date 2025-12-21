const API_BASE = "http://localhost:8000";

/* =========================================
   CSRF helper
========================================= */
function getCookie(name: string): string | null {
  let cookieValue: string | null = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(c.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

/* =========================================
   Fetch wrapper (API)
========================================= */
export async function apiFetch(url: string, options: RequestInit = {}) {
  const csrfToken = getCookie("csrftoken");

  return fetch(`${API_BASE}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    },
  });
}
