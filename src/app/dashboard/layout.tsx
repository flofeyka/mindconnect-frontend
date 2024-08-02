"use client";
import Icon from "@components/Icon";
import Logo from "@components/Logo";
import Link from "next/link";
import React, { useState } from "react";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIcon, setActiveIcon] = useState(1);

  function handleClick(iconId: number) {
    setActiveIcon(iconId);
  }

  function setBorderIcon(iconId: number) {
    if (activeIcon === iconId)
      return "after:content-[''] after:absolute after:h-[200%] after:w-[2px] after:bg-[#1ca66f] after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-[100%]";
  }

  return (
    <div className="flex h-screen ">
      <div className="bg-[#111111] h-full w-[75px] flex flex-col justify-between items-center py-8 border-[#FFFFFF08] border-r-2 ">
        <Logo title={false} />
        <div className="flex flex-col gap-y-[45px] w-full ">
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              1
            )}`}
            onClick={() => handleClick(1)}
          >
            <Link href="/dashboard/">
              <Icon
                path="icons/main-dashboard.svg"
                color={`${activeIcon === 1 ? "#1ca66f" : "#ffffff"}`}
              />
            </Link>
          </div>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              2
            )}`}
            onClick={() => handleClick(2)}
          >
            <Link href="/dashboard/ai">
              <Icon
                path="icons/play.svg"
                className="cursor-pointer"
                color={`${activeIcon === 2 ? "#1ca66f" : "#ffffff"}`}
              />
            </Link>
          </div>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              3
            )}`}
            onClick={() => handleClick(3)}
          >
            <Icon
              path="icons/gift.svg"
              className="cursor-pointer"
              color={`${activeIcon === 3 ? "#1ca66f" : "#ffffff"}`}
            />
          </div>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              4
            )}`}
            onClick={() => handleClick(4)}
          >
            <Icon
              path="icons/stack.svg"
              className="cursor-pointer"
              color={`${activeIcon === 4 ? "#1ca66f" : "#ffffff"}`}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-[45px] w-full">
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              5
            )}`}
            onClick={() => handleClick(5)}
          >
            <Icon
              path="icons/energy.svg"
              className="cursor-pointer"
              color={`${activeIcon === 5 ? "#1ca66f" : "#ffffff"}`}
            />
          </div>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              6
            )}`}
            onClick={() => handleClick(6)}
          >
            <Icon
              path="icons/radiation.svg"
              className="cursor-pointer"
              color={`${activeIcon === 6 ? "#1ca66f" : "#ffffff"}`}
            />
          </div>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              7
            )}`}
            onClick={() => handleClick(7)}
          >
            <Icon
              path="icons/settings.svg"
              className="cursor-pointer"
              color={`${activeIcon === 7 ? "#1ca66f" : "#ffffff"}`}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#111] w-full">{children}</div>
    </div>
  );
}
