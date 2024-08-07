import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { calendarAPI } from '@lib/API/calendarAPI'
import { calendarType } from '@lib/types'

const initialState = {
	calendar: [] as calendarType[],
	isPending: true,
	oneCalendar: {} as calendarType,
	error: null as string | null,
}

const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		setCalendar(state, action: PayloadAction<calendarType[]>) {
			state.calendar = action.payload
			state.isPending = false
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getCalendarByDates.fulfilled, (state, action) => {
				state.calendar = action.payload
				state.isPending = false
			})
			.addCase(getOneCalendar.pending, state => {
				state.isPending = true
			})
			.addCase(
				getOneCalendar.fulfilled,
				(state, action: PayloadAction<calendarType[]>) => {
					state.isPending = false
					state.calendar = action.payload
				}
			)
			.addCase(
				addCalendar.fulfilled,
				(state, action: PayloadAction<calendarType>) => {
					state.calendar.push(action.payload)
					state.isPending = false
				}
			)
			.addCase(deleteNote.fulfilled, (state, action: PayloadAction<string>) => {
				state.calendar = state.calendar.filter(
					element => element._id !== action.payload
				)
				state.isPending = false
			})
			.addCase(updateNote.fulfilled, (state, action) => {
				state.calendar = state.calendar.map(calendar => {
					if (calendar._id === action.payload?._id) {
						return {
							...calendar,
							notes: calendar.notes.map(note => {
								if (note._id === action.payload?.note._id) {
									return {
										...note,
										note: action.payload.note.note,
									}
								} else {
									return note
								}
							}),
						}
					}
					return calendar
				})
				state.isPending = false
			})
			// New builders for deleteCalendar
			.addCase(deleteCalendar.pending, state => {
				state.isPending = true
			})
			.addCase(deleteCalendar.fulfilled, (state, action) => {
				state.calendar = state.calendar.filter(
					cal => cal._id !== action.payload.calendarId
				)
				state.isPending = false
			})
			.addCase(deleteCalendar.rejected, (state, action) => {
				state.isPending = false
				state.error = action.error.message || 'Failed to delete calendar'
			})
			// New builders for getPrevCalendar
			.addCase(getPrevCalendar.pending, state => {
				state.isPending = true
			})
			.addCase(getPrevCalendar.fulfilled, (state, action) => {
				state.oneCalendar = action.payload.response
				state.isPending = false
			})
			.addCase(getPrevCalendar.rejected, (state, action) => {
				state.isPending = false
				state.error = action.error.message || 'Failed to get previous calendar'
			})
			// New builders for getNextCalendar
			.addCase(getNextCalendar.pending, state => {
				state.isPending = true
			})
			.addCase(getNextCalendar.fulfilled, (state, action) => {
				state.oneCalendar = action.payload.response
				state.isPending = false
			})
			.addCase(getNextCalendar.rejected, (state, action) => {
				state.isPending = false
				state.error = action.error.message || 'Failed to get next calendar'
			})
	},
})

export const addCalendar = createAsyncThunk(
	'calendar/addCalendar',
	async (data: { time: string; note: string }) => {
		const response = await calendarAPI.addCalendar(data)
		return response
	}
)

export const getCalendarByDates = createAsyncThunk(
	'calendar/getCalendarByDates',
	async (data: { startDate: string; endDate: string }) => {
		const response = await calendarAPI.getCalendarByDates(data)
		return response
	}
)

export const deleteNote = createAsyncThunk(
	'calendar/deleteNote',
	async (data: { time: string; noteId: string }) => {
		const response = await calendarAPI.deleteNote(data)
		return response
	}
)

export const getOneCalendar = createAsyncThunk(
	'calendar/getOneCalendar',
	async (date: string) => {
		const response = await calendarAPI.getOneCalendar(date)

		return response
	}
)

export const updateNote = createAsyncThunk(
	'calendar/updateNote',
	async (noteData: {
		date: string
		noteId: string
		note: string
		calendarId: string
	}) => {
		const data = await calendarAPI.updateNote(noteData)
		if (data.success) {
			return {
				_id: noteData.calendarId,
				note: data.note,
			}
		}
	}
)

export const deleteCalendar = createAsyncThunk(
	'calendar/deleteCalendar',
	async (calendarId: string) => {
		const response = await calendarAPI.deleteCalendar({ calendarId })
		return response
	}
)

export const getPrevCalendar = createAsyncThunk(
	'calendar/getPrevCalendar',
	async (calendarId: string) => {
		const response = await calendarAPI.getPrevCalendar({ calendarId })

		return response
	}
)

export const getNextCalendar = createAsyncThunk(
	'calendar/getNextCalendar',
	async (calendarId: string) => {
		const response = await calendarAPI.getNextCalendar({ calendarId })

		return response
	}
)

export const { setCalendar } = calendarSlice.actions
export default calendarSlice.reducer
