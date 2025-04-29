import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calendarAPI } from "@lib/API/calendarAPI";
import { calendarNoteType, calendarType } from "@lib/types";

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

      // addNote
      .addCase(
        addNote.fulfilled,
        (state, action: PayloadAction<calendarNoteType>) => {
          console.log("action.payload", action.payload);
          state.calendar = state.calendar.map((calendar) => {
            if (calendar.id === action.payload.calendarId) {
              calendar.notes.push(action.payload);
            }
            return calendar;
          });
          state.isPending = false;
        }
      )

      // deleteNote
      .addCase(
        deleteNote.fulfilled,
        (
          state,
          action: PayloadAction<{
            success: boolean;
            message: string;
            noteId: number;
          }>
        ) => {
          state.calendar = state.calendar.map((calendar) => {
            if (
              calendar.notes.find((note) => note.id === action.payload.noteId)
            ) {
              calendar.notes = calendar.notes.filter(
                (note) => note.id !== action.payload.noteId
              );
            }
            return calendar;
          });
          state.isPending = false;
        }
      )

      // updateNote
      .addCase(updateNote.fulfilled, (state, action) => {
        state.calendar = state.calendar.map((calendar) => {
          if (calendar.id === action.payload?.note.calendarId) {
            return {
              ...calendar,
              notes: calendar.notes.map((note) =>
                note.id === action.payload?.note.id
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
            calendarId: number;
          }>
        ) => {
          if (action.payload.success) {
            state.calendar = state.calendar.filter(
              (cal) => cal.id !== action.payload.calendarId
            );
          }
          state.isPending = false;
        }
      )
      .addCase(addTodayCalendar.pending, handlePending)
      .addCase(
        addTodayCalendar.fulfilled,
        (state, action: PayloadAction<calendarType>) => {
          if (
            !state.calendar.find(
              (calendar) => calendar.id === action.payload.id
            )
          ) {
            state.calendar.push(action.payload);
            state.oneCalendar = action.payload;
          }
          state.isPending = false;
        }
      )
      .addCase(addTodayCalendar.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload || "Failed to add today's calendar";
      })

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

export const addNote = createAsyncThunk(
  "calendar/addNote",
  async (data: { calendar_id: number; note: string }) => {
    return await calendarAPI.addNote(data);
  }
);

export const addTodayCalendar = createAsyncThunk<
  calendarType,
  { date: string },
  { rejectValue: string }
>("calendar/addTodayCalendar", async (_, { rejectWithValue }) => {
  try {
    const response = await calendarAPI.createTodayCalendar();
    if (response.success) {
      return response.calendar;
    } else {
      return rejectWithValue("Failed to create today's calendar");
    }
  } catch (error) {
    return rejectWithValue("An error occurred while creating today's calendar");
  }
});

export const getCalendarByDates = createAsyncThunk(
  "calendar/getCalendarByDates",
  async (data: { startDate: string; endDate: string }) => {
    const response = await calendarAPI.getCalendarByDates(data);
    return response;
  }
);

export const deleteNote = createAsyncThunk(
  "calendar/deleteNote",
  async (data: { date: string; noteId: number }) => {
    const response = await calendarAPI.deleteNote(data);
    return {
      success: response.success,
      message: response.message,
      noteId: data.noteId,
    };
  }
);

export const getOneCalendar = createAsyncThunk(
  "calendar/getOneCalendar",
  async (calendar_id: number) => {
    const response = await calendarAPI.getOneCalendar(calendar_id);
    return response.calendar;
  }
);

export const updateNote = createAsyncThunk(
  "calendar/updateNote",
  async (noteData: {
    date: string;
    noteId: number;
    note: string;
    calendarId: number;
  }) => {
    const data = await calendarAPI.updateNote(noteData);
    if (data.success) {
      return {
        id: noteData.calendarId,
        note: data.note,
      };
    }
  }
);

export const deleteCalendar = createAsyncThunk(
  "calendar/deleteCalendar",
  async (calendarId: number, { rejectWithValue }) => {
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
  async (calendarId: number | null, { rejectWithValue }) => {
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
  async (calendarId: number) => {
    const response = await calendarAPI.getNextCalendar({ calendarId });
    return response.response;
  }
);

export const { setCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
