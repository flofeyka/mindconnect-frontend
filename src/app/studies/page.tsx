import { Input } from '@nextui-org/react'
import { SearchIcon } from '@components/SearchIcon'
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Link,
	Image,
} from '@nextui-org/react'

export default function Studies() {
	return (
		<div>
			<Input
				label='Search'
				isClearable
				radius='lg'
				classNames={{
					label: 'text-black/50 dark:text-white/90',
					input: [
						'bg-transparent',
						'text-black/90 dark:text-white/90',
						'placeholder:text-default-700/50 dark:placeholder:text-white/60',
					],
					innerWrapper: 'bg-transparent',
					inputWrapper: [
						'shadow-xl',
						'bg-default-200/50',
						'dark:bg-default/60',
						'backdrop-blur-xl',
						'backdrop-saturate-200',
						'hover:bg-default-200/70',
						'dark:hover:bg-default/70',
						'group-data-[focus=true]:bg-default-200/50',
						'dark:group-data-[focus=true]:bg-default/60',
						'!cursor-text',
					],
				}}
				placeholder='Type to search...'
				startContent={
					<SearchIcon className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0' />
				}
			/>
			<Card className='max-w-[400px]'>
				<CardHeader className='flex gap-3'>
					<Image
						alt='nextui logo'
						height={40}
						radius='sm'
						src='https://avatars.githubusercontent.com/u/86160567?s=200&v=4'
						width={40}
					/>
					<div className='flex flex-col'>
						<p className='text-md'>NextUI</p>
						<p className='text-small text-default-500'>nextui.org</p>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<p>Make beautiful websites regardless of your design experience.</p>
				</CardBody>
				<Divider />
				<CardFooter>
					<Link
						isExternal
						showAnchorIcon
						href='https://github.com/nextui-org/nextui'
					>
						Visit source code on GitHub.
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
