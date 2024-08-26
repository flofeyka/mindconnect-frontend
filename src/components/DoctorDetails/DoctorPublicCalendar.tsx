"use client";

import Icon from "@components/Icon";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  getAvailableDates,
  sendConsultationEmail,
} from "@lib/redux/slices/doctorcalendar/doctorCalendarSlice";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
  Textarea,
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
  const calendar = useAppSelector((state) => state.doctorCalendar.calendar);

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
      );
  };

  return (
    <>
      <Card className="p-3">
        <CardHeader className="flex justify-between items-center">
          <div>Select date and time for a consultation:</div>
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
              className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px]"
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
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">Selected Time:</h3>
            <p className="text-[#1CA66F]">
              {formatDateToDayMonth(selectedTimeSlot.date)} at{" "}
              {selectedTimeSlot.time}
            </p>
            <Textarea
              label="Add any related comments"
              placeholder="Enter your message..."
              value={message}
              onValueChange={setMessage}
            />
            <Button onClick={handleSendEmail}>Send Email</Button>
          </div>
        )}
      </Card>
    </>
  );
}
