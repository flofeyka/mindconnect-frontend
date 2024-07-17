'use client'

import React, { FC, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@components/Icon'
import Title from '@components/Title'
import ProblemData from '../../../data/ProblemData'

const ProblemSolution: FC = () => {
	const [selected, setSelected] = useState<number | null>(0)

	return (
		<div className='mt-[110px]'>
			<Title>Problem & Solution</Title>
			<div className='flex justify-between pt-[55px]'>
				<div>
					{ProblemData.map((data, i) => (
						<div key={i} className='mb-[40px]'>
							<button
								className={`flex text-[18px] items-center gap-2 font-semibold transition duration-400 ${
									selected === i ? 'text-primary' : ''
								}`}
								onClick={() => setSelected(i)}
							>
								{data.title}
								<Icon
									color={selected === i ? '#1CA66F' : undefined}
									width='20px'
									height='20px'
									path='/icons/arrow.svg'
								/>
							</button>
							<p className={`w-[480px] text-[14px] mt-4 opacity-70`}>
								{data.text}
							</p>
						</div>
					))}
				</div>
				<div className='w-[2px] h-[460px] bg-white/30 relative'>
					<motion.div
						className="w-[2px] h-[115px] bg-primary absolute flex flex-col items-center justify-center after:content-[''] after:bg-primary after:w-[20px] after:h-[20px] after:blur-2xl after:block"
						initial={{ y: 0 }}
						animate={{ y: selected !== null ? selected * 115 : 0 }}
						transition={{ type: 'spring', damping: 40 }}
					/>
				</div>
				<motion.div
					className='gradient w-[580px] h-full rounded-[22px] p-[1px]'
					initial={{ y: 0 }}
					animate={{ y: selected !== null ? selected * 115 : 0 }}
					transition={{ type: 'spring', damping: 40 }}
				>
					<div className='bg-[#141414] rounded-[22px] p-[22px]'>
						<AnimatePresence mode='wait'>
							{selected !== null && (
								<motion.div
									key={selected}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.4 }}
								>
									<h5 className='text-[16px] font-semibold'>
										{ProblemData[selected].answerTitle}
									</h5>
									<p className='w-[480px] text-[14px] opacity-60'>
										{ProblemData[selected].answerText}
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default ProblemSolution
