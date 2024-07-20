"use client";
import CalendarActions from "@components/CalendarActions";
import Icon from "@components/Icon";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import formatDateToTime from "@helpers/formatDateToTime";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import {
  getCalendarByDates,
  updateNote,
} from "@lib/redux/slices/calendar/calendarSlice";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.usersData);
  const { calendar } = useAppSelector((state) => state.Calendar);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const modalRef = useRef<HTMLDivElement>(null);

  const [modalsState, setModalsState] = useState([{ id: "", isActive: false }]);
  const [currentCalendar, setCurrectCalendar] = useState({
    id: "",
    note: "",
    newNote: "",
    time: "",
    date: "",
  });

  function changeModalsState(id: string) {
    const index = modalsState.findIndex((modal) => modal.id === String(id));

    const newModalState = modalsState.map((_modalState) => ({
      ..._modalState,
      isActive: false,
    }));
    newModalState[index].isActive = !newModalState[index].isActive;

    setModalsState(newModalState);
  }

  useEffect(() => {
    dispatch(getAuthUserData());
    dispatch(
      getCalendarByDates({ startDate: "2024-01-01", endDate: "2024-07-18" })
    );
  }, [dispatch]);

  useEffect(() => {
    const modalsID = calendar.map((calendarNote) => ({
      id: String(calendarNote._id),
      isActive: false,
    }));
    setModalsState(modalsID);
  }, [calendar]);

  return (
    <div className="px-[30px] py-5">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-x-[35px]">
          <h3 className="font-semibold text-[22px]">Dashboard</h3>
          <Input
            isClearable
            placeholder="Search"
            startContent={<Icon path="icons/search.svg" />}
            className="min-w-[324px]"
          />
        </div>
        <div className="flex items-center gap-x-[30px]">
          <Icon path="icons/notifications.svg" className="cursor-pointer" />
          <div className="flex items-center  gap-x-[8px]">
            <Avatar src={user.image} size="lg" />
            {user.firstName} ^
          </div>
        </div>
      </header>
      <div className="flex gap-x-[20px] ">
        <Card className="p-3 ">
          <CardHeader className="flex justify-between items-center">
            <div>Calendar</div>
            <div className="flex gap-3">
              <Icon path="arrow-left.svg" className="cursor-pointer" />
              <Icon
                path="arrow-left.svg"
                className="rotate-180 cursor-pointer"
              />
            </div>
          </CardHeader>
          <CardBody className="flex flex-row gap-x-4">
            {calendar.slice(0, 5).map((calendarNote) => (
              <div
                key={String(calendarNote._id)}
                className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] "
              >
                <ScrollShadow hideScrollBar className="max-h-[300px]">
                  {calendarNote.notes.map((note) => (
                    <div
                      key={String(note._id)}
                      className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex  items-center gap-x-2 rounded-md mb-2"
                      onClick={() => {
                        onOpen();
                        setCurrectCalendar({
                          id: String(note._id),
                          note: note.note,
                          newNote: note.note,
                          time: formatDateToTime(String(note.createdAt)),
                          date: String(calendarNote.date),
                        });
                      }}
                    >
                      <span className="text-gray-500">
                        {formatDateToTime(String(note.createdAt))}
                      </span>
                      <span>{note.note}</span>
                    </div>
                  ))}
                </ScrollShadow>

                <div>
                  <Divider />
                  <div className="text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5">
                    {formatDateToDayMonth(String(calendarNote.date))}
                    <div
                      className="cursor-pointer p-1 bg-[#1CA66F1A] rounded-[32px] relative "
                      onClick={() => {
                        changeModalsState(String(calendarNote._id));
                      }}
                    >
                      <Icon path="/icons/plus.svg " />

                      <CalendarActions
                        ref={modalRef}
                        calendar={calendar}
                        isActive={
                          modalsState.find(
                            (note) => note.id === String(calendarNote._id)
                          )?.isActive || false
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="p-3 flex-grow">
          <CardHeader className="flex justify-between items-center">
            Your psychologist
            <Icon path="arrow-left.svg" className="rotate-180 cursor-pointer" />
          </CardHeader>
          <CardBody>
            <div className="mx-auto flex flex-col items-center gap-y-4 mt-8">
              <Avatar src="/avatar.png" className="w-[82px] h-[82px]" />
              <span className="font-semibold text-[16px]">Maria Vertigo</span>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{currentCalendar.time}</ModalHeader>
          <ModalBody>
            <Textarea
              value={currentCalendar.newNote}
              onChange={(e) =>
                setCurrectCalendar({
                  ...currentCalendar,
                  newNote: e.target.value,
                })
              }
            ></Textarea>

            <Button
              color="primary"
              onClick={() => {
                dispatch(
                  updateNote({
                    noteId: currentCalendar.id,
                    date: currentCalendar.date,
                    note: currentCalendar.newNote,
                  })
                );
              }}
            >
              Save
            </Button>
            <Button
              color="danger"
              onClick={() =>
                setCurrectCalendar({
                  ...currentCalendar,
                  newNote: currentCalendar.note,
                })
              }
            >
              Reset
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
