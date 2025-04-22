import Link from 'next/link'

interface PageProps {
	params: Promise<{ id: string }>
}

export default async function Page(props: PageProps) {
    const params = await props.params;

    const {
        id
    } = params;

    return (
		<div className='flex flex-col items-center gap-3'>
			<p className='font-bold'>You left this meeting.</p>
			<Link
				href={`/fast-connect/meeting/${id}`}
				className='bg-gray-500 hover:bg-gray-600'
			>
				Rejoin
			</Link>
		</div>
	)
}
