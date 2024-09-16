"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getPublicDoctorDetails } from "@lib/redux/slices/doctordetails/doctorDetailsSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { MapPin, Clock, Globe, Phone, DollarSign } from "lucide-react";
import DoctorPublicCalendar from "@components/DoctorDetails/DoctorPublicCalendar";
import { Card } from "@nextui-org/react";

export default function DoctorDetails() {
  const params = useParams();
  const doctorId = params.doctorId;
  const dispatch = useAppDispatch();
  const doctorProfile = useAppSelector((state) => state.doctorDetails.profile);

  useEffect(() => {
    dispatch(getPublicDoctorDetails(doctorId as string));
  }, [dispatch, doctorId]);

  console.log(doctorProfile);

  return (
    <div className="bg-[#111] min-h-screen flex flex-col items-center pb-44">
      <div className="container max-w-[1281px] mx-auto px-4 py-8">
        <Card className="max-w-[1281px]">
          <div className="md:flex">
            <div className="md:flex-shrink-0 p-2  ">
              <img
                className="h-48 w-full object-cover md:w-48 rounded"
                src={doctorProfile?.image as any}
                alt={`${doctorProfile?.firstName} ${doctorProfile?.lastName}`}
              />
            </div>
            <div className="p-8 flex gap-10 items-end">
              <div>
                <div className="uppercase tracking-wide text-sm text-[#1CA66F] font-semibold">
                  {doctorProfile?.typeOfConsultation.join(", ")}
                </div>
                <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight">
                  Dr. {doctorProfile?.firstName} {doctorProfile?.lastName}
                </h1>
                <p className="mt-2 text-gray-400">
                  {doctorProfile?.description}
                </p>
                <div className="mt-4 flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  {doctorProfile?.city}, {doctorProfile?.country}
                </div>
                <div className="mt-2 flex items-center text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  {doctorProfile?.yearsOfExperience} years of experience
                </div>
              </div>
              <div>
                <div className="mt-2 flex items-center text-gray-400">
                  <Globe className="h-5 w-5 mr-2" />
                  {doctorProfile?.languages.join(", ")}
                </div>
                <div className="mt-2 flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  {doctorProfile?.phoneNumber}
                </div>
              </div>
              <div className="mt-2 flex items-center text-gray-400">
                <DollarSign className="h-5 w-5 mr-2" />
                {doctorProfile?.priceOneHour.price}{" "}
                {doctorProfile?.priceOneHour.currency} / hour
              </div>
            </div>
          </div>
          <div className="px-8 py-6 bg-[#1CA66F] bg-opacity-[0.1] ">
            <h2 className="text-xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-300">{doctorProfile?.aboutMe}</p>
          </div>
          <div className="px-8 py-6">
            <h2 className="text-xl font-semibold mb-4">Fields of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {doctorProfile?.fieldsOfProblems.map((field, index) => (
                <span
                  key={index}
                  className="bg-[#1CA66F] text-white px-3 py-1 rounded-full text-sm"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <DoctorPublicCalendar doctorId={doctorId as string} />
    </div>
  );
}
