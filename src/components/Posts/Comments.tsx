'use client'

import { useAppDispatch } from '@lib/redux/hooks'
import { fetchComments } from '@lib/redux/slices/posts/postSlice'
import { PostType } from '@lib/types'
import { useEffect } from 'react'

export default function Comments({ postData }: { postData: PostType }) {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(fetchComments(postData._id))
	}, [dispatch])

	return (
		<div>
			{postData.comments?.map((comment: any) => {
				console.log(comment)
				return (
					<li key={comment._id} className='bg-gray-100 p-2 mt-2 rounded'>
						<p>{comment.content}</p>
					</li>
				)
			})}
		</div>
	)
}
