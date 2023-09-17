import {
	Box, Button, Heading, HStack, SimpleGrid, Spacer, Text, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Select,
	Input,
	Stack,
	Flex,
	Badge,
} from '@chakra-ui/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FcPlus } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { addDocumentFirebase, getCollectionFirebase } from '../../Api/firebaseApi'
import BackButtons from '../../Components/Buttons/BackButtons'
import ImageComponent from '../../Components/Image/ImageComponent'
import useUserStore from '../../Hooks/Zustand/Store'

function OutletPage() {
	const globalState = useUserStore();
	const navigate = useNavigate()
	const [data, setData] = useState()
	const [loading, setLoading] = useState(false)
	const [projects, setProjects] = useState()
	const [inputValue, setInputValue] = useState()
	const [selectValue, setSelectValue] = useState()
	const { isOpen, onOpen, onClose } = useDisclosure()


	const getData = () => {
		const conditions = [
			{ field: "companyId", operator: "==", value: globalState.currentCompany }
		];
		getCollectionFirebase('outlets', conditions)
			.then((x) => {
				setData(x)
			})
			.catch((err) => console.log(err.message))
	}

	const addOutlet = () => {

		if (!inputValue || !selectValue)
			return console.log('no input value or select value')

		setLoading(true)
		const newData = {
			name: inputValue,
			projectId: selectValue,
			manager: [],
			users: []
		}
		addDocumentFirebase('outlets', newData, globalState.currentCompany)
			.then((x) => {
				navigate(`${x}`)
				setLoading(false)
			})
			.catch((err) => {
				console.log(err.message)
				setLoading(false)
			})
	}

	const projectOption = () => {
		const conditions = [
			{ field: "companyId", operator: "==", value: globalState.currentCompany },
			{ field: "users", operator: "array-contains", value: globalState?.uid }
		];
		getCollectionFirebase('projects', conditions)
			.then((x) => {
				setProjects(x)
			})
			.catch((err) => console.log(err.message))

	}

	useEffect(() => {
		if (globalState?.currentCompany) {
			getData()
			projectOption()
		}

		return () => {
			setData()
			setProjects()
		}
	}, [globalState?.currentCompany])

	return (
		<Stack p={[1, 1, 5]} spacing={5}>
			<HStack >
				<BackButtons />
				<Heading size={"md"}>Outlets</Heading>
				<Spacer />
				<Button
					onClick={onOpen}
					bgColor={"white"}
					shadow="md"
					variant="outline"
					borderColor="#F05A28"
					color="#F05A28"
				>
					<HStack>
						<FcPlus />
						<Text>Outlet</Text>
					</HStack>
				</Button>
			</HStack>
			{/* <Input type='text' w='full' p='2' m='2' placeholder='Search' /> */}

			<SimpleGrid columns={{ base: 3, lg: 4 }} p="2" spacing={4} my={5}>
				{data?.map((x, i) =>
					<Stack
						key={i}
						p="5"
						shadow="base"
						minH="100px"
						bg={"white"}
						borderRadius={"md"}
						onClick={() => navigate(`${x.id}`)}
						cursor='pointer'>
						<ImageComponent image={x.image} name={x.name} />
						<Spacer />

						<Stack>
							<Text fontWeight={"bold"}>{x.name}</Text>
							<Text fontSize="3xs">ID: {x.id}</Text>
						</Stack>

						<SimpleGrid columns={{ base: 2, lg: 3 }} textAlign='center'>
							<Box shadow='base' borderRadius='md' m='1' p='1'>
								<Text fontSize='xs'>Manager</Text>
								<Text  fontWeight={500}>{x?.managers?.length ? x.managers?.length : 0}</Text>
							</Box>
							<Box shadow='base' borderRadius='md' m='1' p='1'>
								<Text fontSize='xs'>Users</Text>
								<Text fontWeight={500} >{x?.users?.length ? x.users.length : 0}</Text>
							</Box>
							<Box shadow='base' borderRadius='md' m='1' p='1'>
								<Text fontSize='xs'>Projects</Text>
								<Text fontWeight={500}>{x?.projects?.length ? x.users.length : 0}</Text>
							</Box>
						</SimpleGrid>

						<Flex overflowY="auto">
							{x.modules?.map((z) => (
								<Badge colorScheme="green" m="1" borderRadius={'md'}>
									{z}
								</Badge>
							))}
						</Flex>

						<Text fontSize='2xs' textAlign={'end'}>Created: {moment(x?.createdAt?.seconds * 1000).format('LLL')}</Text>
					</Stack>
				)}
			</SimpleGrid>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Outlet</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							<Input type='text' placeholder='Outlet name' onChange={(e) => setInputValue(e.target.value)} />
							<Select placeholder='Project' onChange={(e) => setSelectValue(e.target.value)}>
								{projects?.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
							</Select>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} isLoading={loading} onClick={() => addOutlet()}>
							Save
						</Button>
						{/* <Button variant='ghost'>Secondary Action</Button> */}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Stack>

	)
}

export default OutletPage