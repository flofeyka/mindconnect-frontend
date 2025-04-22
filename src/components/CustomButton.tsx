"use client";
import cn from "@helpers/cn";
import { Button, ButtonProps } from "@nextui-org/react";
import { FC } from "react";

interface CustomButtonProps extends ButtonProps {
  children: string;
}

const CustomButton: FC<CustomButtonProps> = ({ children, color, ...props }) => {
  return (
    <div>
      <Button
        className={cn(
          "text-[14px] font-medium py-[10px]",
          color === "primary"
            ? "px-4 bg-primary border border-separatorHigh"
            : "",
          color === "default"
            ? "bg-secondary px-[14px]  border border-separator"
            : "",
          color === "danger"
            ? "bg-danger-400 px-[14px]  border border-separator"
            : ""
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default CustomButton;
