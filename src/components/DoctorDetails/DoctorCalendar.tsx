"use client";

import Icon from "@components/Icon";
import {
  getLocalTimeZone,
  parseDate,
  today,
  CalendarDate,
  DateValue,
  ZonedDateTime,
} from "@internationalized/date";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  addAvailableDate,
  deleteAvailableDate,
  getAvailableDates,
} from "@lib/redux/slices/doctorcalendar/doctorCalendarSlice";
import { DoctorCalendarType, TimeSlot } from "@lib/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  DatePicker,
  useDisclosure,
  Tooltip,
  NextUIProvider,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Trash } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

// Добавляем функцию форматирования даты
function formatDateToDayMonth(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("default", { day: "numeric", month: "long" });
}

interface DoctorCalendarProps {
  doctorId: string;
  loading: boolean;
}

export default function DoctorCalendar({
  doctorId,
  loading,
}: DoctorCalendarProps) {
  const dispatch = useAppDispatch();
  const [weekOffset, setWeekOffset] = useState(0);
  const calendar = useAppSelector((state) => state.doctorCalendar.calendar);
  const modalAdd = useDisclosure();
  const modalDelete = useDisclosure();

  // States for tracking the selected day and time slot for deletion
  const [selectedDay, setSelectedDay] = useState<DoctorCalendarType | null>(
    null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  const [chosenDate, setChosenDate] = useState<string>("");
  const [chosenTime, setChosenTime] = useState<string>("");
  const [newDate, setNewDate] = useState<DateValue | null>(
    today(getLocalTimeZone())
  );
  const [newTime, setNewTime] = useState("");

  const [errorMessageTime, setErrorMessageTime] = useState<string>("");

  // валидация на 23:59
  const checkErrorMessageTime = (value: string) => {
    value = value.trim();
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const match = value.match(timeRegex);
    if (!match) {
      setErrorMessageTime("Time must be in HH:MM format.");
      return;
    }
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (hours < 0 || hours > 23) {
      setErrorMessageTime("Hours must be between 00 and 23.");
    } else if (minutes < 0 || minutes > 59) {
      setErrorMessageTime("Minutes must be between 00 and 59.");
    } else {
      setErrorMessageTime("");
    }
  };

  useEffect(() => {
    checkErrorMessageTime(newTime);
  }, [newTime]);

  useEffect(() => {
    if (doctorId) {
      const timer = setTimeout(() => {
        dispatch(
          getAvailableDates({ doctorId, query: `?weekOffset=${weekOffset}` })
        );
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [dispatch, doctorId, weekOffset]);

  const handleSaveNewDate = async (date: string, time: string) => {
    try {
      await dispatch(addAvailableDate({ date, time })).unwrap();
      dispatch(
        getAvailableDates({ doctorId, query: `?weekOffset=${weekOffset}` })
      );
    } catch (error) {
      console.error("Error adding available date:", error);
    }
  };

  const handleNextWeek = () => setWeekOffset((prevOffset) => prevOffset + 1);
  const handlePreviousWeek = () => {
    if (weekOffset > 0) setWeekOffset((prevOffset) => prevOffset - 1);
  };

  const handleDeleteClick = (day: DoctorCalendarType, timeSlot: TimeSlot) => {
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlot);
    modalDelete.onOpen();
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(
        deleteAvailableDate({
          calendarId: selectedDay?.id as string,
          timeSlotId: selectedTimeSlot?.id as string,
        })
      ).unwrap();
      dispatch(
        getAvailableDates({ doctorId, query: `?weekOffset=${weekOffset}` })
      );
    } catch (error) {
      console.error("Error deleting available date:", error);
    } finally {
      modalDelete.onClose();
    }
  };

  const formatDate = (date: DateValue | null): string => {
    if (!date) return "";

    const jsDate = date.toDate(getLocalTimeZone());
    const day = jsDate.getDate().toString().padStart(2, "0");
    const month = (jsDate.getMonth() + 1).toString().padStart(2, "0");
    const year = jsDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const navigateTable = (selectedDay: DoctorCalendarType | null) => {
    if (selectedDay) {
      const newDate = new Date(selectedDay.date);
      // Do something with newDate if needed
    }
  };

  return (
    <>
      <Modal isOpen={modalAdd.isOpen} onOpenChange={modalAdd.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Date and Time
              </ModalHeader>
              <ModalBody>
                <DatePicker
                  label="Date"
                  value={newDate as any}
                  onChange={(date: any) => {
                    if (date) setNewDate(date);
                  }}
                  minValue={today(getLocalTimeZone())}
                />
                <Input
                  placeholder="Time (11:00)"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  isInvalid={Boolean(errorMessageTime)}
                  errorMessage={errorMessageTime}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    newDate && handleSaveNewDate(formatDate(newDate), newTime)
                  }
                  color="primary"
                  onPress={onClose}
                  isDisabled={Boolean(errorMessageTime) || !newDate}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={modalDelete.isOpen}
        onOpenChange={modalDelete.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure that you want to delete {selectedTimeSlot?.time}{" "}
                from{" "}
                {selectedDay?.date &&
                  new Date(selectedDay.date).toLocaleDateString("ru-RU", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
              </ModalHeader>
              <ModalBody className="mb-4">
                <Button color="primary" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  color="danger"
                  onPress={handleDeleteConfirm}
                >
                  Yes, Delete
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {!loading && (
        <Card className="p-3 mt-16 max-w-[1510px]">
          <CardHeader className="flex justify-between items-center">
            <div className="text-xl">Set Your Available dates</div>
            <Button onPress={modalAdd.onOpen} color="primary">
              Add New Time
            </Button>
            <div className="flex gap-3">
              <button onClick={handlePreviousWeek}>
                <Icon
                  path="arrow-left.svg"
                  className={`cursor-pointer ${
                    weekOffset > 0 ? "opacity-1" : "opacity-0"
                  }`}
                />
              </button>

              <button onClick={handleNextWeek}>
                <Icon
                  path="arrow-left.svg"
                  className="rotate-180 cursor-pointer"
                />
              </button>
            </div>
          </CardHeader>
          <CardBody className="flex flex-row gap-x-4">
            {calendar.slice(0, 7).map((day) => (
              <div
                key={
                  day.id
                    ? String(day.id)
                    : `day-${Math.random().toString(36).substr(2, 9)}`
                }
                className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between basis-[200px] flex-grow flex-shrink min-w-[158px]"
              >
                <ScrollShadow hideScrollBar className="max-h-[300px]">
                  {day.timeSlots.map((timeSlot) => (
                    <div
                      key={String(timeSlot.id)}
                      className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex items-center rounded mb-2"
                    >
                      <span>{timeSlot.time}</span>
                      <button
                        className="mr-0 ml-auto"
                        onClick={() => handleDeleteClick(day, timeSlot)}
                      >
                        <Trash color="red" size={20} />
                      </button>
                    </div>
                  ))}
                </ScrollShadow>

                <div>
                  <Divider />
                  <div className="text-[#1CA66F] pt-2 flex justify-center items-center">
                    {formatDateToDayMonth(String(day.date))}
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </>
  );
}
