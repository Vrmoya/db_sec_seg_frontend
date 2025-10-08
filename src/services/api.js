// src/services/api.js
import axios from 'axios';
import { store } from '../redux/store';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ajustá según tu backend
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;