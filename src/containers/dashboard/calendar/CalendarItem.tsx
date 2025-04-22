import Icon from "@components/Icon";
import ModalWrapper from "@components/Modal";
import formatDateToTime from "@helpers/formatDateToTime";
import { useDisclosure } from "@nextui-org/react";
import {
  Divider,
  ScrollShadow,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import NoteItem from "./Note/NoteItem";
import { calendarType } from "@lib/types";
import { useAppDispatch } from "@lib/redux/hooks";
import { addNote } from "@lib/redux/slices/calendar/calendarSlice";
import { useState } from "react";

export default function CalendarItem({
  currentCalendar,
}: {
  currentCalendar: calendarType;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const [addNoteValue, setAddNoteValue] = useState("");

  const handleSaveNewNote = async (id: number) => {
    if(addNoteValue.trim().length < 3) return;
    try {
      await dispatch(
        addNote({
          calendar_id: id,
          note: addNoteValue,
        })
      ).unwrap();
      onClose();
      setAddNoteValue("");
      // dispatch(getOneCalendar(id));
    } catch (error) {
      console.error("Error adding available date:", error);
    }
  };
  return (
    <div
      key={String(currentCalendar.id)}
      className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[250px] "
    >
      <ScrollShadow hideScrollBar className="max-h-[300px]">
        {currentCalendar.notes.map((note: any) => (
          <NoteItem
            key={note.id}
            currentCalendar={currentCalendar}
            note={note}
          />
        ))}
      </ScrollShadow>

      <div>
        <Divider />
        <div className="text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5">
          {new Date(currentCalendar.date).toLocaleDateString("default", {
            day: "2-digit",
            month: "2-digit",
          })}
          <div className="cursor-pointer p-1 bg-[#1CA66F1A] rounded-[32px] relative">
            <ModalWrapper onOpenChange={onOpenChange} isOpen={isOpen}>
              <ModalContent className="py-3">
                <ModalHeader>Добавить заметку</ModalHeader>
                <ModalBody>
                  <div className="flex items-center gap-3">
                    <Input
                      label="Заметка"
                      placeholder="Заметил какое-то странное чувство, что-то не так, немного тревожно..."
                      size="sm"
                      value={addNoteValue}
                      onChange={(e) => setAddNoteValue(e.target.value)}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="font-semibold text-white w-full"
                    color="success"
                    onPress={() => handleSaveNewNote(currentCalendar.id)}
                  >
                    Отправить
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
                <DropdownItem key="evaluate">
                  <div className="flex gap-1">
                    <Icon path="icons/smile.svg" />
                    <span>Оценить ваше текущее состояние</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="add-note" onPress={onOpen}>
                  <div className="flex gap-1">
                    <Icon path="icons/notes.svg" />
                    <span>Добавить заметку</span>
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
