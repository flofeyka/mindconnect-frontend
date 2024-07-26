'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Provider, LikeButton } from '@lyket/react'
import Link from 'next/link'
import { redirect, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { fetchPostById } from '@lib/redux/slices/post/onePostslice'
import { fetchDoctorProfileById } from '@lib/redux/slices/doctorprofile/doctorProfileSlice'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { Button } from '@nextui-org/react'
import { Input } from '@nextui-org/input'
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
import { formatDate } from '@app/hooks/useFormattedDate'
import { Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export default function Post() {
	const dispatch = useAppDispatch()
	const { profile } = useAppSelector(state => state.doctorProfile)
	const currentUserId = useAppSelector(state => state.Auth.usersData.id)
	const params = useParams()
	const { postId } = params as { postId: string }
	const modal1 = useDisclosure()
	const router = useRouter()

	const post = useAppSelector((state: RootState) =>
		state.posts.posts.find(p => p._id === postId)
	)

	const [liked, setLiked] = useState(false)
	console.log(liked)
	const [likes, setLikes] = useState(0)
	const [activeComments, setActiveComments] = useState(false)

	useEffect(() => {
		if (postId && (!post || post._id !== postId)) {
			dispatch(fetchPostById(postId))
		}
	}, [dispatch, postId, post])

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	useEffect(() => {
		dispatch(fetchDoctorProfileById(params.id as string))
	}, [dispatch])

	const syncLikeState = useCallback(() => {
		if (post && currentUserId) {
			setLikes(post.likes?.length || 0)
			setLiked(post.likes?.includes(currentUserId) || false)
		}
	}, [post, currentUserId])

	useEffect(() => {
		syncLikeState()
	}, [syncLikeState, post])

	if (!post) {
		return <div>Loading...</div>
	}

	const handleLikeUnlike = async () => {
		if (!currentUserId) return

		try {
			if (liked) {
				await dispatch(unlikePost(postId)).unwrap()
			} else {
				await dispatch(likePost(postId)).unwrap()
			}
			dispatch(fetchPostById(postId))
		} catch (error) {
			console.error('Failed to like/unlike post:', error)
		}
	}

	const handleToggleComments = () => {
		setActiveComments(!activeComments)
		if (!activeComments) {
			dispatch(fetchComments(postId))
		}
	}

	const handleCommentDeleted = () => {
		dispatch(fetchComments(postId))
	}

	const handleDeletePost = () => {
		dispatch(deletePost(params.postId as string))
		router.push(`/profile/${params.id}`)
	}

	return (
		<div className='max-w-md mx-auto bg-secondary rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4'>
			<div className='p-8'>
				<div className='flex justify-between'>
					<Link href={`/profile/${params.id}`}>
						<div className='flex items-center mb-4'>
							<img
								className='h-10 w-10 rounded-full mr-2'
								src={profile?.image}
								alt={profile?.firstName}
							/>
							<div className='text-sm'>
								<p className='text-gray-100 font-semibold'>
									{profile?.firstName}
								</p>
								<p className='text-gray-400'>{formatDate(post.createdAt)}</p>
							</div>
						</div>
					</Link>
					{post.owner == currentUserId && (
						<>
							<Button
								onPress={modal1.onOpen}
								className='text-white bg-red-500 px-2 py-1 '
							>
								Delete Post
							</Button>
							<Modal
								isOpen={modal1.isOpen}
								onClose={modal1.onClose}
								onOpenChange={modal1.onOpenChange}
							>
								<ModalContent>
									<Button
										onClick={handleDeletePost}
										className='text-white bg-red-500 px-2 py-1 '
									>
										Delete Post
									</Button>
								</ModalContent>
							</Modal>
						</>
					)}
				</div>
				<img
					className='w-full object-cover mb-4'
					src={post.image}
					alt={post.title}
				/>
				<h1 className='block mt-1 text-lg leading-tight font-medium text-white'>
					{post.title}
				</h1>
				<p className='mt-2 text-gray-200'>{post.description}</p>

				<div className='mt-4 flex items-center'>
					<button
						onClick={handleLikeUnlike}
						className={`flex items-center mr-4 ${
							liked ? 'text-red-500' : 'text-gray-300'
						}`}
					>
						<span className='text-gray-300 mr-1'>{likes}</span>
						<Heart className='mr-1' size={20} />
						{liked ? 'Unlike' : 'Like'}
					</button>
					<button
						onClick={handleToggleComments}
						className={`flex items-center text-gray-100 ${
							activeComments ? 'text-primary' : 'text-gray-300'
						}`}
					>
						<MessageCircle className='mr-1' size={20} />
						Comments
					</button>
				</div>
				{activeComments && (
					<div className='mt-4'>
						<Comments postData={post} onCommentDeleted={handleCommentDeleted} />
					</div>
				)}
			</div>
		</div>
	)
}
