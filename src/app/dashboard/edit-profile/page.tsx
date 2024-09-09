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
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import DoctorSingleSelect from "@components/EditProfile/DoctorSingleSelect";
import DoctorCalendar from "@components/DoctorDetails/DoctorCalendar";

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

  const handleImageChange = (newImage: File | null) => {
    setImage(newImage);
    setFormData((prevData: Partial<DoctorProfile>) => ({
      ...prevData,
      image: newImage || undefined,
    }));
  };

  const handleInputChange = (field: keyof DoctorProfile) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange =
    (field: keyof DoctorProfile) => (value: string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
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
        currency: prev.priceOneHour?.currency || "",
      },
    }));
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

  console.log(doctor?.id);

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
            Edit Your Doctor's Profile
          </h1>
          <DoctorCalendar doctorId={doctor?.id as string} loading={loading} />

          <form
            className="flex gap-32 justify-center items-start mt-16 mb-6"
            id="edit-profile-form"
          >
            {isImageUploaded ? (
              <div>
                <img
                  src={doctor?.image as any}
                  alt={doctor?.firstName}
                  className="w-[250px] mb-5"
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
                <PhotoUpload image={image} onImageChange={handleImageChange} />
                <Button
                  type="button"
                  color="danger"
                  onClick={() => setIsImageUplaoded(true)}
                  className="mt-5"
                >
                  Cancel
                </Button>
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
                />
                <DoctorInput
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange("lastName")}
                  label="Last Name"
                />
              </div>
              <div className="flex gap-3">
                <DoctorInput
                  id="age"
                  name="age"
                  value={(formData.age as any) || ""}
                  onChange={handleInputChange("age")}
                  label="Your Age"
                />
                <DoctorInput
                  id="phoneNumber"
                  name="phoneNumber"
                  value={(formData.phoneNumber as any) || ""}
                  onChange={handleInputChange("phoneNumber")}
                  label="Your Phone Number"
                />
              </div>
              <DoctorTextArea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange("description")}
                label="Profile Short description"
              />
              <DoctorTextArea
                id="aboutme"
                name="aboutme"
                value={formData.aboutMe || ""}
                onChange={handleInputChange("aboutMe")}
                label="About Me"
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
                className="max-w-[600px] mb-4"
              />
              <div className="flex gap-4">
                <Input
                  type="number"
                  id="Price"
                  name="Price"
                  value={formData.priceOneHour?.price || ""}
                  onChange={handlePriceInputChange}
                  label="Price"
                  className="max-w-72 mb-4"
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
                <DoctorInput
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleInputChange("country")}
                  label="Country"
                />
                <DoctorInput
                  id="city"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange("city")}
                  label="City"
                />
              </div>
              <div className="flex gap-3">
                <DoctorInput
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={(formData.yearsOfExperience as any) || ""}
                  onChange={handleInputChange("yearsOfExperience")}
                  label="Years Of Experience"
                />
                <DoctorInput
                  id="gender"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange("gender")}
                  label="Your Gender"
                />
              </div>

              <Button color="primary" onPress={modal1.onOpen}>
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
                      >
                        Yes, save
                      </Button>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </form>
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
