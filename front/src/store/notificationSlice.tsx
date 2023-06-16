import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NotificationInterface } from '../types';

export interface NotificationState {
  notifications: NotificationInterface[];
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [] as NotificationInterface[],
  } as NotificationState,

  reducers: {
    // manage notifications
    reduxSetNotifications: (state, action: PayloadAction<NotificationInterface[]>) => {
      state.notifications = action.payload;
    },
    reduxAddNotification: (state, action: PayloadAction<NotificationInterface>) => {
      if (state.notifications === undefined)
        state.notifications = [action.payload];
      else
        state.notifications = [...state.notifications, action.payload];
    },
    reduxRemoveNotification: (state, action: PayloadAction<NotificationInterface>) => {
      state.notifications = state.notifications
        .filter((notif: NotificationInterface) => JSON.stringify(notif) !== JSON.stringify(action.payload));
    },
    reduxReadNotification: (state, action: PayloadAction<NotificationInterface>) => {
      state.notifications = state.notifications
        .map((notif: NotificationInterface) => {
          if (JSON.stringify(notif) === JSON.stringify(action.payload))
            return { ...notif, read: true };
          return notif;
        });
    },
  },
});

export const {
  reduxSetNotifications,
  reduxAddNotification,
  reduxRemoveNotification,
  reduxReadNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
