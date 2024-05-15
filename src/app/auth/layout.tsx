import Container from '@components/Container'
import type { ReactNode } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<header>logo</header>
			<main>{children}</main>
		</div>
	)
}

export default AuthLayout
