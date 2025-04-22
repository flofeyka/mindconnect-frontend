import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Авторизация",
  description: "Идентифицируйте себя",
};

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
