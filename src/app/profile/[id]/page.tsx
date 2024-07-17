'use client'

import React, { useEffect } from 'react'
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Avatar,
	Button,
	Image,
} from '@nextui-org/react'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'

export default function Profile() {
	const [isFollowed, setIsFollowed] = React.useState(false)

	return (
		<>
			<Card className='max-w-[836px] mx-auto h-48 mt-14 mb-14'>
				<CardHeader className='justify-between'>
					<div className='flex gap-5'>
						<Avatar
							isBordered
							radius='full'
							size='lg'
							src='https://nextui.org/avatars/avatar-1.png'
						/>
						<div className='flex flex-col gap-1 items-start justify-center'>
							<h4 className='text-small font-semibold leading-none text-default-600'>
								Zoey Lang
							</h4>
							<h5 className='text-small tracking-tight text-default-400'>
								@zoeylang
							</h5>
						</div>
					</div>
					<Button
						className={
							isFollowed
								? 'bg-transparent text-foreground border-default-200'
								: ''
						}
						color='primary'
						radius='full'
						size='md'
						variant={isFollowed ? 'bordered' : 'solid'}
						onPress={() => setIsFollowed(!isFollowed)}
					>
						{isFollowed ? 'Unfollow' : 'Follow'}
					</Button>
				</CardHeader>

				<CardBody className='px-3 py-0 text-small text-default-400'>
					<p>
						Frontend developer and UI/UX enthusiast. Join me on this coding
						adventure!
					</p>
					<span className='pt-2'>
						#FrontendWithZoey
						<span className='py-2' aria-label='computer' role='img'>
							💻
						</span>
					</span>
				</CardBody>
				<CardFooter className='gap-3'>
					<div className='flex gap-1'>
						<p className='font-semibold text-default-400 text-small'>4</p>
						<p className=' text-default-400 text-small'>Following</p>
					</div>
					<div className='flex gap-1'>
						<p className='font-semibold text-default-400 text-small'>97.1K</p>
						<p className='text-default-400 text-small'>Followers</p>
					</div>
				</CardFooter>
			</Card>
			<div className='max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8 mx-auto'>
				<Card className='col-span-12 sm:col-span-4 h-[300px] data-hover:true'>
					<CardHeader className='absolute z-10 top-1 flex-col !items-start'>
						<p className='text-tiny text-white/60 uppercase font-bold'>
							What to watch
						</p>
						<h4 className='text-white font-medium text-large'>
							Stream the Acme event
						</h4>
					</CardHeader>
					<Image
						removeWrapper
						alt='Card background'
						className='z-0 w-full h-full object-cover'
						src='https://nextui.org/images/card-example-4.jpeg'
					/>
				</Card>
				<Card className='col-span-12 sm:col-span-4 h-[300px]'>
					<CardHeader className='absolute z-10 top-1 flex-col !items-start'>
						<p className='text-tiny text-white/60 uppercase font-bold'>
							Plant a tree
						</p>
						<h4 className='text-white font-medium text-large'>
							Contribute to the planet
						</h4>
					</CardHeader>
					<Image
						removeWrapper
						alt='Card background'
						className='z-0 w-full h-full object-cover'
						src='https://nextui.org/images/card-example-3.jpeg'
					/>
				</Card>
				<Card className='col-span-12 sm:col-span-4 h-[300px]'>
					<CardHeader className='absolute z-10 top-1 flex-col !items-start'>
						<p className='text-tiny text-white/60 uppercase font-bold'>
							Supercharged
						</p>
						<h4 className='text-white font-medium text-large'>
							Creates beauty like a beast
						</h4>
					</CardHeader>
					<Image
						removeWrapper
						alt='Card background'
						className='z-0 w-full h-full object-cover'
						src='https://nextui.org/images/card-example-2.jpeg'
					/>
				</Card>
			</div>
		</>
	)
}
