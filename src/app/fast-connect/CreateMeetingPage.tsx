'use client'

import CustomButton from '@components/CustomButton'
import { authAPI } from '@lib/API/api'
import { findUsersByEmails, getAuthUserData } from '@lib/redux/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import {
	useStreamVideoClient,
	Call,
	MemberRequest,
} from '@stream-io/video-react-sdk'
import { Copy, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import router from 'next/router'
import { useEffect, useState } from 'react'

export default function CreateMeetingPage() {
	const [descriptionInput, setDescriptionInput] = useState('')
	const [startTimeInput, setStartTimeInput] = useState('')
	const [participantsInput, setParticipantsInput] = useState('')

	const [call, setCall] = useState<Call>()

	const client = useStreamVideoClient()

	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	useEffect(() => {
		if (Object.keys(user).length === 0) {
			redirect('/auth/login')
		}
	}, [user])

	async function createMeeting() {
		if (!client) {
			return
		}
		try {
			const id = crypto.randomUUID()

			const callType = participantsInput ? 'private-meeting' : 'default'

			const call = client.call(callType, id)

			const memberEmails: string[] = participantsInput
				.split(',')
				.map(email => email.trim())
			console.log(memberEmails)

			const resultAction = await dispatch(findUsersByEmails(memberEmails))
			const memberIds: string[] = resultAction.payload as string[]

			const members: MemberRequest[] = memberIds
				.map((id: string) => ({
					user_id: id,
					role: 'call_member',
				}))
				.concat({ user_id: user.id, role: 'call_member' })
				.filter(
					(v: { user_id: any }, i: any, a: any[]) =>
						a.findIndex(v2 => v2.user_id === v.user_id) === i
				)
			const starts_at = new Date(startTimeInput || Date.now()).toISOString()

			await call.getOrCreate({
				data: {
					starts_at,
					members,
					custom: { description: descriptionInput },
				},
			})
			setCall(call)
		} catch (error) {
			console.error(error)
			alert('Something went wrong')
		}
	}

	if (!client || !user) {
		return <Loader2 className='mx-auto animate-spin' />
	}
	return (
		<div className='flex flex-col items-center space-y-6'>
			<h1 className='text-2xl font-bold text-center'>
				Welcome {user.firstName}
			</h1>
			<div className='w-80 mx-auto space-y-6 rounded-md bg-black p-5'>
				<h2 className='text-xl font-bold'>Create a new meeting</h2>
				<DescriptionInput
					value={descriptionInput}
					onChange={setDescriptionInput}
				/>
				<StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
				<ParticipantsInput
					value={participantsInput}
					onChange={setParticipantsInput}
				/>
				{user.isDoctor ? (
					<CustomButton onClick={createMeeting} className='w-full'>
						Create meeting
					</CustomButton>
				) : (
					<CustomButton onClick={createMeeting} className='w-full'>
						Enter meeting with doctor
					</CustomButton>
				)}
			</div>
			{call && <MeetingLink call={call} />}
		</div>
	)
}

interface DescriptionInputProps {
	value: string
	onChange: (value: string) => void
}

function DescriptionInput({ value, onChange }: DescriptionInputProps) {
	const [active, setActive] = useState(false)
	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	return user.isDoctor ? (
		<div className='space-y-2'>
			<div className='font-medium'>Meeting info</div>
			<label className='flex items-center gap-1.5'>
				<input
					type='checkbox'
					checked={active}
					onChange={e => {
						setActive(e.target.checked)
						onChange('')
					}}
				/>
				Add description
			</label>
			{active && (
				<label className='block space-y-1'>
					<span className='font-medium'>Description</span>
					<textarea
						value={value}
						onChange={e => onChange(e.target.value)}
						maxLength={500}
						className='w-full rounded-md border border-gray-300 p-2'
					></textarea>
				</label>
			)}
		</div>
	) : null
}

interface StartTimeInputProps {
	value: string
	onChange: (value: string) => void
}

function StartTimeInput({ value, onChange }: StartTimeInputProps) {
	const [active, setActive] = useState(false)
	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	const dateTimeLocalNow = new Date(
		new Date().getTime() - new Date().getTimezoneOffset() * 60_000
	)
		.toISOString()
		.slice(0, 16)

	return (
		<div className='space-y-2'>
			<div className='font-medium'>Meeting start:</div>
			<label className='flex items-center gap-1.5'>
				<input
					type='radio'
					checked={!active}
					onChange={() => {
						setActive(false)
						onChange('')
					}}
				/>
				Start meeting immediately
			</label>
			{user.isDoctor ? (
				<>
					<label className='flex items-center gap-1.5'>
						<input
							type='radio'
							checked={active}
							onChange={() => {
								setActive(true)
								onChange(dateTimeLocalNow)
							}}
						/>
						Start meeting at date/time
					</label>
					{active && (
						<label className='block space-y-1'>
							<span className='font-medium'>Start time</span>
							<input
								className='w-full rounded-md border border-gray-300 p-2'
								type='datetime-local'
								value={value}
								min={dateTimeLocalNow}
								onChange={e => onChange(e.target.value)}
							/>
						</label>
					)}
				</>
			) : null}
		</div>
	)
}

interface ParticipantsInputProps {
	value: string
	onChange: (value: string) => void
}

function ParticipantsInput({ value, onChange }: ParticipantsInputProps) {
	const [active, setActive] = useState(false)
	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	return (
		<div className='space-y-2'>
			{' '}
			<div className='font-medium'>Participants:</div>
			<label className='flex items-center gap-1.5'>
				<input
					type='radio'
					checked={!active}
					onChange={() => {
						setActive(false)
						onChange('')
					}}
				/>
				Everyone with link can join
			</label>
			{user.isDoctor ? (
				<>
					<label className='flex items-center gap-1.5'>
						<input
							type='radio'
							checked={active}
							onChange={() => setActive(true)}
						/>
						Private meeting
					</label>
					{active && (
						<label className='block space-y-1'>
							<span className='font-medium'>Participants emails</span>
							<textarea
								className='w-full rounded-md border border-gray-300 p-2'
								value={value}
								onChange={e => onChange(e.target.value)}
								placeholder='Enter participant email addresses separated by comas'
							/>
						</label>
					)}
				</>
			) : null}
		</div>
	)
}

interface MeetingLinkProps {
	call: Call
}

function MeetingLink({ call }: MeetingLinkProps) {
	const user = useAppSelector(state => state.Auth.usersData)
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/fast-connect/meeting/${call.id}`

	if (user.isDoctor !== true) {
		redirect(`/fast-connect/meeting/${call.id}`)
	}

	return (
		<div className='text-center flex flex-col items-center gap-3'>
			<div className='flex items-center gap-3'>
				<span>Invitation link: </span>
				<Link target='_blank' href={meetingLink} className='font-medium'>
					{meetingLink}
				</Link>
				<button
					title='Copy invitation link'
					onClick={() => {
						navigator.clipboard.writeText(meetingLink)
						alert('Copied to clipboard')
					}}
				>
					<Copy />
				</button>
			</div>
			<a
				href={getMailToLink(
					meetingLink,
					call.state.startsAt,
					call.state.custom.description
				)}
				target='_blank'
				className='text-blue-500 hover:underline'
			>
				Send email invitation
			</a>
		</div>
	)
}

function getMailToLink(
	meetingLink: string,
	startsAt?: Date,
	description?: string
) {
	const startDateFormatted = startsAt
		? startsAt.toLocaleString('en-US', {
				dateStyle: 'full',
				timeStyle: 'short',
		  })
		: undefined

	const subject =
		'Join my meeting' + (startDateFormatted ? ` at ${startDateFormatted}` : '')

	const body =
		`Join my meeting at ${meetingLink}.` +
		(startDateFormatted
			? `\n\nThe meeting starts at ${startDateFormatted}.`
			: '') +
		(description ? `\n\nDescription: ${description}` : '')

	return `mailto:?subject=${encodeURIComponent(
		subject
	)}&body=${encodeURIComponent(body)}`
}
