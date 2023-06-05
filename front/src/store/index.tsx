import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import snackarReducer from './snackbarSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackarReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;