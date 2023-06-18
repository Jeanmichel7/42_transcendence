import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './convListSlice';
import snackarReducer from './snackbarSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    snackbar: snackarReducer,
    notification: notificationReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
