import Link from "next/link";
import React, { FC } from "react";

const QuickActions: FC = () => {
  return (
    <div className="flex sm:flex-col sm:w-full gap-20 w-[576px] h-[187px]">
      <div className="">
        <h5 className="font-semibold">Обзор</h5>
        <ul className="flex flex-col gap-3 text-[14px] opacity-80 mt-[18px]">
          <li>
            <Link href="#">Главная</Link>
          </li>
          <li>
            <Link href="#">Проблема & Решение</Link>
          </li>
          <li>
            <Link href="#">Функционал</Link>
          </li>
          <li>
            <Link href="#">Связаться с нами</Link>
          </li>
        </ul>
      </div>
      <div className="">
        <h5 className="font-semibold">Сервис</h5>
        <ul className="flex flex-col gap-3 text-[14px] opacity-80 mt-[18px]">
          <li>
            <Link href="/dashboard">Дашборд</Link>
          </li>
          <li>
            <Link href="#">Поиск психолога</Link>
          </li>
          <li>
            <Link href="#">Коммуникации</Link>
          </li>
          <li>
            <Link href="/fast-quick">Быстрая поддержка</Link>
          </li>
          <li>
            <Link href="#">Исследования</Link>
          </li>
        </ul>
      </div>
      <div className="">
        <h5 className="font-semibold">Особенности</h5>
        <ul className="flex flex-col gap-3 text-[14px] opacity-80 mt-[18px]">
          <li>
            <Link href="#">Главная</Link>
          </li>
          <li>
            <Link href="#">Проблема & Решение</Link>
          </li>
          <li>
            <Link href="#">Функционал</Link>
          </li>
          <li>
            <Link href="#">Связаться с нами</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuickActions;
