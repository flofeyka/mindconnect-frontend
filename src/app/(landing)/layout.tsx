import Container from '@components/Container'
import CustomButton from '@components/CustomButton'
import Icon from '@components/Icon'
import Logo from '@components/Logo'
import HeaderHav from '@containers/landing-page/header/HeaderNav'
import TotalVolunteers from '@containers/landing-page/header/TotalVolunteers'
import Link from 'next/link'
import type { ReactNode } from 'react'
import LandingPage from './page'
import QuickActions from '@containers/landing-page/footer/QuickActions'
import FooterBottom from '@containers/landing-page/footer/FooterBottom'
import ContentOver from '@containers/landing-page/content-over/ContentOver'
import LogoutButton from '@components/LogoutButton'

const LandingLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Container>
				<header className='flex items-center  h-[104px]'>
					<Link href={`/`}>
						<Logo />
					</Link>
					<HeaderHav />
					<div className='flex gap-4 items-center ml-auto'>
						<TotalVolunteers />
						<Link href={'/fast-connect'}>
							<CustomButton
								color='default'
								startContent={
									<Icon
										width='16px'
										height='17px'
										path='icons/quick-support.svg'
									/>
								}
							>
								Quick support
							</CustomButton>
						</Link>
						<Link href={'/auth/login'}>
							<CustomButton color='primary'>Sign in</CustomButton>
						</Link>
					</div>
				</header>
				<LogoutButton />
				<main>
					<LandingPage />
				</main>
			</Container>
			<footer className='bg-[url(/images/footer-bg.png)] h-[497px]'>
				<Container>
					<ContentOver />
					<div className='flex flex-col pt-[150px]'>
						<div className='wrapper flex justify-between'>
							<div className=''>
								<Logo />
								<p className='w-[270px] mt-[18px] text-[14px] text-[#FFFFFF]/80'>
									Start working on your mental health with our app.
								</p>
							</div>
							<div className=''>
								<QuickActions />
							</div>
						</div>
						<FooterBottom />
					</div>
				</Container>
			</footer>
		</div>
	)
}

export default LandingLayout
