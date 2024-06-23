'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { getAuthUserData } from '@lib/redux/auth/authSlice'
import {
	StreamVideo,
	StreamVideoClient,
	User,
} from '@stream-io/video-react-sdk'
import { Loader2 } from 'lucide-react'
import { nanoid } from '@reduxjs/toolkit'
import { getToken } from './actions'

interface StreamClientProviderProps {
	children: React.ReactNode
}

export default function StreamClientProvider({
	children,
}: StreamClientProviderProps) {
	const videoClient = useInitializeVideoClient()

	if (!videoClient) {
		return (
			<div className='h-screen flex items-center justify-center'>
				<Loader2 className='mx-auto animate-spin' />
			</div>
		)
	}

	return <StreamVideo client={videoClient}>{children}</StreamVideo>
}

function useInitializeVideoClient() {
	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()
	const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	useEffect(() => {
		if (!user) return

		let streamUser: User

		if (user?.id) {
			streamUser = {
				id: user.id,
				name: user.firstName || user.id,
				image: user.image,
			}
		} else {
			const id = nanoid()
			streamUser = {
				id,
				type: 'guest',
				name: `Guest ${id}`,
			}
		}

		const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY
		if (!apiKey) {
			throw new Error('stream api key not set')
		}

		const client = new StreamVideoClient({
			apiKey,
			user: streamUser,
			tokenProvider: user?.id ? () => getToken(user.id) : undefined,
		})

		setVideoClient(client)
		return () => {
			client.disconnectUser()
			setVideoClient(null)
		}
	}, [user])

	return videoClient
}
