import { useAppDispatch } from "@lib/redux/hooks";
import { updateNote } from "@lib/redux/slices/calendar/calendarSlice";
import { Button, ModalFooter, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NoteForm({
  currentCalendar,
  note,
  onClose,
}: {
  currentCalendar: any;
  note: any;
  onClose: () => void;
}) {
  const [newNote, setNewNote] = useState(note.note);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      note: note.note,
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = (data: any) => {
    dispatch(
      updateNote({
        noteId: note._id,
        date: currentCalendar.date,
        note: data.note,
        calendarId: currentCalendar._id,
      })
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register("note")}
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />

      <ModalFooter>
        <Button color="danger" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit">
          Save
        </Button>
      </ModalFooter>
    </form>
  );
}
