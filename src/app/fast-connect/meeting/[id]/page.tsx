import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

interface PageProps {
	params: { id: string }
}

export function generateMetadata({ params: { id } }: PageProps): Metadata {
	return {
		title: `Meeting ${id}`,
	}
}

export default async function Page({ params: { id } }: PageProps) {
	// Если не зарег то сделать чето в виде рега
	return <MeetingPage id={id} />
}
