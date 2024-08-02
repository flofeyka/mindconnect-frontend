import CalendarActions from "@components/CalendarActions";
import Icon from "@components/Icon";
import ModalWrapper from "@components/Modal";
import formatDateToDayMonth from "@helpers/formatDateToDayMonth";
import formatDateToTime from "@helpers/formatDateToTime";
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { useRef, useState } from "react";

export default function CalendarItem({ calendarNote, calendar }: any) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [currentCalendar, setCurrectCalendar] = useState({
        id: "",
        note: "",
        newNote: "",
        time: "",
        date: "",
    });


    const [modalsState, setModalsState] = useState([{ id: "", isActive: false }]);


    const modalRef = useRef<HTMLDivElement>(null);


    function changeModalsState(id: string) {
        const index = modalsState.findIndex((modal) => modal.id === String(id));

        const newModalState = modalsState.map((_modalState) => ({
            ..._modalState,
            isActive: false,
        }));
        // newModalState[index].isActive = !newModalState[index].isActive;

        setModalsState(newModalState);
    }
    return <div
        key={String(calendarNote._id)}
        className="bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] "
    >
        <ScrollShadow hideScrollBar className="max-h-[300px]">
            {calendarNote.notes.map((note: any) => (
                <div
                    key={String(note._id)}
                    className="bg-[#1CA66F] bg-opacity-[0.1] p-2 flex  items-center gap-x-2 rounded-md mb-2"
                    onClick={() => {
                        // onOpen();
                        setCurrectCalendar({
                            id: String(note._id),
                            note: note.note,
                            newNote: note.note,
                            time: formatDateToTime(String(note.createdAt)),
                            date: String(calendarNote.date),
                        });
                    }}
                >
                    <span className="text-gray-500">
                        {formatDateToTime(String(note.createdAt))}
                    </span>
                    <span>{note.note}</span>
                </div>
            ))}
        </ScrollShadow>

        <div>
            <Divider />
            <div className="text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5">
                {formatDateToDayMonth(String(calendarNote.date))}
                <div
                    className="cursor-pointer p-1 bg-[#1CA66F1A] rounded-[32px] relative "
                    onClick={() => {
                        changeModalsState(String(calendarNote._id));
                    }}
                >

                    <ModalWrapper onOpenChange={onOpenChange} isOpen={isOpen}>
                        <ModalContent className="py-3">
                            <ModalHeader>Add Note</ModalHeader>
                            <ModalBody>
                                <div className="flex items-center gap-3">
                                    <Input label="Note" size="sm" />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="font-semibold text-white w-full" color="success">Submit</Button>
                            </ModalFooter>
                        </ModalContent>
                    </ModalWrapper>
                    <Dropdown>
                        <DropdownTrigger>
                            <div>
                                <Icon path="/icons/plus.svg " />
                            </div>
                        </DropdownTrigger>


                        <DropdownMenu>
                            <DropdownItem key="d">
                                <div className="flex gap-1">
                                    <Icon path="icons/smile.svg" />
                                    <span>Evaluate your current condition</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem key="d">
                                <div className="flex gap-1"
                                    onClick={onOpen}>
                                    <Icon path="icons/notes.svg" />
                                    <span>Add a note</span>
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* <CalendarActions
                        ref={modalRef}
                        calendar={calendar}
                        isActive={
                            modalsState.find(
                                (note) => note.id === String(calendarNote._id)
                            )?.isActive || false
                        }
                    /> */}
                </div>
            </div>
        </div>
    </div >
}