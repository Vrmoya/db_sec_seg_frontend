// src/services/baseApi.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { forceLogout } from '../redux/actions/authActions';

const baseApi = axios.create({
  baseURL: 'http://localhost:3000/',
});

baseApi.interceptors.request.use((config) => {
  const token =
    window.__APP_STORE__?.getState?.().auth?.token ||
    localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

baseApi.interceptors.response.use(
  (response) => {
    // ⚠️ Si el backend devuelve { code: 403 } dentro de un 200, detectalo manualmente
    if (response.data?.code === 403) {
      toast.warning("No tienes permisos para acceder a esta sección.");
      forceLogout();
      return Promise.reject({ response });
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
      forceLogout();
    }

    if (status === 403) {
      toast.warning("No tienes permisos para acceder a esta sección.");
      forceLogout();
    }

    return Promise.reject(error);
  }
);

export default baseApi;