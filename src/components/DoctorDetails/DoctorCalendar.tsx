"use client";

import Icon from "@components/Icon";
import { formatDateFromDateNow } from "@helpers/formatDateFromDateNow";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import formatDateToTime from "@helpers/formatDateToTime";
import {
  getLocalTimeZone,
  now,
  parseDate,
  today,
} from "@internationalized/date";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  addAvailableDate,
  deleteAvailableDate,
  getAvailableDates,
} from "@lib/redux/slices/doctorcalendar/doctorCalendarSlice";
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
} from "@nextui-org/react";
import { nanoid } from "@reduxjs/toolkit";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface DoctorCalendarProps {
  doctorId: string;
}

export default function DoctorCalendar({ doctorId }: DoctorCalendarProps) {
  const dispatch = useAppDispatch();
  const [weekOffset, setWeekOffset] = useState(0);
  const calendar = useAppSelector((state) => state.doctorCalendar.calendar);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newDate, setNewDate] = useState(parseDate(formatDateFromDateNow()));
  const [newTime, setNewTime] = useState("");

  console.log(doctorId);
  useEffect(() => {
    if (doctorId) {
      const timer = setTimeout(() => {
        console.log("Dispatching getAvailableDates with doctorId:", doctorId);
        dispatch(
          getAvailableDates({ doctorId, query: `?weekOffset=${weekOffset}` })
        );
      }, 500);

      return () => clearTimeout(timer);
    } else {
      console.log("doctorId is undefined, not dispatching");
    }
  }, [dispatch, doctorId, weekOffset]);

  const handleSaveNewDate = async (date: string, time: string) => {
    try {
      await dispatch(addAvailableDate({ date, time })).unwrap(); // Wait for the thunk to complete
      // 2. Re-fetch data after adding a new date
      dispatch(
        getAvailableDates({ doctorId, query: `?weekOffset=${weekOffset}` })
      );
    } catch (error) {
      console.error("Error adding available date:", error);
      // Handle errors if needed
    }
  };

  const handleNextWeek = () => {
    setWeekOffset((prevOffset) => prevOffset + 1);
  };

  const handlePreviousWeek = () => {
    if (weekOffset == 0) {
      return;
    }
    setWeekOffset((prevOffset) => prevOffset - 1);
  };

  function formatDate(dateObject: any) {
    const year = dateObject.year;
    const month = String(dateObject.month).padStart(2, "0"); // Ensure two digits for month
    const day = String(dateObject.day).padStart(2, "0"); // Ensure two digits for day

    return `${year}-${month}-${day}`;
  }

  console.log(calendar);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Date and Time
              </ModalHeader>
              <ModalBody>
                <DatePicker
                  label="Date"
                  value={newDate}
                  onChange={setNewDate}
                  minValue={today(getLocalTimeZone())}
                />
                <Input
                  placeholder="Time (11:00)"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleSaveNewDate(formatDate(newDate as any), newTime)
                  }
                  color="primary"
                  onPress={onClose}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Card className="p-3 ">
        <CardHeader className="flex justify-between items-center">
          <div>Calendar</div>
          <Button onPress={onOpen} color="primary">
            Add New Date
          </Button>
          <div className="flex gap-3">
            {weekOffset > 0 && (
              <button onClick={() => handlePreviousWeek()}>
                <Icon path="arrow-left.svg" className="cursor-pointer" />
              </button>
            )}

            <button onClick={() => handleNextWeek()}>
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
                day._id
                  ? String(day._id)
                  : `day-${Math.random().toString(36).substr(2, 9)}`
              }
              className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] "
            >
              <ScrollShadow hideScrollBar className="max-h-[300px]">
                {day.timeSlots.map((timeSlot) => (
                  <div
                    key={String(timeSlot._id)}
                    className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex items-center rounded-md mb-2"
                  >
                    <span>{timeSlot.time}</span>
                    <button
                      className=" mr-0 ml-auto"
                      onClick={async () => {
                        try {
                          await dispatch(
                            deleteAvailableDate({
                              calendarId: day._id,
                              timeSlotId: timeSlot._id,
                            })
                          ).unwrap();
                          dispatch(
                            getAvailableDates({
                              doctorId,
                              query: `?weekOffset=${weekOffset}`,
                            })
                          );
                        } catch (error) {
                          console.error(
                            "Error deleting available date:",
                            error
                          );
                          // Handle errors if needed
                        }
                      }}
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
    </>
  );
}
