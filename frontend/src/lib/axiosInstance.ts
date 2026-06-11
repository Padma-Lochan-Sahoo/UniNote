// src/lib/axiosInstance.ts
import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();


const normalizeApiUrl = (url) => {
  if (!url) return null;
  return url.replace(/\/+$/, "");
};

const BASE_URL = normalizeApiUrl(rawApiUrl)
  || (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : 'https://uninote-wcxh.onrender.com/api');

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // so cookies (JWT) work
});

export default axiosInstance;
