import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRestaurant: null,
  loading: false,
  error: false,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signUpSuccess: (state, action) => {
      state.currentRestaurant = action.payload;
      state.loading = false;
      state.error = false;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signInStart: (state) => {
        state.loading = true;
    },
    signInSuccess: (state, action) => {
        state.currentRestaurant = action.payload;
        state.loading = false;
        state.error = false;
    },
    signInFailure: (state,action)=>{
        state.loading = false;
        state.error = action.payload;
    },
  },
});

export const { signUpStart, signUpSuccess, signUpFailure,signInStart,signInSuccess,signInFailure } = restaurantSlice.actions;
export default restaurantSlice.reducer;