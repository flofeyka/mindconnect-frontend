import { Checkbox, cn } from "@nextui-org/react";

export default function InputCheckBox({ children, ...props }: any) {
  return (
    <Checkbox
      classNames={{
        label: "dark:text-white",
        input: "hover:bg-[#333]",
        container: "dark:bg-[#333]",
      }}
      {...props}
    >
      {children}
    </Checkbox>
  );
}
