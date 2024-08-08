import Icon from '@components/Icon'
import ModalWrapper from '@components/Modal'
import formatDateToDayMonth from '@helpers/formatDateToDayMonth'
import formatDateToTime from '@helpers/formatDateToTime'
import { useDisclosure } from '@nextui-org/react'
import {
	Divider,
	ScrollShadow,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react'
import NoteItem from './Note/NoteItem'
import { calendarType } from '@lib/types'

export default function CalendarItem({
	calendarNote,
	currentCalendar,
}: {
	calendarNote: any
	currentCalendar: calendarType
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<div
			key={String(calendarNote._id)}
			className='bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] '
		>
			<ScrollShadow hideScrollBar className='max-h-[300px]'>
				{currentCalendar.notes.map((note: any) => (
					<NoteItem
						key={note._id}
						currentCalendar={currentCalendar}
						note={note}
					/>
				))}
			</ScrollShadow>

			<div>
				<Divider />
				<div className='text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5'>
					{formatDateToDayMonth(String(calendarNote.date))}
					<div className='cursor-pointer p-1 bg-[#1CA66F1A] rounded-[32px] relative'>
						<ModalWrapper onOpenChange={onOpenChange} isOpen={isOpen}>
							<ModalContent className='py-3'>
								<ModalHeader>Add Note</ModalHeader>
								<ModalBody>
									<div className='flex items-center gap-3'>
										<Input label='Note' size='sm' />
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										className='font-semibold text-white w-full'
										color='success'
									>
										Submit
									</Button>
								</ModalFooter>
							</ModalContent>
						</ModalWrapper>
						<Dropdown>
							<DropdownTrigger>
								<div>
									<Icon path='/icons/plus.svg ' />
								</div>
							</DropdownTrigger>

							<DropdownMenu>
								<DropdownItem key='evaluate'>
									<div className='flex gap-1'>
										<Icon path='icons/smile.svg' />
										<span>Evaluate your current condition</span>
									</div>
								</DropdownItem>
								<DropdownItem key='add-note' onClick={onOpen}>
									<div className='flex gap-1'>
										<Icon path='icons/notes.svg' />
										<span>Add a note</span>
									</div>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		</div>
	)
}
