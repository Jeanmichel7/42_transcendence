import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    effect: undefined,
  },
  reducers: {
    activateEffect: (state, action) => {
      state.effect = action.payload;
    },
    desactivateEffect: state => {
      state.effect = undefined;
    },
  },
});

export const { activateEffect, desactivateEffect } = gameSlice.actions;

export default gameSlice.reducer;
