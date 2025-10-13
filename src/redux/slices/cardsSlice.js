// src/redux/slices/cardsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseApi from '../../services/baseApi';


export const fetchCardBlocks = createAsyncThunk(
  'cards/fetchCardBlocks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await baseApi.get('/cards', { params: filters });
      return res.data;
    } catch (err) {
  return rejectWithValue(
  err?.response?.data?.message || 'Acceso denegado o error inesperado'
);
    }
  }
);

export const validateBlock = createAsyncThunk(
  'cards/validateBlock',
  async (blockId, { rejectWithValue }) => {
    try {
      const res = await baseApi.post(`/cards/validate/${blockId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: 'Error al validar bloque' });
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState: {
    blocks: [],
    validated: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardBlocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardBlocks.fulfilled, (state, action) => {
        state.loading = false;
        state.blocks = action.payload;
      })
      .addCase(fetchCardBlocks.rejected, (state, action) => {
        state.loading = false;
        state.blocks = [];
        state.error = action.payload?.message || 'Error al cargar bloques';
      })
      .addCase(validateBlock.fulfilled, (state, action) => {
        state.validated.push(action.payload.blockId);
      });
  },
});

export default cardsSlice.reducer;