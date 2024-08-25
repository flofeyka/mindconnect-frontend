import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doctorcalendarAPI } from "@lib/API/doctorcalendarAPI";
import { DoctorCalendarType } from "@lib/types";

type DoctorCalendarState = {
  calendar: DoctorCalendarType[];
  isPending: boolean;
  error: string | null;
};
const initialState: DoctorCalendarState = {
  calendar: [],
  isPending: false,
  error: null,
};

export const getAvailableDates = createAsyncThunk(
  "doctorCalendar/getAvailableDates",
  async (data: { doctorId: string; query: string }) => {
    console.log(data.doctorId);
    const response = await doctorcalendarAPI.getAvailableDates(data);
    return response;
  }
);

export const addAvailableDate = createAsyncThunk(
  "doctorCalendar/addAvailableDate",
  async (data: { date: string; time: string }) => {
    const response = await doctorcalendarAPI.addAvailableDate(data);
    return response;
  }
);

export const deleteAvailableDate = createAsyncThunk(
  "doctorCalendar/deleteAvailableDate",
  async (data: { calendarId: string; timeSlotId: string }) => {
    console.log(data);
    const response = await doctorcalendarAPI.deleteAvailableDate(data);
    return response;
  }
);

const doctorCalendarSlice = createSlice({
  name: "doctorCalendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAvailableDates.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(
        getAvailableDates.fulfilled,
        (state, action: PayloadAction<DoctorCalendarType[]>) => {
          state.calendar = [];
          state.isPending = false;
          console.log(state.calendar);
          state.calendar = action.payload;
          console.log(state.calendar);
        }
      )
      .addCase(getAvailableDates.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.error.message || "Failed to fetch available dates";
      })
      .addCase(addAvailableDate.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(
        addAvailableDate.fulfilled,
        (state, action: PayloadAction<DoctorCalendarType>) => {
          state.isPending = false;
          state.calendar.push(action.payload);
        }
      )
      .addCase(addAvailableDate.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.error.message || "Failed to add available date";
      })
      .addCase(deleteAvailableDate.pending, (state) => {
        state.isPending = true;
        state.error = null;
      })
      .addCase(
        deleteAvailableDate.fulfilled,
        (
          state,
          action: PayloadAction<{ calendarId: string; timeSlotId: string }>
        ) => {
          state.isPending = false;
          state.calendar = state.calendar.map((cal) =>
            cal._id === action.payload.calendarId
              ? {
                  ...cal,
                  timeSlots: cal.timeSlots.filter(
                    (slot) => slot._id !== action.payload.timeSlotId
                  ),
                }
              : cal
          );
        }
      )
      .addCase(deleteAvailableDate.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.error.message || "Failed to delete available date";
      });
  },
});

export default doctorCalendarSlice.reducer;
