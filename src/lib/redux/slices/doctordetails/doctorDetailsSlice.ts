import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const baseAPI = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

baseAPI.interceptors.request.use(
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

// Define types
interface PriceOneHour {
	price: string
	currency: string
}

export interface DoctorProfile {
	id: string
	firstName: string
	lastName: string
	phoneNumber: string
	description: string
	image: File
	priceOneHour: PriceOneHour
	typeOfConsultation: string[]
	fieldsOfProblems: string[]
	aboutMe: string
	languages: string[]
	country: string
	city: string
	yearsOfExperience: number
	age: number
	gender: string
}

interface DoctorProfileState {
	profile: DoctorProfile | null
	loading: boolean
	error: string | null
}

interface UpdateProfilePayload {
	[key: string]: any
	image?: File
}

// Async thunk
export const updateDoctorProfile = createAsyncThunk<
	DoctorProfile,
	UpdateProfilePayload,
	{
		rejectValue: string
	}
>('doctorDetails/update', async (profileData, { rejectWithValue }) => {
	try {
		const formData = new FormData()
		Object.keys(profileData).forEach(key => {
			if (profileData[key] != null) {
				if (key === 'image' && profileData[key] instanceof File) {
					formData.append('image', profileData[key])
				} else if (typeof profileData[key] === 'object') {
					formData.append(key, JSON.stringify(profileData[key]))
				} else {
					formData.append(key, profileData[key])
				}
			}
		})

		const response = await baseAPI.patch<DoctorProfile>(
			'/user/update-doctor-profile',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data as string)
		}
		return rejectWithValue('An unexpected error occurred')
	}
})

export const getDoctorDetails = createAsyncThunk<
	DoctorProfile,
	void,
	{
		rejectValue: string
	}
>('doctorProfile/getDetails', async (_, { rejectWithValue }) => {
	try {
		const response = await baseAPI.get<DoctorProfile>('/user/doctor-details')
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			return rejectWithValue(error.response.data as string)
		}
		return rejectWithValue('An unexpected error occurred')
	}
})

export const getPublicDoctorDetails = createAsyncThunk<
	DoctorProfile,
	string,
	{
		rejectValue: string
	}
>(
	'doctorProfile/getPublicDetails',
	async (doctorId, { rejectWithValue }: any) => {
		try {
			const response = await baseAPI.get<DoctorProfile>(
				`/public-doctor-details/${doctorId}`
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				return rejectWithValue(error.response.data as string)
			}
			return rejectWithValue('An unexpected error occurred')
		}
	}
)

// Slice
const initialState: DoctorProfileState = {
	profile: null,
	loading: false,
	error: null,
}

const doctorDetailsSlice = createSlice({
	name: 'doctorDetails',
	initialState,
	reducers: {
		// You can add any additional synchronous actions here if needed
	},
	extraReducers: builder => {
		builder
			.addCase(updateDoctorProfile.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(
				updateDoctorProfile.fulfilled,
				(state, action: PayloadAction<DoctorProfile>) => {
					state.loading = false
					state.profile = action.payload
					state.error = null
				}
			)
			.addCase(updateDoctorProfile.rejected, (state, action) => {
				state.loading = false
				state.error =
					typeof action.payload === 'string'
						? action.payload
						: 'An unknown error occurred'
			})
			.addCase(getDoctorDetails.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(
				getDoctorDetails.fulfilled,
				(state, action: PayloadAction<DoctorProfile>) => {
					state.loading = false
					state.profile = action.payload
					state.error = null
				}
			)
			.addCase(getDoctorDetails.rejected, (state, action) => {
				state.loading = false
				state.error =
					typeof action.payload === 'string'
						? action.payload
						: 'An unknown error occurred'
			})
			.addCase(getPublicDoctorDetails.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(
				getPublicDoctorDetails.fulfilled,
				(state, action: PayloadAction<DoctorProfile>) => {
					state.loading = false
					state.profile = action.payload
					state.error = null
				}
			)
			.addCase(getPublicDoctorDetails.rejected, (state, action) => {
				state.loading = false
				state.error =
					typeof action.payload === 'string'
						? action.payload
						: 'An unknown error occurred'
			})
	},
})

export default doctorDetailsSlice.reducer
