import { forwardRef } from "react";
import Icon from "./Icon";
import {
  Input,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalHeader,
} from "@nextui-org/react";
import { calendarType } from "@lib/types";

interface CalendarActionsProps {
  isActive: boolean;
  calendar: calendarType[];
}

const CalendarActions = forwardRef<HTMLDivElement, CalendarActionsProps>(
  ({ isActive, calendar }: CalendarActionsProps, ref) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // if (!isActive) return;

    return (
      <>
        <div
          ref={ref}
          className="fixed z-10 bg-[#161616] p-3 rounded-lg text-white"
        >
          <div className="flex mb-3 gap-x-2 p-2 hover:bg-[#FFFFFF33]">
            <Icon path="icons/smile.svg" />
            <span>Evaluate your current condition</span>
          </div>
          <div
            className="flex gap-x-2 p-2 hover:bg-[#FFFFFF33]"
            onClick={onOpen}
          >
            <Icon path="icons/notes.svg" />
            <span>Add a note</span>
          </div>
        </div>

      </>
    );
  }
);

CalendarActions.displayName = "CalendarActions";

export default CalendarActions;
