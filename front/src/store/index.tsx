import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './convListSlice';
import snackarReducer from './snackbarSlice';
import notificationReducer from './notificationSlice';
import gameReducer from './gameSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    snackbar: snackarReducer,
    notification: notificationReducer,
    game: gameReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
