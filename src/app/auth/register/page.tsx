'use client'

import Icon from '@components/Icon'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import { Button, Input, Link } from '@nextui-org/react'
import { FormikValues, useFormik } from 'formik'
import * as Yup from 'yup'
import InputForm from '@components/InputForm'
import InputCheckBox from '@components/InputCheckBox'
import { signUp } from '@lib/redux/auth/authSlice'
import Vector from '@components/Vector'
import Title from '@components/Title'

function Register() {
	const dispatch = useAppDispatch()
	const formik = useFormik({
		initialValues: {
			fullname: '',
			email: '',
			password: '',
			repeatPassword: '',
		},
		validationSchema: Yup.object().shape({
			email: Yup.string().trim().email().required(),
			firstName: Yup.string().trim().required(),
			password: Yup.string().trim().required().min(8),
			repeatPassword: Yup.string()
				.trim()
				.required()
				.oneOf([Yup.ref('password')], 'Passwords must match'),
		}),
		onSubmit: (values: FormikValues) => {
			const { firstName, email, password } = values
			dispatch(signUp({ firstName, email, password }))
			window.open('/test', '_self')
		},
	})

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className='flex h-[10vh] items-center'>
				<Icon
					path='/icon/auth/logo-sm.svg'
					color='#aaaaaa'
					height='30px'
					width='190px'
				/>
			</div>
			<div className='flex flex-col items-center justify-center'>
				<div className='text-center max-w-[80%] mb-7'>
					<Title>Registration</Title>
					<div className='text-[14px]'>
						If you do not have an account, you can create one in a few clicks
					</div>
				</div>
				<div>
					<div className={'mb-[10px]'}>
						<InputForm
							name='firstName'
							value={formik.values.firstName}
							onChange={formik.handleChange}
							placeholder='Full name'
							type='text'
							InnerIconSrc='/user.svg'
							height='50px'
						/>
					</div>
					<div className={'mb-[10px]'}>
						<InputForm
							name='email'
							value={formik.values.email}
							onChange={formik.handleChange}
							placeholder='Email'
							type='email'
							InnerIconSrc='/email.svg'
							height='50px'
						/>
					</div>
					<div className={'mb-[10px]'}>
						<InputForm
							name='password'
							value={formik.values.password}
							onChange={formik.handleChange}
							placeholder='Password'
							type='password'
							InnerIconSrc='/password.svg'
							height='50px'
						/>
					</div>
					<div className='mb-[10px]'>
						<InputForm
							name='repeatPassword'
							value={formik.values.repeatPassword}
							onChange={formik.handleChange}
							placeholder='Repeat password'
							type='password'
							InnerIconSrc='/password.svg'
							height='50px'
						/>
					</div>
					<div className='mb-[10px]'>
						<InputCheckBox color='success'>
							I agree to the{' '}
							<a
								href='#'
								className='underline decoration-green-600 text-green-600'
							>
								privacy policy
							</a>
						</InputCheckBox>
					</div>
					<div className='flex'>
						<Button onClick={() => window.history.back()}>
							<Vector />
						</Button>
						<Button
							className='w-[225px] text-white font-bold border-green-600 border-1'
							color='success'
							type='submit'
						>
							Create an account
						</Button>
					</div>
					<div className='text-center'>
						Already have an account?{' '}
						<Link href='/auth/login' className={'font-simebold'}>
							{' '}
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</form>
	)
}
