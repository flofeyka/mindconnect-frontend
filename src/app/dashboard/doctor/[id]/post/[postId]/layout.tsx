import Logo from "@components/Logo";
import React from "react";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="bg-[#111] w-full h-full">{children}</div>
    </div>
  );
}
