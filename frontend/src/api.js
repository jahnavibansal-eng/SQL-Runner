const BASE_URL = "https://sql-runner-goyx.onrender.com";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { token } : {};
}

async function request(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(opts.headers || {}),
    },
    body: opts.body || null
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

export async function login(username, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export async function fetchTables() {
  return request("/tables");
}

export async function fetchTableInfo(name) {
  return request(`/table/${encodeURIComponent(name)}`);
}

export async function runQuery(sql) {
  return request("/query", {
    method: "POST",
    body: JSON.stringify({ sql })
  });
}

export async function fetchHistory() {
  return request("/history");
}

export async function clearHistoryAPI() {
  return request("/history", {
    method: "DELETE"
  });
}
