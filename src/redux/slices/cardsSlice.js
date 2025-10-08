// src/redux/slices/cardsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCardBlocks = createAsyncThunk(
  'cards/fetchCardBlocks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/cards/blocks', { params: filters });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const validateBlock = createAsyncThunk(
  'cards/validateBlock',
  async (blockId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/cards/validate/${blockId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
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
      .addCase(validateBlock.fulfilled, (state, action) => {
        state.validated.push(action.payload.blockId);
      });
  },
});

export default cardsSlice.reducer;