import { configureStore } from "@reduxjs/toolkit";
import { authSlice, calendarSlice } from "./slices";

export const makeStore = () => {
  return configureStore({
    reducer: {
      Auth: authSlice,
      Calendar: calendarSlice
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
