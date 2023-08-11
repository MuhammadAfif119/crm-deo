import { InfoIcon } from '@chakra-ui/icons'
import {
	Avatar, Box, Button, Center, Heading, Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton, HStack, Input, SimpleGrid, Spacer, Text, useDisclosure, Stack, Grid, Divider
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { arrayRemoveFirebase, arrayUnionFirebase, getCollectionFirebase } from '../../Api/firebaseApi'
import { createUserFunctions } from '../../Api/firebaseFunction'
import { clientTypessense } from '../../Api/Typesense'
import useUserStore from '../../Hooks/Zustand/Store'
import Swal from 'sweetalert2'

function UsersPage() {
	const globalState = useUserStore()
	const [data, setData] = useState()
	const [counter, setCounter] = useState(0)
	const [name, setName] = useState()
	const [email, setEmail] = useState()
	const [search,setSearch]=useState({})
	const [loading,setLoading]=useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure()


	const handleAddNewUser = async () => {
		setLoading(true);
		if (!name || name.trim() === "" || !email) {
			onClose();
			Swal.fire({
			  icon: 'warning',
			  title: 'Oops...',
			  text: 'Please complate input',
			});
			setLoading(false);
			return; // Stop execution
		  }

		const conditions = [
			{ field: "email", operator: "==", value: email.toLowerCase() },
		];

		try {
			const x = await getCollectionFirebase('users', conditions);

			if (x.length > 0) {
				await arrayUnionFirebase('companies', globalState.currentCompany, 'users', [x[0].id]);
				setLoading(false);
				onClose();
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Success Create User',
				});
				setData(prevData => [x[0], ...prevData]);
			} else {
				const createNewUser = await createUserFunctions({ email: email, name: name, companyId: globalState.currentCompany });
				setLoading(false);
				onClose();
				Swal.fire({
				  icon: 'success',
				  title: 'Success',
				  text: 'Success Create New User',
				});
				const newUser = { email: email, id: createNewUser.data.uid, name: name };
				setData(prevData => [newUser, ...prevData]);
			}
		} catch (err) {
			console.log(err.message);
			setLoading(false);
			Swal.fire({
			  icon: 'error',
			  title: 'Oops...',
			  text: 'An error occurred while processing your request.',
			});
		  }
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

	const handleRemoveUser = (uid) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You won\'t be able to revert this!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		setLoading(true);
			if (result.isConfirmed) {
				arrayRemoveFirebase('companies', globalState.currentCompany, 'users', [uid])
				.then(() => {
				setLoading(false);
					Swal.fire({
						icon: 'success',
						title: 'Success',
						text: 'User has been deleted successfully!',
					});
					const newData = data.filter((user) => user.id !== uid);
					setData(newData);
				})
				.catch((err) => {
					setLoading(false);
					console.log(err.message);
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'An error occurred while deleting user.',
					});
				});
			}
		});
	};

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
					<Divider />
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							{/* <Lorem count={2} /> */}
							<Grid templateColumns={{ base: '1fr', md: '1fr' }}>
								<Stack p={2}>
									<Stack>
										<Text>Name</Text>
										<Input type='text' placeholder='name' onChange={(e) => setName(e.target.value)} />
									</Stack>

									<Stack>
										<Text>Email</Text>
										<Input type='text' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
									</Stack>
								</Stack>
							</Grid>
						</Stack>
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