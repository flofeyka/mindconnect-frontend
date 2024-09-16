"use client";

import Icon from "@components/Icon";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  getAvailableDates,
  sendConsultationEmail,
} from "@lib/redux/slices/doctorcalendar/doctorCalendarSlice";
import { DoctorCalendarType, TimeSlot } from "@lib/types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface DoctorCalendarProps {
  doctorId: string;
}

export default function DoctorPublicCalendar({
  doctorId,
}: DoctorCalendarProps) {
  const dispatch = useAppDispatch();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<{
    calendarId: string;
    timeSlotId: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalSend = useDisclosure();
  const modalSuccess = useDisclosure();

  const calendar = useAppSelector((state) => state.doctorCalendar.calendar);
  const loading = useAppSelector((state) => state.doctorCalendar.isPending);

  const handleSendEmail = async () => {
    if (
      selectedTimeSlot?.date &&
      selectedTimeSlot?.time &&
      selectedTimeSlotIds?.calendarId &&
      selectedTimeSlotIds.timeSlotId
    )
      await dispatch(
        sendConsultationEmail({
          params: {
            doctorId,
            calendarId: selectedTimeSlotIds?.calendarId,
            timeSlotId: selectedTimeSlotIds.timeSlotId,
          },
          data: {
            date: selectedTimeSlot?.date,
            time: selectedTimeSlot?.time,
            text: message,
          },
        })
      )
        .then(() => {
          setIsModalOpen(true);
          modalSuccess.onOpen();
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
  };

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

  const handleNextWeek = () => {
    setWeekOffset((prevOffset) => prevOffset + 1);
  };

  const handlePreviousWeek = () => {
    if (weekOffset == 0) {
      return;
    }
    setWeekOffset((prevOffset) => prevOffset - 1);
  };

  const handleTimeSlotSelect = (
    date: string,
    time: string,
    calendarId: string,
    timeSlotId: string
  ) => {
    setSelectedTimeSlot({ date, time });
    setSelectedTimeSlotIds({ calendarId, timeSlotId });
  };

  return (
    <>
      <Card className="p-3 max-w-[1510px]">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Select date and time for a consultation:
          </h3>
          <div className="flex gap-3">
            {weekOffset > 0 && (
              <button onClick={handlePreviousWeek}>
                <ArrowLeft />
              </button>
            )}
            <button onClick={handleNextWeek}>
              <ArrowRight />
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
              className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between basis-[200px] flex-grow flex-shrink min-w-[158px]"
            >
              <ScrollShadow hideScrollBar className="max-h-[300px]">
                {day.timeSlots.map((timeSlot) => (
                  <div
                    key={String(timeSlot._id)}
                    onClick={() =>
                      handleTimeSlotSelect(
                        String(day.date),
                        timeSlot.time,
                        day._id,
                        timeSlot._id
                      )
                    }
                    className={`cursor-pointer border bg-[#1CA66F] bg-opacity-[0.1] p-2 flex items-center rounded mb-2 ${
                      selectedTimeSlot &&
                      selectedTimeSlot.date === String(day.date) &&
                      selectedTimeSlot.time === timeSlot.time
                        ? "border border-green-500"
                        : ""
                    }`}
                  >
                    <span>{timeSlot.time}</span>
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
        {selectedTimeSlot && (
          <div className="mt-4 text-left p-3">
            <div className="flex gap-4 items-center mb-4">
              <h3 className="text-lg font-semibold">Selected Time:</h3>
              <p className="text-[#1CA66F] ">
                {formatDateToDayMonth(selectedTimeSlot.date)} at{" "}
                {selectedTimeSlot.time}
              </p>
            </div>
            <Textarea
              label="Add any related comments"
              placeholder="Enter your message..."
              value={message}
              onValueChange={setMessage}
              size="lg"
            />
            <Button onPress={modalSend.onOpen} color="primary" className="mt-4">
              Send Email
            </Button>
            <Modal
              isOpen={modalSend.isOpen}
              onOpenChange={modalSend.onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Are you sure that you want to apply for consultation on{" "}
                      {formatDateToDayMonth(selectedTimeSlot.date)} at{" "}
                      {selectedTimeSlot.time}
                    </ModalHeader>
                    <ModalBody className="mb-4">
                      <Button color="danger" onPress={onClose}>
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        color="primary"
                        onPress={() => {
                          handleSendEmail();
                          onClose();
                        }}
                      >
                        Yes, send
                      </Button>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        )}
      </Card>
      {isModalOpen && (
        <Modal
          isOpen={modalSuccess.isOpen}
          onOpenChange={modalSuccess.onOpenChange}
          defaultOpen={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Email has been successfully sent
                </ModalHeader>
                <ModalBody className="mb-4">
                  <Button color="primary" onPress={onClose}>
                    Alright, close me
                  </Button>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
