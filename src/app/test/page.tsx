'use client'

import { getAuthUserData } from "@lib/redux/auth/authSlice"
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks"
import { useEffect } from "react"

export default function Test() {
    const dispatch = useAppDispatch()
    const usersData = useAppSelector(state => state.auth.usersData)
    useEffect(() => {
        dispatch(getAuthUserData());
    }, [])

    return <div>
        email: {usersData.email}
    </div>
}