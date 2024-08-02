import Icon from "@components/Icon";
import { useAppDispatch } from "@lib/redux/hooks";
import { logout } from "@lib/redux/slices/auth/authSlice";
import { usersDataType } from "@lib/types";
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";

export default function Profile({ user }: { user: usersDataType }) {
    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    const dispatch = useAppDispatch();

    return <div>
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} >
            <ModalContent className="p-3">
                {(onClose) => <EditProfileForm onClose={onClose} firstName={user.firstName} lastName={user.lastName} />}
            </ModalContent>
        </Modal>
        <Dropdown>
            <DropdownTrigger>
                <div className="flex items-center cursor-pointer">
                    <Avatar src={user.image} size="md" />
                    <div className="font-semibold ml-2 flex items-center gap-2">
                        {user.firstName} <Icon height="10px" path="/icons/vector-bottom.svg" />
                    </div>
                </div>
            </DropdownTrigger>

            <DropdownMenu>
                <DropdownItem key="d"><div onClick={onOpen}>Settings</div></DropdownItem>
                <DropdownItem className="mt-3 text-red-700 hover:text-red-700" key="l">
                    {/* <LogoutModal /> Should be a logout modal */}
                     <div onClick={() => dispatch(logout())}>Logout</div>
                    </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
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

function EditProfileForm({ firstName, lastName, onClose }: { firstName: string, lastName: string, onClose: () => void }) {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            firstName: firstName,
            lastName: lastName,
            age: 0,
            phoneNumber: 1488
        }
    });


    const onSubmit = (data: any) => {
        console.log(data)
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div className="text-center font-semibold text-2xl">Edit profile</div> */}
        <div className="flex flex-col items-center w-full mt-2">
            <Avatar size="lg" className="w-20 h-20 cursor-pointer" />
        </div>
        <div className="flex my-3">
            <Input {...register("firstName")} size="lg" className="mr-2" placeholder="First name" />
            <Input {...register("lastName")} size="lg" placeholder="Last name" />
        </div>
        <div className="flex">
            <Input {...register("phoneNumber")} size="lg" className="mr-2" placeholder="Phone number" />
            <Input {...register("age")} size="lg" placeholder="Age" />
        </div>
        <div className="w-full mt-2">
            <Button size="lg" onClick={onClose} className="w-full font-semibold" color="primary" >Submit</Button>
        </div>
    </form>
}