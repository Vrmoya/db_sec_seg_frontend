// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cardsReducer from './slices/cardsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
  },
});