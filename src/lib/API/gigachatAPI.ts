import { ChatDialog } from "@lib/types";
import baseAPI from "./api";

export const GigaChatAPI = {
  async getDialogs(): Promise<ChatDialog[]> {
    const { data } = await baseAPI.get("/gigachat");
    return data;
  },

  async createDialog(dto: { title: string; image?: string }) {
    const { data } = await baseAPI.post("/gigachat/dialog/create", dto);
    return data;
  },

  async getMessages(id: string) {
    const { data } = await baseAPI.get(`/gigachat/${id}`);

    return data.messages;
  },

  async sendMessage(dialog_id: string, message: string) {
    const { data } = await baseAPI.post("/gigachat/send", {
      dialog_id,
      message,
    });

    return data;
  },
};
