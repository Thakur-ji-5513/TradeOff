// Use the environment variable if available, otherwise default to local server
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const BASE_URL = `${API_BASE}/tradeoff`;

export const calculateTradeoff = async (data) => {
  const res = await fetch(`${BASE_URL}/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const createTradeoff = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getMyTradeoffs = async () => {
  const res = await fetch(`${BASE_URL}/my`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.json();
};

export const deleteTradeoff = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.json();
};

export const updateTradeoffStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ status })
  });

  return res.json();
};