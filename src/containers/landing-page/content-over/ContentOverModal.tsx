import { Input, Textarea } from "@nextui-org/react";
import React, { FC } from "react";

const ContentOverModal: FC = () => {
  return (
    <div className="">
      <div className="flex gap-4">
        <Input
          type="email"
          label="Ваше имя"
          classNames={{
            inputWrapper: [
              "border-solid border-1  border-[#ffff]/5 bg-[#FFFFFF]/5",
            ],
          }}
        />
        <Input
          type="email"
          label="Тема"
          classNames={{
            inputWrapper: [
              "border-solid border-1  border-[#ffff]/5 bg-[#FFFFFF]/5",
            ],
          }}
        />
      </div>
      <Input
        type="email"
        label="Тема"
        className="py-[14px]"
        classNames={{
          inputWrapper: [
            "border-solid border-1  border-[#ffff]/5 bg-[#FFFFFF]/5",
          ],
        }}
      />
      <Textarea
        placeholder="Ваше сообщение..."
        className="w-full "
        classNames={{
          inputWrapper: [
            "border-solid border-1  border-[#ffff]/5 bg-[#FFFFFF]/5 h-full",
          ],
        }}
      />
    </div>
  );
};

export default ContentOverModal;
