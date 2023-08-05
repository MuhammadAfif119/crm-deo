import {
	Avatar, AvatarGroup, Badge, Box, HStack, useDisclosure, Spacer, Text, Tooltip, Stack
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { FiPhoneCall, FiTag } from 'react-icons/fi';
import SingleCalendarComponent from './SingleCalendarComponent';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import { addDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';
import { formatFrice } from '../../Utils/Helper'
import { BsCalendarPlus, BsChatDots, BsCheckSquare, BsFileText, BsTag, BsTelephone, BsPersonDash } from 'react-icons/bs';

function TaskCardComponent({ task, setData, columnsData, handleModalOpen }) {
	const [index, setIndex] = useState(0);

	const navigate = useNavigate();

	const globalState = useUserStore();



	const handleMoveCard = (id, column) => {
		setData([
			...columnsData.slice(0, index),
			...columnsData.slice(index + 1)
		]);
		setDocumentFirebase('leads', id, { column: column, lastUpdated: new Date(), companyId:  globalState.currentCompany }, globalState.currentCompany)

		addDocumentFirebase(`leads/${id}/history`, { comments: `${auth.currentUser.email} has moved card to ${column} on ${new Date()}`, lastUpdated: new Date() }, globalState.currentCompany)
	}

	const [{ opacity }, drag] = useDrag(
		() => ({
			type: 'column',
			item: task?.id,
			end(item, monitor) {
				const dropResult = monitor.getDropResult()
				if (item && dropResult) {
					const isDropAllowed =
						dropResult.allowedDropEffect === 'move'
					if (isDropAllowed) {
						handleMoveCard(task?.id, dropResult.name)
					}
				}
			},
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.4 : 1,
			}),
		}),
		[task],
	)



	useEffect(() => {
		setIndex(index)
	}, [])


	return (
		<>
			<Stack
				width='full'
				shadow='base'
				borderBottomWidth={2}
				borderColor={`green.300`}
				borderRadius={'md'}
				p='2'
				spacing={1}
				ref={drag}
				style={{ opacity }}
				cursor='pointer'
				onClick={() => {
					handleModalOpen(task,)
					// console.log(`${task?.id}`, { state: { type: 'existing' } })
					// console.log(`${task?.id}`, { state: { type: 'existing' } })
					// navigate(`${task?.id}`, { state: { type: 'existing' } })
					// window.open(`${param.title}/${task?.id}`)
					// setSomeFunction(setData)
					// setTaskData(props)
					// console.log(props)
				}}
			>
				<HStack>
					<HStack spacing={1} alignItems='center'>
						<Text fontWeight={'bold'} fontSize='sm' textTransform={'capitalize'}>{task?.name}</Text>
						{task.status ?
							<Badge colorScheme={
								task.status === 'help' ? 'yellow'
									:
									task.status === 'won' ? 'green'
										:
										task.status === 'lost' ? 'red'
											:
											'gray'
							} size='sm' borderRadius={'sm'}>
								<Text >{task.status}</Text>
							</Badge>
							:
							<></>
						}
					</HStack>
					<Spacer />
					<Box borderRadius={'full'} borderWidth={1} p={2} bgColor='gray.100' cursor={'pointer'} onClick={() => console.log('delete from leads')}>
						<BsPersonDash size={12} color='gray' />
					</Box>

				</HStack>


				<Text fontSize='xs' color={'gray.600'}>{task?.source ? task.source : ""}</Text>


				<Text fontSize='xs' fontWeight={500}>Rp.{formatFrice(task?.opportunity_value ? task.opportunity_value : 0)}</Text>



				<HStack>
					<SingleCalendarComponent data={task.createdAt} date={moment.unix(task.createdAt).format('DD')} month={moment.unix(task.createdAt).format('MMM')} />

					<Spacer />
					<Stack spacing={2}>
						<HStack spacing={3}>
							<Stack>
								<BsTelephone size={14} />
							</Stack>
							<Stack>
								<BsChatDots size={14} />
							</Stack>
							<Stack>
								<BsTag size={14} />
							</Stack>
							<Stack>
								<BsFileText size={14} />
							</Stack>
							<Stack>
								<BsCheckSquare size={14} />
							</Stack>
							<Stack>
								<BsCalendarPlus size={14} />
							</Stack>

						</HStack>
						<Stack spacing={0} textAlign='end'>
							{task.lastUpdated.seconds ?
								<Text fontSize='2xs'>Updated: {moment.unix(task.lastUpdated.seconds).fromNow()}</Text>
								:
								<></>
							}
							<Text fontSize='3xs'>ID: {task.id}</Text>
						</Stack>
					</Stack>
				</HStack>

			</Stack>
		</>
	)
}

export default TaskCardComponent