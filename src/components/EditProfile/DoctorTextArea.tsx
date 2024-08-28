"use client";

import { Textarea, TextAreaProps } from "@nextui-org/react";
import React from "react";

interface DoctorTextAreaProps extends Omit<TextAreaProps, "onChange"> {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function DoctorTextArea({
  id,
  name,
  value,
  onChange,
  label,
}: DoctorTextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Textarea
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      label={label}
      className="w-[600px] mb-4"
    />
  );
}
