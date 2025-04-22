import { Modal } from "@nextui-org/react";
import { ReactNode } from "react";

export default function ModalWrapper({ children, onOpenChange, isOpen }: { children: ReactNode, onOpenChange: () => void, isOpen: boolean }) {
    return <Modal placement="center" onOpenChange={onOpenChange} isOpen={isOpen} classNames={{
        wrapper: "bg-black/20",
        base: "bg-[#161616]/80 border-solid  border-[#ffff]/5",
        backdrop: "backdrop-blur-[12px]",
    }} >
        { children }
    </Modal>
}