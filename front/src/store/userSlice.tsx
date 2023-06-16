import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiErrorResponse, NotificationInterface, UserInterface } from '../types';

export interface UserState {
  userData: UserInterface;
  isLogged: boolean;
  error: null | ApiErrorResponse;
  userFriends: UserInterface[],
  userBlocked: UserInterface[],
  waitingFriendsRequestReceived: UserInterface[],
  waitingFriendsRequestSent: UserInterface[],
}

// Friends management
const addFriend = (state: UserState, user: UserInterface) => {
  if (state.userFriends === undefined)
    state.userFriends = [user];
  else
    state.userFriends = [...state.userFriends, user];
};

const removeFriend = (state: UserState, user: UserInterface) => {
  if (state.userFriends === undefined)
    return;
  state.userFriends = state.userFriends
    .filter((friend: UserInterface) => friend.id !== user.id);
};

// User blocked management
const addUserBlocked = (state: UserState, user: UserInterface) => {
  if (state.userBlocked === undefined)
    state.userBlocked = [user];
  else
    state.userBlocked = [...state.userBlocked, user];
};

const removeUserBlocked = (state: UserState, user: UserInterface) => {
  if (state.userBlocked === undefined)
    return;
  state.userBlocked = state.userBlocked
    .filter((userBlocked: UserInterface) => userBlocked.id !== user.id);
};

// Waiting friends request management
const addWaitingFriends = (state: UserState, user: UserInterface) => {
  if (state.waitingFriendsRequestReceived === undefined)
    state.waitingFriendsRequestReceived = [user];
  else
    state.waitingFriendsRequestReceived = [...state.waitingFriendsRequestReceived, user];
};

const removeWaitingFriends = (state: UserState, user: UserInterface) => {
  if (state.waitingFriendsRequestReceived === undefined)
    return;
  state.waitingFriendsRequestReceived = state.waitingFriendsRequestReceived
    .filter((waitingFriend: UserInterface) => waitingFriend.id !== user.id);
};

// Waiting friends request sent management
const addWaitingFriendsSent = (state: UserState, user: UserInterface) => {
  if (state.waitingFriendsRequestSent === undefined)
    state.waitingFriendsRequestSent = [user];
  else
    state.waitingFriendsRequestSent = [...state.waitingFriendsRequestSent, user];
};

const removeWaitingFriendsSent = (state: UserState, user: UserInterface) => {
  if (state.waitingFriendsRequestSent === undefined)
    return;
  state.waitingFriendsRequestSent = state.waitingFriendsRequestSent
    .filter((waitingFriend: UserInterface) => waitingFriend.id !== user.id);
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogged: false,
    error: null,
    userFriends: [],
    userBlocked: [],
    waitingFriendsRequestReceived: [],
    waitingFriendsRequestSent: [],
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
      // state.userFriends = action.payload.friends;
      // state.userBlocked = action.payload.userBlocked;
      // state.waitingFriendsRequestReceived = action.payload.waitingFriendsRequestReceived;
      // state.waitingFriendsRequestSent = action.payload.waitingFriendsRequestSent;
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
      };
      state.error = null;
      // state.userFriends = [];
      // state.userBlocked = [];
      // state.waitingFriendsRequestReceived = [];
      // state.waitingFriendsRequestSent = [];
    },


    // manage friends
    reduxSetFriends: (state, action: PayloadAction<UserInterface[]>) => {
      state.userFriends = action.payload;
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
      state.userBlocked = action.payload;
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
      state.waitingFriendsRequestReceived = action.payload;
    },
    reduxAddWaitingFriends: (state, action: PayloadAction<UserInterface>) => {
      addWaitingFriends(state, action.payload);
    },
    reduxRemoveWaitingFriends: (state, action: PayloadAction<UserInterface>) => {
      removeWaitingFriends(state, action.payload);
    },

    //manage waiting friends request sent
    reduxSetWaitingFriendsSent: (state, action: PayloadAction<UserInterface[]>) => {
      state.waitingFriendsRequestSent = action.payload;
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
  setError,
} = userSlice.actions;



export default userSlice.reducer;