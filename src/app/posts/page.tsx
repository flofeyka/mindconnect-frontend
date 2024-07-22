'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@lib/redux/store'
import {
	fetchPosts,
	addPost,
	updatePost,
	deletePost,
	likePost,
	unlikePost,
	addComment,
	fetchComments,
} from '../../lib/redux/slices/posts/postSlice'
import Comments from '@components/Posts/Comments'

interface Comment {
	_id: string
	content: string
	owner: string
}

interface Post {
	_id: string
	title: string
	description: string
	image?: string
	likes: string[]
	comments: Comment[]
}

const PostsPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { posts, loading, error } = useSelector(
		(state: RootState) => state.posts
	)

	const [newPost, setNewPost] = useState({
		title: '',
		description: '',
		image: null as File | null,
	})
	const [editingPost, setEditingPost] = useState<{
		id: string
		title: string
		description: string
	} | null>(null)
	const [newComment, setNewComment] = useState('')
	const [activeComments, setActiveComments] = useState<string | null>(null)

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch])

	const handleAddPost = async (e: React.FormEvent) => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('title', newPost.title)
		formData.append('description', newPost.description)
		if (newPost.image) {
			formData.append('image', newPost.image)
		}
		try {
			await dispatch(addPost(formData)).unwrap()
			setNewPost({ title: '', description: '', image: null })
			dispatch(fetchPosts())
		} catch (error) {
			console.error('Failed to add post:', error)
		}
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

	const handleLikeUnlike = (postId: string, isLiked: boolean) => {
		if (isLiked) {
			dispatch(unlikePost(postId))
		} else {
			dispatch(likePost(postId))
		}
	}

	const handleAddComment = async (postId: string) => {
		if (newComment.trim()) {
			try {
				await dispatch(addComment({ postId, content: newComment })).unwrap()
				setNewComment('')
				dispatch(fetchComments(postId))
			} catch (error) {
				console.error('Failed to add comment:', error)
			}
		}
	}

	const toggleComments = (postId: string) => {
		if (activeComments === postId) {
			setActiveComments(null)
		} else {
			setActiveComments(postId)
			dispatch(fetchComments(postId))
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setNewPost({ ...newPost, image: e.target.files[0] })
		}
	}

	if (loading === 'pending') return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-bold mb-4'>Posts</h1>

			{/* Add New Post Form */}
			<form onSubmit={handleAddPost} className='mb-8'>
				<input
					type='text'
					placeholder='Title'
					value={newPost.title}
					onChange={e => setNewPost({ ...newPost, title: e.target.value })}
					className='w-full p-2 mb-2 border rounded'
				/>
				<textarea
					placeholder='Description'
					value={newPost.description}
					onChange={e =>
						setNewPost({ ...newPost, description: e.target.value })
					}
					className='w-full p-2 mb-2 border rounded'
				/>
				<input
					type='file'
					accept='image/*'
					onChange={handleFileChange}
					className='mb-2'
				/>
				<button type='submit' className='bg-blue-500 text-white p-2 rounded'>
					Add Post
				</button>
			</form>

			{/* Posts List */}
			<div>
				{posts.map(post => (
					<div key={post._id} className='border p-4 mb-4 rounded'>
						{editingPost && editingPost.id === post._id ? (
							<form onSubmit={handleUpdatePost}>
								<input
									type='text'
									value={editingPost.title}
									onChange={e =>
										setEditingPost({ ...editingPost, title: e.target.value })
									}
									className='w-full p-2 mb-2 border rounded'
								/>
								<textarea
									value={editingPost.description}
									onChange={e =>
										setEditingPost({
											...editingPost,
											description: e.target.value,
										})
									}
									className='w-full p-2 mb-2 border rounded'
								/>
								<button
									type='submit'
									className='bg-green-500 text-white p-2 rounded mr-2'
								>
									Save
								</button>
								<button
									onClick={() => setEditingPost(null)}
									className='bg-gray-500 text-white p-2 rounded'
								>
									Cancel
								</button>
							</form>
						) : (
							<>
								<h2 className='text-xl font-bold'>{post.title}</h2>
								<p>{post.description}</p>
								{post.image && (
									<img
										src={post.image}
										alt={post.title}
										className='mt-2 max-w-full h-auto'
									/>
								)}
								<div className='mt-2'>
									<button
										onClick={() =>
											handleLikeUnlike(
												post._id,
												post.likes?.includes('user-id') || false
											)
										}
										className='bg-blue-500 text-white p-2 rounded mr-2'
									>
										{post.likes?.includes('user-id') ? 'Unlike' : 'Like'} (
										{post.likes?.length || 0})
									</button>
									<button
										onClick={() =>
											setEditingPost({
												id: post._id,
												title: post.title,
												description: post.description || '',
											})
										}
										className='bg-yellow-500 text-white p-2 rounded mr-2'
									>
										Edit
									</button>
									<button
										onClick={() => handleDeletePost(post._id)}
										className='bg-red-500 text-white p-2 rounded mr-2'
									>
										Delete
									</button>
									<button
										onClick={() => toggleComments(post._id)}
										className='bg-purple-500 text-white p-2 rounded'
									>
										{activeComments === post._id
											? 'Hide Comments'
											: 'Show Comments'}
									</button>
								</div>
								{activeComments === post._id && (
									<div className='mt-4'>
										<h3 className='font-bold'>Comments:</h3>
										<Comments postData={post}/>
										<div className='mt-2'>
											<input
												type='text'
												value={newComment}
												onChange={e => setNewComment(e.target.value)}
												placeholder='Add a comment'
												className='w-full p-2 border rounded'
											/>
											<button
												onClick={() => handleAddComment(post._id)}
												className='mt-2 bg-green-500 text-white p-2 rounded'
											>
												Add Comment
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default PostsPage
