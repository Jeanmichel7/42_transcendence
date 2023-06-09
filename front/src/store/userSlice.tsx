import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiErrorResponse, UserInterface } from '../types';
// import { fetchUserAccount } from '../api/user';

export interface UserState {
  userData: UserInterface;
  isLogged: boolean;
  error: null | ApiErrorResponse;
}

// export const fetchUser = createAsyncThunk< UserInterface | ApiErrorResponse, void, { state: UserState } >(
//   'user/fetchUser',
//   async () => {
//     const response = await fetchUserAccount();
//     return response;
//   },
// );

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



export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogged: false,
    error: null,
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
      if (state.userData.waitingFriendsRequestReceived === undefined)
        state.userData.waitingFriendsRequestReceived = [action.payload];
      else
        state.userData.waitingFriendsRequestReceived = [...state.userData.waitingFriendsRequestReceived, action.payload];
    },
    reduxRemoveWaitingFriends: (state, action: PayloadAction<UserInterface>) => {
      if (state.userData.waitingFriendsRequestReceived === undefined)
        return;
      state.userData.waitingFriendsRequestReceived = state.userData.waitingFriendsRequestReceived
        .filter((waitingFriend: UserInterface) => waitingFriend.id !== action.payload.id);
    },


    //manage waiting friends request sent
    reduxSetWaitingFriendsSent: (state, action: PayloadAction<UserInterface[]>) => {
      state.userData.waitingFriendsRequestSent = action.payload;
    },
    reduxAddWaitingFriendsSent: (state, action: PayloadAction<UserInterface>) => {
      if (state.userData.waitingFriendsRequestSent === undefined)
        state.userData.waitingFriendsRequestSent = [action.payload];
      else
        state.userData.waitingFriendsRequestSent = [...state.userData.waitingFriendsRequestSent, action.payload];
    },
    reduxRemoveWaitingFriendsSent: (state, action: PayloadAction<UserInterface>) => {
      if (state.userData.waitingFriendsRequestSent === undefined)
        return;
      state.userData.waitingFriendsRequestSent = state.userData.waitingFriendsRequestSent
        .filter((waitingFriend: UserInterface) => waitingFriend.id !== action.payload.id);
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
  setError,
} = userSlice.actions;



export default userSlice.reducer;