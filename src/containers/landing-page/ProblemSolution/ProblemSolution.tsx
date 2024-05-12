import Icon from '@components/Icon'
import Title from '@components/Title'

import React, { FC } from 'react'
import ProblemData from '../../../data/ProblemData'

const ProblemSolution: FC = () => {
  return (
    <div className="mt-[110px]">
      <Title>Problem & Solution</Title>
      <div className="flex justify-between pt-[55px]">
        <div className="">
          {ProblemData.map((data, i) => (
            <div
              key={i}
              className="mb-[40px]"
            >
              <button className="flex text-[18px] items-center gap-2 font-semibold">
                {data.title}
                <Icon
                  width="20px"
                  height="20px"
                  path="/icons/arrow.svg"
                />
              </button>
              <p className="w-[480px] text-[14px] mt-4 opacity-70">
                {data.text}
              </p>
            </div>
          ))}
        </div>
        <div className="w-[2px] h-[55vh] bg-white/30 relative">
          <div className="w-[2px] h-[10vh] bg-primary absolute flex flex-col items-center justify-center after:content-[''] after:bg-primary after:w-[20px] after:h-[20px] after:blur-2xl after:block "></div>
        </div>
        <div className="gradient w-[580px] h-full rounded-[22px] p-[1px]">
          <div className="bg-[#141414] rounded-[22px] p-[22px] ">
            <h5 className="16px font-semibold">
              I've opened a door here that I regret
            </h5>
            <p className="w-[480px] text-[14px] opacity-60">
              That's what it said on 'Ask Jeeves.' Did you enjoy your meal, Mom?
              You drank it fast enough.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemSolution
