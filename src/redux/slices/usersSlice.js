import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseApi from '../../services/baseApi';


// 🔄 Obtener todos los usuarios
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseApi.get('/api/users');
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
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(toggleUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((u) => (u.id === updated.id ? updated : u));
      });
  },
});

export default usersSlice.reducer;