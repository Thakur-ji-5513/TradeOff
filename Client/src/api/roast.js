const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const BASE_URL = `${API_BASE}/roast`;

export const getRoastChatResponse = async (messages) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ messages }),
  });
  return res.json();
};
