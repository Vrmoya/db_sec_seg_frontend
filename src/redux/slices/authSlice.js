// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// 🔁 Cargar datos persistidos desde localStorage
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/signin', credentials);

      // ✅ Guardar en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (err) {
      const fallback = {
        message: 'Error de conexión con el servidor',
        status: err?.response?.status || 500,
      };
      return rejectWithValue(err?.response?.data || fallback);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      // 🧹 Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error inesperado';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;