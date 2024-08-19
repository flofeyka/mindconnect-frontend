"use client"

import Icon from "@components/Icon"
import formatDateToDayMonth from "@helpers/formatDateToDayMonth"
import formatDateToTime from "@helpers/formatDateToTime"
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks"
import { getAvailableDates } from "@lib/redux/slices/doctorcalendar/doctorCalendarSlice"
import { Card, CardBody, CardHeader, Divider, ScrollShadow } from "@nextui-org/react"
import { useEffect } from "react"

interface DoctorCalendarProps {
    doctorId: string;
  }

export default function DoctorCalendar({ doctorId }: DoctorCalendarProps) {
    const dispatch = useAppDispatch()
    const calendar = useAppSelector(state => state.doctorCalendar.calendar)

    console.log(doctorId)
    useEffect(() => {
        if (doctorId) {
          const timer = setTimeout(() => {
            console.log("Dispatching getAvailableDates with doctorId:", doctorId);
            dispatch(getAvailableDates(doctorId));
          }, 2000); 

          return () => clearTimeout(timer);
        } else {
          console.log("doctorId is undefined, not dispatching");
        }
      }, [dispatch, doctorId]);
    
    

    console.log(calendar)

    return <Card className="p-3 ">
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
      {calendar.slice(0, 5).map((day) => (
        <div
          key={String(day._id)}
          className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] "
        >
          <ScrollShadow hideScrollBar className="max-h-[300px]">
            {day.timeSlots.map((timeSlot) => (
              <div
                key={String(timeSlot._id)}
                className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex  items-center gap-x-2 rounded-md mb-2"
              >
                <span>{timeSlot.time}</span>
              </div>
            ))}
          </ScrollShadow>

          <div>
            <Divider />
            <div className="text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5">
              {formatDateToDayMonth(String(day.date))}
              <div
                className="cursor-pointer p-1 bg-[#1CA66F1A] rounded-[32px] relative "
              >
                <Icon path="/icons/plus.svg " />
              </div>
            </div>
          </div>
        </div>
      ))}
    </CardBody>
  </Card>
}