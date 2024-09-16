"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { env } from "../../../env";

export default function useInitializeChatClient() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.usersData);
  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const client = StreamChat.getInstance(env.NEXT_PUBLIC_STREAM_CHAT_KEY);
    client
      .connectUser(
        {
          id: user.id,
          name: user.firstName || user.id,
          image: user.image,
        },
        async () => {
          // Pass the user ID as a query parameter
          const response = await fetch(`/api/get-token?userId=${user.id}`);
          if (!response.ok) {
            throw new Error("Failed to get token");
          }
          const body = await response.json();
          return body.token;
        }
      )
      .catch((error) => console.error("failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("failed to connect user", error))
        .then(() => console.log("connection closed"));
    };
  }, [user.id, user.firstName, user.image]);

  return chatClient;
}
