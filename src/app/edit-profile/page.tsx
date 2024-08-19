'use client'

import DoctorInput from '@components/EditProfile/DoctorInput'
import DoctorMultipleSelect from '@components/EditProfile/DoctorMultipleSelect'
import DoctorTextArea from '@components/EditProfile/DoctorTextArea'
import PhotoUpload from '@components/EditProfile/PhotoUpload'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import {
	DoctorProfile,
	getDoctorDetails,
	PriceOneHour,
	updateDoctorProfile,
} from '@lib/redux/slices/doctordetails/doctorDetailsSlice'
import { useEffect, useState } from 'react'
import {
	consultTypes,
	currencies,
	fieldsOfproblems,
	languages,
} from '../../data/types'
import { Button, Input } from '@nextui-org/react'
import DoctorSingleSelect from '@components/EditProfile/DoctorSingleSelect'
import DoctorCalendar from '@components/DoctorDetails/DoctorCalendar'

export default function EditProfile() {
	const dispatch = useAppDispatch()
	const doctor = useAppSelector(state => state.doctorDetails.profile)

	useEffect(() => {
		dispatch(getDoctorDetails())
	}, [dispatch])

	const [formData, setFormData] = useState<Partial<DoctorProfile>>({})
	const [image, setImage] = useState<File | null>(null)

	useEffect(() => {
		if (doctor) {
			setFormData(doctor)
		}
	}, [doctor])

	const handleImageChange = (newImage: File | null) => {
		setImage(newImage)
		setFormData((prevData: Partial<DoctorProfile>) => ({
			...prevData,
			image: newImage || undefined,
		}))
	}

	const handleInputChange = (field: keyof DoctorProfile) => (value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const handleSelectChange =
		(field: keyof DoctorProfile) => (value: string[]) => {
			setFormData(prev => ({ ...prev, [field]: value }))
		}

	const handlePriceInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			priceOneHour: {
				...prev.priceOneHour,
				price: value,
				currency: prev.priceOneHour?.currency || '', // Ensure currency is always a string
			},
		}))
	}

	const handleSingleSelectChange =
		(field: 'priceOneHour') => (value: string) => {
			setFormData((prev: Partial<DoctorProfile>) => ({
				...prev,
				[field]: {
					...prev[field],
					currency: value,
				} as PriceOneHour,
			}))
		}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log(formData)
		dispatch(updateDoctorProfile(formData))
	}
	console.log(doctor?.id)

	return (
		<>
		<form onSubmit={handleSubmit}>
			<PhotoUpload image={image} onImageChange={handleImageChange} />
			<DoctorInput
				id='firstName'
				name='firstName'
				value={formData.firstName || ''}
				onChange={handleInputChange('firstName')}
				label='First Name'
			/>
			<DoctorInput
				id='lastName'
				name='lastName'
				value={formData.lastName || ''}
				onChange={handleInputChange('lastName')}
				label='Last Name'
			/>
			<DoctorInput
				id='age'
				name='age'
				value={(formData.age as any) || ''}
				onChange={handleInputChange('age')}
				label='Your Age'
			/>
			<DoctorTextArea
				id='description'
				name='description'
				value={formData.description || ''}
				onChange={handleInputChange('description')}
				label='Profile Short description'
			/>
			<DoctorTextArea
				id='aboutme'
				name='aboutme'
				value={formData.aboutMe || ''}
				onChange={handleInputChange('aboutMe')}
				label='About Me'
			/>
			<DoctorInput
				id='phoneNumber'
				name='phoneNumber'
				value={(formData.phoneNumber as any) || ''}
				onChange={handleInputChange('phoneNumber')}
				label='Your Phone Number'
			/>
			<DoctorMultipleSelect
				label='Type of Consultation'
				placeholder='Select types'
				options={consultTypes}
				value={formData.typeOfConsultation || []}
				onChange={handleSelectChange('typeOfConsultation')}
			/>
			<DoctorMultipleSelect
				label='Fields of Problems'
				placeholder='Select Fields'
				options={fieldsOfproblems}
				value={formData.fieldsOfProblems || []}
				onChange={handleSelectChange('fieldsOfProblems')}
				className='max-w-[700px]'
			/>
			<div className='flex gap-4'>
				<Input
					type='number'
					id='Price'
					name='Price'
					value={formData.priceOneHour?.price || ''}
					onChange={handlePriceInputChange}
					label='Price'
					className='max-w-72 mb-4'
				/>
				<DoctorSingleSelect
					label='Choose your currency'
					placeholder='Choose a currency'
					options={currencies}
					value={formData.priceOneHour?.currency || ''}
					onChange={handleSingleSelectChange('priceOneHour')}
				/>
			</div>
			<DoctorMultipleSelect
				label='Languages'
				placeholder='Select languages'
				options={languages}
				value={formData.languages || []}
				onChange={handleSelectChange('languages')}
			/>
			<DoctorInput
				id='country'
				name='country'
				value={formData.country || ''}
				onChange={handleInputChange('country')}
				label='Country'
			/>
			<DoctorInput
				id='city'
				name='city'
				value={formData.city || ''}
				onChange={handleInputChange('city')}
				label='City'
			/>
			<DoctorInput
				id='yearsOfExperience'
				name='yearsOfExperience'
				value={(formData.yearsOfExperience as any) || ''}
				onChange={handleInputChange('yearsOfExperience')}
				label='Years Of Experience'
			/>
			<DoctorInput
				id='gender'
				name='gender'
				value={formData.gender || ''}
				onChange={handleInputChange('gender')}
				label='Your Gender'
			/>
			<Button type='submit' color='primary' className=''>
				Save Changes
			</Button>
		</form>
		<DoctorCalendar doctorId={doctor?.id as string} />
		</>
	)
}
