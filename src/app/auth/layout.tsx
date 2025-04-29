"use client";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import { Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.Auth.usersData);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      await dispatch(getAuthUserData());
      setIsLoading(false);
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(user).length !== 0 && user !== undefined && !isLoading) {
      redirect("/dashboard");
    }
  }, [user?.id]);
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {isLoading ? <Spinner color="white" size="lg" /> : children}
    </div>
  );
}
