import ModalWrapper from "@components/Modal";
import formatDateToTime from "@helpers/formatDateToTime";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import NoteForm from "./NoteForm";
import Icon from "@components/Icon";
import { useAppDispatch } from "@lib/redux/hooks";
import { deleteNote } from "@lib/redux/slices/calendar/calendarSlice";
import formatDateToSubmit from "@helpers/formatDateToSubmit";

export default function NoteItem({
  note,
  currentCalendar,
}: {
  note: any;
  currentCalendar: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const dispatch = useAppDispatch();

  return (
    <div>
      <ModalWrapper isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader>{formatDateToTime(note.createdAt)}</ModalHeader>
              <ModalBody>
                <NoteForm
                  currentCalendar={currentCalendar}
                  note={note}
                  onClose={onClose}
                />
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </ModalWrapper>
      <div
        className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex items-center justify-between rounded-md mb-2 cursor-pointer"
        onClick={onOpen}
      >
        <div className="flex gap-x-2">
          <span className="text-gray-500">
            {formatDateToTime(String(note.createdAt))}
          </span>
          <span>{note.note}</span>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              deleteNote({
                date: formatDateToSubmit(currentCalendar.date),
                noteId: note._id,
              })
            );
          }}
        >
          <Icon path="/icons/trash.svg" width="30" color="#FF0000" />
        </div>
      </div>
    </div>
  );
}
