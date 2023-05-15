import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {
      id: 0,
      login: '',
      firstName: '',
      lastName: '',
      status: '',
      avatar: '',
      role:'user'
    },
    isLogged: false,
  },
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      // console.log("action.payload : ", action.payload)
      state.userData.id = action.payload.id;
      state.userData.login = action.payload.login;
      state.userData.firstName = action.payload.firstName;
      state.userData.lastName = action.payload.lastName;
      state.userData.status = action.payload.status;
      state.userData.avatar = action.payload.avatar;
      state.userData.role = action.payload.role;
    },
    setLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
    setLogout: (state) => {
      state.isLogged = false;
      state.userData = {
        id: 0,
        login: '',
        firstName: '',
        lastName: '',
        status: '',
        avatar: '',
        role:'user'
      };
    },

  },
});

export const { setUser, setLogged, setLogout } = userSlice.actions;

export default userSlice.reducer;