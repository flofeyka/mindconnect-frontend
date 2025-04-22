"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const HeaderHav: React.FC = () => {
  const searchParams = useSearchParams();
  console.log(searchParams.getAll("q"));
  return (
    <nav className="ml-[78px] sm:hidden ">
      <ul className="flex items-center justify-stretch gap-[32px] text-[14px]">
        <li className="opacity-70 hover:opacity-100 transition-opacity w-full">
          <Link href="#home">Главная</Link>
        </li>
        <li className="opacity-70 hover:opacity-100 transition-opacity w-full ">
          <Link href="#problem-solition">Проблема & Решение</Link>
        </li>
        <li className="opacity-70 hover:opacity-100 transition-opacity w-full">
          <Link href="#functional">Функционал</Link>
        </li>
        <li className="opacity-70 hover:opacity-100 transition-opacity w-full">
          <Link href="#contact-us">Связаться с нами</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderHav;
