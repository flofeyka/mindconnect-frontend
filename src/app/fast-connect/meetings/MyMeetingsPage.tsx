'use client'

import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { useStreamVideoClient, Call } from '@stream-io/video-react-sdk'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MyMeetingsPage() {
	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	const client = useStreamVideoClient()
	const [calls, setCalls] = useState<Call[]>()

	useEffect(() => {
		async function loadCalls() {
			if (!client || !user?.id) {
				return
			}
			const { calls } = await client.queryCalls({
				sort: [{ field: 'starts_at', direction: -1 }],
				filter_conditions: {
					starts_at: { $exists: true },
					$or: [
						{ created_by_user_id: String(user.id) },
						{ members: { $in: [String(user.id)] } },
					],
				},
			})

			setCalls(calls)
		}
		loadCalls()
	}, [client, user?.id])

	return (
		<div className='space-y-3'>
			<h1 className='text-center text-2xl font-bold'>My meetings</h1>
			{!calls && <Loader2 className='mx-auto animate-spin' />}
			{calls?.length === 0 && <p>No meetings found</p>}
			<ul className='list-inside list-disc space-y-2'>
				{calls?.map(call => (
					<MeetingItem key={call.id} call={call} />
				))}
			</ul>
		</div>
	)
}

interface MeetingItemProps {
	call: Call
}

function MeetingItem({ call }: MeetingItemProps) {
	const meetingLink = `/fast-connect/meeting/${call.id}`

	const isInFuture =
		call.state.startsAt && new Date(call.state.startsAt) > new Date()

	const hasEnded = !!call.state.endedAt

	return (
		<li>
			<Link href={meetingLink} target='_blank' className='hover:underline'>
				{call.state.startsAt?.toLocaleString()}
				{isInFuture && ' (Upcoming)'}
				{hasEnded && ' (Ended)'}
			</Link>
			<p className='ml-6 text-gray-500'>{call.state.custom.description}</p>
		</li>
	)
}
