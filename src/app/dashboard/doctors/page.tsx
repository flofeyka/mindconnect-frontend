"use client";

import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { fetchAllDoctors } from "@lib/redux/slices/doctorprofile/doctorProfileSlice";
import { Gender, Language, Problem } from "@lib/types";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  CheckboxGroup,
  Input,
  Spinner,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const [search, setSearch] = useState<string>("");
  const [problem, setProblem] = useState<Problem>(Problem.ALCOHOL_USE_DISORDER);
  const [language, setLanguage] = useState<Language>(Language.RUSSIAN);
  const [gender, setGender] = useState<Gender>(Gender.NOT_SELECTED);

  useEffect(() => {
    dispatch(
      fetchAllDoctors({
        search,
        problems: [problem],
        languages: [language],
        gender,
      })
    );
  }, [dispatch, search, problem, language, gender]);

  useEffect(() => {
    router.prefetch(`/dashboard/doctor/[id]`);
    router.prefetch(`/dashboard/doctor-details/[doctorId]`);
    router.prefetch("/dashboard/chat");
  }, [router]);

  return (
    <>
      <div className="flex justify-center overflow-x-hidden mt-5 items-center">
        <Input
          isClearable
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Поиск по имени или проблеме"
          startContent={<Icon path="/icons/search.svg" />}
          className="max-w-[400px] origin-center mr-2"
        />
        <Autocomplete
          onSelectionChange={(value) => setProblem(value as Problem)}
          value={problem}
          placeholder="Ваша проблема"
          defaultItems={Object.entries(Problem)}
          className="max-w-xs mr-2"
        >
          {(item) => (
            <AutocompleteItem key={item[0]}>{item[1]}</AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          onSelectionChange={(value) => setLanguage(value as Language)}
          value={language}
          placeholder="Выберите язык"
          defaultItems={Object.entries(Language)}
          className="max-w-xs mr-2"
        >
          {(item) => (
            <AutocompleteItem key={item[0]}>{item[1]}</AutocompleteItem>
          )}
        </Autocomplete>
        <CheckboxGroup orientation="horizontal" color="secondary">
          <Checkbox value={Gender.MALE}>Мужчина</Checkbox>
          <Checkbox value={Gender.FEMALE}>Женщина</Checkbox>
          <Checkbox value={undefined}>Не важно</Checkbox>
        </CheckboxGroup>
      </div>

      <DoctorList doctors={doctors} />
    </>
  );
}
