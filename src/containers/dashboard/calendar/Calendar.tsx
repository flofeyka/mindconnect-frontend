'use client'
import CalendarActions from "@components/CalendarActions";
import Icon from "@components/Icon";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import formatDateToTime from "@helpers/formatDateToTime";
import { useAppSelector } from "@lib/redux/hooks";
import { Card, CardBody, CardHeader, Divider, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { useRef, useState } from "react";
import CalendarItem from "./CalendarItem";

export default function Calendar() {

    const { calendar } = useAppSelector(state => state.Calendar);

    return <Card className="p-3 relative h-full">
        <CardHeader className="flex justify-between items-center">
            <div className="font-semibold text-xl">Calendar</div>
            <div className="flex gap-3">
                <Icon path="arrow-left.svg" className="cursor-pointer" />
                <Icon
                    path="arrow-left.svg"
                    className="rotate-180 cursor-pointer"
                />
            </div>
        </CardHeader>
        <CardBody className="flex flex-row gap-x-4">
            {calendar.slice(0, 5).map(calendarNote => <CalendarItem calendar={calendar} calendarNote={calendarNote} />)}
        </CardBody>
    </Card>
}