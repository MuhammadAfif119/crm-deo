import { AddIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Fade, filter, Heading, IconButton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { getCollectionFirebase } from '../../Api/firebaseApi';
// import { addDocumentFirebase, getCollectionFirebase } from '../../Apis/firebaseApi';
// import { clientTypesense } from '../../Apis/typeSense';
import { db } from '../../Config/firebase';
import { encryptToken } from '../../Utils/encrypToken';
import TaskCardComponent from '../Card/TaskCardComponent';

const ColumnColorScheme = {
	TODOS: 'blue',
	BACKLOG: 'red',
	PROGRESS: 'green',
	REVIEW: 'yellow',
	DONE: 'gray',
};

function KanbanColumnsComponent({ allowedDropEffect, column, kanbanData, filterData, index, formId }) {
	const [columnsData, setColumnsData] = useState([])
	const [columnsData2, setColumnsData2] = useState([])
	const param = useParams()
	const navigate = useNavigate()


	const handleNewTask = () => {

	}

	const handleLoad = () => {
		
		const conditions = [
			{ field: "formId", operator: "==", value: formId },
			{ field: "column", operator: "==", value: column },
		];
		const sortBy = { field: "lastUpdated", direction: "desc" };
		const limitValue = 5;
		let startAfter = ''
		if (columnsData2.length > 0) {
			// console.log('kedua kali dan seterusnya')
			startAfter = columnsData2[columnsData2.length - 1].lastUpdated
			// if (filterData?.category)
			// 	conditions.push({ field: "category", operator: "==", value: filterData?.category })

			// if (filterData?.label)
			// 	conditions.push({ field: "label", operator: "==", value: filterData?.label })


			// if (filterData?.asignee)
			// 	conditions.push({ field: "asignee", operator: "==", value: filterData?.asignee })

		} else {
			// console.log('pertama kali')
			startAfter = columnsData[columnsData.length - 1].lastUpdated
			// if (filterData?.category)
			// 	conditions.push({ field: "category", operator: "==", value: filterData?.category })

			// if (filterData?.label)
			// 	conditions.push({ field: "label", operator: "==", value: filterData?.label })


			// if (filterData?.asignee)
			// 	conditions.push({ field: "asignee", operator: "==", value: filterData?.asignee })
		}


		getCollectionFirebase('leads', {conditions}, {sortBy}, {limitValue}, {startAfterData : startAfter})
			.then((x) => {
				const updateData = [...columnsData2, ...x]
				setColumnsData2(updateData)
			})

	}



	const handleTypesenseSearch = (q) => {
		// console.log(q)
		const searchParameters = {
			q: q,
			query_by: "title",
			filter_by: `formId: ${formId} && column:${column} `,
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
		let unsubscribe = () => { }

		if (filterData?.search)
			setTimeout(function () {
				handleTypesenseSearch(filterData.search)
			}, 300);

		if (!filterData?.search) {



			let collectionRef = collection(db, "leads");
			collectionRef = query(collectionRef, where("formId", "==", formId));
			collectionRef = query(collectionRef, where("column", "==", column));

			collectionRef = query(collectionRef, orderBy("lastUpdated", "desc"));
			collectionRef = query(collectionRef, limit(5));


			unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
				const addTask = [];

				querySnapshot.forEach((doc) => {
					addTask.push({ id: doc.id, ...doc.data() });
				});

				setColumnsData(addTask)
			});
		}


		return () => {
			unsubscribe()
			setColumnsData([])
			setColumnsData2([])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterData])


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
					<TaskCardComponent
						key={index}
						task={x}
						indexNumber={index}
						setData={type === 'snapshot' ? setColumnsData : setColumnsData2}
						columnsData={datas}
					/>
				</Fade>
			)
	});

	return (
		<Box w='xs' m='1' >
			<Heading fontSize="md" mb={1} letterSpacing="wide" textAlign='center'>
				<Badge
					w='full'
					fontSize='xl'
					px={2}
					py={1}
					rounded="lg"
					bgColor={`green.${index ? index * 100 : 50}`}
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
				opacity={isOver ? 0.85 : 1}
			>
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