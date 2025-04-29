import { StreamClient } from '@stream-io/node-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id параметр обязателен' },
        { status: 400 }
      );
    }

    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;

    if (!streamApiKey || !streamApiSecret) {
      console.error('Stream API ключи не настроены');
      return NextResponse.json(
        { error: 'Конфигурация сервера отсутствует' },
        { status: 500 }
      );
    }

    const streamClient = new StreamClient(streamApiKey, streamApiSecret);

    // Создаем токен, действительный в течение 24 часов
    const expirationTime = Math.floor(Date.now() / 1000) + 86400;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamClient.createToken(userId, expirationTime, issuedAt);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Ошибка при создании токена:', error);
    return NextResponse.json(
      { error: 'Не удалось создать токен' },
      { status: 500 }
    );
  }
} 