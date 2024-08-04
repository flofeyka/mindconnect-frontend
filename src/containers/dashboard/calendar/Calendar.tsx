"use client";
import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import CalendarItem from "./CalendarItem";
import { useEffect } from "react";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import { getCalendarByDates } from "@lib/redux/slices/calendar/calendarSlice";

export default function Calendar() {
  const { calendar } = useAppSelector((state) => state.Calendar);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getCalendarByDates({ startDate: "2024-01-01", endDate: "2024-07-18" })
    );
  }, [dispatch]);


  return (
    <Card className="p-3 relative h-full">
      <CardHeader className="flex justify-between items-center">
        <div className="font-semibold text-xl">Calendar</div>
        <div className="flex gap-3">
          <Icon path="arrow-left.svg" className="cursor-pointer" />
          <Icon path="arrow-left.svg" className="rotate-180 cursor-pointer" />
        </div>
      </CardHeader>
      <CardBody className="flex flex-row gap-x-4">
        {calendar.slice(0, 5).map((calendarNote) => (
          <CalendarItem currentCalendar={calendarNote} calendarNote={calendarNote} />
        ))}
      </CardBody>
    </Card>
  );
}
