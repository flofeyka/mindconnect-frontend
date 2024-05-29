import { Input } from "@nextui-org/react";
import Icon from "./Icon";
import React, { HTMLAttributes, HTMLProps } from "react";

interface Props extends React.PropsWithChildren<any> {
  name: string;
  width: string | undefined;
  height: string | undefined;
  InnerIconSrc: string;
  InnerIconWidth?: string;
  InnerIconHeight?: string;
}

export default function InputForm({
  name,
  InnerIconSrc = "",
  InnerIconWidth = "",
  InnerIconHeight,
  width = "",
  height = "",
  ...props
}: Props) {
  return (
    <div>
      <Input
        classNames={{
          base: `w-[${width}] h-[${height}] border-gray-100`,
          inputWrapper: "bg-[#222] focus-within:border-white/5",
          input: "focus-within:border-gray-100",
        }}
        variant="bordered"
        name={name}
        isRequired
        startContent={
          <Icon
            width={InnerIconWidth}
            height={InnerIconHeight}
            path={InnerIconSrc}
          />
        }
        {...props}
      />
    </div>
  );
}
