"use client";
import Icon from "@components/Icon";
import Logo from "@components/Logo";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Spinner, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import Loading from "./loading";
import { MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIcon, setActiveIcon] = useState(Number);
  const [isLoading, setIsLoading] = useState(false);
  const [path, setPath] = useState("dashboard");
  const router = useRouter();
  const pathname = usePathname();
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
  useEffect(() => {
    router.prefetch("/dashboard/doctors");
    router.prefetch("/dashboard/ai");
    router.prefetch("/dashboard/chat");
  }, [router]);

  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveIcon(1);
    } else if (pathname === "/dashboard/doctors") {
      setActiveIcon(3);
    } else if (pathname === "/dashboard/ai") {
      setActiveIcon(2);
    } else if (pathname === "/dashboard/chat") {
      setActiveIcon(4);
    }
  }, [pathname]);

  const { isAuth, isPending } = useAppSelector((state) => state.Auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
      if (!isAuth && !isPending) {
        redirect("/auth/login");
      }

  }, []);

  return (
    <div className="flex min-h-screen relative ">
      <div className="bg-[#111111] h-screen w-[75px] fixed flex flex-col justify-between items-center py-8 border-[#FFFFFF08] border-r-2 ">
        <button onClick={() => routerPush("/")}>
          <Logo title={false} />
        </button>
        <div className="flex flex-col gap-y-[45px] w-full ">
          <Tooltip content="Дашборд" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                1
              )}`}
              onClick={() => {
                handleDivClick("/dashboard", 1);
              }}
            >
              <Icon
                path="/icons/main-dashboard.svg"
                color={`${activeIcon === 1 ? "#1ca66f" : "#ffffff"}`}
              />
            </div>
          </Tooltip>
          <Tooltip content="Чат с ИИ" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                2
              )}`}
              onClick={() => {
                handleDivClick("/dashboard/ai", 2);
              }}
            >
              <Icon
                path="/bot.svg"
                className="cursor-pointer"
                color={`${activeIcon === 2 ? "#1ca66f" : "#ffffff"}`}
              />
            </div>
          </Tooltip>
          <Tooltip content="Поиск врачей" placement="right">
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
          <Tooltip content="Чат" placement="right">
            <div
              className={`w-full flex justify-center relative cursor-pointer ${setBorderIcon(
                4
              )}`}
              onClick={() => {
                handleClick(4);
                routerPush("/dashboard/chat");
              }}
            >
              <MessageSquare
                className="cursor-pointer"
                color={`${activeIcon === 4 ? "#1ca66f" : "#ffffff"}`}
                size={22}
              />
            </div>
          </Tooltip>
        </div>
        <div className="flex flex-col items-center gap-y-[45px] w-full">
          <Tooltip content="Перейти к быстрой связи" placement="right">
            <Link href={"/fast-connect"} target="_blank">
              <div
                className={`w-full flex justify-center relative cursor-pointer`}
              >
                <Icon
                  path="/icons/energy.svg"
                  className="cursor-pointer"
                  color="#ffffff"
                />
              </div>
            </Link>
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

      <div className="ml-[75px] w-full overflow-auto">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
