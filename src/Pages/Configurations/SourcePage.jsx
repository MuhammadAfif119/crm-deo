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
	Heading
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteDocumentFirebase, getCollectionFirebase } from '../../Api/firebaseApi'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
// import { deleteSource } from '../../../Api/firebaseFunctions'
import useUserStore from '../../Hooks/Zustand/Store'
import { deleteSource } from '../../Api/firebaseFunction'
import Swal from 'sweetalert2'

function IndexPage() {
    const globalState = useUserStore();
	const [data,setData]=useState()
	const [isLoading, setIsLoading] = useState(false);
	const [indexDelete, setIndexDelete] = useState(0)

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

	useEffect(() => {
	    if(globalState?.currentCompany)
	        getData()
	
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
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		  }).then(async (result) => {
			if (result.isConfirmed) {
				setIndexDelete(i)
				setIsLoading(true)
				const response =  deleteSource(data[i].sourceId, data[i].name)
				setIsLoading(false)
				if (response.status) {
					deleteDocumentFirebase('analytic_sources', data[i].id)
				   	getData()
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
		// console.log('delete')
		// const confirmDelete = window.confirm("Are you sure to delete this source?");
		// if (confirmDelete) {
		// 	setIndexDelete(i)
		// 	setIsLoading(true)
		// 	const response = await deleteSource(data[i].sourceId, data[i].name)
		// 	setIsLoading(false)
		// 	console.log(response, 'ok')
		// 	if (response.status) {
		// 		await deleteDocumentFirebase('analytic_sources', data[i].id)
		// 		getData()
		// 	} else {
		// 		alert(response.message)
		// 	}
		// }

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
						{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
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
										<Link to={`/projects/${x.projectId}`}>{x.projectId}</Link>
									</Td>
									<Td>{x.sourceType}</Td>
									<Td>{x.connectionName}</Td>
									<Td>
										{
											x.sourceType === 'google-ads' 
											?
												<>
													<Text>Customer ID: {x.params.configuration.customer_id}</Text>
												</>
											: 
												"" 
										}
									</Td>
									<Td>
										{
											isLoading && indexDelete === i ? 
												<Button m='2' isLoading colorScheme='green' >Loading</Button>
											: 
											<>
												<HStack>
													<Button bgColor={'green.500'} size={'sm'} onClick={() => deleteSourceData(i)}>
														<DeleteIcon color={'white'} />
													</Button>
													<Link to={`${x.id}`}>
														<Button bgColor={'orange.400'} size={'sm'}>
															<EditIcon color={'white'}>Edit</EditIcon>
														</Button>
													</Link>
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
		</Stack>
		</>
	)
}

export default IndexPage