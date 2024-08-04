import Icon from "@components/Icon";
import ModalWrapper from "@components/Modal";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import formatDateToTime from "@helpers/formatDateToTime";
import { useAppDispatch } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import {
  getCalendarByDates,
  updateNote,
} from "@lib/redux/slices/calendar/calendarSlice";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import NoteItem from "./Note/NoteItem";
import { calendarType } from "@lib/types";

export default function CalendarItem({
  calendarNote,
  currentCalendar,
}: {
  calendarNote: any;
  currentCalendar: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  return (
    <div
      key={String(calendarNote._id)}
      className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] "
    >
      <ScrollShadow hideScrollBar className="max-h-[300px]">
        {calendarNote.notes.map((note: any) => (
          <NoteItem currentCalendar={currentCalendar} note={note} />
        ))}
      </ScrollShadow>

      <div>
        <Divider />
        <div className="text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5">
          {formatDateToDayMonth(String(calendarNote.date))}
          <div className="cursor-pointer p-1 bg-[#1CA66F1A] rounded-[32px] relative">
            <ModalWrapper onOpenChange={onOpenChange} isOpen={isOpen}>
              <ModalContent className="py-3">
                <ModalHeader>Add Note</ModalHeader>
                <ModalBody>
                  <div className="flex items-center gap-3">
                    <Input label="Note" size="sm" />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="font-semibold text-white w-full"
                    color="success"
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </ModalWrapper>
            <Dropdown>
              <DropdownTrigger>
                <div>
                  <Icon path="/icons/plus.svg " />
                </div>
              </DropdownTrigger>

              <DropdownMenu>
                <DropdownItem key="d">
                  <div className="flex gap-1">
                    <Icon path="icons/smile.svg" />
                    <span>Evaluate your current condition</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="d">
                  <div className="flex gap-1" onClick={onOpen}>
                    <Icon path="icons/notes.svg" />
                    <span>Add a note</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
