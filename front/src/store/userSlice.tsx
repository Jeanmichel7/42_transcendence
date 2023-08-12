import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationInterface, UserInterface, UserStatusInterface } from '../types';

export interface UserState {
  userData: UserInterface;
  isLogged: boolean;
  userFriends: UserInterface[] | null,
  userBlocked: UserInterface[] | null,
  waitingFriendsRequestReceived: UserInterface[] | null,
  waitingFriendsRequestSent: UserInterface[] | null,
}

// Friends management
const addFriend = (state: UserState, user: UserInterface) => {
  if (!state.userFriends)
    state.userFriends = [user];
  else
    state.userFriends = [...state.userFriends, user];
};

const removeFriend = (state: UserState, userId: number) => {
  if (!state.userFriends)
    return;
  state.userFriends = state.userFriends
    .filter((friend: UserInterface) => friend.id !== userId);
};

// User blocked management
const addUserBlocked = (state: UserState, userId: number) => {
  const userToBlock: UserInterface | undefined 
    = state.userFriends?.find((u) => u.id === userId);
  if (!userToBlock) return;
  if (!state.userBlocked)
    state.userBlocked = [userToBlock];
  else
    state.userBlocked = [...state.userBlocked, userToBlock];
};

const removeUserBlocked = (state: UserState, userId: number) => {
  const userToUnBlock: UserInterface | undefined 
    = state.userFriends?.find((u) => u.id === userId);
  if (!userToUnBlock) return;
  if (!state.userBlocked)
    return;
  state.userBlocked = state.userBlocked
    .filter((userBlocked: UserInterface) => userBlocked.id !== userId);
};

// Waiting friends request management
const addWaitingFriends = (state: UserState, user: UserInterface) => {
  if (!state.waitingFriendsRequestReceived)
    state.waitingFriendsRequestReceived = [user];
  else
    state.waitingFriendsRequestReceived = [...state.waitingFriendsRequestReceived, user];
};

const removeWaitingFriends = (state: UserState, user: UserInterface) => {
  if (!state.waitingFriendsRequestReceived)
    return;
  state.waitingFriendsRequestReceived = state.waitingFriendsRequestReceived
    .filter((waitingFriend: UserInterface) => waitingFriend.id !== user.id);
};

// Waiting friends request sent management
const addWaitingFriendsSent = (state: UserState, user: UserInterface) => {
  if (!state.waitingFriendsRequestSent)
    state.waitingFriendsRequestSent = [user];
  else
    state.waitingFriendsRequestSent = [...state.waitingFriendsRequestSent, user];
};

const removeWaitingFriendsSent = (state: UserState, user: UserInterface) => {
  if (!state.waitingFriendsRequestSent)
    return;
  state.waitingFriendsRequestSent = state.waitingFriendsRequestSent
    .filter((waitingFriend: UserInterface) => waitingFriend.id !== user.id);
};

const helperUpdateUserStatus = (state: UserState, userStatus: UserStatusInterface) => {
  // userFriends
  if (state.userFriends) {
    const userFriend = state.userFriends.find((u) => u.id === userStatus.id);
    if (userFriend)
      userFriend.status = userStatus.status;
  }

  // userBlocked
  if (state.userBlocked) {
    const userBlocked = state.userBlocked.find((u) => u.id === userStatus.id);
    if (userBlocked)
      userBlocked.status = userStatus.status;
  }

  // waitingFriendsRequestReceived
  if (state.waitingFriendsRequestReceived) {
    const waitingFriendsRequestReceived = state.waitingFriendsRequestReceived.find((u) => u.id === userStatus.id);
    if (waitingFriendsRequestReceived)
      waitingFriendsRequestReceived.status = userStatus.status;
  }

  // waitingFriendsRequestSent
  if (state.waitingFriendsRequestSent) {
    const waitingFriendsRequestSent = state.waitingFriendsRequestSent.find((u) => u.id === userStatus.id);
    if (waitingFriendsRequestSent)
      waitingFriendsRequestSent.status = userStatus.status;
  }

  // if me
  if (state.userData.id === userStatus.id)
    state.userData.status = userStatus.status;
};


export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogged: false,
    userFriends: null,
    userBlocked: null,
    waitingFriendsRequestReceived: null,
    waitingFriendsRequestSent: null,
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
      score: 1500,
      level: 0,
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
      state.isLogged = true;
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
        score: 1500,
        level: 0,
      };
    },

    // score
    reduxUpdateScore: (state, action: PayloadAction<number>) => {
      state.userData.score = action.payload;
    },

    // status
    reduxUpdateUserStatus: (state, action: PayloadAction<UserStatusInterface>) => {
      helperUpdateUserStatus(state, action.payload);
    },

    // manage friends
    reduxSetFriends: (state, action: PayloadAction<UserInterface[]>) => {
      state.userFriends = action.payload;
    },
    reduxAddFriends: (state, action: PayloadAction<UserInterface>) => {
      addFriend(state, action.payload);
      removeUserBlocked(state, action.payload.id);
    },
    reduxRemoveFriends: (state, action: PayloadAction<number>) => {
      removeFriend(state, action.payload);
    },

    //manage user blocked
    reduxSetUserBlocked: (state, action: PayloadAction<UserInterface[]>) => {
      state.userBlocked = action.payload;
    },
    reduxAddUserBlocked: (state, action: PayloadAction<number>) => {
      addUserBlocked(state, action.payload);
      removeFriend(state, action.payload);
    },
    reduxRemoveUserBlocked: (state, action: PayloadAction<number>) => {
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
  },
});

export const {
  setUser, setLogged, setLogout,
  reduxUpdateUserStatus,
  reduxSetFriends, reduxAddFriends, reduxRemoveFriends,
  reduxSetUserBlocked, reduxAddUserBlocked, reduxRemoveUserBlocked,
  reduxSetWaitingFriends, reduxAddWaitingFriends, reduxRemoveWaitingFriends,
  reduxSetWaitingFriendsSent, reduxAddWaitingFriendsSent, reduxRemoveWaitingFriendsSent,
  reduxAcceptedRequest, reduxDeclinedRequest,
} = userSlice.actions;

export default userSlice.reducer;
