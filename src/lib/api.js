// lib/api.js
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "HATA: NEXT_PUBLIC_API_BASE_URL ortam değişkeni tanımlı değil!"
  );
  throw new Error(
    "API Base URL is not defined. Please check your .env files or Render environment variables."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Axios isteklerinden önce çalışacak interceptor
// Bu, her giden isteğe JWT token'ını ekler.
api.interceptors.request.use(
  (config) => {
    // LocalStorage'dan JWT token'ını "token" anahtarıyla alıyoruz.
    const token = localStorage.getItem("token");

    // Eğer token varsa, "Authorization" başlığına "Bearer" önekiyle ekle.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
