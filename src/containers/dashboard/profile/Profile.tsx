"use client";

import AnimatedIcon from "@components/AnimatedIcon";
import Icon from "@components/Icon";
import ModalWrapper from "@components/Modal";
import { useAppDispatch } from "@lib/redux/hooks";
import { logout } from "@lib/redux/slices/auth/authSlice";
import { usersDataType } from "@lib/types";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function Profile({ user }: { user: usersDataType }) {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [icon, setIcon] = useState(false);
  const modalLogout = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/dashboard/doctor/${user.id}`);
    router.prefetch("/dashboard/edit-profile");
    router.prefetch("/");
  }, [router]);

  const toggleDropdown = () => {
    setIcon(!icon);
  };
  console.log(user);
  const dispatch = useAppDispatch();

  return (
    <div>
      <ModalWrapper onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent className="p-3">
          {(onClose) => (
            <EditProfileForm
              onClose={onClose}
              image={user.image}
              firstName={user.firstName}
              lastName={user.lastName}
              age={user.age}
              city={user.city}
              country={user.country}
              phoneNumber={user.phoneNumber}
            />
          )}
        </ModalContent>
      </ModalWrapper>
      <Dropdown>
        <DropdownTrigger onClick={toggleDropdown}>
          <div className="flex items-center cursor-pointer">
            <Avatar src={user.image} size="md" />
            <div className="font-semibold ml-2 flex items-center gap-2">
              {user.firstName} {user.lastName}{" "}
              <AnimatedIcon
                height="10px"
                path="/icons/vector-bottom.svg"
                className={`transform transition-transform duration-300 ${
                  icon ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
        </DropdownTrigger>

        {user.isDoctor ? (
          <DropdownMenu>
            <DropdownItem key="settings">
              <div onClick={onOpen}>Настройки</div>
            </DropdownItem>
            <DropdownItem key="profile">
              <div
                onClick={() => {
                  router.push(`/dashboard/doctor/${user.id}`);
                }}
              >
                Мой профиль
              </div>
            </DropdownItem>
            <DropdownItem key="extanded">
              <div
                onClick={() => {
                  router.push("/dashboard/edit-profile");
                }}
              >
                Редактировать детали
              </div>
            </DropdownItem>
            <DropdownItem
              className="mt-3 text-red-700 hover:text-red-700"
              key="l"
            >
              <div onClick={modalLogout.onOpen}>Выйти</div>
            </DropdownItem>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownItem key="d">
              <div onClick={onOpen}>Мои данные</div>
            </DropdownItem>

            <DropdownItem
              className="mt-3 text-red-700 hover:text-red-700"
              key="l"
            >
              {/* <LogoutModal /> Should be a logout modal */}
              <div onClick={modalLogout.onOpen}>Выйти</div>
            </DropdownItem>
          </DropdownMenu>
        )}
      </Dropdown>
      <Modal
        isOpen={modalLogout.isOpen}
        onOpenChange={modalLogout.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Вы действительно хотите выйти?
              </ModalHeader>
              <ModalBody>
                <Button color="primary" onPress={modalLogout.onClose}>
                  Отмена
                </Button>
                <Button
                  type="button"
                  color="danger"
                  onPress={() => {
                    dispatch(logout());
                    router.push("/");
                  }}
                >
                  Да, выйти
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// function LogoutModal() {
//     const { onOpen, isOpen, onOpenChange } = useDisclosure();

//     return <div>
//         <div onClick={onOpen}>Logout</div>

//         <Modal onOpenChange={onOpenChange} isOpen={isOpen} >
//             <ModalContent className="p-3">
//                 <div>
//                     <div className="text-center font-semibold text-2xl">Are you sure you want to log out?</div>
//                     <Input type="text" placeholder="Enter your password" />
//                     {/* <Button color="primary" className="w-full mt-3" onClick={onClose}>Logout</Button> */}
//                 </div>
//             </ModalContent>
//         </Modal>

//     </div>

// }

function EditProfileForm({
  firstName,
  lastName,
  onClose,
  image,
  age,
  city,
  country,
  phoneNumber,
}: {
  firstName: string;
  lastName: string;
  onClose: () => void;
  image: string;
  age: number;
  city: string;
  country: string;
  phoneNumber: string;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      age: age,
      phoneNumber: phoneNumber,
      city: city,
      country: country,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="text-center font-semibold text-2xl">Edit profile</div> */}
      <div className="flex flex-col items-center w-full mt-2">
        <Avatar src={image} size="md" className="w-20 h-20 cursor-pointer" />
      </div>
      <div className="flex my-3">
        <Input
          {...register("firstName")}
          label="Имя"
          size="md"
          className="mr-2"
          placeholder="Иван"
        />
        <Input
          {...register("lastName")}
          label="Фамилия"
          size="md"
          placeholder="Смирнов"
        />
      </div>
      <div className="flex">
        <Input
          {...register("phoneNumber")}
          label="Номер телефона"
          size="md"
          className="mr-2"
          placeholder="+79921234567"
        />
        <Input
          {...register("age")}
          label="Возраст"
          size="md"
          placeholder="20"
        />
      </div>
      <div className="flex mt-3">
        <Input
          {...register("city")}
          size="md"
          label="Ваш город"
          className="mr-2"
          placeholder="Тюмень"
        />
        <Input
          {...register("country")}
          label="Ваша страна"
          size="md"
          placeholder="Россия"
        />
      </div>
      <div className=" flex gap-2 w-full mt-2">
        <Button
          size="lg"
          onClick={onClose}
          className="w-full font-semibold "
          color="danger"
        >
          Отмена
        </Button>
        <Button
          size="lg"
          onClick={onClose}
          className="w-full font-semibold"
          color="primary"
        >
          Отправить
        </Button>
      </div>
    </form>
  );
}
