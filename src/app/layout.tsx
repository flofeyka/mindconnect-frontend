import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import React from "react";
import "../assets/styles/global.css";
import Providers from "./providers";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mind-Connect",
  description: "Развивайте и меняйте свой разум",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="ru">
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
