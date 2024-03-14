import Container from '@/components/Container';
import type { ReactNode } from 'react';

const LandingLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Container>
				<header>gbcz</header>
				<main>{children}</main>
			</Container>
			<footer></footer>
		</div>
	);
}

export default LandingLayout;