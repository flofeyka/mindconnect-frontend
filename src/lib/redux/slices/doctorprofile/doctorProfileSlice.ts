import baseAPI from "@lib/API/api";
import { DoctorAPI } from "@lib/API/doctorAPI";
import { Gender, Language, Problem } from "@lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Interfaces
interface DoctorProfile {
  id: string;
  firstName: string;
  email: string;
  description: string;
  image: string;
  lastName: string | null;
  subscribers: string[];
  subscribedTo: string[];
  isDoctor: boolean;
}

interface Post {
  description: string;
  image: string | undefined;
  id: string;
  title: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  // Add any other fields that a post might have
}

interface DoctorProfileState {
  profile: DoctorProfile | null;
  doctors: DoctorProfile[];
  posts: Post[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// Helper function to get token
const getToken = () => localStorage.getItem("token");

// Async Thunks
export const fetchDoctorProfileById = createAsyncThunk(
  "doctorProfile/fetchById",
  async (id: string) => {
    const response = await axios.get(
      `https://mindconnect-vebk.onrender.com/api/post/profile/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  }
);

export const subscribeToDoctor = createAsyncThunk(
  "doctorProfile/subscribe",
  async (doctorId: string) => {
    const response = await axios.patch(
      `https://mindconnect-vebk.onrender.com/api/user/subscribe/${doctorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return { doctorId, message: response.data };
  }
);

export const unsubscribeFromDoctor = createAsyncThunk(
  "doctorProfile/unsubscribe",
  async (doctorId: string) => {
    const response = await axios.patch(
      `https://mindconnect-vebk.onrender.com/api/user/unsubscribe/${doctorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return { doctorId, message: response.data };
  }
);

export const fetchAllDoctors = createAsyncThunk(
  "doctorProfile/fetchAll",
  async (dto: {
    languages: Language[];
    problems: Problem[];
    gender: Gender;
    search: string;
  }) => {
    return await DoctorAPI.fetchDoctors(dto);
  }
);

export const fetchPostsFromDoctor = createAsyncThunk(
  "doctorProfile/fetchPosts",
  async (doctorId: string) => {
    const response = await axios.get(
      `https://mindconnect-vebk.onrender.com/api/post/posts/${doctorId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  }
);

// Initial state
const initialState: DoctorProfileState = {
  profile: null,
  doctors: [],
  posts: [],
  loading: "idle",
  error: null,
};

// Slice
const doctorProfileSlice = createSlice({
  name: "doctorProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorProfileById.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchDoctorProfileById.fulfilled,
        (state, action: PayloadAction<DoctorProfile>) => {
          state.loading = "succeeded";
          state.profile = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchDoctorProfileById.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch doctor profile";
      })
      .addCase(subscribeToDoctor.fulfilled, (state, action) => {
        if (state.profile && state.profile.id === action.payload.doctorId) {
          state.profile.subscribers.push(action.meta.arg); // Assuming the current user ID is passed as arg
        }
        state.doctors = state.doctors.map((doctor) =>
          doctor.id === action.payload.doctorId
            ? {
                ...doctor,
                subscribers: [...doctor.subscribers, action.meta.arg],
              }
            : doctor
        );
      })
      .addCase(unsubscribeFromDoctor.fulfilled, (state, action) => {
        if (state.profile && state.profile.id === action.payload.doctorId) {
          state.profile.subscribers = state.profile.subscribers.filter(
            (id) => id !== action.meta.arg
          );
        }
        state.doctors = state.doctors.map((doctor) =>
          doctor.id === action.payload.doctorId
            ? {
                ...doctor,
                subscribers: doctor.subscribers.filter(
                  (id) => id !== action.meta.arg
                ),
              }
            : doctor
        );
      })
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchAllDoctors.fulfilled,
        (state, action: PayloadAction<DoctorProfile[]>) => {
          state.loading = "succeeded";
          state.doctors = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch doctors";
      })
      .addCase(fetchPostsFromDoctor.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        fetchPostsFromDoctor.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading = "succeeded";
          state.posts = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPostsFromDoctor.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch doctor's posts";
      });
  },
});

export default doctorProfileSlice.reducer;
