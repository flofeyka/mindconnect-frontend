'use client'
import React, { FC } from 'react'
import { useDisclosure } from '@nextui-org/react'
import Image from 'next/image'
import CustomModal from '@components/CustomModal'
import ContentOverModal from './ContentOverModal'
import cn from '@helpers/cn'




const ContentOver: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  return (
    <div className="relative">
      <CustomModal
        title="Contact us"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ContentOverModal />
      </CustomModal>
      <div className="w-full flex h-[216px] rounded-[22px] bg-[url(/images/modal-bg.png)] bg-[#161616]/80 absolute bottom-[-100px]">
        <div className="p-[42px]">
          <button
            onClick={onOpen}
            className={cn(
              'text-[26px] font-semibold mb-[25px] text-left relative',
              "after:content-[''] after:bg-[url(/icons/arrow.svg)] after:inline-block after:w-6 after:h-6 after:absolute after:bottom-[7px] after:ml-1",
              'hover:after:translate-x-2 after:transition-all'
            )}
          >
            Get in touch with us in a <br /> couple of clicks
          </button>
          <div className="flex items-center gap-3 text-[#FFFFFF]/30">
            <p>Suggest an idea</p>
            <div className="w-1 h-1 bg-[#FFFFFF]/30 rounded-3xl"></div>
            <p>Report problems </p>
            <div className="w-1 h-1 bg-[#FFFFFF]/30 rounded-3xl"></div>
            <p>Cooperate with us</p>
          </div>
        </div>
        <div className="h-[180px] mt-auto">
          <Image
            className="h-full"
            width={595}
            height={100}
            alt="content over image"
            src="/images/content-over-bg.png"
          />
        </div>
      </div>
    </div>
  )
}

export default ContentOver
