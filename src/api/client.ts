import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.response.use(
    res => res,
    err => {
        console.error("API error:", err.response?.status, err.message);
        return Promise.reject(err);
    },
);

export default client;