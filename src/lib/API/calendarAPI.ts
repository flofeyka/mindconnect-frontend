import axios from "axios";
import baseAPI from "./api";

export const calendarAPI = {
  async addNote(body: { calendar_id: number; note: string }) {
    const { data } = await baseAPI.post(`calendar/note`, {
      ...body,
    });
    return data;
  },
  async getCalendarByDates(body: { startDate: string; endDate: string }) {
    // const Response = await baseAPI.get(
    //   `calendar/dates-calendar?startDate=${data.startDate}&endDate=${data.endDate}`
    // );
    // return Response.data;
    let end = new Date(body.endDate).setHours(23, 59, 59);
    const { data } = await baseAPI.get(`calendar/all/by-dates`, {
      params: {
        start_date: body.startDate,
        end_date: new Date(end),
      },
    });
    return data;
  },
  async deleteNote(body: { date: string; noteId: number }) {
    const { data } = await baseAPI.delete(`calendar/note/${body.noteId}`);
    return data;
  },
  async getOneCalendar(calendar_id: number) {
    const { data } = await baseAPI.get(`calendar/${calendar_id}`);

    return data;
  },
  async updateNote({
    date,
    noteId,
    note,
  }: {
    date: string;
    noteId: number;
    note: string;
  }) {
    const { data, status } = await baseAPI.put(
      `calendar/note`,
      {
        note_id: noteId,
        note,
      }
    );
    return {
      success: status === 200,
      note: data,
    };
  },
  async deleteCalendar({ calendarId }: { calendarId: number }) {
    const { data, status } = await baseAPI.delete(
      `calendar/delete/${calendarId}`
    );
    return {
      success: status === 200,
      message: data.message,
    };
  },
  async getPrevCalendar({ calendarId }: { calendarId: number | null }) {
    const endpoint = calendarId
      ? `calendar/${calendarId}`
      : `calendar/previous-calendar/null`;
    const Response = await baseAPI.get(endpoint);
    return {
      success: Response.status === 200,
      response: Response.data,
    };
  },
  async getNextCalendar({ calendarId }: { calendarId: number }) {
    const Response = await baseAPI.get(`calendar/next-calendar/${calendarId}`);
    return {
      success: Response.status === 200,
      response: Response.data,
    };
  },
  async getAllDates() {
    const Response = await baseAPI.get(`calendar/all-dates`);
    return {
      success: Response.status === 200,
      response: Response.data,
    };
  },
  async createTodayCalendar() {
    const { data } = await baseAPI.post(`calendar/today-calendar`);
    return {
      success: data.success,
      calendar: data.calendar,
    };
  },
};
