'use client'
import Link from 'next/link'
import {  useSearchParams } from 'next/navigation'

const HeaderHav: React.FC = () => {
  const searchParams = useSearchParams()
  console.log(searchParams.getAll('q'))
  return (
    <nav className="ml-[78px]">
      <ul className="flex items-center gap-[32px] text-[14px]">
        <li className="opacity-70 hover:opacity-100 transition-opacity">
          <Link href="#home">Home</Link>
        </li>
        <li className="opacity-70 hover:opacity-100 transition-opacity">
          <Link href="#problem-solition">Problem & Solution</Link>
        </li>
        <li className="opacity-70 hover:opacity-100 transition-opacity">
          <Link href="#functional">Functional</Link>
        </li>
        <li className="opacity-70 hover:opacity-100 transition-opacity">
          <Link href="#contact-us">Contact us</Link>
        </li>
      </ul>
    </nav>
  )
}

export default HeaderHav
