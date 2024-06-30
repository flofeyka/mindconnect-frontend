import { Metadata } from 'next'
import MyMeetingsPage from './MyMeetingsPage'

export const metadata: Metadata = {
	title: 'My meetings',
}
export default function Page() {
	// ЕСЛИ незарег то скрыть доступ к этой хуйне
	return <MyMeetingsPage />
}
