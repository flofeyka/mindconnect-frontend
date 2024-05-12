import Link from 'next/link'
import React, { FC } from 'react'

const QuickActions: FC = () => {
  return (
    <div className="flex gap-20 w-[576px] h-[187px]">
      <div className="">
        <h5 className="font-semibold">Overview</h5>
        <ul className="flex flex-col gap-3 text-[14px] opacity-80 mt-[18px]">
          <li>
            <Link href="#">Home</Link>
          </li>
          <li>
            <Link href="#">Problem & Solution</Link>
          </li>
          <li>
            <Link href="#">Functional</Link>
          </li>
          <li>
            <Link href="#">Contact us</Link>
          </li>
        </ul>
      </div>
      <div className="">
        <h5 className="font-semibold">Service</h5>
        <ul className="flex flex-col gap-3 text-[14px] opacity-80 mt-[18px]">
          <li>
            <Link href="#">Dashboard</Link>
          </li>
          <li>
            <Link href="#">Search psychologist</Link>
          </li>
          <li>
            <Link href="#">Communications</Link>
          </li>
          <li>
            <Link href="#">Quick support</Link>
          </li>
          <li>
            <Link href="#">Researches</Link>
          </li>
        </ul>
      </div>
      <div className="">
        <h5 className="font-semibold">Features</h5>
        <ul className="flex flex-col gap-3 text-[14px] opacity-80 mt-[18px]">
          <li>
            <Link href="#">Home</Link>
          </li>
          <li>
            <Link href="#">Problem & Solution</Link>
          </li>
          <li>
            <Link href="#">Functional</Link>
          </li>
          <li>
            <Link href="#">Contact us</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default QuickActions
