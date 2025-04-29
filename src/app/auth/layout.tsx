"use client";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isPending, isAuth} = useAppSelector((state) => state.Auth);


  useEffect(() => {
    if (!isPending && !isAuth) {
      redirect("/dashboard");
    }
  }, [isAuth, isPending]);
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {isPending ? <Spinner color="white" size="lg" /> : children}
    </div>
  );
}
