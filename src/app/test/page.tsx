'use client'

import { getAuthUserData } from "@lib/redux/auth/authSlice"
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks"
import { memo, useEffect } from "react"

function Test() {
    const dispatch = useAppDispatch();
    const usersData = useAppSelector(state => state.Auth.usersData);

    useEffect(() => {
        dispatch(getAuthUserData());
    }, [dispatch])

    return <div>
        email: {usersData.email}
    </div>
}

export default memo(Test);