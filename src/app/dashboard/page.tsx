"use client";
import Icon from "@components/Icon";
import Calendar from "@containers/dashboard/calendar/Calendar";
import Profile from "@containers/dashboard/profile/Profile";
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
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.usersData);

  useEffect(() => {
    dispatch(
      getCalendarByDates({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
      })
    );
  }, [dispatch]);

  return (
    <div className="px-[30px] py-5">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-x-[35px]">
          <h3 className="font-semibold text-[22px]">Дашборд</h3>
        </div>
        <div className="flex items-center gap-x-[30px]">
          <Icon path="/icons/notifications.svg" className="cursor-pointer" />
          <Profile user={user} />
        </div>
      </header>
      <div className="flex gap-x-[20px]">
        <div className="w-[65vw]">
          <Calendar />
        </div>
        <div className="w-[25vw]">
          <Card className="p-3 flex-grow relative h-full">
            <CardHeader className="flex justify-between items-center font-semibold text-xl">
              Ваш психолог
              <Icon
                path="/arrow-left.svg"
                className="rotate-180 cursor-pointer"
              />
            </CardHeader>
            <CardBody>
              <div className="mx-auto flex flex-col items-center gap-y-4 mt-8">
                <Avatar src="/avatar.png" className="w-[100px] h-[100px]" />
                <span className="font-semibold text-[17px]">Мария Вертиго</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
