import React, { FC, ReactNode } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import Title from "./Title";
import CustomButton from "./CustomButton";

interface CustomModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  children: ReactNode;
  title: string;
}

const CustomModal: FC<CustomModalProps> = ({
  isOpen,
  onOpenChange,
  children,
  title,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: "bg-black/20",
        base: "bg-[#161616]/80 border-solid  border-[#ffff]/5 max-w-[572px] h-[461px]",
        backdrop: "backdrop-blur-[12px]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <Title size={18}>{title}</Title>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <CustomButton
                style={{ width: "55vh" }}
                color="primary"
                onClick={onClose}
              >
                Submit
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
