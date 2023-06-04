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
      friends: [],
      userBlocked: [],
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
      state.userData.friends = action.payload.friends;
      state.userData.userBlocked = action.payload.userBlocked;
      state.userData.is2FAEnabled = action.payload.is2FAEnabled;
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
        role:'user',
        description: '',
        is2FAEnabled: false,
        friends: [],
        userBlocked: [],
      };
    },


    reduxSetFriends: (state, action: PayloadAction<UserInterface[]>) => {
      state.userData.friends = action.payload;
    },
    reduxAddFriends: (state, action: PayloadAction<UserInterface>) => {
      console.log('action.payload add frinds : ', action.payload)
      state.userData.friends = [...state.userData.friends, action.payload];
      state.userData.userBlocked = state.userData.userBlocked
        .filter((userBlocked: UserInterface) => userBlocked.id !== action.payload.id);
    },
    reduxRemoveFriends: (state, action: PayloadAction<number>) => {
      console.log('action.payload remove friends: ', action.payload)
      state.userData.friends = state.userData.friends.filter((friend: UserInterface) => friend.id !== action.payload);
    },

    reduxSetUserBlocked: (state, action: PayloadAction< UserInterface[] >) => {
      state.userData.userBlocked = action.payload;
    },
    reduxAddUserBlocked: (state, action: PayloadAction< UserInterface >) => {
      state.userData.userBlocked = [...state.userData.userBlocked, action.payload];
      state.userData.friends = state.userData.friends
        .filter((friend: UserInterface) => friend.id !== action.payload.id);
    },
    // reduxRemoveUserBlocked: (state, action: PayloadAction<any>) => {
    //   state.userData.userBlocked = state.userData.userBlocked.filter((userBlocked: any) => userBlocked.id !== action.payload);
    // },

    setError: (state, action: PayloadAction<ApiErrorResponse>) => {
      state.error = action.payload;
    },



  },

  // extraReducers: (builder) => {
  //   builder.addCase(fetchUser.pending, (state) => {
  //     state.error = null;
  //   });
  //   builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction< UserInterface | ApiErrorResponse >) => {
  //     if ('error' in action.payload) {
  //       state.error = action.payload;
  //     } else {
  //       state.userData = action.payload;
  //       state.isLogged = true;
  //     }
  //   });
  //   builder.addCase(fetchUser.rejected, (state, action: any ) => {
  //     state.error = action.error;
  //   });
  // },
});

export const { 
  setUser, setLogged, setLogout,
  reduxSetFriends, reduxAddFriends, reduxRemoveFriends,
  reduxSetUserBlocked, reduxAddUserBlocked,
  setError,
} = userSlice.actions;



export default userSlice.reducer;