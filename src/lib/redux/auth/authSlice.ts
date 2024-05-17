import { authAPI } from "@lib/API/api";
import { authType, usersDataType } from "@lib/types";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    captchaUrl: null,
    usersData: {} as {
      email: string;
      firstName: string;
      lastName: string;
      number: number;
      image: string;
    },
  } as authType,
  reducers: {
    setUser(state, action: PayloadAction<usersDataType>) {
      state.usersData = action.payload;
    },
    setCaptchaUrl(state, action: PayloadAction<string>) {
      state.captchaUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      signIn.fulfilled,
      (state, action: PayloadAction<usersDataType>) => {
        state.isAuth = true;
        state.usersData = action.payload;
      }
    );
    builder.addCase(
      signUp.fulfilled,
      (state, action: PayloadAction<usersDataType>) => {
        state.isAuth = true;
        state.usersData = action.payload;
      }
    );
    builder.addCase(logout.fulfilled, (state, action: PayloadAction) => {
      state.isAuth = false;
    });
    builder.addCase(
      getAuthUserData.fulfilled,
      (state, action: PayloadAction<usersDataType>) => {
        state.usersData = action.payload;
        state.isAuth = true;
      }
    );
  },
});

export const { setUser, setCaptchaUrl } = authSlice.actions;

export const getAuthUserData = createAsyncThunk(
  "auth/getAuthUserData",
  async () => {
    const data: usersDataType = await authAPI.getUsersData();
    return data;
  }
);

export const signIn = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const data: usersDataType =  await authAPI.login({ email, password });
    return data;
  }
);

export const signUp = createAsyncThunk(
  "auth/register",
  async ({
    firstName,
    email,
    password,
  }: {
    firstName: string;
    email: string;
    password: string;
  }) => {
    const data: usersDataType = await authAPI.register({ firstName, email, password });
    return data;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  return await authAPI.logout();
});

export default authSlice.reducer;
