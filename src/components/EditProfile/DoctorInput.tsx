"use client";

import { Input, InputProps } from "@nextui-org/react";
import React from "react";

interface DoctorInputProps extends Omit<InputProps, "onChange"> {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function DoctorInput({
  id,
  name,
  value,
  onChange,
  label,
}: DoctorInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={handleChange}
      label={label}
      className="w-[350px] mb-4"
    />
  );
}
