import { createSlice } from "@reduxjs/toolkit";

const gameSlice = createSlice({
  name: "game",
  initialState: false,
  reducers: {
    activateEffect: (state, action) => {
      state = true;
      return state;
    },
    desactivateEffect: (state, action) => {
      state = false;
      return state;
    },
  },
});

export const { activateEffect, desactivateEffect } = gameSlice.actions;

export default gameSlice.reducer;
