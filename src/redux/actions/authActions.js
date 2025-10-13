// src/redux/actions/authActions.js
import { logout } from '../slices/authSlice';

export const forceLogout = () => {
  const store = window.__APP_STORE__; // ✅ evita ciclo
  store?.dispatch(logout());
  localStorage.setItem('lastRoute', window.location.pathname);
  window.location.href = '/login';
};