import cn from '@helpers/cn'
import React, { FC } from 'react'

const FunctionalCard: FC = () => {
	return (
		<div className='mt-[105px]'>
			<div className='flex gap-6 mb-5'>
				<div
					className={cn(
						'bg-[url(/images/psychologists-bg.png)] bg-cover bg-no-repeat',
						'w-[780px] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex '
					)}
				>
					<div className='p-[42px]'>
						<h4 className='font-semibold text-[18px] text-[#EBEBEB]'>
							Psychologists
						</h4>
						<p className='w-[413px] text-[14px] mt-[12px] opacity-80 '>
							Our psychologists are educated specialists in various fields of
							psychology, they are the ones who will really be able to solve
							your problems
						</p>
					</div>
					<img
						className='w-[211px] h-[196px] mt-10'
						src='/images/psychologists.png'
						alt=''
					/>
				</div>

				<div className='bg-[url(/images/anonymous-bg.png)] bg-cover bg-no-repeat bg-center w-[380px] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex '>
					<div className='p-[42px]'>
						<h4 className='font-semibold text-[18px] text-[#EBEBEB]'>
							Conference function
						</h4>
						<p className='w-[296px] text-[14px] mt-[12px] opacity-80 mb-5'>
							Set appointments with your doctor
						</p>
						<img
							className='w-[296px] h-[133px]'
							src='/images/anonymous.png'
							alt=''
						/>
					</div>
				</div>
			</div>
			<div className='flex gap-6'>
				<div className='bg-[url(/images/ai-bg.png)] bg-cover bg-no-repeat bg-center w-[380px] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex '>
					<div className='p-[42px]'>
						<h4 className='font-semibold text-[18px] text-[#EBEBEB]'>
							AI Assistant
						</h4>
						<p className='w-[296px] text-[14px] mt-[12px] opacity-80 mb-5'>
							Find answers on whatever questions
						</p>
						<img
							className='w-[296px] h-[133px]'
							src='/images/chat.png'
							alt=''
						/>
					</div>
				</div>

				<div
					className={cn(
						'bg-[url(/images/support-bg.png)] bg-cover bg-no-repeat',
						'w-[780px] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex '
					)}
				>
					<div className='p-[42px]'>
						<h4 className='font-semibold text-[18px] text-[#EBEBEB]'>
							Quick support
						</h4>
						<p className='w-[413px] text-[14px] mt-[12px] opacity-80 '>
							Quick support is available for everyone free of charge for 15 or
							more minutes talk with a specialist, who will support and help you
							in emergecy situation
						</p>
					</div>
					<img
						className='w-[172px] h-[202px] mt-10'
						src='/images/suppurt.png'
						alt=''
					/>
				</div>
			</div>
		</div>
	)
}

export default FunctionalCard
