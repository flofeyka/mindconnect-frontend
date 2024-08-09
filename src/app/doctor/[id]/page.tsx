'use client'

import React, { useEffect, useState } from 'react'
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
import {
	fetchDoctorProfileById,
	fetchPostsFromDoctor,
	subscribeToDoctor,
	unsubscribeFromDoctor,
} from '@lib/redux/slices/doctorprofile/doctorProfileSlice'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { Link as LinkUi } from '@nextui-org/react'

export default function Doctor() {
	const dispatch = useAppDispatch()
	const { profile, posts, loading, error } = useAppSelector(
		state => state.doctorProfile
	)
	const [isSubscribed, setIsSubscribed] = React.useState(false)
	const [subscriberCount, setSubscriberCount] = useState(0)
	const params = useParams()
	const currentUserId = useAppSelector(state => state.Auth.usersData.id)
	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	useEffect(() => {
		const doctorId = params.id as string
		if (doctorId) {
			dispatch(fetchDoctorProfileById(doctorId))
			dispatch(fetchPostsFromDoctor(doctorId))
		}
	}, [dispatch, params.id])

	useEffect(() => {
		if (profile && currentUserId) {
			setIsSubscribed(profile.subscribers.includes(currentUserId))
			setSubscriberCount(profile.subscribers.length)
		}
	}, [profile, currentUserId])

	const handleSubscribeToggle = async () => {
		const doctorId = params.id as string
		if (isSubscribed) {
			await dispatch(unsubscribeFromDoctor(doctorId))
			setSubscriberCount(prev => prev - 1)
		} else {
			await dispatch(subscribeToDoctor(doctorId))
			setSubscriberCount(prev => prev + 1)
		}
		setIsSubscribed(!isSubscribed)
	}

	if (loading === 'pending') {
		return <Loader2 />
	}

	if (loading === 'failed') {
		return <div>Error: {error}</div>
	}

	if (!profile) {
		return <div>No profile data available</div>
	}

	return (
		<>
			<Card className='max-w-[836px] mx-auto h-48 mt-14 mb-14'>
				<CardHeader className='justify-between'>
					<div className='flex gap-5'>
						<Avatar
							isBordered
							radius='full'
							size='lg'
							src={profile.image || 'https://nextui.org/avatars/avatar-1.png'}
						/>
						<div className='flex flex-col gap-1 items-start justify-center'>
							<h4 className='text-small font-semibold leading-none text-default-600'>
								{profile.firstName || 'name not found'}
							</h4>
							<h5 className='text-small tracking-tight text-default-400'>
								{profile.email}
							</h5>
						</div>
					</div>
					<Button
						className={
							isSubscribed
								? 'bg-transparent text-foreground border-default-200'
								: ''
						}
						color='primary'
						radius='full'
						size='md'
						variant={isSubscribed ? 'bordered' : 'solid'}
						onPress={handleSubscribeToggle}
					>
						{isSubscribed ? 'Unsubscribe' : 'Subscribe'}
					</Button>
				</CardHeader>

				<CardBody className='px-3 py-0 text-small text-default-400'>
					<p>{profile.description}</p>
				</CardBody>
				<CardFooter className='gap-3 items-center flex'>
					<div className='flex gap-1'>
						<p className='font-semibold text-default-400 text-small'>
							{profile.subscribedTo.length}
						</p>
						<p className=' text-default-400 text-small'>Following</p>
					</div>
					<div className='flex gap-1'>
						<p className='font-semibold text-default-400 text-small'>
							{subscriberCount}
						</p>
						<p className='text-default-400 text-small'>Followers</p>
					</div>
					{(params.id as string) === currentUserId && (
						<Button
							href='/add'
							as={LinkUi}
							color='primary'
							showAnchorIcon
							variant='solid'
							className='mr-0 ml-auto'
						>
							Add Post
						</Button>
					)}
				</CardFooter>
			</Card>
			<div className='max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8 mx-auto'>
				{posts
					.slice()
					.reverse()
					.map(post => (
						<Card
							key={post._id}
							className='col-span-12 sm:col-span-4 h-[250px] overflow-hidden'
						>
							<Link
								href={`/doctor/${params.id}/post/${post._id}`}
								className='w-full h-full relative block'
							>
								<CardHeader className='absolute z-10 top-0 left-0 right-0 flex-col !items-start bg-gradient-to-b from-black/60 to-transparent'>
									<p className='text-tiny text-white/60 uppercase font-bold'>
										{post.title}
									</p>
									<h4 className='text-white font-medium text-large'>
										{post.description}
									</h4>
								</CardHeader>
								<Image
									removeWrapper
									alt='Card background'
									className='z-0 w-full h-full object-cover'
									src={post.image}
								/>
							</Link>
						</Card>
					))}
			</div>
		</>
	)
}
