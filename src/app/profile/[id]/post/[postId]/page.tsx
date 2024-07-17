'use client'

import React from 'react'
import { Provider, ClapButton } from '@lyket/react'
import {
	Image,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Link,
	User,
} from '@nextui-org/react'

export default function Post() {
	return (
		<div className='flex gap-14 justify-center mt-14'>
			<Image
				isBlurred
				width={240}
				src='https://nextui-docs-v2.vercel.app/images/album-cover.png'
				alt='NextUI Album Cover'
				className='m-5'
			/>
			<Card className='max-w-[400px]'>
				<CardHeader className='flex gap-3'>
					<div className='flex flex-col '>
						<h2 className='text-lg'>Title</h2>
						{/* link to author's profile: */}
						<User
							name='Jane Doe'
							description='Product Designer'
							avatarProps={{
								src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
							}}
						/>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<p>Make beautiful websites regardless of your design experience.</p>
				</CardBody>
				<Divider />
				<Provider apiKey='st_abdc0a40e610428e8dfdf59fe95a07'>
					<ClapButton namespace='testing-react' id='everybody-clap-now' />
				</Provider>
				<CardFooter>
					<Link href=''>View comments</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
