import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snackbarOpen: false,
  snackbarType: "success",
  snackbarMessage: "",
};

const snackSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackbar(state, action) {
      state.snackbarOpen = action.payload.snackBarOpen;
      state.snackbarType = action.payload.snackBarType;
      state.snackbarMessage = action.payload.snackBarMessage;
    },
  },
});

export const snackActions = snackSlice.actions;
export default snackSlice.reducer;
