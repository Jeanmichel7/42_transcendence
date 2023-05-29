import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {
      id: -1,
      login: '',
      email: '',
      firstName: '',
      lastName: '',
      status: '',
      avatar: '',
      role:'user',
      description: '',
      friends: [] as any[],
      userBlocked: [] as any[],
    },
    isLogged: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
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
    },
    setLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
    setLogout: (state) => {
      state.isLogged = false;
      state.userData = {
        id: 0,
        login: '',
        email: '',
        firstName: '',
        lastName: '',
        status: '',
        avatar: '',
        role:'user',
        description: '',
        friends: [],
        userBlocked: [],
      };
    },
    reduxSetFriends: (state, action: PayloadAction<any>) => {
      state.userData.friends = action.payload;
    },
    reduxAddFriends: (state, action: PayloadAction<any>) => {
      state.userData.friends = [...state.userData.friends, action.payload];
      state.userData.userBlocked = state.userData.userBlocked
      .filter((userBlocked: any) => userBlocked.id !== action.payload.id);

    },
    reduxRemoveFriends: (state, action: PayloadAction<any>) => {
      state.userData.friends = state.userData.friends.filter((friend: any) => friend.id !== action.payload);
    },



    reduxSetUserBlocked: (state, action: PayloadAction<any>) => {
      state.userData.userBlocked = action.payload;
    },
    reduxAddUserBlocked: (state, action: PayloadAction<any>) => {
      state.userData.userBlocked = [...state.userData.userBlocked, action.payload];
      state.userData.friends = state.userData.friends
      .filter((friend: any) => friend.id !== action.payload.id);
    },
    // reduxRemoveUserBlocked: (state, action: PayloadAction<any>) => {
    //   state.userData.userBlocked = state.userData.userBlocked.filter((userBlocked: any) => userBlocked.id !== action.payload);
    // },
  },
});

export const { 
  setUser, setLogged, setLogout,
  reduxSetFriends, reduxAddFriends, reduxRemoveFriends,
  reduxSetUserBlocked, reduxAddUserBlocked
} = userSlice.actions;

export default userSlice.reducer;