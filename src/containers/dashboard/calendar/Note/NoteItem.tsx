import ModalWrapper from "@components/Modal";
import formatDateToTime from "@helpers/formatDateToTime";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import NoteForm from "./NoteForm";

export default function NoteItem({
  note,
  currentCalendar,
}: {
  note: any;
  currentCalendar: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        key={String(note._id)}
        className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex  items-center gap-x-2 rounded-md mb-2"
        onClick={onOpen}
      >
        <span className="text-gray-500">
          {formatDateToTime(String(note.createdAt))}
        </span>
        <span>{note.note}</span>
      </div>
    </div>
  );
}
