// src/services/baseApi.js
import axios from 'axios';

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

export default baseApi;