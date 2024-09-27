import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calendarAPI } from "@lib/API/calendarAPI";
import { calendarType } from "@lib/types";

type CalendarState = {
  calendar: calendarType[];
  isPending: boolean;
  oneCalendar: calendarType | null;
  error: string | null;
  availableDates: string[];
};

const initialState: CalendarState = {
  calendar: [],
  isPending: true,
  oneCalendar: null,
  error: null,
  availableDates: [],
};

const handlePending = (state: CalendarState) => {
  state.isPending = true;
  state.error = null;
};

const handleRejected = (
  state: CalendarState,
  action: PayloadAction<string>
) => {
  state.isPending = false;
  state.error = action.payload || "An error occurred";
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setCalendar(state, action: PayloadAction<calendarType[]>) {
      state.calendar = action.payload;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCalendarByDates
      .addCase(
        getCalendarByDates.fulfilled,
        (state, action: PayloadAction<calendarType[]>) => {
          state.calendar = action.payload;
          state.isPending = false;
        }
      )

      // getOneCalendar
      .addCase(getOneCalendar.pending, handlePending)
      .addCase(
        getOneCalendar.fulfilled,
        (state, action: PayloadAction<calendarType>) => {
          state.oneCalendar = action.payload;
          state.isPending = false;
        }
      )

      // addCalendar
      .addCase(
        addCalendar.fulfilled,
        (state, action: PayloadAction<calendarType>) => {
          state.calendar.push(action.payload);
          state.isPending = false;
        }
      )

      // deleteNote
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
        state.calendar = state.calendar.filter(
          (element) => element._id !== action.payload
        );
        state.isPending = false;
      })

      // updateNote
      .addCase(updateNote.fulfilled, (state, action) => {
        state.calendar = state.calendar.map((calendar) => {
          if (calendar._id === action.payload?._id) {
            return {
              ...calendar,
              notes: calendar.notes.map((note) =>
                note._id === action.payload?.note._id
                  ? { ...note, note: action.payload.note.note }
                  : note
              ),
            };
          }
          return calendar;
        });
        state.isPending = false;
      })

      // deleteCalendar
      .addCase(deleteCalendar.pending, handlePending)
      .addCase(
        deleteCalendar.fulfilled,
        (
          state,
          action: PayloadAction<{
            success: boolean;
            message: any;
            calendarId: string;
          }>
        ) => {
          if (action.payload.success) {
            state.calendar = state.calendar.filter(
              (cal) => cal._id !== action.payload.calendarId
            );
          }
          state.isPending = false;
        }
      )
      .addCase(
        addTodayCalendar.fulfilled,
        (state, action: PayloadAction<calendarType>) => {
          state.calendar.push(action.payload);
          state.isPending = false;
        }
      )

      // getPrevCalendar
      .addCase(getPrevCalendar.pending, handlePending)
      .addCase(
        getPrevCalendar.fulfilled,
        (state, action: PayloadAction<calendarType>) => {
          state.oneCalendar = action.payload;
          state.isPending = false;
        }
      )

      // getNextCalendar
      .addCase(getNextCalendar.pending, handlePending)
      .addCase(
        getNextCalendar.fulfilled,
        (state, action: PayloadAction<calendarType>) => {
          state.oneCalendar = action.payload;
          state.isPending = false;
        }
      )
      .addCase(getAllDates.fulfilled, (state, action) => {
        if (action.payload.success && Array.isArray(action.payload.response)) {
          state.availableDates = action.payload.response
            .filter((date) => date !== null)
            .map((dateStr) => {
              const d = new Date(dateStr);
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(d.getDate()).padStart(2, "0")}`;
            });
        } else {
          state.error = "Invalid response format";
        }
      });
  },
});

export const addCalendar = createAsyncThunk(
  "calendar/addCalendar",
  async (data: { date: string; time: string; note: string }) => {
    const response = await calendarAPI.addCalendar(data);
    return response;
  }
);

export const addTodayCalendar = createAsyncThunk(
  "calendar/addTodayCalendar",
  async (data: { date: string }) => {
    const response = await calendarAPI.createTodayCalendar({ date: data.date });
    return response;
  }
);

export const getCalendarByDates = createAsyncThunk(
  "calendar/getCalendarByDates",
  async (data: { startDate: string; endDate: string }) => {
    const response = await calendarAPI.getCalendarByDates(data);
    return response;
  }
);

export const deleteNote = createAsyncThunk(
  "calendar/deleteNote",
  async (data: { date: string; noteId: string }) => {
    const response = await calendarAPI.deleteNote(data);
    return response;
  }
);

export const getOneCalendar = createAsyncThunk(
  "calendar/getOneCalendar",
  async (date: string) => {
    const response = await calendarAPI.getOneCalendar(date);
    return response;
  }
);

export const updateNote = createAsyncThunk(
  "calendar/updateNote",
  async (noteData: {
    date: string;
    noteId: string;
    note: string;
    calendarId: string;
  }) => {
    const data = await calendarAPI.updateNote(noteData);
    if (data.success) {
      return {
        _id: noteData.calendarId,
        note: data.note,
      };
    }
  }
);

export const deleteCalendar = createAsyncThunk(
  "calendar/deleteCalendar",
  async (calendarId: string, { rejectWithValue }) => {
    try {
      const response = await calendarAPI.deleteCalendar({ calendarId });
      return { ...response, calendarId };
    } catch (error) {
      return rejectWithValue("Failed to delete calendar");
    }
  }
);

export const getPrevCalendar = createAsyncThunk(
  "calendar/getPrevCalendar",
  async (calendarId: string | null, { rejectWithValue }) => {
    try {
      const response = await calendarAPI.getPrevCalendar({ calendarId });
      if (response.success) {
        return response.response; // Return the previous calendar
      } else {
        return rejectWithValue("Failed to fetch previous calendar");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch previous calendar"
      );
    }
  }
);

export const getAllDates = createAsyncThunk(
  "calendar/getAllDates",
  async () => {
    const response = await calendarAPI.getAllDates();
    return response;
  }
);

export const getNextCalendar = createAsyncThunk(
  "calendar/getNextCalendar",
  async (calendarId: string) => {
    const response = await calendarAPI.getNextCalendar({ calendarId });
    return response.response;
  }
);

export const { setCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
