'use client'

import { formatDate } from '@app/hooks/useFormattedDate'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'
import {
	addComment,
	deleteComment,
	fetchComments,
} from '@lib/redux/slices/posts/postSlice'
import { PostType } from '@lib/types'
import { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter } from '@nextui-org/card'
import { Button, Input } from '@nextui-org/react'
import { Modal, ModalContent, useDisclosure } from '@nextui-org/react'
import { Send } from 'lucide-react'

interface Comment {
	_id: string
	content: string
	createdAt: string
	owner: string
}

interface CommentsProps {
	postData: PostType
	onCommentDeleted: () => void
}

export default function Comments({
	postData,
	onCommentDeleted,
}: CommentsProps) {
	const dispatch = useAppDispatch()
	const currentUserId = useAppSelector(state => state.Auth.usersData.id)
	const [comments, setComments] = useState<any>(postData.comments || [])
	const [comment, setComment] = useState('')
	const [openModalId, setOpenModalId] = useState<string | null>(null)

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	useEffect(() => {
		dispatch(fetchComments(postData._id)).then(action => {
			if (fetchComments.fulfilled.match(action)) {
				setComments(action.payload)
			}
		})
		console.log(postData.owner)
	}, [dispatch, postData._id])

	const handleDeleteComment = (commentId: string) => {
		dispatch(deleteComment({ postId: postData._id, commentId }))
			.then(() => {
				setComments(
					comments.filter((comment: any) => comment._id !== commentId)
				)
				onCommentDeleted()
			})
			.catch(error => {
				console.error('Failed to delete comment:', error)
			})
	}

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault()
		if (comment.trim()) {
			try {
				const newComment = await dispatch(
					addComment({ postId: postData._id, content: comment })
				).unwrap()
				setComment('')
				dispatch(fetchComments(postData._id))
				setComments([...comments, newComment.comment])
			} catch (error) {
				console.error('Failed to add comment:', error)
			}
		}
	}

	return (
		<div>
			<form onSubmit={handleAddComment} className='mt-4 mb-3'>
				<Input
					type='text'
					value={comment}
					variant='bordered'
					onChange={e => setComment(e.target.value)}
					placeholder='Write a comment...'
				/>
				<Button
					type='submit'
					color='primary'
					className='mt-2 text-white p-2 flex items-center'
				>
					<Send size={16} />
					Send
				</Button>
			</form>
			<h3 className='font-semibold mb-2 text-white'>Comments:</h3>
			{comments
				.slice()
				.reverse()
				.map((comment: Comment) => (
					<div key={comment._id}>
						<Card className='mb-3'>
							<CardBody className='flex gap-2'>
								<p className='text-white'>{comment.content}</p>
								<p className='text-sm text-gray-500'>
									{formatDate(comment.createdAt)}
								</p>
							</CardBody>
							{(postData.owner === currentUserId ||
								comment.owner === currentUserId) && (
								<CardFooter>
									<Button
										onPress={() => setOpenModalId(comment._id)}
										className='text-white bg-red-500 px-2 py-1'
									>
										Delete Comment
									</Button>
									<Modal
										isOpen={openModalId === comment._id}
										onOpenChange={isOpen => {
											if (!isOpen) setOpenModalId(null)
										}}
									>
										<ModalContent>
											<Button
												onClick={() => handleDeleteComment(comment._id)}
												className='text-white bg-red-500 px-2 py-1'
											>
												Delete
											</Button>
										</ModalContent>
									</Modal>
								</CardFooter>
							)}
						</Card>
					</div>
				))}
		</div>
	)
}
