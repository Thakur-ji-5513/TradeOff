// Use the environment variable if available, otherwise default to local server
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const BASE_URL = `${API_BASE}/auth`;

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};



export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

export const getProfile = async () => {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.json();
};