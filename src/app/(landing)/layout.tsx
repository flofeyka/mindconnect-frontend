import Container from '@/components/Container';
import Logo from '@/components/Logo';
import type { ReactNode } from 'react';

const LandingLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Container>
				<header>
					<Logo />
				</header>
				<main>{children}</main>
			</Container>
			<footer></footer>
		</div>
	);
}

export default LandingLayout;