import React from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#111]">
      <div className=" w-full h-full">{children}</div>
    </div>
  );
}
