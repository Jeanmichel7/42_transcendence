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
    reduxSetNotifications: (
      state,
      action: PayloadAction<NotificationInterface[]>,
    ) => {
      state.notifications = action.payload;
    },
    reduxAddNotification: (
      state,
      action: PayloadAction<NotificationInterface>,
    ) => {
      if (state.notifications === undefined)
        state.notifications = [action.payload];
      else state.notifications = [...state.notifications, action.payload];
    },
    reduxAddManyNotifications: (
      state,
      action: PayloadAction<NotificationInterface[]>,
    ) => {
      state.notifications = [...state.notifications, ...action.payload];
    },
    reduxRemoveNotification: (
      state,
      action: PayloadAction<{ notifId: number; userId: number }>,
    ) => {
      const { notifId, userId } = action.payload;
      state.notifications = state.notifications.filter(
        (notif: NotificationInterface) => notif.id != notifId,
      );
      localStorage.setItem(
        'notifications' + userId,
        JSON.stringify(state.notifications),
      );
    },
    reduxReadNotification: (
      state,
      action: PayloadAction<NotificationInterface>,
    ) => {
      state.notifications = state.notifications.map(
        (notif: NotificationInterface) => {
          if (notif.read) return notif;
          if (notif.id == action.payload.id) return { ...notif, read: true };
          return notif;
        },
      );
    },
  },
});

export const {
  reduxSetNotifications,
  reduxAddNotification,
  reduxRemoveNotification,
  reduxReadNotification,
  reduxAddManyNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
