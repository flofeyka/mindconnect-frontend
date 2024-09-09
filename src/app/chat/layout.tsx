import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Mind Chat",
  description: "Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="">{children}</div>;
}
