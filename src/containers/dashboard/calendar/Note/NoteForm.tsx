import { useAppDispatch } from "@lib/redux/hooks";
import { updateNote } from "@lib/redux/slices/calendar/calendarSlice";
import {Button, ModalFooter, Spinner, Textarea} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "@components/CustomButton";

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
      setIsLoading(true);
    await dispatch(
      updateNote({
        noteId: note.id,
        date: currentCalendar.date,
        note: data.note,
        calendarId: currentCalendar.id,
      })
    );
    setIsLoading(false)
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register("note")}
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        disabled={isLoading}
      />

      <ModalFooter>
        <CustomButton color="danger" disabled={isLoading} onPress={onClose}>
          Отмена
        </CustomButton>
        <CustomButton color="primary" disabled={isLoading} type="submit">
            { isLoading ? 'Загрузка...' : 'Сохранить' }
        </CustomButton>
      </ModalFooter>
    </form>
  );
}
