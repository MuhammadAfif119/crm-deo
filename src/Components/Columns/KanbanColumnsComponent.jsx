import { AddIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Fade, filter, Heading, IconButton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd';
import { useNavigate, useParams } from 'react-router-dom';
// import { addDocumentFirebase, getCollectionFirebase } from '../../Apis/firebaseApi';
// import { clientTypesense } from '../../Apis/typeSense';
import { db } from '../../Config/firebase';

const ColumnColorScheme = {
	TODOS: 'blue',
	BACKLOG: 'red',
	PROGRESS: 'green',
	REVIEW: 'yellow',
	DONE: 'gray',
};

function KanbanColumnsComponent({ allowedDropEffect, column, kanbanData, filterData,index }) {
	const [columnsData, setColumnsData] = useState([])
	const [columnsData2, setColumnsData2] = useState([])
	const param = useParams()
	const navigate = useNavigate()

	const handleNewTask = () => {

	}

	const handleLoad = () => {
	
	}


	const handleTypesenseSearch = (q) => {
		// console.log(q)
		const searchParameters = {
			q: q,
			query_by: "title",
			filter_by: `filesId: ${param.id} && column:${column} `,
			sort_by: "_text_match:desc"
		};
		// clientTypesense
		// 	.collections("kanban")
		// 	.documents()
		// 	.search(searchParameters)
		// 	.then((x) => {
		// 		// console.log(x)
		// 		const newData = x.hits.map((y) => { return { ...y.document } })
		// 		setColumnsData(newData)
		// 	});
	}

	useEffect(() => {
	

		return () => {

		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [{ canDrop, isOver }, drop] = useDrop(
		() => ({
			accept: 'column',
			drop: () => ({
				name: column,
				allowedDropEffect,
			}),
			collect: (monitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
		}),
		[allowedDropEffect],
	)

	const ColumnTasks = (datas, type) => datas?.map((x, index) => {
		// console.log(x, 'ini datanya di columntask')
		if (x.id)
			return (
				<Fade in={true} initialscale={0.9} key={index}>
					{/* <TaskCardComponent
						key={index}
						task={x}
						index={index}
						setData={type === 'snapshot' ? setColumnsData : setColumnsData2}
						columnsData={datas}
						kanbanData={kanbanData}
					/> */}
				</Fade>
			)
	});

	return (
		<Box w='3xs' m='1' >
			<Heading fontSize="md" mb={1} letterSpacing="wide" textAlign='center'>
				<Badge
					w='full'
					fontSize='xl'
					px={2}
					py={1}
					rounded="lg"
					bgColor={`green.${index?index*100:50}`}
				>
					{column}
				</Badge>
			</Heading>

			<Stack
				ref={drop}
				direction='column'
				h={{ base: '30vh', md: '80vh' }}
				p={4}
				mt={2}
				spacing={4}
				bgColor={isOver ? 'red' : 'white'}
				rounded="lg"
				boxShadow="md"
				overflow="auto"
			// opacity={isOver ? 0.85 : 1}
			>
				{/* {column !== 'done' && (filterData?.assignee === "" || filterData?.category === "" || filterData?.label === "") ?
					<IconButton
						size="xs"
						w="full"
						color={'gray.500'}
						bgColor={'gray.100'}
						_hover={{ bgColor: 'gray.200' }}
						py={2}
						variant="solid"
						onClick={() => handleNewTask()}
						colorScheme="black"
						aria-label="add-task"
						icon={<AddIcon />}
					/>
					:
					<></>
				} */}
				{ColumnTasks(columnsData, 'snapshot')}
				{columnsData2?.length ? ColumnTasks(columnsData2, 'manual') : <></>}
				{columnsData?.length > 4 && columnsData2?.length === 0 ?
					<Button onClick={() => handleLoad()}> Load more</Button>
					:
					columnsData2?.length > 4 ?
						<Button onClick={() => handleLoad()}> Load more</Button>
						:
						<></>
				}
			</Stack>
		</Box >
	)
}

export default KanbanColumnsComponent