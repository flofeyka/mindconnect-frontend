import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Authorization",
  description: "Identify yourself"
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {children}
    </div>
  );
}
