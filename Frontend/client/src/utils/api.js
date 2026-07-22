const API_BASE = import.meta.env.VITE_API_URL || "";

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function saveLoggedInUser(user) {
  localStorage.setItem("loggedInUser", JSON.stringify(user || {}));
}

export function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  } catch {
    return {};
  }
}

export function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("savedJobs");
}

export function getTokenPayload() {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const json = JSON.parse(decodeURIComponent(atob(payload).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
    return json;
  } catch (e) {
    return null;
  }
}

export function isAdmin() {
  const p = getTokenPayload();
  return p && p.role === 'admin';
}

function buildHeaders(headers = {}) {
  const token = getToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  return {
    "Content-Type": "application/json",
    ...authHeaders,
    ...headers,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: buildHeaders(options.headers),
    credentials: "include",
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error || data?.message || response.statusText;
    throw new Error(message);
  }

  return data;
}

export function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerEmployer(payload) {
  return request("/api/auth/register/employer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStudentProfile() {
  return request("/api/students/profile");
}

export function updateStudentProfile(payload) {
  return request("/api/students/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function addStudentEducation(payload) {
  return request("/api/students/education", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getJobs() {
  return request("/api/jobs");
}

export function getMatchedJobs() {
  return request("/api/jobs/matched");
}

export function getEmployers(status) {
  return request(`/api/admin/employers${status ? `?status=${encodeURIComponent(status)}` : ""}`);
}

export function reviewEmployer(id, approval_status, approval_comments) {
  return request(`/api/admin/employers/${id}`, {
    method: "PUT",
    body: JSON.stringify({ approval_status, approval_comments }),
  });
}

export function getJobsForReview(status) {
  return request(`/api/admin/jobs${status ? `?status=${encodeURIComponent(status)}` : ""}`);
}

export function getStats(start_date, end_date) {
  const query = start_date && end_date
    ? `?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`
    : "";
  return request(`/api/admin/stats${query}`);
}

export function reviewJob(id, approval_status, approval_comments) {
  return request(`/api/admin/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify({ approval_status, approval_comments }),
  });
}

export function getPlacements() {
  return request(`/api/admin/placements`);
}

export function applyJob(job_id) {
  return request("/api/applications", {
    method: "POST",
    body: JSON.stringify({ job_id }),
  });
}

export function getEmployerDetails(id) {
  return request(`/api/admin/employers/${id}`);
}

export function getJobDetails(id) {
  return request(`/api/admin/jobs/${id}`);
}

export function getMyApplications() {
  return request("/api/applications/me");
}

export function withdrawApplication(applicationId) {
  return request(`/api/applications/${applicationId}/withdraw`, {
    method: "PUT",
  });
}
