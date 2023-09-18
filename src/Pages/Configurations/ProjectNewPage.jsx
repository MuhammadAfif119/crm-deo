import { InfoIcon } from '@chakra-ui/icons'
import {
	Avatar, AvatarGroup, Box, Button, Container, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl, FormHelperText, useDisclosure, FormLabel, Heading, HStack, Input, Select, Spacer, Text, SimpleGrid, Checkbox, Tooltip, CheckboxGroup, Stack
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addDocumentFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi'
import BackButtonComponent from '../../Components/Buttons/BackButtons';
import UserCardComponent from '../../Components/Card/UserCardComponent'
import ImageComponent from '../../Components/Image/ImageComponent'
import InputSearchUserComponent from '../../Components/Inputs/InputSearchComponent'
import { uploadImage } from '../../Api/firebaseFunction'
import useUserStore from '../../Hooks/Zustand/Store'

function ProjectsViewPage() {
	const globalState = useUserStore();
	const [data, setData] = useState()
	const [input, setInput] = useState({})
	const [modules, setModules] = useState()
	const [manager, setManager] = useState([])
	const [users, setUsers] = useState([])
	const [modalData, setModalData] = useState()
	const params = useParams()
	const navigate = useNavigate()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const dataCheckBox = [
		{ value: 'rms', name: 'RMS', description: 'End to end restaurant management system' },
		{ value: 'lms', name: 'LMS', description: 'End to end Learning Management System' },
		{ value: 'eCommerce', name: 'eCommerce', description: 'End to end restaurant management system' },
		{ value: 'listing', name: 'Listing', description: 'End to end restaurant management system' },
		{ value: 'omniChannel', name: 'Omni Channel', description: 'End to end restaurant management system' },
		{ value: 'event', name: 'Events', description: 'Event management inside LMS' },
		{ value: 'crm', name: 'CRM', description: 'Customer Relationship Management from leads, web chat, marketplace, social media monitoring' },
	]

	const getData = () => {
		getSingleDocumentFirebase('projects', params.id)
			.then((x) => {
				setData(x)
				setManager(x?.manager ? x.manager : [])
				setUsers(x?.users ? x.users : [])
				setModules(x?.modules ? x.modules : [])
			})
			.catch((err) => console.log(err.message))
	}

	const saveData = async () => {
		if (input.image === '') {
			alert('Please fill the image')
			return
		}
		if (manager)
			input.manager = manager

		if (modules)
			input.modules = modules

		if (users) {
			users.push(globalState?.uid)
			input.users = users.filter((value, index, array) => array.indexOf(value) === index)
		}

		if (params.id === "new") {
			await addDocumentFirebase("projects", input, globalState.currentCompany);
		} else {
			await setDocumentFirebase('projects', params.id, input, data.companyId)
		}
		navigate(-1)
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
		}
	}, [])

	return (
		<>
			<Stack p={[1, 1, 5]} spacing={5}>
				<HStack>
					<BackButtonComponent />
					<Spacer />
					<Box>
						<Heading size={'lg'}>Projects</Heading>
						<Text fontSize='3xs'>ID: {params.id}</Text>
					</Box>
				</HStack>

				<Container bgColor={'white'} p={5} borderRadius='md' shadow={'base'}>
					<HStack>
						<ImageComponent image={data?.image} name={data?.name} width='200px' />
						{data?.image ?
							<Button size={'sm'} colorScheme='red' onClick={() => deleteImage()}>Change Image</Button>
							:
							<Box>
								<Input type='file' onChange={(e) => submitImage(e.target.files)} />
							</Box>
						}
					</HStack>

					<FormControl mt='2'>
						<FormLabel>Project Name</FormLabel>
						<Input type='text' placeholder='Project name' defaultValue={data?.name} onChange={(e) => setInput({ ...input, name: e.target.value })} />
					</FormControl>

					<FormControl mt='2'>
						<FormLabel>Project Description</FormLabel>
						<Input type='text' defaultValue={data?.description} placeholder='Description' onChange={(e) => setInput({ ...input, description: e.target.value })} />
					</FormControl>

					<FormControl mt='2' borderRadius='md' shadow='base' p='5'>
						<FormLabel>Project Modules</FormLabel>
						<SimpleGrid columns='3' gap={3}>
							{modules ?
								dataCheckBox?.map((x) =>
									<Checkbox
										onChange={(e) => {
											if (e.target.checked)
												setModules([...modules, x.value])
											else
												setModules([...modules?.filter((z) => z !== x.value)])
										}}
										defaultChecked={modules?.find((z) => z === x.value) ? true : false}>
										<HStack>
											<Text>{x.name}</Text>
											<Tooltip label={x.description} aria-label='A tooltip'>
												<InfoIcon color='blue' />
											</Tooltip>
										</HStack>
									</Checkbox>)
								:
								<></>}
						</SimpleGrid>
					</FormControl>


					<Button mt='5' colorScheme='green' w='full' onClick={() => saveData()}>Save</Button>
					{/* <Button mt='5' colorScheme='red' w='full' onClick={()=>{
				console.log(data)
				console.log(input)
				console.log(modules)
				console.log(users,manager)
			}}>Check State</Button> */}
				</Container>



			</Stack>

		</>

	)
}

export default ProjectsViewPage