/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    userPermission: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserPermission: (state, action) => {
      state.userPermission = action.payload;
    },
  },
});

export const { setUser, setUserPermission } = userSlice.actions;
export default userSlice.reducer;
