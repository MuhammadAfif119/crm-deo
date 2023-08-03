import {
	Box, Button, HStack, Spacer, Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteDocumentFirebase, getCollectionFirebase } from '../../Api/firebaseApi'
import { DeleteIcon } from '@chakra-ui/icons'
// import { deleteSource } from '../../../Api/firebaseFunctions'
import useUserStore from '../../Hooks/Zustand/Store'
import { deleteSource } from '../../Api/firebaseFunction'

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
		console.log('delete')
		const confirmDelete = window.confirm("Are you sure to delete this source?");
		if (confirmDelete) {
			setIndexDelete(i)
			setIsLoading(true)
			const response = await deleteSource(data[i].sourceId, data[i].name)
			setIsLoading(false)
			if (response.status) {
				await deleteDocumentFirebase('analytic_sources', data[i].id)
				getData()
			} else {
				alert(response.message)
			}
		}
	}
	
	return (
		<>
		<Box>
			<HStack>
				<Spacer />
				<Link to='new'>
					<Button colorScheme='green'>Add Source</Button>
				</Link>
			</HStack>
			<TableContainer>
				<Table variant='simple'>
					{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
					<Thead>
						<Tr>
							<Th>Project ID</Th>
							<Th>Source Type</Th>
							<Th>Connection Name</Th>
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
										isLoading && indexDelete === i ? 
										<Button m='2' isLoading colorScheme='green' >Loading</Button> : <DeleteIcon onClick={() => deleteSourceData(i)} />
									}
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
		</>
	)
}

export default IndexPage