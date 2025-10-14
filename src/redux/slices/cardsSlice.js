import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import baseApi from '../../services/baseApi';

export const fetchCardBlocks = createAsyncThunk(
  'cards/fetchCardBlocks',
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await baseApi.get(`/cards?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: 'Error al cargar bloques' }
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
      return rejectWithValue(
        err?.response?.data || { message: 'Error al validar bloque' }
      );
    }
  }
);

// ✅ Nuevo thunk para métricas del dashboard
export const fetchCardStats = createAsyncThunk(
  'cards/fetchCardStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await baseApi.get('/cards/stats');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || { message: 'Error al cargar métricas' }
      );
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState: {
    blocks: [],
    total: 0,
    validated: [],
    stats: null, // ✅ nuevo estado para métricas
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
        state.blocks = action.payload.results;
        state.total = action.payload.total;
      })
      .addCase(fetchCardBlocks.rejected, (state, action) => {
        state.loading = false;
        state.blocks = [];
        state.total = 0;
        state.error = action.payload?.message || 'Error al cargar bloques';
      })
      .addCase(validateBlock.fulfilled, (state, action) => {
        state.validated.push(action.payload.blockId);
      })
      .addCase(fetchCardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default cardsSlice.reducer;