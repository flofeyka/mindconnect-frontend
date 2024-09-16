"use client";

import React from "react";
import { Select, SelectItem, Selection } from "@nextui-org/react";

interface SelectType {
  key: string;
  label: string;
}

interface DoctorSelectProps {
  label: string;
  placeholder: string;
  options: SelectType[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export default function DoctorMultipleSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  className = "w-[350px] block mb-4 ",
}: DoctorSelectProps) {
  const handleSelectionChange = (keys: Selection) => {
    onChange(Array.from(keys) as string[]);
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      selectionMode="multiple"
      className={className}
      selectedKeys={new Set(value)}
      onSelectionChange={handleSelectionChange}
    >
      {options.map((option) => (
        <SelectItem key={option.key} value={option.key}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
}
