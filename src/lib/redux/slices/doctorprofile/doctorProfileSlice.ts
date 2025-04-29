import baseAPI from "@lib/API/api";
import {DoctorAPI} from "@lib/API/doctorAPI";
import {Gender, Language, Problem} from "@lib/types";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@lib/redux/store";

// Interfaces
interface DoctorProfile {
    id: number;
    firstName: string;
    email: string;
    description: string;
    image: string;
    lastName: string | null;
    followers: any[]
    subscriptions: any[];
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

// Async Thunks
export const fetchDoctorProfileById = createAsyncThunk(
    "doctorProfile/fetchById",
    async (id: string) => {
        const response = await baseAPI.get(
            `user/profile/${id}`
        );
        return response.data;
    }
);

export const subscribeToDoctor = createAsyncThunk(
    "doctorProfile/subscribe",
    async (doctorId: string, {getState}) => {
        const {usersData} = (getState() as RootState).Auth
        const response = await baseAPI.post(
            `/user/follow/${doctorId}`,
        );
        return {doctorId, message: response.data, usersData};
    }
);

export const unsubscribeFromDoctor = createAsyncThunk(
    "doctorProfile/unsubscribe",
    async (doctorId: string, {getState}) => {
        const {usersData} = (getState() as RootState).Auth

        const response = await baseAPI.post(
            `/user/unfollow/${doctorId}`,
        );
        return {doctorId, message: response.data, usersData};
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
        const doctors = await DoctorAPI.fetchDoctors(dto);
        return doctors;
    }
);

export const fetchPostsFromDoctor = createAsyncThunk(
    "doctorProfile/fetchPosts",
    async (doctorId: string) => {
        const response = await baseAPI.get(
            `https://mindconnect-vebk.onrender.com/api/post/${doctorId}`,
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
                console.log(action.payload);
                if (state.profile && state.profile.id === Number(action.payload.doctorId)) {
                    state.profile.followers.push(action.payload.usersData); // Assuming the current user ID is passed as arg
                }
                state.doctors = state.doctors.map((doctor) =>
                    doctor.id === Number(action.payload.doctorId)
                        ? {
                            ...doctor,
                            followers: [...doctor.followers, action.payload.usersData]
                        }
                        : doctor
                );
            })
            .addCase(unsubscribeFromDoctor.fulfilled, (state, action) => {

                if (state.profile && state.profile.id === Number(action.payload.doctorId)) {
                    state.profile.followers = state.profile.followers.filter(user => user.id !== action.payload.usersData?.id)
                }
                state.doctors = state.doctors.map((doctor) =>
                    doctor.id === Number(action.payload.doctorId)
                        ? {
                            ...doctor,
                            followers: (state?.profile?.followers || []).filter(user => user.id !== action.payload.usersData?.id)
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
