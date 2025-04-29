"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { Card, CardHeader, Avatar } from "@nextui-org/react";
import { Bot } from "lucide-react";
import { useEffect } from "react";
import { Message } from "./page";

export default function MessageItem({ message }: { message: Message }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.usersData);

  const { role, content } = message;
  if (role === "assistant") {
    return (
      <div className="flex flex-col gap-3 p-8 whitespace-pre-wrap">
        <div className="flex items-center gap-2">
          <Bot />
          Ассистент:
        </div>
        {content}
      </div>
    );
  }
  return (
    <div className="p-8 justify-end flex w-full">
      <div className="whitespace-pre-wrap">
        <div className="flex items-start justify-stretch gap-2">
          <span className="bg-[#353535] p-3 rounded-xl break-all">
            {content}
          </span>
        </div>
      </div>
    </div>
  );
}
