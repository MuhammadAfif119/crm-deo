import {
	Box, Button, HStack, Spacer, Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Text,
	Stack,
	Heading,
	Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteDocumentFirebase, getCollectionFirebase, updateDocumentFirebase } from '../../Api/firebaseApi'
import { AddIcon, CheckCircleIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
// import { deleteSource } from '../../../Api/firebaseFunctions'
import useUserStore from '../../Hooks/Zustand/Store'
import { deleteSource, updateSecretId } from '../../Api/firebaseFunction'
import Swal from 'sweetalert2'

function IndexPage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const globalState = useUserStore();
	const [data,setData]=useState()
	const [isLoading, setIsLoading] = useState(false);
	const [indexDelete, setIndexDelete] = useState(0)
	const [oauths, setOauths] = useState([])
	const [sourceSelected, setSourceSelected] = useState({})
	const [oauthSelected, setOauthSelected] = useState()

	const getData = ()=>{
		const conditions = [
      		{ field: "companyId", operator: "==", value:  globalState?.currentCompany},
    	];
		getCollectionFirebase('analytic_sources',conditions) 
		.then((x)=>{
			console.log(x)
			if(x){
				setData(x)
			}
		})
	}

	const getOauths = ()=>{
		const conditions = [
      		{ field: "companyId", operator: "==", value:  globalState?.currentCompany},
    	];
		getCollectionFirebase('analytic_oauths',conditions) 
		.then((x)=>{
			console.log("oauths", oauths)
			if(x){
				setOauths(x)
			}
		})
	}

	useEffect(() => {
	    if(globalState?.currentCompany)
	        getData()
			getOauths()
	
        return () => {
            setData()
        }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalState?.currentCompany])

	const deleteSourceData = async (i) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Yes, delete it!'
		  }).then(async (result) => {
			if (result.isConfirmed) {
				setIndexDelete(i)
				setIsLoading(true)
				const response = await deleteSource(data[i].sourceId, data[i].name)
				setIsLoading(false)
				if (response.status) {
					await deleteDocumentFirebase('analytic_sources', data[i].id)
				   	await getData()
					Swal.fire(
						'Deleted!',
						'Your file has been deleted.',
						'success'
					)
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: response.message
					})
				}
			}
		})
	}

	const changeSource = (id) => {
		console.log("data", data[id])
		setSourceSelected(data[id])
		onOpen()
	}

	const changeOauth = async (oauth) => {
		setOauthSelected(oauth.id)
		console.log("oauth", oauth)
		setIsLoading(true)
		const response = await updateSecretId({
			"secretId": oauth.secretId,
			"sourceId": sourceSelected.sourceId
		})
		console.log("response", response)
		setIsLoading(false)
		if (response.status) {
			sourceSelected.secretId = oauth.secretId
			await updateDocumentFirebase("analytic_sources", sourceSelected.id, sourceSelected)
			onClose()
		} else {
			alert(response.message)
		}
	}
	
	return (
		<>
		<Stack p={[1, 1, 5]}>
			<Stack spacing={4}>
				<HStack>
					<Heading size={'md'} fontWeight={'bold'}>Integration</Heading>
					<Spacer />
					<Link to='new'>
						<Button colorScheme='green' size={'sm'}>+</Button>
					</Link>
				</HStack>
				<Stack bgColor={'white'} spacing={1} borderRadius={'xl'} p={3} m={[1, 1, 4]} shadow={'md'} overflowY={'auto'}>
					<Table variant='striped' colorScheme='gray'>
						<Thead>
							<Tr>
								<Th>Project ID</Th>
								<Th>Source Type</Th>
								<Th>Connection Name</Th>
								<Th>Param</Th>
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
							{data?.map((x,i) =>
								<Tr key={i}>
									<Td>
										<Link to={`/projects/${x.projectId}`}>{x.projectName}</Link>
									</Td>
									<Td>{x.sourceType}</Td>
									<Td>{x.connectionName}</Td>
									<Td>
										{
											x.sourceType === 'google-ads' 
											?
												<>
													<Text>Customer ID: {x.params.configuration.customer_id}</Text>
													<Text>Date: {x.params.configuration.start_date}</Text>
												</>
											: 
												x.sourceType === 'facebook-marketing' 
												?
													<Text>Account ID: {x.params.configuration.account_id}</Text>
												:
													""
										}
										Oauth Email: {x.secretEmail}
										<br />
										<Link to={`oauth/${x.projectId}/${x.sourceType}`}>
											<Button bgColor={'blue.300'} size={'sm'}>
												<AddIcon color={'white'}></AddIcon> Oauth
											</Button>
										</Link>
										<Button onClick={() => changeSource(i)} bgColor={'orange.300'} size={'sm'} ml={3}>
											<EditIcon color={'white'}></EditIcon> Change
										</Button>
									</Td>
									<Td>
										{
											isLoading && indexDelete === i ? 
												<Button m='2' isLoading colorScheme='green' >Loading</Button>
											: 
											<>
												<HStack>
													<Link to={`${x.id}`}>
														<Button bgColor={'orange.300'} size={'sm'}>
															<EditIcon color={'white'}>Edit</EditIcon>
														</Button>
													</Link>
													<Button bgColor={'red.500'} size={'sm'} onClick={() => deleteSourceData(i)}>
														<DeleteIcon color={'white'} />
													</Button>
												</HStack>
											</>
										}
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</Stack>
			</Stack>
			<Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose Oauths</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack overflowX={"auto"}>
							<Table variant='striped' colorScheme='gray'>
							<Thead>
								<Tr>
									<Th>Action</Th>
									<Th>Email</Th>
									<Th>Source Type</Th>
								</Tr>
							</Thead>
							<Tbody>
								{oauths?.filter(val => val.sourceType === sourceSelected.sourceType).map((x, i) => 
									<Tr key={i}>
										<Td>
											{
												x.email !== sourceSelected.secretEmail
												?
													isLoading && oauthSelected === x.id ?
														<Button isLoading bgColor={'blue.300'} size={'sm'} ml={3}>
															<CheckCircleIcon color={'white'}></CheckCircleIcon> Select
														</Button>
													:
														<Button onClick={() => changeOauth(x)} bgColor={'blue.300'} size={'sm'} ml={3}>
															<CheckCircleIcon color={'white'}></CheckCircleIcon> Select
														</Button>
												:
													""
											}
										</Td>
										<Td>
											<Text>{x.email}</Text>
										</Td>
										<Td>
											<Text>{x.sourceType}</Text>
										</Td>
									</Tr>
								)}
							</Tbody>
							</Table>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant={'outline'} size='sm' colorScheme="red" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
		</Stack>
		</>
	)
}

export default IndexPage