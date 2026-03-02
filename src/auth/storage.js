const KEY = "lp_auth";

export function saveAuth(payload) {
  localStorage.setItem(KEY, JSON.stringify(payload));
}
export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
export function clearAuth() {
  localStorage.removeItem(KEY);
}