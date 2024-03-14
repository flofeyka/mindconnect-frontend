import type { FC, ReactNode } from 'react';

interface ContainerProps {
	children: ReactNode;
	width?: string;
}

const Container: FC<ContainerProps> = ({ 
	children, 
	width = '1180px'
}) => {
	return (
		<div className={`max-w-[${width}px] mx-auto`}>
			{children}
		</div>
	);
}

export default Container;