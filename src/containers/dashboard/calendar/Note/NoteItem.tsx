import ModalWrapper from "@components/Modal";
import formatDateToTime from "@helpers/formatDateToTime";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import NoteForm from "./NoteForm";
import Icon from "@components/Icon";
import { useAppDispatch } from "@lib/redux/hooks";
import {
  deleteNote,
  getOneCalendar,
} from "@lib/redux/slices/calendar/calendarSlice";
import formatDateToSubmit from "@helpers/formatDateToSubmit";

export default function NoteItem({
  note,
  currentCalendar,
}: {
  note: any;
  currentCalendar: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const modalDelete = useDisclosure();

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
      <div className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex items-center justify-between rounded-md mb-2 cursor-pointer">
        <div className="flex gap-x-2" onClick={onOpen}>
          <span className="text-gray-500">
            {formatDateToTime(String(note.createdAt))}
          </span>
          <span>{note.note}</span>
        </div>
        <div onClick={modalDelete.onOpen}>
          <Icon path="/icons/trash.svg" width="30" color="#FF0000" />
        </div>
        <ModalWrapper
          isOpen={modalDelete.isOpen}
          onOpenChange={modalDelete.onOpenChange}
        >
          <ModalContent>
            <div>
              <ModalHeader>{formatDateToTime(note.createdAt)}</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this note?</p>
                <Button
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      deleteNote({
                        date: formatDateToSubmit(currentCalendar.date),
                        noteId: note._id,
                      })
                    ).unwrap();
                    dispatch(getOneCalendar(currentCalendar.date as any));
                  }}
                >
                  Delete
                </Button>
              </ModalBody>
            </div>
          </ModalContent>
        </ModalWrapper>
      </div>
    </div>
  );
}
