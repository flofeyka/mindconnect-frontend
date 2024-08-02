import Container from '@components/Container'
import Logo from '@components/Logo'
import React from 'react'

export default function DoctorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='flex min-h-screen h-full'>
			<div className='bg-[#111] w-full'>{children}</div>
		</div>
	)
}
