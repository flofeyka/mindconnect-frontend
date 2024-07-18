'use client'

import React, { useEffect } from 'react'
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

import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { fetchPostById } from '@lib/redux/slices/post/onePostslice'
import { fetchDoctorProfileById } from '@lib/redux/slices/doctorprofile/doctorProfileSlice'

export default function Post() {
	const dispatch = useAppDispatch()
	const { currentPost, loading, error } = useAppSelector(state => state.post)
	const { profile } = useAppSelector(state => state.doctorProfile)
	const params = useParams()

	useEffect(() => {
		const doctorId = params.id as string
		if (doctorId) {
			dispatch(fetchDoctorProfileById(doctorId))
		}
	}, [dispatch, params.id])

	useEffect(() => {
		const postId = params.postId as string
		if (postId) {
			dispatch(fetchPostById(postId))
		}
	}, [dispatch, params.id])

	if (loading === 'pending') {
		return <div>Loading...</div>
	}

	if (loading === 'failed') {
		return <div>Error: {error}</div>
	}

	if (!currentPost) {
		return <div>No post found</div>
	}
	return (
		<div className='flex gap-14 justify-center mt-14'>
			<Image
				isBlurred
				width={240}
				src={currentPost.image}
				alt={currentPost.title}
				className='m-5'
			/>
			<Card className='max-w-[400px]'>
				<CardHeader className='flex gap-3'>
					<div className='flex flex-col '>
						<h2 className='text-lg'>{currentPost.title}</h2>
						{/* link to author's profile: */}
						<User
							name={profile?.username}
							description={profile?.description}
							avatarProps={{
								src: `${profile?.image}`,
							}}
						/>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<p>{currentPost.description}</p>
				</CardBody>
				<Divider />
				<Provider apiKey='st_abdc0a40e610428e8dfdf59fe95a07'>
					<ClapButton namespace='testing-react' id='everybody-clap-now' />
				</Provider>
				<CardFooter>
					<p>Likes: {currentPost.likes.length}</p>
					<p>Comments: {currentPost.comments.length}</p>
					<p>Created at: {new Date(currentPost.createdAt).toLocaleString()}</p>
				</CardFooter>
			</Card>
		</div>
	)
}
