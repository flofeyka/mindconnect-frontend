import axios from "axios"

const instance = axios.create({
	withCredentials: true,
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/calendar/`,
})

instance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export const calendarAPI = {
    async addCalendar(data: { time: string; note: string }) {
      const Response = await instance.post(
        `add-calendar/?date=${data.time}`,
        {
          ...data,
        }
      );
      return Response.data;
    },
    async getCalendarByDates(data: { startDate: string; endDate: string }) {
      const Response = await instance.get(
        `dates-calendar?startDate=${data.startDate}&endDate=${data.endDate}`
      );
      return Response.data;
    },
    async deleteNote(data: { time: string; noteId: string }) {
      const Response = await instance.delete(
        `delete-calendar/?date=${data.time}/notes/?note=${data.noteId}`
      );
      return Response.data;
    },
    async getOneCalendar(date: string) {
      const Response = await instance.get(`calendar/one-calendar/${date}`);
  
      return Response.data;
    },
    async updateNote(data: { date: string; noteId: string; note: string }) {
      const Response = await instance.put(
        `update-note/${data.date}/notes/${data.noteId} `,
        {
          ...data,
        }
      );
      return Response.data;
    },
  };