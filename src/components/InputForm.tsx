import { Input } from '@nextui-org/react'
import Icon from './Icon'
import React, { HTMLAttributes, HTMLProps } from 'react'

interface Props extends React.PropsWithChildren<any> {
	name: string
	width?: string | undefined
	height: string | undefined
	InnerIconSrc: string
	InnerIconWidth?: string
	InnerIconHeight?: string
}

export default function InputForm({
	name,
	InnerIconSrc = '',
	InnerIconWidth = '',
	InnerIconHeight,
	width = '100%',
	height = '',
	placeholder,
	...props
}: Props) {
	return (
		<div>
			<Input
				classNames={{
					base: `w-[${width}] h-[${height}]`,
					inputWrapper: 'bg-[#222]',
				}}
				name={name}
				isRequired
				placeholder={placeholder}
				startContent={
					<Icon
						width={InnerIconWidth}
						height={InnerIconHeight}
						path={InnerIconSrc}
					/>
				}
				{...props}
			/>
		</div>
	)
}
