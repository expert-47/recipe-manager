import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie } from "cookies-next";

const initialState = {
  user: undefined,
  isAuthenticated: false,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    userLoggedIn: (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
    },
    userLoggedOut: (state) => {
      state.user = undefined;
      state.isAuthenticated = false;
      deleteCookie("username");
      deleteCookie("email");
      deleteCookie("id");
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
