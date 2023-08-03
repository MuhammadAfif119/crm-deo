import { InfoIcon } from '@chakra-ui/icons'
import {
	Avatar, Box, Button, Center, Heading, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton, HStack, Input, SimpleGrid, Spacer, Text, useDisclosure
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { arrayRemoveFirebase, arrayUnionFirebase, getCollectionFirebase } from '../../../Api/firebaseApi'
import { createUserFunctions } from '../../../Api/firebaseFunction'
import { clientTypessense } from '../../../Api/Typesense'
import useUserStore from '../../../Hooks/Zustand/Store'

function UsersPage() {
	const globalState = useUserStore()
	const [data, setData] = useState()
	const [counter, setCounter] = useState(0)
	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [search,setSearch]=useState({})
	const [loading,setLoading]=useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure()


	const handleAddNewUser = () => {
		setLoading(true)
		    const conditions = [
		{ field: "email", operator: "==", value: email.toLowerCase() },
		];
        // console.log("oke")
        // return 
		getCollectionFirebase('users',conditions)
		.then((x)=>{
			if(x){
				console.log(x)
				arrayUnionFirebase('companies',globalState.currentCompany,'users',[x[0].id])
				.then()
				.catch((err)=>console.log(err.message))
			}
			else{
				createUserFunctions({ email: email, name: name, companyId: globalState.currentCompany })
					.then()
					.catch((err)=> console.log(err.message))
			}
			setLoading(false) 
			onClose()
		})
		.catch((err)=>console.log(err.message))
		//create new user
	
	}

	const handleSearch=(q,p)=>{
		setSearch({query:q,page:p})
		const searchParameters = {
			q: q,
			query_by: "email",
			filter_by: `id: [${globalState?.users}]`,
			page:p,
			sort_by: "_text_match:desc"
		};
		clientTypessense
			.collections("users")
			.documents()
			.search(searchParameters)
			.then((x) => {
				setCounter(x.found)
				const newData = x.hits.map((y) => { return { ...y.document } })
				if(p===1)
				setData(newData)
				else
				setData([...data,...newData])

			});
	}

	const handleRemoveUser=(uid)=>{
        console.log("oke")
		arrayRemoveFirebase('companies',globalState.currentCompany,'users',[uid])
		.then(()=>handleSearch('*',1))
		.catch((err)=>console.log(err.message))
	}

	useEffect(() => {
		// getData(counter)
		handleSearch('*',1)
		return () => {
			setData()
		}
	}, [globalState?.users?.length])


	
	return (
		<>
			<Box>
				<HStack>
					<Box>
						<Heading>Users</Heading>
						<HStack>
							<InfoIcon />
							<Text>Add or remove people in company</Text>
						</HStack>
					</Box>
					<Spacer />

					<Button colorScheme='green' onClick={onOpen}>Add User</Button>
				</HStack>
				
				<Input type='text' m='1' placeholder='Search User' onChange={(e)=>handleSearch(e.target.value,1)}/>
				
				<SimpleGrid columns='2'>
					{
						data?.length > 0 ?
							data?.map((x, i) =>
								<HStack key={i} bgColor='white' borderRadius='md' p='2' m='2'>
									<Avatar name={x?.name} />
									<Box>
										<Text>{x?.name}</Text>
										<Text>{x?.email}</Text>
										<Text fontSize='2xs'>ID: {x?.id}</Text>
									</Box>
									<Spacer/>
									<Button alignSelf='start' onClick={()=>handleRemoveUser(x.id)}>x</Button>
								</HStack>)
							:
							<></>
					}
				</SimpleGrid>
				<Center>
					{data?.length < counter ?
						<>
						<Box textAlign='center'>
							<Text>{data.length}/{counter}</Text>
							<Button colorScheme='green' onClick={() => handleSearch(search?.query,search.page+1)}>Load More</Button>
						</Box>

						</>	
						:
						<>
						{/* <Text>{data.length}</Text> */}
						</>
					}
				</Center>
			</Box>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add User</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{/* <Lorem count={2} /> */}
						<Input type='text' placeholder='name' onChange={(e) => setName(e.target.value)} />
						<Input type='text' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
					</ModalBody>

					<ModalFooter>
						{
						loading?
							<Button colorScheme='green' mr={3} isLoading>
							Save
							</Button>
							:
							<Button colorScheme='green' mr={3} onClick={() => handleAddNewUser()}>
								Save
							</Button>
						}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default UsersPage