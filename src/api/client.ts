import axios from "axios";

const client = axios.create({
    baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
    timeout: 10_000,
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