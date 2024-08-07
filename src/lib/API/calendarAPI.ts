import axios from 'axios'
import baseAPI from './api'

export const calendarAPI = {
	async addCalendar(data: { time: string; note: string }) {
		const Response = await baseAPI.post(
			`calendar/add-calendar/?date=${data.time}`,
			{
				...data,
			}
		)
		return Response.data
	},
	async getCalendarByDates(data: { startDate: string; endDate: string }) {
		const Response = await baseAPI.get(
			`calendar/dates-calendar?startDate=${data.startDate}&endDate=${data.endDate}`
		)
		return Response.data
	},
	async deleteNote(data: { time: string; noteId: string }) {
		const Response = await baseAPI.delete(
			`calendar/delete-calendar/?date=${data.time}/notes/?note=${data.noteId}`
		)
		return Response.data
	},
	async getOneCalendar(date: string) {
		const Response = await baseAPI.get(`calendar/one-calendar/${date}`)

		return Response.data
	},
	async updateNote({
		date,
		noteId,
		note,
	}: {
		date: string
		noteId: string
		note: string
	}) {
		const { data, status } = await baseAPI.put(
			`calendar/update-note/${date}/notes/${noteId} `,
			{
				date,
				noteId,
				note,
			}
		)
		return {
			success: status === 200,
			note: data.note,
		}
	},
	async deleteCalendar({ calendarId }: { calendarId: string }) {
		const { data, status } = await baseAPI.delete(
			`calendar/delete/${calendarId}`
		)
		return {
			success: status === 200,
			message: data.message,
		}
	},
	async getPrevCalendar({ calendarId }: { calendarId: string }) {
		const Response = await baseAPI.get(
			`calendar/previous-calendar/${calendarId}`
		)
		return {
			success: Response.status === 200,
			response: Response.data,
		}
	},
	async getNextCalendar({ calendarId }: { calendarId: string }) {
		const Response = await baseAPI.get(`calendar/next-calendar/${calendarId}`)
		return {
			success: Response.status === 200,
			response: Response.data,
		}
	},
}
