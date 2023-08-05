import { Avatar, AvatarGroup, Box, Button, Center, Divider, Flex, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Spacer, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useNavigate, useParams } from 'react-router-dom'
import { getCollectionFirebase, getSingleDocumentFirebase } from '../../Api/firebaseApi'
import KanbanColumnsComponent from '../../Components/Columns/KanbanColumnsComponent'
import { decryptToken } from '../../Utils/encrypToken'
import BackButtons from '../../Components/Buttons/BackButtons'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import DetailPipelineCard from '../../Components/Card/DetailPipelineCard'
import useUserStore from '../../Hooks/Zustand/Store'
import { clientTypessense } from '../../Api/Typesense'
import DetailPipelineAddCard from '../../Components/Card/DetailPipelineAddCard'

function PipelineViewPage() {
	const param = useParams();
	const globalState = useUserStore();

	const [pipelineList, setPipelineList] = useState("");
	const isDesktop = useBreakpointValue({ base: false, lg: true });
	const [selectedUserProjectIds, setSelectedUserProjectIds] = useState([]);


	const navigate = useNavigate()

	const [modalDetail, setModalDetail] = useState(false);
	const [detailActive, setDetailActive] = useState("");

	const [modalAdd, setModalAdd] = useState(false)

	const [filterData, setFilterData] = useState({ search: "" });

	const fetchData = async () => {
		try {
			const result = await getSingleDocumentFirebase('pipelines', param.id);
			setPipelineList(result);
		} catch (error) {
			console.log(error);
		}
	};

	const handleModalOpen = (x) => {
		setModalDetail(true);
		setDetailActive(x);
	};

	const handleModalClose = () => {
		setModalDetail(false);
		setDetailActive("");
	};



	const handleModalAddOpen = () => {
		setModalAdd(true);
	};

	const handleModalAddClose = () => {
		setModalAdd(false);
	};

	// const handleSearchUsers = (q) => {
	// 	// console.log(q)
	// 	// const companyUsers = globalState.companies.find((x) => x.id === globalState.currentCompany)
	// 	// const newArr = companyUsers?.users.join(",")

	// 	const searchParameters = {
	// 		q: q,
	// 		query_by: "name,email",
	// 		filter_by: `companyId:${globalState?.currentCompany} && projectId:${globalState?.currentProject}`,
	// 		sort_by: "_text_match:desc"
	// 	};
	// 	clientTypessense
	// 		.collections("contacts")
	// 		.documents()
	// 		.search(searchParameters)
	// 		.then((x) => {
	// 			console.log(x, 'yyy')
	// 			setSearchResult(x)
	// 		});
	// }

	// const handleUserProjectClick = (userId) => {
	// 	console.log(userId, 'xxx')
	// 	setSelectedUserProjectIds((prevIds) => {
	// 		if (prevIds.includes(userId)) {
	// 			return prevIds.filter((id) => id !== userId);
	// 		} else {
	// 			return [...prevIds, userId];
	// 		}
	// 	});
	// }

	const handleSave = () => {
		console.log(selectedUserProjectIds, 'xxx')

	}





	useEffect(() => {
		fetchData()

		return () => {
		}
	}, [ globalState.currentProject])

	return (
		<Stack p={[1, 1, 5]}>
			<HStack>
				<BackButtons />
				<Heading size={'md'}>Pipelines {pipelineList?.title}</Heading>
				<Spacer />
				<Input type='text' size='sm' w='3xs' placeholder='Search Leads' onChange={(e) =>
					setFilterData({ search: e.target.value })} />
				<Select size='sm' w='24' placeholder='Sort by' onChange={(e) =>
					setFilterData({ status: e.target.value })}>
					<option value={'won'}>Won</option>
					<option value={'lost'}>Lost</option>
					<option value={'open'}>Open</option>
				</Select>
				<Button size='sm' colorScheme='green' onClick={handleModalAddOpen}>+</Button>
			</HStack>
			<Stack>
				{pipelineList?.length > 0}
			</Stack>
			<Flex
				overflowX='auto'
			>
				<DndProvider backend={HTML5Backend}>
					{isDesktop ?
						<HStack>
							{pipelineList?.stages?.map((x, i) => {
								return (

									<KanbanColumnsComponent  handleModalOpen={handleModalOpen} key={i} index={i} kanbanData={{ name: x?.stageName }} formId={pipelineList?.formId[0]} allowedDropEffect='move' filterData={filterData} column={x?.stageName} />

								)
							}

							)}

						</HStack> :
						<Center>
							<Heading>Desktop View Only</Heading>
						</Center>
					}
				</DndProvider>
			</Flex>

			<Modal
				isOpen={modalDetail}
				onClose={handleModalClose}
				isCentered
				size={'4xl'}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Stack>
							<Text textTransform={'capitalize'}>Detail {detailActive.name}</Text>
						</Stack>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize={'sm'}>Add and edit opportunity details, tasks, notes and appointments.</Text>
						<Divider py={1} />
						<Stack >
							{detailActive && (
								<DetailPipelineCard data={detailActive} stages={pipelineList?.stages} navigate={navigate} handleModalClose={handleModalClose}
								/>

							)}
						</Stack>
					</ModalBody>
				</ModalContent>
			</Modal>



			<Modal
				isOpen={modalAdd}
				onClose={handleModalAddClose}
				isCentered
				size={'xl'}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Stack>
							<Text textTransform={'capitalize'}>Add Contact</Text>
						</Stack>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
					<Text fontSize={'sm'}>Add and edit opportunity details, tasks, notes and appointments.</Text>
						<Divider py={1} />
						<Stack >
								<DetailPipelineAddCard formId={pipelineList?.formId[0]} stages={pipelineList?.stages} navigate={navigate} handleModalClose={handleModalClose}
								/>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<HStack>
							<Button colorScheme="blue" variant={'outline'} size='sm' mr={3} onClick={handleSave}>
								Save
							</Button>
							<Button colorScheme="red" variant={'outline'} size='sm' mr={3} onClick={handleModalAddClose}>
								Close
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>

		</Stack>
	)
}

export default PipelineViewPage