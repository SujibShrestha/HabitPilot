// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import profileReducer from "./profileSlice";
import plansReducer from "./plansSlice";

const persistedState = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth")!)
  : undefined;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    plans: plansReducer,
  },
  preloadedState: { auth: persistedState },
});

store.subscribe(() => {
  localStorage.setItem("auth", JSON.stringify(store.getState().auth));
});
// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;