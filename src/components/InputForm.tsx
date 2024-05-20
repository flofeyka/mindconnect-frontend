import { Input } from "@nextui-org/react";
import Icon from "./Icon";

type Props = {
  name: string;
  width: string | undefined;
  height: string | undefined;
  InnerIconSrc: string;
  InnerIconWidth: string;
  InnerIconHeight: string;
};

export default function InputForm({
  name,
  InnerIconSrc = "",
  InnerIconWidth = "",
  InnerIconHeight,
  width = "",
  height = "", ...props
}: Props) {
  return (
    <div>
      <Input
        classNames={{
          base: `w-[${width}] h-[${height}] b-gray-100`,
          inputWrapper: [
            "focus-within:dark:border-gray-200 border-solid-1",
            "focus-within:dark:bg-[#222]",
            "dark:text-white dark:bg-[#222]",
          ],
          input: [
            "placeholder:text-default-700/50",
            "dark:placeholder:text-gray-400",
            "dark:text-white",
          ],
          innerWrapper: ["focus-within:dark:border-gray-200 border-solid-1"],
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
