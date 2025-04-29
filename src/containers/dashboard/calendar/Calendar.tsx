"use client";
import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  calendar,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import CalendarItem from "./CalendarItem";
import {
  addTodayCalendar,
  getOneCalendar,
} from "@lib/redux/slices/calendar/calendarSlice";

export default function Calendar() {
  const [addNoteValue, setAddNoteValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString());

  // const calendar = useAppSelector((state) => state.Calendar.oneCalendar);
  const calendars = useAppSelector((state) => state.Calendar.calendar);
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  console.log(calendar);
  useEffect(() => {
    dispatch(addTodayCalendar({ date: new Date().toISOString() }));
  }, [dispatch]);

  useEffect(() => {
    const date = new Date().toISOString();
    console.log("Inside useEffect:", date);
    // dispatch(addTodayCalendar({ date }));
  }, [dispatch]);

  // const handlePrevCalendar = () => {
  //   if (calendar?.id) {
  //     dispatch(getPrevCalendar(calendar.id));
  //   } else {
  //     dispatch(getPrevCalendar(null));
  //   }
  // };

  // const handleNextCalendar = () => {
  //   if (calendar?.id) {
  //     dispatch(getNextCalendar(calendar.id));
  //   }
  // };

  // // Форматирование даты календаря для отображения
  // const formatCalendarDate = () => {
  //   if (!calendar?.date)
  //     return new Date().toLocaleDateString("default", {
  //       month: "2-digit",
  //       day: "2-digit",
  //     });

  //   try {
  //     if (typeof calendar.date === "object" && "$date" in calendar.date) {
  //       return new Date(calendar.date).toLocaleDateString("default", {
  //         month: "2-digit",
  //         day: "2-digit",
  //       });
  //     }
  //     return new Date(String(calendar.date)).toLocaleDateString("default", {
  //       month: "2-digit",
  //       day: "2-digit",
  //     });
  //   } catch (e) {
  //     return new Date().toLocaleDateString("default", {
  //       month: "2-digit",
  //       day: "2-digit",
  //     });
  //   }
  // };

  return (
    <Card className="p-3 relative h-full">
      <CardHeader className="flex justify-between items-center">
        <div className="font-semibold text-xl">Календарь</div>
        <div className="flex gap-3">
          <input
            type="date"
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            value={new Date(date).toISOString().split("T")[0]}
            onChange={(e) => setDate(new Date(e.target.value).toISOString())}
          />
          <button
            className="cursor-pointer"
            // onClick={handlePrevCalendar}
          >
            <Icon path="arrow-left.svg" />
          </button>
          <button
            className="rotate-180 cursor-pointer"
            // onClick={handleNextCalendar}
          >
            <Icon path="arrow-left.svg" />
          </button>
        </div>
      </CardHeader>
      <CardBody className="flex flex-row gap-x-4">
        {calendars.map((calendar) => (
          <CalendarItem currentCalendar={calendar} key={calendar.id} />
        ))}
      </CardBody>
    </Card>
  );
}
