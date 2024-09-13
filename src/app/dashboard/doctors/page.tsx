"use client";

import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { fetchAllDoctors } from "@lib/redux/slices/doctorprofile/doctorProfileSlice";
import { CheckboxGroup, Checkbox, Button } from "@nextui-org/react";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect } from "react";
import specialities from "../../../data/specialities.js";
import { languages } from "../../../data/types.js";
import { useRouter } from "next/navigation.js";

export default function Doctors() {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((state) => state.doctorProfile.doctors);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);
  const currentId = useAppSelector((state) => state.Calendar.oneCalendar?._id);

  useEffect(() => {
    router.prefetch(`/dashboard/doctor/[id]`);
    router.prefetch(`/dashboard/doctor-details/[doctorId]`);
    router.prefetch("/dashboard/chat");
  }, [router]);

  return (
    <>
      <div className="flex justify-center mt-5 items-center">
        <Input
          isClearable
          placeholder="Search by name or problem"
          startContent={<Icon path="/icons/search.svg" />}
          className="max-w-[400px] origin-center mr-2"
        />
        <Autocomplete
          placeholder="Your problem"
          defaultItems={specialities}
          className="max-w-xs mr-2"
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          placeholder="Choose a language"
          defaultItems={languages}
          className="max-w-xs mr-2"
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
        <CheckboxGroup orientation="horizontal" color="secondary">
          <Checkbox value="buenos-aires">Male</Checkbox>
          <Checkbox value="sydney">Female</Checkbox>
        </CheckboxGroup>
      </div>

      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id} className="flex justify-center p-5">
            <div
              onClick={() => router.push(`/dashboard/doctor/${doctor._id}`)}
              className="w-[836px] block cursor-pointer"
            >
              <Card className="max-w-[836px] mx-auto h-48">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <Avatar
                      isBordered
                      radius="full"
                      size="lg"
                      src={
                        doctor.image ||
                        "https://nextui.org/avatars/avatar-1.png"
                      }
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {doctor.firstName} {doctor.lastName}
                      </h4>
                      <h5 className="text-small tracking-tight text-default-400">
                        {doctor.email}
                      </h5>
                    </div>
                    <Button
                      color="primary"
                      variant="solid"
                      className="mr-0 ml-auto"
                      onClick={() =>
                        router.push(`/dashboard/doctor/${doctor._id}`)
                      }
                    >
                      Go to Profile
                    </Button>
                  </div>
                </CardHeader>

                <CardBody className="px-3 py-0 text-small text-default-400">
                  <p>{doctor.description}</p>
                </CardBody>
                <CardFooter className="gap-3">
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">
                      {doctor.subscribedTo.length}
                    </p>
                    <p className=" text-default-400 text-small">Following</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">
                      {doctor.subscribers.length}
                    </p>
                    <p className="text-default-400 text-small">Followers</p>
                  </div>

                  <Button
                    color="primary"
                    variant="solid"
                    className="mr-0 ml-auto"
                    onClick={() =>
                      router.push(`/dashboard/doctor-details/${doctor._id}`)
                    }
                  >
                    Book an appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
