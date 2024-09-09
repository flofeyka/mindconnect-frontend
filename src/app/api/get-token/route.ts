import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { env } from "../../../env";

export async function GET(request: Request) {
  try {
    // Parse the URL to get the userId from the query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    console.log("get token function", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const streamClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_CHAT_KEY,
      env.STREAM_CHAT_SECRET
    );

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamClient.createToken(userId, expirationTime, issuedAt);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
