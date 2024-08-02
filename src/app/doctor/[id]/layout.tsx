import Container from '@components/Container'
import Logo from '@components/Logo'
import React from 'react'

export default function DoctorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (

		<div className='flex'>
			<div className='bg-[#111] w-full h-full'>{children}</div>
		</div>
	)
}
