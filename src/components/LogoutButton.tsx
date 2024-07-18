'use client'

import React from 'react'
import { useAppDispatch } from '@lib/redux/hooks'
import { logout } from '@lib/redux/slices/auth/authSlice'

const LogoutButton = () => {
	const dispatch = useAppDispatch()

	const handleLogout = () => {
		dispatch(logout())
	}

	return <button onClick={handleLogout}>Logout</button>
}

export default LogoutButton
