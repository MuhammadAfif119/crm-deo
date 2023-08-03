import { InfoIcon } from '@chakra-ui/icons'
import { Avatar, AvatarGroup, Box, Button, Container,   Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl, FormHelperText, useDisclosure,FormLabel, Heading, HStack, Input, Select, Spacer, Text, SimpleGrid, Checkbox, Tooltip, CheckboxGroup } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addDocumentFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../../Api/firebaseApi'
import BackButtonComponent from '../../../Components/Buttons/BackButtons';
import UserCardComponent from '../../../Components/Card/UserCardComponent'
import ImageComponent from '../../../Components/Image/ImageComponent'
import InputSearchUserComponent from '../../../Components/Inputs/InputSearchComponent'
import { uploadImage } from '../../../Api/firebaseFunction'
import useUserStore from '../../../Hooks/Zustand/Store'

function ProjectsViewPage() {
    const globalState = useUserStore();
	const [data,setData]=useState()
	const [input,setInput]=useState({})
	const [modules,setModules]=useState()
	const [manager,setManager]=useState([])
	const [users,setUsers]=useState([])
	const [modalData,setModalData]=useState()
	const params=useParams()
	const navigate = useNavigate()
	const { isOpen, onOpen, onClose } = useDisclosure()

	const dataCheckBox=[
		{value:'rms',name:'RMS', description:'End to end restaurant management system'},
		{value:'lms',name:'LMS', description:'End to end Learning Management System'},
		{value:'eCommerce',name:'eCommerce', description:'End to end restaurant management system'},
		{value:'listing',name:'Listing', description:'End to end restaurant management system'},
		{value:'omniChannel',name:'Omni Channel', description:'End to end restaurant management system'},
		{value:'event',name:'Events', description:'Event management inside LMS'},
		{value:'crm',name:'CRM', description:'Customer Relationship Management from leads, web chat, marketplace, social media monitoring'},
]

	const getData=()=>{
        console.log("globals", globalState)
		getSingleDocumentFirebase('projects',params.id)
		.then((x)=>{
			setData(x)
			setManager(x?.manager?x.manager:[])
			setUsers(x?.users?x.users:[])
			setModules(x?.modules?x.modules:[])
		})
		.catch((err)=>console.log(err.message))
	}

	const saveData = async () =>{
		if (input.image === '') {
			alert('Please fill the image')
			return
		}
		if(manager)
		input.manager=manager

		if(modules)
		input.modules=modules

		if(users) {
            users.push(globalState?.uid)
            input.users=users.filter((value, index, array) => array.indexOf(value) === index)
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
			setInput({...input,image:res.data})
			setData({...data, image: res.data})
		}
	}

	const handleModal=(data)=>{
		setModalData(data)
		onOpen()
	}

	const deleteImage = () => {
		const confirmDelete = window.confirm("Are you sure to change?");
		if (confirmDelete) {
			setInput({...input, image: ''})
			setData({...data, image: ''})
		}
	}

	useEffect(() => {
	  getData()
	  return () => {
		setData()
	  }
	}, [])
	
  return (<>
	  <Box>
		  <HStack> 
			  <BackButtonComponent/>
			  <Box>
			  	<Heading>Projects</Heading>
		  		<Text fontSize='2xs'>Project ID: {params.id}</Text>
			  </Box>
		  </HStack>
		 
		  <Container>
			<HStack>
					<ImageComponent image={data?.image} name={data?.name} width='200px'/>
				{data?.image?
					<Button colorScheme='red' onClick={() => deleteImage()}>Change Image</Button>
				:
				<Box>
					<Input type='file' onChange={(e)=>submitImage(e.target.files)}/>
				</Box>
				}
			</HStack>

			<FormControl mt='2'>
				<FormLabel>Project Name</FormLabel>
				<Input type='text' defaultValue={data?.name} onChange={(e)=>setInput({...input,name:e.target.value})}/>
			</FormControl>

			<FormControl mt='2'>
				<FormLabel>Project Description</FormLabel>
				<Input type='text' defaultValue={data?.description} onChange={(e)=>setInput({...input,description:e.target.value})}/>
			</FormControl>
			
			<FormControl mt='2' borderRadius='md' shadow='base' p='5'>
			<FormLabel>Project Modules</FormLabel>
			<SimpleGrid columns='3'>
				{modules?
				dataCheckBox?.map((x)=>
				<Checkbox
				onChange={(e)=>{
					if(e.target.checked)
						setModules([...modules,x.value])
					else
						setModules([...modules?.filter((z)=> z!==x.value) ])
				}} 
				defaultChecked={modules?.find((z)=>z===x.value)?true:false}>
					<HStack>
						<Text>{x.name}</Text>
						<Tooltip label={x.description} aria-label='A tooltip'>
							<InfoIcon color='blue'/>
						</Tooltip>
					</HStack>
					</Checkbox>)
					:
					<></>}
			</SimpleGrid>
			</FormControl>
			
			<FormControl mt='2' borderRadius='md' shadow='base' p='5'>
				<HStack>
					<FormLabel>Project managers</FormLabel>
					<Spacer/>
					<Button size='xs' colorScheme='blue' onClick={()=>handleModal('manager')}>Add Manager</Button>
				</HStack>
				<HStack>
					<InfoIcon/>
					<Text>Manager can add users, view reports to project</Text>
				</HStack>
				<SimpleGrid columns={2}>
					{manager?.map((x)=>
					<UserCardComponent uid={x} user={manager} setUser={setManager}/>
					)}
				</SimpleGrid>
			</FormControl>
			<FormControl mt='2' borderRadius='md' shadow='base' p='5'>
				<HStack>
					<FormLabel>Project users</FormLabel>
					<Spacer/>
					<Button size='xs' colorScheme='blue' onClick={()=>handleModal('user')}>Add User</Button>
				</HStack>
				<HStack>
					<InfoIcon/>
					<Text>User can access project's module</Text>
				</HStack>
				<SimpleGrid columns={2}>
					{users?.map((x)=>
					<UserCardComponent uid={x} user={users} setUser={setUsers}/>
					)}
				</SimpleGrid>
			</FormControl>

			<Button mt='5' colorScheme='green' w='full' onClick={()=>saveData()}>Save</Button>
			<Button mt='5' colorScheme='red' w='full' onClick={()=>{
				console.log(data)
				console.log(input)
				console.log(modules)
				console.log(users,manager)
			}}>Check State</Button>
		  </Container>
	  </Box>
	  <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {modalData}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
			  {modalData==='manager'?			
			  	<InputSearchUserComponent user={manager} setUser={setManager} onClose={onClose}/>
				:
				<InputSearchUserComponent user={users} setUser={setUsers} onClose={onClose}/>

			  }
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Save
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
	  </>
  )
}

export default ProjectsViewPage