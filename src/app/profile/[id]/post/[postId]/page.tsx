'use client'

import React, { useEffect, useState } from 'react'
import { Provider, LikeButton } from '@lyket/react'
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
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { Heart, MessageCircle, Send } from 'lucide-react'
import {
	addComment,
	deletePost,
	fetchComments,
	likePost,
	unlikePost,
	updatePost,
} from '@lib/redux/slices/posts/postSlice'

export default function Post() {
	const dispatch = useAppDispatch()
	const { currentPost, loading, error } = useAppSelector(state => state.post)
	const { profile } = useAppSelector(state => state.doctorProfile)
	const currentUserId = useAppSelector(state => state.Auth.usersData.id)
	const comments = useAppSelector(state => state.posts.posts)
	const params = useParams()

	// new
	const [liked, setLiked] = useState(currentPost?.likes.includes(currentUserId))
	const [activeComments, setActiveComments] = useState<string | null>(null)

	const [comment, setComment] = useState('')

	const [editingPost, setEditingPost] = useState<{
		id: string
		title: string
		description: string
	} | null>(null)

	const handleUpdatePost = (e: React.FormEvent) => {
		e.preventDefault()
		if (editingPost) {
			dispatch(
				updatePost({
					postId: editingPost.id,
					postData: {
						title: editingPost.title,
						description: editingPost.description,
					},
				})
			)
			setEditingPost(null)
		}
	}

	const handleDeletePost = (postId: string) => {
		dispatch(deletePost(postId))
	}

	const handleAddComment = async (postId: string) => {
		if (comment.trim()) {
			try {
				await dispatch(addComment({ postId, content: comment })).unwrap()
				setComment('')
				dispatch(fetchComments(postId))
			} catch (error) {
				console.error('Failed to add comment:', error)
			}
		}
	}

	const handleLikeUnlike = (postId: string, isLiked: boolean) => {
		if (isLiked) {
			dispatch(unlikePost(postId))
		} else {
			dispatch(likePost(postId))
		}
	}

	const handleToggleComments = (postId: string) => {
		if (activeComments === postId) {
			setActiveComments(null)
		} else {
			setActiveComments(postId)
			dispatch(fetchComments(postId))
			console.log(currentPost?.comments)
		}
	}
	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setComment(e.target.value)
	// new

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

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
		<div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4'>
			<div className='p-8'>
				<div className='flex items-center mb-4'>
					<img
						className='h-10 w-10 rounded-full mr-2'
						src={profile?.image}
						alt={profile?.firstName}
					/>
					<div className='text-sm'>
						<p className='text-gray-900 font-semibold'>{profile?.firstName}</p>
						<p className='text-gray-600'>{currentPost.createdAt}</p>
					</div>
				</div>
				<img
					className='w-full object-cover mb-4'
					src={currentPost.image}
					alt={currentPost.title}
				/>
				<h2 className='block mt-1 text-lg leading-tight font-medium text-black'>
					{currentPost.title}
				</h2>
				<p className='mt-2 text-gray-500'>{currentPost.description}</p>
				<div className='mt-4 flex items-center'>
					<button
						onClick={() =>
							handleLikeUnlike(
								currentPost._id,
								currentPost.likes?.includes('user-id') || false
							)
						}
						className={`flex items-center mr-4 ${
							liked ? 'text-red-500' : 'text-gray-500'
						}`}
					>
						<Heart className='mr-1' size={20} />
						{liked ? 'Нравится' : 'Нравится'}
					</button>
					<button
						onClick={() => handleToggleComments(currentPost._id)}
						className='flex items-center text-gray-500'
					>
						<MessageCircle className='mr-1' size={20} />
						Комментарии
					</button>
				</div>
				{activeComments && (
					<div className='mt-4'>
						<h3 className='font-semibold mb-2 text-black'>Комментарии:</h3>

						<form
							onSubmit={() => handleAddComment(currentPost._id)}
							className='mt-4'
						>
							<input
								type='text'
								value={comment}
								onChange={handleCommentChange}
								placeholder='Напишите комментарий...'
								className='w-full p-2 border rounded'
							/>
							<button
								type='submit'
								className='mt-2 bg-blue-500 text-white p-2 rounded flex items-center'
							>
								<Send size={16} className='mr-2' />
								Отправить
							</button>
						</form>

						{currentPost.comments.map(comment => (
							<div key={comment.id} className='mb-2 p-2 bg-gray-100 rounded'>
								<p className='text-sm'>{comment.content}</p>
								<p className='text-xs text-gray-500 mt-1'>
									{comment.createdAt}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
