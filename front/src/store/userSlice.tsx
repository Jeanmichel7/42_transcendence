import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiErrorResponse, NotificationInterface, UserInterface } from '../types';
// import { fetchUserAccount } from '../api/user';

export interface UserState {
  userData: UserInterface;
  isLogged: boolean;
  notifications: NotificationInterface[];
  error: null | ApiErrorResponse;
}

// export const fetchUser = createAsyncThunk< UserInterface | ApiErrorResponse, void, { state: UserState } >(
//   'user/fetchUser',
//   async () => {
//     const response = await fetchUserAccount();
//     return response;
//   },
// );


// Friends management
const addFriend = (state: UserState, user: UserInterface) => {
  if (state.userData.friends === undefined)
    state.userData.friends = [user];
  else
    state.userData.friends = [...state.userData.friends, user];
};

const removeFriend = (state: UserState, user: UserInterface) => {
  if (state.userData.friends === undefined)
    return;
  state.userData.friends = state.userData.friends
    .filter((friend: UserInterface) => friend.id !== user.id);
};

// User blocked management
const addUserBlocked = (state: UserState, user: UserInterface) => {
  if (state.userData.userBlocked === undefined)
    state.userData.userBlocked = [user];
  else
    state.userData.userBlocked = [...state.userData.userBlocked, user];
};

const removeUserBlocked = (state: UserState, user: UserInterface) => {
  if (state.userData.userBlocked === undefined)
    return;
  state.userData.userBlocked = state.userData.userBlocked
    .filter((userBlocked: UserInterface) => userBlocked.id !== user.id);
};

// Waiting friends request management
const addWaitingFriends = (state: UserState, user: UserInterface) => {
  if (state.userData.waitingFriendsRequestReceived === undefined)
    state.userData.waitingFriendsRequestReceived = [user];
  else
    state.userData.waitingFriendsRequestReceived = [...state.userData.waitingFriendsRequestReceived, user];
};

const removeWaitingFriends = (state: UserState, user: UserInterface) => {
  if (state.userData.waitingFriendsRequestReceived === undefined)
    return;
  state.userData.waitingFriendsRequestReceived = state.userData.waitingFriendsRequestReceived
    .filter((waitingFriend: UserInterface) => waitingFriend.id !== user.id);
};

// Waiting friends request sent management
const addWaitingFriendsSent = (state: UserState, user: UserInterface) => {
  if (state.userData.waitingFriendsRequestSent === undefined)
    state.userData.waitingFriendsRequestSent = [user];
  else
    state.userData.waitingFriendsRequestSent = [...state.userData.waitingFriendsRequestSent, user];
};

