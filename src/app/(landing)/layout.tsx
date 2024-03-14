import Container from '@/components/Container';
import Logo from '@/components/Logo';
import type { ReactNode } from 'react';

const LandingLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Container>
				<header>
					Header
				</header>
				<main>{children}</main>
			</Container>
			<footer>Footer</footer>
		</div>
	);
}

export default LandingLayout;