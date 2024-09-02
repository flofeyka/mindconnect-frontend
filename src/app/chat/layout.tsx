import type { Metadata } from "next";
import "./chat.css";
export const metadata: Metadata = {
  title: "Mind Chat",
  description: "Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col items-center h-screen">{children}</div>;
}
