"use client";

import DoctorInput from "@components/EditProfile/DoctorInput";
import DoctorMultipleSelect from "@components/EditProfile/DoctorMultipleSelect";
import DoctorTextArea from "@components/EditProfile/DoctorTextArea";
import PhotoUpload from "@components/EditProfile/PhotoUpload";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  DoctorProfile,
  getDoctorDetails,
  PriceOneHour,
  updateDoctorProfile,
} from "@lib/redux/slices/doctordetails/doctorDetailsSlice";
import { useEffect, useState } from "react";
import {
  consultTypes,
  currencies,
  fieldsOfproblems,
  languages,
} from "../../../data/types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import DoctorSingleSelect from "@components/EditProfile/DoctorSingleSelect";
import dynamic from "next/dynamic";
import { DoctorSelectPlace } from "@components/EditProfile";

const DoctorCalendar = dynamic(
  () => import("@components/DoctorDetails/DoctorCalendar"),
  {
    loading: () => (
      <div className="absolute top-1/2 left-1/2 ">
        <Spinner size="lg" />
      </div>
    ),
  }
);

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const doctor = useAppSelector((state) => state.doctorDetails.profile);
  const loading = useAppSelector((state) => state.doctorDetails.loading);
  const modal1 = useDisclosure();
  const modalSuccess = useDisclosure();

  useEffect(() => {
    dispatch(getDoctorDetails());
  }, [dispatch]);

  const [formData, setFormData] = useState<Partial<DoctorProfile>>({});
  const [image, setImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageUploaded, setIsImageUplaoded] = useState(false);
  const [validationsFormData, setValidationsFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phoneNumber: "",
    description: "",
    aboutMe: "",
    priceOneHour: "",
    country: "",
    city: "",
    yearsOfExperience: "",
    gender: "",
  });
  const [isValidAll, setIsValidAll] = useState(false);

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  useEffect(() => {
    if (doctor?.image) {
      setIsImageUplaoded(true);
    }
  }, [doctor]);

  useEffect(() => {
    if (validationsFormData) {
      const isValidAll = Object.values(validationsFormData).every(
        (value) => value === ""
      );
      setIsValidAll(isValidAll);
    }
  }, [validationsFormData]);

  const handleImageChange = (newImage: File | null) => {
    setImage(newImage);
    setFormData((prevData: Partial<DoctorProfile>) => ({
      ...prevData,
      image: newImage || undefined,
    }));
  };

  // Определяем правила валидации для каждого поля профиля доктора
  const validationRules: {
    [key in keyof DoctorProfile]?: (value: string) => string;
  } = {
    firstName: (value) => {
      if (value.length < 3 || value.length > 32) {
        return "This field must contain between 3 and 32 characters";
      }
      return "";
    },
    lastName: (value) => {
      if (value.length < 3 || value.length > 32) {
        return "This field must contain between 3 and 32 characters";
      }
      return "";
    },
    country: (value) => {
      if (!value) {
        return "Country is required";
      }
      return "";
    },
    city: (value) => {
      if (!value) {
        return "City is required";
      }
      return "";
    },
    age: (value) => {
      value = value.trim();
      const num = Number(value);
      if (isNaN(num)) {
        return "Age must be a number";
      }
      if (num < 10 || num > 100) {
        return "Age must be between 10 and 100 years";
      }
      return "";
    },
    phoneNumber: (value) => {
      if (value.length > 15) {
        return "This field cannot be longer than 15 characters";
      }
      if (!value.startsWith("+")) {
        return "Phone number must start with '+'";
      }
      return "";
    },
    description: (value) => {
      if (value.length > 255) {
        return "This field cannot be longer than 255 characters";
      }
      return "";
    },
    aboutMe: (value) => {
      if (value.length > 2500) {
        return "This field cannot be longer than 2500 characters";
      }
      return "";
    },
    yearsOfExperience: (value) => {
      const num = Number(value);
      if (isNaN(num)) {
        return "Years of experience must be a number";
      }
      if (num < 0 || num > 100) {
        return "Work experience must be between 0 and 100 years";
      }
      return "";
    },
    gender: (value) => {
      if (value.length > 32) {
        return "This field cannot be longer than 32 characters";
      }
      return "";
    },
  };

  /**
   * Обрабатывает изменение значения поля формы и выполняет валидацию.
   * @param field - имя поля профиля доктора
   * @returns Функция, принимающая новое значение поля
   */
  const handleInputChange = (field: keyof DoctorProfile) => (value: string) => {
    // Обновляем состояние данных формы
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Проверяем наличие правил валидации для данного поля
    if (validationRules[field]) {
      const errorMessage = validationRules[field]!(value);
      setValidationsFormData((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleSelectChange =
    (field: keyof DoctorProfile) => (value: string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handlePriceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      priceOneHour: {
        ...prev.priceOneHour,
        price: value,
        currency: prev.priceOneHour?.currency || "",
      },
    }));
    if (Number(value) > 10000 && formData.priceOneHour?.currency === "UAH") {
      setValidationsFormData((prev) => ({
        ...prev,
        priceOneHour: "Price must be less than 10000",
      }));
    } else if (
      Number(value) > 1000 &&
      (formData.priceOneHour?.currency === "USD" ||
        formData.priceOneHour?.currency === "EUR")
    ) {
      setValidationsFormData((prev) => ({
        ...prev,
        priceOneHour: "Price must be less than 1000",
      }));
    } else {
      setValidationsFormData((prev) => ({ ...prev, priceOneHour: "" }));
    }
  };

  const handleSingleSelectChange =
    (field: "priceOneHour") => (value: string) => {
      setFormData((prev: Partial<DoctorProfile>) => ({
        ...prev,
        [field]: {
          ...prev[field],
          currency: value,
        } as PriceOneHour,
      }));
    };

  const handleSubmit = () => {
    console.log(formData);
    dispatch(updateDoctorProfile(formData))
      .then(() => {
        setIsModalOpen(true);
        modalSuccess.onOpen();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <Spinner
          color="primary"
          size="lg"
          className="absolute top-0 bottom-0 left-0 right-0"
        />
      ) : (
        <>
          <h1 className="title text-3xl mt-6 text-center">
            Edit Your Doctor&apos;s Profile
          </h1>

          <DoctorCalendar doctorId={doctor?.id as string} loading={loading} />
          <div className="w-[1250px]">
            <form
              className="flex justify-between items-start mt-16 mb-6 "
              id="edit-profile-form"
            >
              {isImageUploaded ? (
                <div>
                  <img
                    src={doctor?.image as any}
                    alt={doctor?.firstName}
                    className="w-[350px] mb-5"
                  />
                  <Button
                    type="button"
                    color="primary"
                    onClick={() => setIsImageUplaoded(false)}
                  >
                    Upload new image
                  </Button>
                </div>
              ) : (
                <div>
                  <PhotoUpload
                    image={image}
                    onImageChange={handleImageChange}
                  />
                  <div className="flex justify-between items-center mt-5">
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => setIsImageUplaoded(true)}
                    >
                      Cancel
                    </Button>
                    <Button color="primary" onPress={modal1.onOpen}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex gap-3">
                  <DoctorInput
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange("firstName")}
                    label="First Name"
                    error={validationsFormData.firstName}
                  />
                  <DoctorInput
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange("lastName")}
                    label="Last Name"
                    error={validationsFormData.lastName}
                  />
                </div>
                <div className="flex gap-3">
                  <DoctorInput
                    id="age"
                    name="age"
                    value={(formData.age as any) || ""}
                    onChange={handleInputChange("age")}
                    label="Your Age"
                    error={validationsFormData.age}
                  />
                  <DoctorInput
                    id="phoneNumber"
                    name="phoneNumber"
                    value={(formData.phoneNumber as any) || ""}
                    onChange={handleInputChange("phoneNumber")}
                    label="Your Phone Number"
                    error={validationsFormData.phoneNumber}
                  />
                </div>
                <DoctorTextArea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange("description")}
                  label="Profile Short Description"
                  error={validationsFormData.description}
                />
                <DoctorTextArea
                  id="aboutMe"
                  name="aboutMe"
                  value={formData.aboutMe || ""}
                  onChange={handleInputChange("aboutMe")}
                  label="About Me"
                  error={validationsFormData.aboutMe}
                />
                <div className="flex gap-3">
                  <DoctorMultipleSelect
                    label="Type of Consultation"
                    placeholder="Select types"
                    options={consultTypes}
                    value={formData.typeOfConsultation || []}
                    onChange={handleSelectChange("typeOfConsultation")}
                  />
                  <DoctorMultipleSelect
                    label="Languages"
                    placeholder="Select languages"
                    options={languages}
                    value={formData.languages || []}
                    onChange={handleSelectChange("languages")}
                  />
                </div>
                <DoctorMultipleSelect
                  label="Fields of Problems"
                  placeholder="Select Fields"
                  options={fieldsOfproblems}
                  value={formData.fieldsOfProblems || []}
                  onChange={handleSelectChange("fieldsOfProblems")}
                  className="w-[712px] mb-4"
                />
                <div className="flex gap-3">
                  <Input
                    type="number"
                    id="Price"
                    name="Price"
                    value={formData.priceOneHour?.price || ""}
                    onChange={handlePriceInputChange}
                    label="Price"
                    className="w-[350px] mb-4"
                    isInvalid={!!validationsFormData.priceOneHour}
                    errorMessage={validationsFormData.priceOneHour}
                  />
                  <DoctorSingleSelect
                    label="Choose your currency"
                    placeholder="Choose a currency"
                    options={currencies}
                    value={formData.priceOneHour?.currency || ""}
                    onChange={handleSingleSelectChange("priceOneHour")}
                  />
                </div>
                <div className="flex gap-3">
                  <DoctorSelectPlace
                    countryValue={formData.country || ""}
                    cityValue={formData.city || ""}
                    onCountryChange={handleInputChange("country")}
                    onCityChange={handleInputChange("city")}
                    countryError={validationsFormData.country}
                    cityError={validationsFormData.city}
                  />
                </div>
                <div className="flex gap-3">
                  <DoctorInput
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={(formData.yearsOfExperience as any) || ""}
                    onChange={handleInputChange("yearsOfExperience")}
                    label="Years Of Experience"
                    error={validationsFormData.yearsOfExperience}
                  />
                  <DoctorInput
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange("gender")}
                    label="Your Gender"
                    error={validationsFormData.gender}
                  />
                </div>

                <Button
                  color="primary"
                  isDisabled={!isValidAll}
                  onPress={modal1.onOpen}
                >
                  Save Changes
                </Button>
              </div>
              <Modal isOpen={modal1.isOpen} onOpenChange={modal1.onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Are you sure that you want to save changes?
                      </ModalHeader>
                      <ModalBody className="mb-4">
                        <Button color="danger" onPress={onClose}>
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          color="primary"
                          onPress={() => {
                            handleSubmit();
                            onClose();
                          }}
                          isDisabled={!isValidAll}
                        >
                          Yes, save
                        </Button>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </form>
          </div>
        </>
      )}
      {isModalOpen && (
        <Modal
          isOpen={modalSuccess.isOpen}
          onOpenChange={modalSuccess.onOpenChange}
          defaultOpen={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Changes have been applied
                </ModalHeader>
                <ModalBody className="mb-4">
                  <Button color="primary" onPress={onClose}>
                    Alright, close me
                  </Button>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
