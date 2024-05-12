import { cn } from '@nextui-org/react'
import React, { type FC } from 'react'


interface TitleProps {
  children: string
  size?: number
}

const Title: FC<TitleProps> = ({ children, size }) => {
  return (
    <>
      <div
        style={{fontSize: size}}
        className={cn('text-gradient', 'font-semibold text-[26px]')}
      >
        {children}
      </div>
    </>
  )
}

export default Title
