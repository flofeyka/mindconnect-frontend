"use client";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  DoctorProfile,
  getDoctorDetails,
  updateDoctorProfile,
} from "@lib/redux/slices/doctordetails/doctorDetailsSlice";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { RefreshCw, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  consultTypes,
  currencies,
  fieldsOfproblems,
  languages,
} from "../../../data/types";
export default function MyDoctorProfile() {
  const dispatch = useAppDispatch();
  const doctor = useAppSelector((state) => state.doctorDetails.profile);
  const loading = useAppSelector((state) => state.doctorDetails.loading);
  const error = useAppSelector((state) => state.doctorDetails.error);

  useEffect(() => {
    dispatch(getDoctorDetails());
  }, [dispatch]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<DoctorProfile>>({});
  const [image, setImage] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Update form data when profile is loaded
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      priceOneHour: {
        ...prev.priceOneHour,
        price: value,
        currency: prev.priceOneHour?.currency || "", // Ensure currency is always a string
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // photo upload
  const handlePhotoUpload = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
      setFormData(e.target?.result as any);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const resetPhoto = () => {
    setImage(null);
    setPhotoPreview(null);
  };
  // photo upload

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateDoctorProfile(formData));
    setEditMode(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {typeof error === "string" ? error : "An unknown error occurred"}
      </div>
    );
  if (!doctor) return <div>No profile data available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Profile</h1>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="relative max-w-96 mb-4">
            <h2 className="mb-4">Profile image</h2>
            {photoPreview ? (
              <>
                <img
                  src={photoPreview}
                  alt="Upload preview"
                  className="max-w-full h-80 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute top-[0px] right-0"
                  onClick={resetPhoto}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Photo
                </Button>
              </>
            ) : (
              <label
                htmlFor="photo-upload"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                  isDragging ? "border-blue-500 bg-blue-50" : ""
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePhotoUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                />
              </label>
            )}
          </div>
          <div>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              label="First Name"
              className="max-w-72 mb-4"
            />
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              label="Last Name"
              className="max-w-72 mb-4"
            />
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              label="Profile Short description"
              className="max-w-72 mb-4"
            />
            {/* Add more form fields for other profile properties */}
          </div>
          <Input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleInputChange}
            label="Phone Number"
            className="max-w-72 mb-4"
          />
          <div className="flex gap-4">
            <Input
              type="text"
              id="Price"
              name="Price"
              value={formData.priceOneHour?.price || ""}
              onChange={handlePriceInputChange}
              label="Price"
              className="max-w-72 mb-4"
            />
            <Select
              label="Choose your currency"
              placeholder="Choose a currency"
              selectionMode="single"
              className="max-w-xs"
              defaultSelectedKeys={[formData.priceOneHour?.currency || ""]}
            >
              {currencies.map((currency) => (
                <SelectItem key={currency.key}>{currency.label}</SelectItem>
              ))}
            </Select>
          </div>
          <Select
            label="Type of consultations"
            placeholder="Select types"
            selectionMode="multiple"
            className="max-w-xs block"
            defaultSelectedKeys={formData.typeOfConsultation}
          >
            {consultTypes.map((consultType) => (
              <SelectItem key={consultType.key}>{consultType.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="Fields of Problems"
            placeholder="Select Fields"
            selectionMode="multiple"
            className="max-w-xs block mt-4"
            defaultSelectedKeys={formData.fieldsOfProblems}
          >
            {fieldsOfproblems.map((field) => (
              <SelectItem key={field.key}>{field.label}</SelectItem>
            ))}
          </Select>
          <Textarea
            id="aboutme"
            name="aboutme"
            value={formData.aboutMe || ""}
            onChange={handleInputChange}
            label="About you"
            className=" mt-4"
          />
          <Select
            label="Fields of Problems"
            placeholder="Select Fields"
            selectionMode="multiple"
            className="max-w-xs block mt-4"
            defaultSelectedKeys={formData.languages}
          >
            {languages.map((language) => (
              <SelectItem key={language.key}>{language.label}</SelectItem>
            ))}
          </Select>

          <Button type="submit" color="primary" className="">
            Save Changes
          </Button>
          <Button
            onClick={() => setEditMode(false)}
            color="secondary"
            className="ml-4"
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-secondary rounded-xl shadow-md overflow-hidden p-5">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="w-full object-cover md:w-48"
                  src={doctor.image as any}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  width={192}
                />
              </div>
              <div className="p-8">
                <div className="flex gap-2">
                  {doctor.typeOfConsultation.map((index) => (
                    <div
                      key={index}
                      className="uppercase tracking-wide  text-sm text-indigo-500 font-semibold"
                    >
                      {index}
                    </div>
                  ))}
                </div>

                <h1 className="mt-2 text-3xl leading-8 font-bold tracking-tight">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h1>
                <p className="mt-2 text-gray-500">
                  {doctor.yearsOfExperience} years of experience • {doctor.age}{" "}
                  years old • {doctor.gender}
                </p>
                <p className="mt-4 text-lg ">{doctor.description}</p>
                <Button
                  onClick={() => setEditMode(true)}
                  color="primary"
                  className="mt-4"
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold ">
                    Contact Information
                  </h2>
                  <p className="mt-1 ">{doctor.phoneNumber}</p>
                  <p className="mt-1 ">
                    {doctor.city}, {doctor.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold ">Consultation Fee</p>
                  <p className="mt-1 ">
                    {doctor.priceOneHour.price} {doctor.priceOneHour.currency} /
                    hour
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold ">About Me</h2>
              <p className="mt-2 text-gray-200 ">{doctor.aboutMe}</p>
            </div>

            <div className="px-8 py-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold ">Specializations</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.fieldsOfProblems.map((field, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold ">Languages</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
