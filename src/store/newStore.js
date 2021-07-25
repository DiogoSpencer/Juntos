import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./session/auth";
import snackReducer from "./snackBar/snack";

const store = configureStore({
  reducer: { auth: authReducer, snack: snackReducer },
});

export default store;
