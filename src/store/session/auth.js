import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  token: "",
  username: "",
  role: "",
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, action) {
      state.isLogged = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logout(state) {
      state = initialState;
    },
    resetToken(state, action) {
      state.token = action.payload.token;
    },
  },
});

export const authActions = authenticationSlice.actions;
export default authenticationSlice.reducer;
