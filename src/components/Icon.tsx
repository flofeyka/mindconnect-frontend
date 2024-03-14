import cm from '@/helpers/classMerge';
import type { FC } from 'react';

interface IconProps {
	width: string;
	height: string;
	color?: string;
	path: string;
}

const Icon: FC<IconProps> = ({ 
	width,
	height,
  color = '#FFFFFF',
  path
}) => {
	return (
		<div 
			className={cm(`icon`, color.charAt(0) !== '#' ? color : '')}
			style={{ 
				maskImage: `url("${path}")`,
				backgroundColor: color.charAt(0) === '#' ? color : '',
				width, 
				height
			}}
		></div>
	);
}

export default Icon;