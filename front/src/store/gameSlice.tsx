import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    isEffectActivated: false,
  },
  reducers: {
    activateEffect: state => {
      state.isEffectActivated = true;
    },
    desactivateEffect: state => {
      state.isEffectActivated = false;
    },
  },
});

export const { activateEffect, desactivateEffect } = gameSlice.actions;

export default gameSlice.reducer;
