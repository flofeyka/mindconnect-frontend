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
	id: string
	email: string
	firstName: string
	lastName: string
	number: number
	image: string
	isDoctor: boolean
}

export type calendarType = {
	_id: {
		$oid: string
	}
	date: {
		$date: string
	}
	owner: {
		$oid: string
	}
	__v: number
	notes: calendarNoteType[]
}

export type calendarNoteType = {
	_id: {
		$oid: string
	}
	note: string
	time: string
	createdAt: {
		$date: string
	}
}

export type ResearchDataType = {
	page: number
	limit: number
}

export type ResearchType = {
	"@GROUP_ID": string
}