"use client";

import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { fetchAllDoctors } from "@lib/redux/slices/doctorprofile/doctorProfileSlice";
import { CheckboxGroup, Checkbox, Button, Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect } from "react";
import specialities from "../../../data/specialities.js";
import { languages } from "../../../data/types.js";
import { useRouter } from "next/navigation.js";
import dynamic from "next/dynamic";

const DoctorList = dynamic(() => import("./DoctorList"), {
  loading: () => (
    <div className="absolute top-1/2 left-1/2 ">
      <Spinner size="lg" />
    </div>
  ),
});

export default function Doctors() {
  const dispatch = useAppDispatch();
  const doctors = useAppSelector((state) => state.doctorProfile.doctors);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

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

      <DoctorList doctors={doctors} />
    </>
  );
}
