import { ResearchDataType, usersDataType } from "@lib/types";
import baseAPI from "./api";

export const authAPI = {
  async googleSignIn() {
    const { data } = await baseAPI.get("auth/googlesignin");
    return {
      status: data.status,
      data: data.data,
    };
  },
  async getGoogleUsersData(code: string) {
    const { data } = await baseAPI.get(`auth/getgoogleuserdata?code=${code}`);
    localStorage.setItem("token", data.accessToken);
    return {
      data: data.user,
      status: data.status,
    };
  },
  async login(body: {
    email: string;
    password: string;
  }): Promise<usersDataType> {
    const { data } = await baseAPI.post("auth/sign-in", body);
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.user;
  },
  async register(body: {
    firstName: string;
    email: string;
    password: string;
    lastName: string;
    isDoctor: boolean;
  }): Promise<usersDataType> {
    const { data } = await baseAPI.post("auth/sign-up", {
      ...body,
    });
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.user;
  },
  async logout() {
    const { data } = await baseAPI.delete("auth/logout", {
      data: {
      refreshToken: localStorage.getItem('refreshToken')
      }
    });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return data;
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
  async refresh(): Promise<{ success: boolean; user: usersDataType }> {
    const { status, data } = await baseAPI.post("auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return { success: status === 201, user: data.user };
  },

  async requestResetPassword(email: string) {
    const { data, status } = await baseAPI.post("auth/request-password-reset", {
      email,
    });
    return {
      status: status,
      data: data,
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
