"use client";

import { Chat, LoadingIndicator } from "stream-chat-react";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import { useCallback, useEffect, useState } from "react";
import ChatChannel from "./ChatChannel";
import ChatSideBar from "./ChatSideBar";
import useInitializeChatClient from "./useInitializeChatClient";
import { Menu, X } from "lucide-react";
import useWindowSize from "@app/hooks/useWindowSize";
import { mdBreakpoint } from "../../utils/tailwind";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.usersData);
  const [chatSideBarOpen, setChatSideBarOpen] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakpoint;

  useEffect(() => {
    if (windowSize.width >= mdBreakpoint) setChatSideBarOpen(false);
  }, [windowSize.width]);

  const handleSideBarOnClose = useCallback(() => {
    setChatSideBarOpen(false);
  }, []);

  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);

  const chatClient = useInitializeChatClient();

  if (!chatClient || !user.id) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingIndicator size={40} color="primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 xl:px-20 xl:py-8">
      <div className="msx-w-[1600px] min-w-[350px] h-full shadow-sm m-auto flex flex-col">
        <Chat client={chatClient}>
          <div className="flex justify-center border-b border-b[#dbdde1] p-3 md:hidden">
            <button onClick={() => setChatSideBarOpen(!chatSideBarOpen)}>
              {!chatSideBarOpen ? (
                <span className="flex items-center gap-2">
                  {" "}
                  <Menu /> Menu{" "}
                </span>
              ) : (
                <X />
              )}
            </button>
          </div>
          <div className="flex flex-row h-full overflow-y-auto">
            <ChatSideBar
              user={user}
              show={isLargeScreen || chatSideBarOpen}
              onClose={handleSideBarOnClose}
            />
            <ChatChannel
              show={isLargeScreen || !chatSideBarOpen}
              hideChannelOnThread={!isLargeScreen}
            />
          </div>
        </Chat>
      </div>
    </div>
  );
}
