"use client";
import Icon from "@components/Icon";
import Logo from "@components/Logo";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner, Tooltip } from "@nextui-org/react";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIcon, setActiveIcon] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  function handleClick(iconId: number) {
    setActiveIcon(iconId);
  }

  function setBorderIcon(iconId: number) {
    if (activeIcon === iconId)
      return "after:content-[''] after:absolute after:h-[200%] after:w-[2px] after:bg-[#1ca66f] after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-[100%]";
  }
  function routerPush(endpoint: string) {
    router.push(endpoint);
  }

  const handleDivClick = async (endpoint: string, number: number) => {
    setIsLoading(true);
    handleClick(number);
    try {
      router.push(endpoint); // Wait for the router to complete the navigation
    } finally {
      setIsLoading(false); // Hide the spinner after navigation
    }
  };

  return (
    <div className="flex h-screen ">
      <div className="bg-[#111111] h-full w-[75px] flex flex-col justify-between items-center py-8 border-[#FFFFFF08] border-r-2 ">
        <button onClick={() => routerPush("/")}>
          <Logo title={false} />
        </button>
        <div className="flex flex-col gap-y-[45px] w-full ">
          <Tooltip content="Dashboard" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                1
              )}`}
              onClick={() => {
                handleDivClick("/dashboard", 1);
              }}
            >
              {isLoading && (
                <Spinner color="primary" size="lg" className="absolute" />
              )}
              <Icon
                path="/icons/main-dashboard.svg"
                color={`${activeIcon === 1 ? "#1ca66f" : "#ffffff"}`}
              />
            </div>
          </Tooltip>
          <Tooltip content="Ai chat" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                2
              )}`}
              onClick={() => {
                handleDivClick("/dashboard/ai", 2);
              }}
            >
              {isLoading && (
                <Spinner color="primary" size="lg" className="absolute" />
              )}
              <Icon
                path="/bot.svg"
                className="cursor-pointer"
                color={`${activeIcon === 2 ? "#1ca66f" : "#ffffff"}`}
              />
            </div>
          </Tooltip>
          <Tooltip content="Doctors Search" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                3
              )}`}
              onClick={() => {
                handleClick(3);
                routerPush("/dashboard/doctors");
                return <Spinner />;
              }}
            >
              <Icon
                path="/user-search.svg"
                className="cursor-pointer"
                color={`${activeIcon === 3 ? "#1ca66f" : "#ffffff"}`}
              />
            </div>
          </Tooltip>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              4
            )}`}
            onClick={() => handleClick(4)}
          >
            <Icon
              path="/icons/stack.svg"
              className="cursor-pointer"
              color={`${activeIcon === 4 ? "#1ca66f" : "#ffffff"}`}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-[45px] w-full">
          <Tooltip content="Go to fast connect" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                5
              )}`}
              onClick={() => {
                handleClick(5);
                routerPush("/fast-connect");
                return <Spinner />;
              }}
            >
              <Icon
                path="/icons/energy.svg"
                className="cursor-pointer"
                color={`${activeIcon === 5 ? "#1ca66f" : "#ffffff"}`}
              />
            </div>
          </Tooltip>
          <div
            className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
              6
            )}`}
            onClick={() => handleClick(6)}
          >
            <Icon
              path="/icons/radiation.svg"
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
              path="/icons/settings.svg"
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
