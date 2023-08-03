import { Box, Button, Heading, HStack, SimpleGrid, Spacer, Text,  Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Select,
	Input, } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addDocumentFirebase, getCollectionFirebase } from '../../Api/firebaseApi'
import ImageComponent from '../../Components/Image/ImageComponent'
import useUserStore from '../../Hooks/Zustand/Store'

function OutletPage() {
    const globalState = useUserStore();
	const navigate = useNavigate()
	const [data,setData]=useState()
	const [projects,setProjects]=useState()
	const [inputValue,setInputValue]=useState()
	const [selectValue,setSelectValue]=useState()
	const { isOpen, onOpen, onClose } = useDisclosure()


	const getData = ()=>{
		const conditions = [
            { field: "companyId", operator: "==", value: globalState.currentCompany }
        ];
		getCollectionFirebase('outlets',conditions)
		.then((x)=>{
			setData(x)
		})
		.catch((err)=>console.log(err.message))
	}

	const addOutlet=()=>{
		if(!inputValue || !selectValue)
			return console.log('no input value or select value')

		const newData ={
			name:inputValue,
			projectId:selectValue,
			manager:[],
			users:[]
		}
		addDocumentFirebase('outlets',newData,globalState.currentCompany)
		.then((x)=>navigate(`${x}`))
		.catch((err)=>console.log(err.message))
	}

	const projectOption = ()=>{
		const conditions = [
            { field: "companyId", operator: "==", value: globalState.currentCompany },
            { field: "users", operator: "array-contains", value: globalState?.uid}
        ];
		getCollectionFirebase('projects',conditions)
		.then((x)=>{
			setProjects(x)
		})
		.catch((err)=>console.log(err.message))
		
	}

	useEffect(() => {
		if(globalState?.currentCompany){
			getData()
			projectOption()
		}

	  return () => {
		setData()
		setProjects()
	  }
	}, [globalState?.currentCompany])
	
  return (
	  <>
	<Box>
		<HStack>
			<Heading>Outlets</Heading>
			<Spacer/>
			{projects?.length>0?
			<Button colorScheme='green' onClick={onOpen}>Add Outlet</Button>
			:
			<Button colorScheme='red' disabled>Please add project before adding outlet</Button>
			}
		</HStack>
		<Input type='text' w='full' p='2' m='2' placeholder='search outlet'/>

		<SimpleGrid columns={4} p='2'>
		{data?.map((x,i)=>
		<Box key={i} shadow='base' p='1' m='1'>
			<Link to={x.id}>
			<ImageComponent image={x.image} name={x.name} />
				<Text>{x.name}</Text>
				<Text>{x.type}</Text>
				<SimpleGrid columns={{base:2,lg:3}} textAlign='center'>
						<Box shadow='base' borderRadius='md' m='1' p='1'>
							<Text fontSize='xs'>Manager</Text>
							<Text >{x?.manager?.length?x.manager.length:0}</Text>
						</Box>
						<Box shadow='base' borderRadius='md' m='1' p='1'>
							<Text fontSize='xs'>Users</Text>
							<Text >{x?.users?.length?x.users.length:0}</Text>
						</Box>
						<Box shadow='base' borderRadius='md' m='1' p='1'>
							<Text fontSize='xs'>Projects</Text>
							<Text >{x?.projects?.length?x.users.length:0}</Text>
						</Box>
					</SimpleGrid>
				{/* <Text fontSize='2xs'>Last updated: {moment.unix(x.lastUpdated.seconds).fromNow() }</Text> */}
				<Text fontSize='2xs'>ID: {x.id }</Text>
				</Link>
			</Box>)}
			</SimpleGrid>
	</Box>
	<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Outlet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
			<Input type='text' placeholder='Outlet name' onChange={(e)=>setInputValue(e.target.value)}/>
			<Select placeholder='Project' onChange={(e)=>setSelectValue(e.target.value)}>
				{projects?.map((x,i)=><option key={i} value={x.id}>{x.name}</option>)}
			</Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>addOutlet()}>
              Save
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
	</>
  )
}

export default OutletPage