import { Metadata } from 'next'
import MeetingPage from './MeetingPage'

interface PageProps {
	params: Promise<{ id: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;

    const {
        id
    } = params;

    return {
		title: `Meeting ${id}`,
	}
}

export default async function Page(props: PageProps) {
    const params = await props.params;

    const {
        id
    } = params;

    // Если не зарег то сделать чето в виде рега
    return <MeetingPage id={id} />
}