const removeWaitingFriendsSent = (state: UserState, user: UserInterface) => {
  if (state.userData.waitingFriendsRequestSent === undefined)
    return;
  state.userData.waitingFriendsRequestSent = state.userData.waitingFriendsRequestSent
    .filter((waitingFriend: UserInterface) => waitingFriend.id !== user.id);
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogged: false,
    error: null,
    notifications: localStorage.getItem('notifications') ? JSON.parse(localStorage.getItem('notifications') as string) : [] as NotificationInterface[],
    userData: {
      id: -1,
      login: '',
      email: '',
      firstName: '',
      lastName: '',
      status: 'offline',
      avatar: '',
      description: '',
      role: 'user',
      is2FAEnabled: false,
      friends: [],
      userBlocked: [],
      waitingFriendsRequestReceived: [],
      waitingFriendsRequestSent: [],
    },
  } as UserState,

  reducers: {
    setUser: (state, action: PayloadAction<UserInterface>) => {
      // console.log("action.payload : ", action.payload)
      state.userData.id = action.payload.id;
      state.userData.login = action.payload.login;
      state.userData.email = action.payload.email;
      state.userData.firstName = action.payload.firstName;
      state.userData.lastName = action.payload.lastName;
      state.userData.status = action.payload.status;
      state.userData.avatar = action.payload.avatar;
      state.userData.role = action.payload.role;
      state.userData.description = action.payload.description;
      state.userData.is2FAEnabled = action.payload.is2FAEnabled;
      state.userData.friends = action.payload.friends;
      state.userData.userBlocked = action.payload.userBlocked;
      state.userData.waitingFriendsRequestReceived = action.payload.waitingFriendsRequestReceived;
      state.userData.waitingFriendsRequestSent = action.payload.waitingFriendsRequestSent;
      state.isLogged = true;
      state.error = null;
    },
    setLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
    setLogout: (state) => {
      state.isLogged = false;
      state.userData = {
        id: -1,
        login: '',
        email: '',
        firstName: '',
        lastName: '',
        status: 'offline',
        avatar: '',
        role: 'user',
        description: '',
        is2FAEnabled: false,
        friends: [],
        userBlocked: [],
        waitingFriendsRequestReceived: [],
        waitingFriendsRequestSent: [],
      };
    },

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
      console.log('remove notif : ', action.payload);
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

    // manage friends
    reduxSetFriends: (state, action: PayloadAction<UserInterface[]>) => {
      state.userData.friends = action.payload;
    },
    reduxAddFriends: (state, action: PayloadAction<UserInterface>) => {
      addFriend(state, action.payload);
      removeUserBlocked(state, action.payload);
    },
    reduxRemoveFriends: (state, action: PayloadAction<UserInterface>) => {
      removeFriend(state, action.payload);
    },

    //manage user blocked
    reduxSetUserBlocked: (state, action: PayloadAction<UserInterface[]>) => {
      state.userData.userBlocked = action.payload;
    },
    reduxAddUserBlocked: (state, action: PayloadAction<UserInterface>) => {
      addUserBlocked(state, action.payload);
      removeFriend(state, action.payload);
    },
    reduxRemoveUserBlocked: (state, action: PayloadAction<UserInterface>) => {
      removeUserBlocked(state, action.payload);
    },

    //manage waiting friends request
    reduxSetWaitingFriends: (state, action: PayloadAction<UserInterface[]>) => {
      state.userData.waitingFriendsRequestReceived = action.payload;
    },
    reduxAddWaitingFriends: (state, action: PayloadAction<UserInterface>) => {
      addWaitingFriends(state, action.payload);
    },
    reduxRemoveWaitingFriends: (state, action: PayloadAction<UserInterface>) => {
      removeWaitingFriends(state, action.payload);
    },

    //manage waiting friends request sent
    reduxSetWaitingFriendsSent: (state, action: PayloadAction<UserInterface[]>) => {
      state.userData.waitingFriendsRequestSent = action.payload;
    },
    reduxAddWaitingFriendsSent: (state, action: PayloadAction<UserInterface>) => {
      addWaitingFriendsSent(state, action.payload);
    },
    reduxRemoveWaitingFriendsSent: (state, action: PayloadAction<UserInterface>) => {
      removeWaitingFriendsSent(state, action.payload);
    },

    //manage actions request
    reduxAcceptedRequest: (state, action: PayloadAction<NotificationInterface>) => {
      addFriend(state, action.payload.sender);
      removeWaitingFriendsSent(state, action.payload.sender);
    },
    reduxDeclinedRequest: (state, action: PayloadAction<NotificationInterface>) => {
      removeWaitingFriendsSent(state, action.payload.sender);
    },

    //manage error
    setError: (state, action: PayloadAction<ApiErrorResponse>) => {
      state.error = action.payload;
    },
  },

});

export const {
  setUser, setLogged, setLogout,
  reduxSetFriends, reduxAddFriends, reduxRemoveFriends,
  reduxSetUserBlocked, reduxAddUserBlocked, reduxRemoveUserBlocked,
  reduxSetWaitingFriends, reduxAddWaitingFriends, reduxRemoveWaitingFriends,
  reduxSetWaitingFriendsSent, reduxAddWaitingFriendsSent, reduxRemoveWaitingFriendsSent,
  reduxAcceptedRequest, reduxDeclinedRequest,
  reduxSetNotifications, reduxAddNotification, reduxRemoveNotification, reduxReadNotification,
  setError,
} = userSlice.actions;



export default userSlice.reducer;