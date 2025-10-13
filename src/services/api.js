// src/services/api.js
import baseApi from './baseApi';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn('Sesión inválida o expirada. Redirigiendo al login...');
      store.dispatch(logout());
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default baseApi;