import React from 'react'
import { Metadata } from 'next'
import StreamClientProvider from '@app/StreamClientProvider'
import '@stream-io/video-react-sdk/dist/css/styles.css'

export const metadata: Metadata = {
	title: 'FastConnect',
	description: 'Get free help from a professional',
}

export default function FastConnectLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<StreamClientProvider>
			<div className='flex flex-col h-screen justify-center items-center'>
				{children}
			</div>
		</StreamClientProvider>
	)
}
