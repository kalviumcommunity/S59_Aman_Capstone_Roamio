import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthenticated: false,
  },
  reducers: {
    signIn: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      state.userData = null;
      state.isAuthenticated = false; 
    },
  },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
