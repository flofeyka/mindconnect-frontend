import { Gender, Language, Problem } from "@lib/types";
import baseAPI from "./api";

export const DoctorAPI = {
  async fetchDoctors(dto: {
    languages: Language[];
    problems: Problem[];
    gender: Gender;
    search: string;
  }) {
    const { data } = await baseAPI.post("/user/doctors", dto);

    return data;
  },
};
