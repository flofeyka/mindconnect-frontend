'use client'

import React, { useEffect, useState } from 'react'
import { X, Upload, Send, RefreshCw } from 'lucide-react'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { addPost } from '@lib/redux/slices/posts/postSlice'
import { useRouter } from 'next/navigation'
import { getAuthUserData } from '@lib/redux/slices/auth/authSlice'

export default function AddPage() {
	const dispatch = useAppDispatch()
	const user = useAppSelector(state => state.Auth.usersData.id)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [image, setImage] = useState<File | null>(null)
	const [photoPreview, setPhotoPreview] = useState<string | null>(null)

	useEffect(() => {
		dispatch(getAuthUserData())
	}, [dispatch])

	const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setImage(file)
			const reader = new FileReader()
			reader.onload = e => {
				setPhotoPreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		}
	}
	const resetPhoto = () => {
		setImage(null)
		setPhotoPreview(null)
	}
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (title && description && image) {
			const postData = { title, description, image }

			dispatch(addPost(postData))
			router.push(`/profile/${user}`)
		} else {
			alert('All fields are required')
		}
	}

	return (
		<div className='max-w-2xl mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Create a New Post</h1>
				<Button onClick={() => console.log('Close clicked')}>
					<X className='h-6 w-6' />
				</Button>
			</div>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='space-y-2'>
					<label htmlFor='photo' className='block text-sm font-medium'>
						Photo
					</label>
					<div className='flex items-center justify-center w-full'>
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
									className='absolute top-2 right-2'
									onClick={resetPhoto}
								>
									<RefreshCw className='w-4 h-4 mr-2' />
									Reset Photo
								</Button>
							</>
						) : (
							<label
								htmlFor='photo-upload'
								className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
							>
								<div className='flex flex-col items-center justify-center pt-5 pb-6'>
									<Upload className='w-8 h-8 mb-4 text-gray-500' />
									<p className='mb-2 text-sm text-gray-500'>
										<span className='font-semibold'>Click to upload</span> or
										drag and drop
									</p>
								</div>
								<input
									id='photo-upload'
									type='file'
									className='hidden'
									onChange={handlePhotoUpload}
									accept='image/*'
								/>
							</label>
						)}
					</div>
				</div>
				<div className='space-y-2'>
					<label htmlFor='title' className='block text-sm font-medium'>
						Title
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
					<label htmlFor='description' className='block text-sm font-medium'>
						Description
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
					<Button type='button' onClick={() => console.log('Cancel clicked')}>
						Cancel
					</Button>
					<Button type='submit'>
						<Send className='w-4 h-4 mr-2' />
						Post
					</Button>
				</div>
			</form>
		</div>
	)
}
