'use client'

import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { Card, CardHeader, Avatar } from '@nextui-org/react'
import { Message as MessageType } from 'ai'
import { Bot } from 'lucide-react'
import { useEffect } from 'react'

export default function Message({ message }: { message: MessageType }) {
	const dispatch = useAppDispatch()
	const user = useAppSelector(state => state.Auth.usersData)

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])
	const { role, content } = message
	if (role === 'assistant') {
		return (
			<div className='flex flex-col gap-3 p-6 whitespace-pre-wrap'>
				<div className='flex items-center gap-2'>
					<Bot />
					Assistant:
				</div>
				{content}
			</div>
		)
	}
	return (
		<Card className='whitespace-pre-wrap'>
			<CardHeader>
				<div className='flex items-center gap-2'>
					<Avatar size='sm' src={user.image} />
					{content}
				</div>
			</CardHeader>
		</Card>
	)
}
