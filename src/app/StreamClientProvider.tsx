"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { nanoid } from "@reduxjs/toolkit";
import { getToken } from "./actions";

interface StreamClientProviderProps {
  children: React.ReactNode;
}

export default function StreamClientProvider({
  children,
}: StreamClientProviderProps) {
  const videoClient = useInitializeVideoClient();

  if (!videoClient) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

function useInitializeVideoClient() {
  const user = useAppSelector((state) => state.Auth.usersData);
  const dispatch = useAppDispatch();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );

  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);

  useEffect(() => {
    // Генерируем идентификатор для пользователя
    const id = nanoid();
    // Создаем объект пользователя, используя обычный тип (не гостевой)
    const streamUser: User = {
      id,
      name: `Пользователь ${id.substring(0, 5)}`,
      // Убираем тип "guest", чтобы использовать стандартный тип пользователя
    };

    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    if (!apiKey) {
      throw new Error("ключ api stream не установлен");
    }

    // Простая функция для создания временного токена на клиенте
    // ПРИМЕЧАНИЕ: Это только для тестирования, в продакшн нужно использовать серверную генерацию
    const tokenProvider = async () => {
      try {
        // Попытка получить токен с сервера (если доступно)
        const tokenResponse = await fetch('/api/stream-token?user_id=' + id, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' } 
        });
        
        if (tokenResponse.ok) {
          const data = await tokenResponse.json();
          return data.token;
        }
        
        // Fallback - сообщаем об ошибке
        console.warn('Не удалось получить токен. Используем анонимный доступ.');
        return "";
      } catch (error) {
        console.error('Ошибка при получении токена:', error);
        return "";
      }
    };

    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider,
    });

    setVideoClient(client);
    return () => {
      client.disconnectUser();
      setVideoClient(null);
    };
  }, []); // Удалена зависимость от user, чтобы клиент создавался сразу

  return videoClient;
}
