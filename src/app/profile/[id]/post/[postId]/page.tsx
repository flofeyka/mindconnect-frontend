'use client'

import React, { useEffect, useState } from 'react'
import { Provider, LikeButton } from '@lyket/react'
import Link from 'next/link'
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
import Comments from '@components/Posts/Comments'
import { RootState } from '@lib/redux/store'

export default function Post() {
	const dispatch = useAppDispatch()
	const { profile } = useAppSelector(state => state.doctorProfile)
	const currentUserId = useAppSelector(state => state.Auth.usersData.id)
	const params = useParams()
	const { postId } = params as { postId: string }

	const post = useAppSelector((state: RootState) =>
		state.posts.posts.find(p => p._id === postId)
	)

	const [liked, setLiked] = useState(false)
	const [likes, setLikes] = useState(0)
	const [activeComments, setActiveComments] = useState<string | null>(null)
	const [comment, setComment] = useState('')
	const [editingPost, setEditingPost] = useState<{
		id: string
		title: string
		description: string
	} | null>(null)

	useEffect(() => {
		if (postId && (!post || post._id !== postId)) {
			dispatch(fetchPostById(postId))
		}
	}, [dispatch, postId, post])

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
		if (post && currentUserId) {
			setLikes(post.likes?.length || 0)
			setLiked(post.likes?.includes(currentUserId) || false)
		}
	}, [post, currentUserId])

	if (!post) {
		return <div>Loading...</div>
	}

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

	const handleLikeUnlike = async (postId: string, isLiked: boolean) => {
		try {
			if (isLiked) {
				await dispatch(unlikePost(postId)).unwrap()
				setLikes(prevLikes => prevLikes - 1)
			} else {
				await dispatch(likePost(postId)).unwrap()
				setLikes(prevLikes => prevLikes + 1)
			}
			setLiked(!isLiked)
		} catch (error) {
			console.error('Failed to like/unlike post:', error)
		}
	}

	const handleToggleComments = (postId: string) => {
		if (activeComments === postId) {
			setActiveComments(null)
		} else {
			setActiveComments(postId)
			dispatch(fetchComments(postId))
		}
	}

	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setComment(e.target.value)

	return (
		<div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4'>
			<div className='p-8'>
				<Link href={`/profile/${params.id}`}>
					<div className='flex items-center mb-4'>
						<img
							className='h-10 w-10 rounded-full mr-2'
							src={profile?.image}
							alt={profile?.firstName}
						/>
						<div className='text-sm'>
							<p className='text-gray-900 font-semibold'>
								{profile?.firstName}
							</p>
							<p className='text-gray-600'>{post.createdAt}</p>
						</div>
					</div>
				</Link>
				<img
					className='w-full object-cover mb-4'
					src={post.image}
					alt={post.title}
				/>
				<h2 className='block mt-1 text-lg leading-tight font-medium text-black'>
					{post.title}
				</h2>
				<p className='mt-2 text-gray-500'>{post.description}</p>
				<div className='mt-4 flex items-center'>
					<button
						onClick={() => handleLikeUnlike(post._id, liked)}
						className={`flex items-center mr-4 ${
							liked ? 'text-red-500' : 'text-gray-500'
						}`}
					>
						<span>{likes}</span>
						<Heart className='mr-1' size={20} />
						{liked ? 'Like' : 'Like'}
					</button>

					<button
						onClick={() => handleToggleComments(post._id)}
						className='flex items-center text-gray-500'
					>
						<MessageCircle className='mr-1' size={20} />
						Комментарии
					</button>
				</div>
				{activeComments === post._id && (
					<div className='mt-4'>
						<h3 className='font-semibold mb-2 text-black'>Комментарии:</h3>

						<form
							onSubmit={e => {
								e.preventDefault()
								handleAddComment(post._id)
							}}
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

						<Comments postData={post} />
					</div>
				)}
			</div>
		</div>
	)
}
