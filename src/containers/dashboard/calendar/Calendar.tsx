'use client'
import Icon from '@components/Icon'
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks'
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
	useDisclosure,
} from '@nextui-org/react'
import CalendarItem from './CalendarItem'
import { useEffect } from 'react'
import {
	getOneCalendar,
	getPrevCalendar,
	getNextCalendar,
} from '@lib/redux/slices/calendar/calendarSlice'
import NoteItem from './Note/NoteItem'
import formatDateToDayMonth from '@helpers/formatDateToDayMonth'
import ModalWrapper from '@components/Modal'

export default function Calendar() {
	const calendar = useAppSelector(state => state.Calendar.oneCalendar)
	const dispatch = useAppDispatch()
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	useEffect(() => {
		dispatch(getOneCalendar('2024-08-09'))
	}, [dispatch])
	console.log(calendar)

	const handlePrevCalendar = () => {
		if (calendar?._id) {
			dispatch(getPrevCalendar(calendar._id))
		} else {
			dispatch(getPrevCalendar(null))
		}
	}

	const handleNextCalendar = () => {
		if (calendar?._id) {
			dispatch(getNextCalendar(calendar._id))
		}
	}

	return (
		<Card className='p-3 relative h-full'>
			<CardHeader className='flex justify-between items-center'>
				<div className='font-semibold text-xl'>Calendar</div>
				<div className='flex gap-3'>
					<Icon path='arrow-left.svg' className='cursor-pointer' />
					<Icon path='arrow-left.svg' className='rotate-180 cursor-pointer' />
				</div>
			</CardHeader>
			<CardBody className='flex flex-row gap-x-4'>
				<div
					key={String(calendar?._id)}
					className='bg-[#1CA66F] bg-opacity-[0.1] p-3 rounded-[10px] flex flex-col justify-between w-[200px] '
				>
					<ScrollShadow hideScrollBar className='max-h-[300px]'>
						{calendar?.notes.map((note: any) => (
							<NoteItem key={note._id} currentCalendar={calendar} note={note} />
						))}
					</ScrollShadow>

					<div>
						<Divider />
						<div className='text-[#1CA66F] pt-2 flex justify-center items-center gap-x-5'>
							{formatDateToDayMonth(String(calendar?.date))}
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
			</CardBody>
		</Card>
	)
}
