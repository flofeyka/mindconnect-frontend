import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    STREAM_CHAT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_STREAM_CHAT_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_STREAM_CHAT_KEY: process.env.NEXT_PUBLIC_STREAM_CHAT_KEY,
  },
});
