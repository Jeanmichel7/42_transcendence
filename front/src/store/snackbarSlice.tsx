import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PutSnackbarInterface, SnackbarInterface } from '../types/utilsTypes';

export interface SnackbarState {
  snackbar: SnackbarInterface;
}

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    snackbar: {
      open: false,
      message: '',
      severity: 'success',
      vertical: 'bottom',
      horizontal: 'right',
    } as SnackbarInterface,
  },
  reducers: {
    setSnackbar: (state, action: PayloadAction<PutSnackbarInterface>) => {
      state.snackbar = { ...state.snackbar, ...action.payload, open: true };
    },
    setErrorSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = { ...state.snackbar, message: action.payload, severity: 'error', open: true };
    },
    setMsgSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = { ...state.snackbar, message: action.payload, severity: 'success', open: true };
    },
    setWarningSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = { ...state.snackbar, message: action.payload, severity: 'warning', open: true };
    },
    closeSnackbar: (state) => {
      state.snackbar.open = false;
    },
    setSeveritySnackbar: (state, action: PayloadAction<'success' | 'info' | 'warning' | 'error'>) => {
      state.snackbar.severity = action.payload;
    },
  },
});

export const { setSnackbar, setErrorSnackbar, setMsgSnackbar, setSeveritySnackbar, closeSnackbar, setWarningSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;