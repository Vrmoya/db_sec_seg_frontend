import axios from 'axios';
import { toast } from 'react-toastify';

// Crear instancia base
const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
});

// Interceptor de solicitud: agrega token desde localStorage
baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de respuesta: manejo de errores comunes
baseApi.interceptors.response.use(
  (response) => {
    // ⚠️ Si el backend devuelve { code: 403 } dentro de un 200, detectalo manualmente
    if (response.data?.code === 403) {
      toast.warning("No tienes permisos para acceder a esta sección.");
      localStorage.removeItem('token'); // Opcional: limpiar token
      return Promise.reject({ response });
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
      localStorage.removeItem('token'); // Opcional: limpiar token
    }

    if (status === 403) {
      toast.warning("No tienes permisos para acceder a esta sección.");
      localStorage.removeItem('token'); // Opcional: limpiar token
    }

    return Promise.reject(error);
  }
);

export default baseApi;