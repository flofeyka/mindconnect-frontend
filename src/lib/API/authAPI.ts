import { ResearchDataType, usersDataType } from '@lib/types'
import axios from 'axios'

const instance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth/`,
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

export const authAPI = {
	async googleSignIn() {
		const Response = await instance.get('googlesignin')
		return {
			status: Response.status,
			data: Response.data,
		}
	},
	async getGoogleUsersData(code: string) {
		const Response = await instance.get(`getgoogleuserdata?code=${code}`)
		localStorage.setItem('token', Response.data.accessToken)
		return {
			data: Response.data.user,
			status: Response.status,
		}
	},
	async login(data: {
		email: string
		password: string
	}): Promise<usersDataType> {
		const Response = await instance.post('signin', data)
		localStorage.setItem('token', Response.data.token);
		localStorage.setItem('refreshToken', Response.data.refreshToken)
		return Response.data.user
	},
	async register(data: {
		firstName: string
		email: string
		password: string
	}): Promise<usersDataType> {
		const Response = await instance.post('signup', {
			...data,
		})
		localStorage.setItem('token', Response.data.token)
		localStorage.setItem('refreshToken', Response.data.refreshToken)
		return Response.data.user
	},
	async logout() {
		const Response = await instance.post('logout')
		return Response.data
	},
	async getUsersData(): Promise<{ user: usersDataType; status: number }> {
		const Response = await instance.get('current', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
		return {
			user: Response.data,
			status: Response.status,
		}
	},
	async refresh(): Promise<{ status: number }> {
		const Response = await instance.post('refreshToken', {refreshToken: localStorage.getItem('refreshToken')})
		localStorage.setItem('token', Response.data.token);
		localStorage.setItem('refreshToken', Response.data.refreshToken)
		return { status: Response.status }
	},

	async requestResetPassword(email: string) {
		const Response = await instance.post('request-password-reset', {
			email,
		})
		return {
			status: Response.status,
			data: Response.data,
		}
	},

	async resetPassword(token: string, newPassword: string) {
		const Response = await instance.post(`reset-password/${token}`, {
			newPassword,
		})
		return {
			status: Response.status,
			data: Response.data,
		}
	},

	async verifyToken(token: string) {
		const Response = await instance.get(`verify-token/${token}`)
		return {
			data: Response.data,
			status: Response.status,
		}
	},

	async findUsersByEmails(emails: string[]) {
		const Response = await instance.post('users-by-emails', {
			emails: emails,
		})
		return Response.data.userIds
	},
}

export const researchAPI = {
  async getResearch(data: ResearchDataType) {
    const Response = await instance.get(
      `researches/get?page=${data.page}&limit=${data.limit}`
    );
    return Response.data;
  },
};
