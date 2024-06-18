import Container from "@components/Container";
import Logo from "@components/Logo";
import React from "react";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="bg-[#111111] h-full w-[75px] border-r-1 border-white flex flex-col justify-between items-center py-5">
        <Logo title={false}/>
      </div>
      <div className="bg-[#111] w-full">{children}</div>
    </div>
  );
}
