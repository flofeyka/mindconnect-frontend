'use client'

import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { getPublicDoctorDetails } from '@lib/redux/slices/doctordetails/doctorDetailsSlice'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function DoctorDetails() {
	const params = useParams()
	const doctorId = params.doctorId
	const dispatch = useAppDispatch()
	const doctorProfile = useAppSelector(state => state.doctorDetails.profile)

	useEffect(() => {
		dispatch(getPublicDoctorDetails(doctorId as string))
	}, [dispatch, doctorId])

	console.log(doctorProfile)

	return (
		<div className='max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden'>
			<div className='p-6'>
				<div className='flex flex-col sm:flex-row'>
					<div className='sm:w-1/4 mb-4 sm:mb-0'>
						<img
							src={doctorProfile?.image as any}
							alt={`Dr. ${doctorProfile?.firstName} ${doctorProfile?.lastName}`}
							className='w-32 h-32 rounded-full object-cover border-4 border-blue-500'
						/>
					</div>
					<div className='sm:w-3/4 sm:pl-6'>
						<h3 className='text-2xl font-bold mb-2'>
							Dr. {doctorProfile?.firstName} {doctorProfile?.lastName}
						</h3>
						<div className='flex flex-wrap mb-2'>
							<span className='text-sm text-gray-600 mr-4'>
								{doctorProfile?.typeOfConsultation.join(', ')}
							</span>
							<span className='text-sm text-gray-600'>
								{doctorProfile?.yearsOfExperience}+ Years of Experience
							</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
							<div
								className='bg-blue-600 h-2.5 rounded-full'
								style={{
									width: `${Math.min(
										doctorProfile?.yearsOfExperience as any,
										100
									)}%`,
								}}
							></div>
						</div>
					</div>
				</div>

				<p className='mt-4 mb-6'>{doctorProfile?.aboutMe}</p>

				<div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
					<div>
						<h4 className='font-bold mb-2'>Fields of Expertise</h4>
						<ul className='list-disc pl-5'>
							{doctorProfile?.fieldsOfProblems.map((field, index) => (
								<li key={index}>{field}</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className='font-bold mb-2'>Languages Spoken</h4>
						<ul className='list-disc pl-5'>
							{doctorProfile?.languages.map((language, index) => (
								<li key={index}>{language}</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className='font-bold mb-2'>Location</h4>
						<p>
							{doctorProfile?.city}, {doctorProfile?.country}
						</p>
					</div>
				</div>
			</div>

			<div className='bg-gray-100 px-6 py-4'>
				<div className='flex justify-between items-center'>
					<span className='text-lg font-semibold'>
						Consultation Fee: {doctorProfile?.priceOneHour.currency}{' '}
						{doctorProfile?.priceOneHour.price} per hour
					</span>
					<button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
						Book Appointment
					</button>
				</div>
			</div>
		</div>
	)
}
