// src/auth.js
export function isAuthenticated() {
  // Simple mock: check localStorage
  return localStorage.getItem("loggedIn") === "true";
}

export function login() {
  localStorage.setItem("loggedIn", "true");
}

export function logout() {
  localStorage.removeItem("loggedIn");
}
