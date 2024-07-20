import { ResearchDataType, usersDataType } from "@lib/types";
import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  baseURL: "https://mindconnect-vebk.onrender.com/api/",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  async googleSignIn() {
    const Response = await instance.get("auth/googlesignin");
    return {
      status: Response.status,
      data: Response.data,
    };
  },
  async getGoogleUsersData(code: string) {
    const Response = await instance.get(`auth/getgoogleuserdata?code=${code}`);
    localStorage.setItem("token", Response.data.accessToken);
    return {
      data: Response.data.user,
      status: Response.status,
    };
  },
  async login(data: {
    email: string;
    password: string;
  }): Promise<usersDataType> {
    const Response = await instance.post("auth/signin", data);
    localStorage.setItem("token", Response.data.token);
    return Response.data.user;
  },
  async register(data: {
    firstName: string;
    email: string;
    password: string;
  }): Promise<usersDataType> {
    const Response = await instance.post("auth/signup", {
      ...data,
    });
    localStorage.setItem("token", Response.data.token);
    return Response.data.user;
  },
  async logout() {
    const Response = await instance.post("auth/logout");
    return Response.data;
  },
  async getUsersData(): Promise<{ user: usersDataType; status: number }> {
    const Response = await instance.get("auth/current", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return {
      user: Response.data,
      status: Response.status,
    };
  },
  async refresh(): Promise<{ status: number }> {
    const Response = await instance.get("auth/refreshToken", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
    localStorage.setItem("token", Response.data.token);
    return { status: Response.status };
  },

  async requestResetPassword(email: string) {
    const Response = await instance.post("auth/request-password-reset", {
      email,
    });
    return {
      status: Response.status,
      data: Response.data,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    const Response = await instance.post(`auth/reset-password/${token}`, {
      newPassword,
    });
    return {
      status: Response.status,
      data: Response.data,
    };
  },

  async verifyToken(token: string) {
    const Response = await instance.get(`auth/verify-token/${token}`);
    return {
      data: Response.data,
      status: Response.status,
    };
  },

  async findUsersByEmails(emails: string[]) {
    const Response = await instance.post("auth/users-by-emails", {
      emails: emails,
    });
    return Response.data.userIds;
  },
};

export const calendarAPI = {
  async addCalendar(data: { time: string; note: string }) {
    const Response = await instance.post(
      `calendar/add-calendar/?date=${data.time}`,
      {
        ...data,
      }
    );
    return Response.data;
  },
  async getCalendarByDates(data: { startDate: string; endDate: string }) {
    const Response = await instance.get(
      `calendar/dates-calendar?startDate=${data.startDate}&endDate=${data.endDate}`
    );
    return Response.data;
  },
  async deleteNote(data: { time: string; noteId: string }) {
    const Response = await instance.delete(
      `calendar/delete-calendar/?date=${data.time}/notes/?note=${data.noteId}`
    );
    return Response.data;
  },
  async getOneCalendar(date: string) {
    const Response = await instance.get(`calendar/one-calendar/${date}`);

    return Response.data;
  },
  async updateNote(data: { date: string; noteId: string; note: string }) {
    const Response = await instance.put(
      `calendar/update-note/${data.date}/notes/${data.noteId} `,
      {
        ...data,
      }
    );
    return Response.data;
  },
};

export const researchAPI = {
  async getResearch(data: ResearchDataType) {
    const Response = await instance.get(
      `calendar/researches/get?page=${data.page}&limit=${data.limit}`
    );
    return Response.data;
  },
};
