import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calendarAPI } from "@lib/API/calendarAPI";
import { calendarType } from "@lib/types";

const initialState = {
  calendar: [] as calendarType[],
  isPending: true,
  oneCalendar: {} as calendarType,
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
    builder.addCase(getCalendarByDates.fulfilled, (state, action) => {
      state.calendar = action.payload;
      state.isPending = false;
    });
    builder.addCase(getOneCalendar.pending, (state) => {
      state.isPending = true;
    });
    builder.addCase(
      getOneCalendar.fulfilled,
      (state, action: PayloadAction<calendarType[]>) => {
        state.isPending = false;
        state.calendar = action.payload;
      }
    );

    builder.addCase(
      addCalendar.fulfilled,
      (state, action: PayloadAction<calendarType>) => {
        state.calendar.push(action.payload);
        state.isPending = false;
      }
    );
    builder.addCase(
      deleteNote.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.calendar = state.calendar.filter(
          (element) => element._id !== action.payload
        );
        state.isPending = false;
      }
    );
    builder.addCase(updateNote.fulfilled, (state, action) => {
      state.calendar = state.calendar.map((calendar) => {
        if (calendar._id === action.payload?._id) {
          return {
            ...calendar,
            notes: calendar.notes.map((note) => {
              if (note._id === action.payload?.note._id) {
                return {
                  ...note,
                  note: action.payload.note.note,
                };
              } else {
                return note;
              }
            }),
          };
        }
        return calendar;
      });
      state.isPending = false;
    });
  },
});

export const addCalendar = createAsyncThunk(
  "calendar/addCalendar",
  async (data: { time: string; note: string }) => {
    const response = await calendarAPI.addCalendar(data);
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
  async (data: { time: string; noteId: string }) => {
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

export const { setCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
