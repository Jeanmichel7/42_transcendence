import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './chatSlicer';
import snackarReducer from './snackbarSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    snackbar: snackarReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
