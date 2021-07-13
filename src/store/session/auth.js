import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  token: "",
  username: "",
  role: "",
  email: "",
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
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.profileImg = action.payload.profileImg;
      state.numHelps = action.payload.numHelps;
    },
    logout(state) {
      state.isLogged = false;
      state.token = "";
      state.username = "";
      state.role = "";
      state.email = "";
      state.firstName = "";
      state.lastName = "";
      state.profileImg = "";
      state.numHelps = 0;
    },
    resetToken(state, action) {
      state.token = action.payload;
      console.log("store " + action.payload)
    },
  },
});

export const authActions = authenticationSlice.actions;
export default authenticationSlice.reducer;
