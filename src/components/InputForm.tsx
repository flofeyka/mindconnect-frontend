import { Input } from "@nextui-org/react";
import Icon from "./Icon";

type Props = {
  name: string;
  placeholder: string;
  width: string;
  height: string;
  InnerIconSrc: string;
  InnerIconWidth: string;
  InnerIconHeight: string;
  onChange: any;
  value: string;
  type: string;
};

export default function InputForm({
  name,
  placeholder,
  InnerIconSrc,
  InnerIconWidth,
  InnerIconHeight,
  width,
  height,
  onChange,
  value,
  type,
}: Props) {
  return (
    <div className="mb-[14px]">
      <Input
        classNames={{
          base: `w-[${width}] h-[${height}] b-white`,
          inputWrapper: [
            "focus-within:dark:border-gray-500 border-solid-2",
            "focus-within:dark:bg-[#333]",
            "dark:text-white dark:bg-[#333]",
          ],
          input: [
            "placeholder:text-default-700/50",
            "dark:placeholder:text-gray-400",
            "dark:text-white",
          ],
          innerWrapper: ["focus-within:dark:border-gray-400 border-solid-2"],
        }}
        variant="bordered"
        name={name}
        placeholder={placeholder}
        isRequired
        startContent={
          <Icon
            width={InnerIconWidth}
            height={InnerIconHeight}
            path={InnerIconSrc}
          />
        }
        onChange={onChange}
        value={value}
        type={type}
      />
    </div>
  );
}
