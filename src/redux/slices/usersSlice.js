import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseApi from '../../services/baseApi';

// 🔄 Obtener todos los usuarios
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await baseApi.get('/api/users', { params });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: 'Error al cargar usuarios' });
    }
  }
);

// ✅ Activar/desactivar usuario
export const toggleUser = createAsyncThunk(
  'users/toggleUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await baseApi.patch(`/api/users/${userId}/toggle`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: 'Error al actualizar usuario' });
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        // Si el payload es un objeto con users
        if (Array.isArray(payload.users)) {
          state.list = payload.users;
          state.total = payload.totalPages ? payload.totalPages * 10 : payload.users.length;
        }
        // Si el payload es directamente un array
        else if (Array.isArray(payload)) {
          state.list = payload;
          state.total = payload.length;
        }
        // Si el payload no es válido
        else {
          state.list = [];
          state.total = 0;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al cargar usuarios';
      })
      .addCase(toggleUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((u) => (u.id === updated.id ? updated : u));
      });
  },
});

export default usersSlice.reducer;