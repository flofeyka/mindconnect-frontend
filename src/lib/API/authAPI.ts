import { ResearchDataType, usersDataType } from "@lib/types";
import baseAPI from "./api";

export const authAPI = {
  async googleSignIn() {
    const Response = await baseAPI.get("auth/googlesignin");
    return {
      status: Response.status,
      data: Response.data,
    };
  },
  async getGoogleUsersData(code: string) {
    const Response = await baseAPI.get(`auth/getgoogleuserdata?code=${code}`);
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
    const Response = await baseAPI.post("auth/signin", data);
    localStorage.setItem("token", Response.data.token);
    localStorage.setItem("refreshToken", Response.data.refreshToken);
    return Response.data.user;
  },
  async register(data: {
    firstName: string;
    email: string;
    password: string;
    username: string;
    isDoctor: boolean;
  }): Promise<usersDataType> {
    const Response = await baseAPI.post("auth/signup", {
      ...data,
    });
    localStorage.setItem("token", Response.data.token);
    localStorage.setItem("refreshToken", Response.data.refreshToken);
    return Response.data.user;
  },
  async logout() {
    const Response = await baseAPI.post("auth/logout");
    return Response.data;
  },
  async getUsersData(): Promise<{ user: usersDataType; success: boolean }> {
    const { data, status } = await baseAPI.get("auth/current", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return {
      user: data,
      success: status === 200,
    };
  },
  async refresh(): Promise<{ success: boolean }> {
    const { status, data } = await baseAPI.post("auth/refreshToken", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    return { success: status === 200 };
  },

  async requestResetPassword(email: string) {
    const Response = await baseAPI.post("auth/request-password-reset", {
      email,
    });
    return {
      status: Response.status,
      data: Response.data,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    const Response = await baseAPI.post(`auth/reset-password/${token}`, {
      newPassword,
    });
    return {
      status: Response.status,
      data: Response.data,
    };
  },

  async verifyToken(token: string) {
    const Response = await baseAPI.get(`auth/verify-token/${token}`);
    return {
      data: Response.data,
      status: Response.status,
    };
  },

  async findUsersByEmails(emails: string[]) {
    const Response = await baseAPI.post("auth/users-by-emails", {
      emails: emails,
    });
    return Response.data.userIds;
  },
};

export const researchAPI = {
  async getResearch(data: ResearchDataType) {
    const Response = await baseAPI.get(
      `auth/researches/get?page=${data.page}&limit=${data.limit}`
    );
    return Response.data;
  },
};
