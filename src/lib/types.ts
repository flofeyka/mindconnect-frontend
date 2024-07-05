export type authType = {
	isAuth: boolean
	captchaUrl: null | string
	usersData: usersDataType
	tokenIsValid: boolean | null
	isPending: boolean
	googleUrl: null | string
	emails: string[]
}

export type usersDataType = {
	isDoctor: any
	id: string
	email: string
	firstName: string
	lastName: string
	number: number
	image: string
}
