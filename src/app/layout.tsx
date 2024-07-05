import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import Providers from './providers'
import '../assets/styles/global.css'
import '@mantine/core/styles/global.css'
import React from 'react'

const font = Poppins({
	subsets: ['devanagari'],
	weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
	title: 'Mind-Connect',
	description: 'Develop and change your mind',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html className='dark' lang='en'>
			<body className={font.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
