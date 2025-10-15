// src/api/client.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;


// Cliente API configurado
const apiClient = axios.create({
  baseURL: API_BASE_URL, // 👈 Laravel expone las rutas API aquí
  withCredentials: true, // necesario para que Sanctum maneje las cookies
});

// Obtener token CSRF antes de login/register (va fuera de /api)
export const getCsrfToken = () =>
  axios.get(`${API_BASE_URL.replace("/api", "")}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });

export default apiClient;
