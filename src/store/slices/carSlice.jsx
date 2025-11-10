/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';

const carSlice = createSlice({
  name: 'cars',
  initialState: {
    carsList: [],
  },
  reducers: {
    addCar: (state, action) => {
      state.carsList= [action.payload];
    },
    resetCars: state => {
      state.carsList = [];
    },
  },
});

export const { addCar, resetCars } = carSlice.actions;
export default carSlice.reducer;
