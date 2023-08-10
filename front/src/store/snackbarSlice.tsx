import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiErrorResponse, PutSnackbarInterface, SnackbarInterface } from '../types';

export interface SnackbarState {
  snackbar: SnackbarInterface;
}

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    snackbar: {
      open: false,
      message: '',
      loginFrom: '',
      avatar: '',
      severity: 'success',
      vertical: 'bottom',
      horizontal: 'right',
      link: '',
      trophyImg: '',
      error : {
        error: '',
        message: '',
        statusCode: 0,
      },
    } as SnackbarInterface,
  },
  reducers: {
    setSnackbar: (state, action: PayloadAction<PutSnackbarInterface>) => {
      state.snackbar = { ...state.snackbar, ...action.payload, open: true };
    },
    // setErrorSnackbar: (state, action: PayloadAction<string>) => {
    //   state.snackbar = {
    //     ...state.snackbar,
    //     message: action.payload,
    //     severity: 'error',
    //     open: true,
    //   };
    // },
    setErrorSnackbar: (state, action: PayloadAction<ApiErrorResponse>) => {
      state.snackbar = {
        ...state.snackbar,
        error: {
          error: action.payload.error,
          message: action.payload.message,
          statusCode: action.payload.statusCode,
        },
        severity: 'error',
        open: true,
      };
    },
    setPersonalizedErrorSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = {
        ...state.snackbar,
        error: {
          error: 'Error : ',
          message: action.payload,
          statusCode: -1,
        },
        severity: 'error',
        open: true,
      };
    },
    setMsgSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = {
        ...state.snackbar,
        message: action.payload,
        severity: 'success',
        open: true,
      };
    },
    setWarningSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar = {
        ...state.snackbar,
        message: action.payload,
        severity: 'warning',
        open: true,
      };
    },
    closeSnackbar: (state) => {
      state.snackbar.open = false;
      state.snackbar.message = '';
      state.snackbar.loginFrom = '';
      state.snackbar.avatar = '';
      state.snackbar.link = '';
      state.snackbar.trophyImg = '';
      // state.snackbar.severity = 'success';
      state.snackbar.vertical = 'bottom';
      state.snackbar.horizontal = 'right';
      state.snackbar.error = {
        error: '',
        message: '',
        statusCode: -1,
      };
    },
    setSeveritySnackbar: (
      state,
      action: PayloadAction<'success' | 'info' | 'warning' | 'error'>,
    ) => {
      state.snackbar.severity = action.payload;
    },
  },
});

export const {
  setSnackbar,
  setErrorSnackbar,
  setMsgSnackbar,
  setSeveritySnackbar,
  closeSnackbar,
  setWarningSnackbar,
  setPersonalizedErrorSnackbar,
} = snackbarSlice.actions;

export default snackbarSlice.reducer;
