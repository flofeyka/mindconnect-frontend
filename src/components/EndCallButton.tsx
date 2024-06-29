import useStreamCall from '@app/hooks/useStreamCall'
import { useCallStateHooks } from '@stream-io/video-react-sdk'

export default function EndCallButton() {
	const call = useStreamCall()

	const { useLocalParticipant } = useCallStateHooks()
	const LocalParticipant = useLocalParticipant()

	const participantIsChannelOwner =
		LocalParticipant &&
		call.state.createdBy &&
		LocalParticipant.userId === call.state.createdBy.id

	if (!participantIsChannelOwner) {
		return null
	}

	return (
		<button
			onClick={call.endCall}
			className='mx-auto block font-medium text-red-500 hover:underline'
		>
			End call for everyone
		</button>
	)
}
