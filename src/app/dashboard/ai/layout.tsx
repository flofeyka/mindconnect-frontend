import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solve your problems with AI",
  description: "AI-powered solutions for your challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col items-center h-screen">{children}</div>;
}
