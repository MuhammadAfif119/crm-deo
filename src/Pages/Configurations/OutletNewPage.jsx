import { InfoIcon } from '@chakra-ui/icons'
import {
	Avatar, AvatarGroup, Box, Button, Container, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl, FormHelperText, useDisclosure, FormLabel, Heading, HStack, Input, Select, Spacer, Text, SimpleGrid, Stack
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addDocumentFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi'
import BackButtonComponent from '../../Components/Buttons/BackButtons';
import UserCardComponent from '../../Components/Card/UserCardComponent'
import ImageComponent from '../../Components/Image/ImageComponent'
import InputSearchUserComponent from '../../Components/Inputs/InputSearchComponent'
import useUserStore from '../../Hooks/Zustand/Store'
import { uploadImage } from '../../Api/firebaseFunction'

function OutletViewPage() {
	const globalState = useUserStore();
	const [data, setData] = useState()
	const [input, setInput] = useState({})
	const [manager, setManager] = useState([])
	const [users, setUsers] = useState([])
	const [modalData, setModalData] = useState()
	const params = useParams()
	const navigate = useNavigate()
	const { isOpen, onOpen, onClose } = useDisclosure()


	const getData = () => {
		getSingleDocumentFirebase('outlets', params.id)
			.then((x) => {
				setData(x)
				setManager(x?.manager ? x.manager : [])
				setUsers(x?.users ? x.users : [])
			})
			.catch((err) => console.log(err.message))
	}

	const saveData = async () => {
		if (manager)
			input.manager = manager

		if (users) {
			users.push(globalState?.uid)
			input.users = users.filter((value, index, array) => array.indexOf(value) === index)
		}

		if (params.id === "new") {
			await addDocumentFirebase("outlets", input, globalState.currentCompany);
		} else {
			await setDocumentFirebase('outlets', params.id, input, data.companyId)
		}
		navigate(-1)
	}

	const handleModal = (data) => {
		setModalData(data)
		onOpen()
		// console.log(data)
	}

	const submitImage = async (file) => {
		const res = (await uploadImage(file[0])).data
		alert(res.message)
		if (res.status) {
			setInput({ ...input, image: res.data })
			setData({ ...data, image: res.data })
		}
	}

	const deleteImage = () => {
		const confirmDelete = window.confirm("Are you sure to change?");
		if (confirmDelete) {
			setInput({ ...input, image: '' })
			setData({ ...data, image: '' })
		}
	}


	useEffect(() => {
		getData()
		return () => {
			setData()
			setUsers()
			setManager()
		}
	}, [])

	return (
		<>
			<Stack p={[1, 1, 5]} spacing={5}>
				<HStack>
					<BackButtonComponent />
					<Spacer />
					<Box>
						<Heading size={'lg'}>Outlets</Heading>
						<Text fontSize='3xs'>ID: {params.id}</Text>
					</Box>
				</HStack>

				<Container bgColor={'white'} p={5} borderRadius='md' shadow={'base'}>
					<HStack>
						<ImageComponent image={data?.image} name={data?.name} width='200px' />
						{data?.image ?
							<Button  size={'sm'} colorScheme='red' onClick={() => deleteImage()}>Change Image</Button>
							:
							<Box>
								<Input type='file' onChange={(e) => submitImage(e.target.files)} />
							</Box>
						}
					</HStack>

					<FormControl mt='2'>
						<FormLabel>Outlet Name</FormLabel>
						<Input type='text' placeholder={data?.name} onChange={(e) => setInput({ ...input, name: e.target.value })} />
					</FormControl>
					<FormControl mt='2'>
						<FormLabel>Outlet Description</FormLabel>
						<Input type='text' placeholder={data?.description} onChange={(e) => setInput({ ...input, description: e.target.value })} />
					</FormControl>

					{/* <FormControl mt='2' borderRadius='md' shadow='base' p='5'>
						<HStack>
							<FormLabel>Outlet managers</FormLabel>
							<Spacer />
							<Button size='xs' colorScheme='blue' onClick={() => handleModal('manager')}>Add Manager</Button>
						</HStack>
						<HStack>
							<InfoIcon />
							<Text>Manager can add users, view reports to Outlet</Text>
						</HStack>
						<SimpleGrid columns={2}>
							{manager?.map((x) =>
								<UserCardComponent uid={x} user={manager} setUser={setManager} />
							)}
						</SimpleGrid>
					</FormControl>

					<FormControl mt='2' borderRadius='md' shadow='base' p='5'>
						<HStack>
							<FormLabel>Outlet users</FormLabel>
							<Spacer />
							<Button size='xs' colorScheme='blue' onClick={() => handleModal('user')}>Add User</Button>
						</HStack>
						<HStack>
							<InfoIcon />
							<Text>User can view Outlet's system</Text>
						</HStack>
						<SimpleGrid columns={2}>
							{users?.map((x) =>
								<UserCardComponent uid={x} user={users} setUser={setUsers} />
							)}
						</SimpleGrid>
					</FormControl> */}

					<Button mt='5' colorScheme='green' w='full' onClick={() => saveData()}>Save</Button>
					{/* <Button mt='5' colorScheme='red' w='full' onClick={() => console.log(input)}>Check State</Button> */}
				</Container>
			</Stack>

		</>
	)
}

export default OutletViewPage