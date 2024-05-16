import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up to your account",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
