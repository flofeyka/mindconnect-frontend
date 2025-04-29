'use client'

import useLoadCall from '@app/hooks/useLoadCall'
import useStreamCall from '@app/hooks/useStreamCall'
import AudioVolumeIndicator from '@components/AudioVolumeIndicator'
import CustomButton from '@components/CustomButton'
import FlexibleCallLayout from '@components/FlexibleCallLayout'
import PermissionPrompt from '@components/PermissionPrompt'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import {
	Call,
	CallControls,
	CallingState,
	DeviceSettings,
	SpeakerLayout,
	StreamCall,
	StreamTheme,
	VideoPreview,
	useCall,
	useCallStateHooks,
	useStreamVideoClient,
} from '@stream-io/video-react-sdk'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface MeetingPageProps {
	id: string
}

export default function MeetingPage({ id }: MeetingPageProps) {
	const [userName, setUserName] = useState('Гость')
	
	const { call, callLoading } = useLoadCall(id)

	if (callLoading) {
		return <Loader2 className='mx-auto animate-spin' />
	}

	if (!call) {
		return <p className='text-center font-bold'>Встреча не найдена</p>
	}

	return (
		<>
			<p className='text-center mb-10 text-gray-500'>
				Этот звонок зашифрован. Никто не может получить информацию из этого звонка.
			</p>
			<StreamCall call={call}>
				<StreamTheme>
					<MeetingScreen userName={userName} />
				</StreamTheme>
			</StreamCall>
		</>
	)
}

interface MeetingScreenProps {
	userName: string
}

function MeetingScreen({ userName }: MeetingScreenProps) {
	const call = useStreamCall()

	const { useCallEndedAt, useCallStartsAt } = useCallStateHooks()

	const callEndedAt = useCallEndedAt()
	const callStartsAt = useCallStartsAt()

	const [setupComplete, setSetupComplete] = useState(false)

	async function handleSetupComplete() {
		call.join()
		setSetupComplete(true)
	}
	
	const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date()
	const callHasEnded = !!callEndedAt

	if (callHasEnded) {
		return <MeetingEndedScreen />
	}

	if (callIsInFuture) {
		return <UpcomingMeetingScreen />
	}

	const description = call.state.custom.description
	const createdBy = call.state.custom.createdBy

	return (
		<div className='space-y-6'>
			{description && (
				<p className='text-center'>
					Описание встречи: <span className='font-bold'>{description}</span>
				</p>
			)}
			{createdBy && (
				<p className='text-center'>
					Создатель: <span className='font-bold'>{createdBy}</span>
				</p>
			)}
			{setupComplete ? (
				<CallUI />
			) : (
				<SetupUI onSetupComplete={handleSetupComplete} userName={userName} />
			)}
		</div>
	)
}

interface SetupUIProps {
	onSetupComplete: () => void
	userName: string
}

function SetupUI({ onSetupComplete, userName }: SetupUIProps) {
	const call = useStreamCall()
	const [name, setName] = useState(userName)

	const { useMicrophoneState, useCameraState } = useCallStateHooks()

	const micState = useMicrophoneState()
	const camState = useCameraState()

	const [micCamDisabled, setMicCamDisabled] = useState(false)

	useEffect(() => {
		if (micCamDisabled) {
			call.camera.disable()
			call.microphone.disable()
		} else {
			call.camera.enable()
			call.microphone.enable()
		}
	}, [micCamDisabled, call])

	if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
		return <PermissionPrompt />
	}

	return (
		<div className='flex flex-col items-center gap-3'>
			<h1 className='text-center text-2xl font-bold'>Настройка</h1>
			<label className='block space-y-1 w-full max-w-md'>
				<span className='font-medium'>Ваше имя</span>
				<input
					type='text'
					className='w-full p-2 border rounded'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</label>
			<VideoPreview />
			<div className='flex h-16 items-center gap-3'>
				<AudioVolumeIndicator />
				<DeviceSettings />
			</div>
			<label className='flex items-center gap-2 font-medium'>
				<input
					type='checkbox'
					checked={micCamDisabled}
					onChange={e => setMicCamDisabled(e.target.checked)}
				/>
				Присоединиться с выключенными микрофоном и камерой
			</label>
			<CustomButton onClick={onSetupComplete}>Присоединиться к встрече</CustomButton>
		</div>
	)
}

function CallUI() {
	const { useCallCallingState } = useCallStateHooks()
	const callingState = useCallCallingState()

	if (callingState !== CallingState.JOINED) {
		return <Loader2 className='mx-auto animate-spin' />
	}

	return <FlexibleCallLayout />
}

function UpcomingMeetingScreen() {
	const call = useStreamCall()

	return (
		<div className='flex flex-col items-center gap-6'>
			<p>
				Эта встреча еще не началась. Она начнется в 
				<span className='font-bold'>
					{call.state.startsAt?.toLocaleString()}
				</span>
			</p>
			{call.state.custom.description && (
				<p>
					Описание:{' '}
					<span className='font-bold'>{call.state.custom.description}</span>
				</p>
			)}
			{call.state.custom.createdBy && (
				<p>
					Создатель:{' '}
					<span className='font-bold'>{call.state.custom.createdBy}</span>
				</p>
			)}
			<Link href='/'>На главную</Link>
		</div>
	)
}

function MeetingEndedScreen() {
	return (
		<div className='flex flex-col items-center gap-6'>
			<p className='font-bold'>Эта встреча завершена</p>
			<Link href='/'>На главную</Link>
		</div>
	)
}
