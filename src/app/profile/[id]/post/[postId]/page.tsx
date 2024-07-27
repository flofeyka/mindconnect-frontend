'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Provider, LikeButton } from '@lyket/react'
import Link from 'next/link'
import { redirect, useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { fetchPostById } from '@lib/redux/slices/post/onePostslice'
import { fetchDoctorProfileById } from '@lib/redux/slices/doctorprofile/doctorProfileSlice'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import { Heart, MessageCircle, RefreshCw, Send, Upload } from 'lucide-react'
import {
	Button,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Textarea,
} from '@nextui-org/react'
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
	const modalEdit = useDisclosure()

	// from add post
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState<File | null>(null)
	const [photoPreview, setPhotoPreview] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	const handlePhotoUpload = (file: File) => {
		setImage(file)
		const reader = new FileReader()
		reader.onload = e => {
			setPhotoPreview(e.target?.result as string)
		}
		reader.readAsDataURL(file)
	}

	const handleDragEnter = useCallback(
		(e: React.DragEvent<HTMLLabelElement>) => {
			e.preventDefault()
			e.stopPropagation()
			setIsDragging(true)
		},
		[]
	)

	const handleDragLeave = useCallback(
		(e: React.DragEvent<HTMLLabelElement>) => {
			e.preventDefault()
			e.stopPropagation()
			setIsDragging(false)
		},
		[]
	)

	const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handlePhotoUpload(e.dataTransfer.files[0])
		}
	}, [])

	const resetPhoto = () => {
		setImage(null)
		setPhotoPreview(null)
	}

	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (title && description && image) {
			const postData = { title, description, image }

			dispatch(updatePost({ postId: params.postId as string, postData }))
			setTimeout(() => {
				window.location.reload()
			}, 1000)
		} else {
			alert('All fields are required')
		}
	}
	// from add post

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
							<Button onPress={modalEdit.onOpen}>Edit</Button>
							<Modal
								isOpen={modalEdit.isOpen}
								onOpenChange={modalEdit.onOpenChange}
							>
								<ModalContent>
									{onClose => (
										<>
											<ModalHeader className='flex flex-col gap-1'>
												Edit post {post.title}
											</ModalHeader>
											<ModalBody>
												<form onSubmit={handleSubmit} className='space-y-4'>
													<div className='space-y-2'>
														<label
															htmlFor='photo'
															className='block text-sm font-medium'
														>
															Select New Photo
														</label>
														<div className='flex items-center justify-center w-full relative'>
															{photoPreview ? (
																<>
																	<img
																		src={photoPreview}
																		alt='Upload preview'
																		className='max-w-full h-64 object-cover rounded-lg'
																	/>
																	<Button
																		type='button'
																		size='sm'
																		className='absolute top-[-40px] right-2'
																		onClick={resetPhoto}
																	>
																		<RefreshCw className='w-4 h-4 mr-2' />
																		Reset Photo
																	</Button>
																</>
															) : (
																<label
																	htmlFor='photo-upload'
																	className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
																		isDragging
																			? 'border-blue-500 bg-blue-50'
																			: ''
																	}`}
																	onDragEnter={handleDragEnter}
																	onDragLeave={handleDragLeave}
																	onDragOver={handleDragOver}
																	onDrop={handleDrop}
																>
																	<div className='flex flex-col items-center justify-center pt-5 pb-6'>
																		<Upload className='w-8 h-8 mb-4 text-gray-500' />
																		<p className='mb-2 text-sm text-gray-500'>
																			<span className='font-semibold'>
																				Click to upload
																			</span>{' '}
																			or drag and drop
																		</p>
																	</div>
																	<input
																		id='photo-upload'
																		type='file'
																		className='hidden'
																		onChange={e => {
																			if (e.target.files && e.target.files[0]) {
																				handlePhotoUpload(e.target.files[0])
																			}
																		}}
																		accept='image/*'
																	/>
																</label>
															)}
														</div>
													</div>
													<div className='space-y-2'>
														<label
															htmlFor='title'
															className='block text-sm font-medium'
														>
															New Title
														</label>
														<Input
															id='title'
															value={title}
															onChange={e => setTitle(e.target.value)}
															placeholder='Enter post title'
															required
														/>
													</div>
													<div className='space-y-2'>
														<label
															htmlFor='description'
															className='block text-sm font-medium'
														>
															New Description
														</label>
														<Textarea
															id='description'
															value={description}
															onChange={e => setDescription(e.target.value)}
															placeholder='Enter post description'
															rows={4}
															required
														/>
													</div>
													<div className='flex justify-end space-x-2'>
														<Button type='button' onClick={modalEdit.onClose}>
															Cancel
														</Button>
														<Button type='submit'>
															<Send className='w-4 h-4 mr-2' />
															Edit
														</Button>
													</div>
												</form>
											</ModalBody>
										</>
									)}
								</ModalContent>
							</Modal>
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
