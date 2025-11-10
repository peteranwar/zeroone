/* eslint-disable import/no-extraneous-dependencies */
import { configureStore } from '@reduxjs/toolkit';
import carReducer from './slices/carSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    car: carReducer,
    user: userReducer,
  },
});

export default store;
