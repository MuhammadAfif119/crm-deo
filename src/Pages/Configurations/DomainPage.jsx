import { DeleteIcon, ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons'
import {
	Box, Button, Heading, HStack, Spacer, Table,
	Thead,
	Tbody,
	Image,
	Tr,
	Th,
	Td,
	TableContainer,
	Text,
	Stack
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteDocumentFirebase, getCollectionFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi'
import { checkDomainCustom, deleteDomainCustom } from '../../Api/vercelAPI'
import useUserStore from '../../Hooks/Zustand/Store'

function DomainsPage() {
  	const globalState = useUserStore();
	const [data,setData]=useState()

	const getData = ()=>{
		const conditions = [
      		{ field: "companyId", operator: "==", value:  globalState?.currentCompany},
    	];

		getCollectionFirebase('domain_lists',conditions) 
		.then((x)=>{
			console.log(x)
			if(x){
				setData(x)
			}
		})
	}

	const deleteDomain = async (i) => {
		const confirmDelete = window.confirm("Are you sure to delete this domain?");
		if (confirmDelete) {
			const deleteDomainResult = await deleteDomainCustom(data[i].domain, data[i].projectVercel)
			if (deleteDomainResult.status) {
				await deleteDocumentFirebase('domain_lists', data[i].id)
				let domain = await getSingleDocumentFirebase('domains', data[i].projectId)
				domain.domain = domain.domain.filter(function(e) { return e !== data[i].domain })
				await setDocumentFirebase("domains", data[i].projectId, domain)
				getData()
				alert("Success to delete domain");
			} else {
				alert(deleteDomainResult.message)
			}
		}
	}

	const checkDomain = async (i) => {
		const domainResult = await checkDomainCustom(data[i].domain, data[i].projectVercel)
		if (domainResult.status) {
			alert("Result verify: " + JSON.stringify(domainResult.data));
		} else {
			alert(domainResult.message)
		}
	}
	const getSubdomain = (verification) => {
		if (verification.name !== verification.apexName) {
			return {
				isSubdomain: true,
				name: verification.name.replaceAll("."+verification.apexName, "")
			}
		} else {
			return {
				isSubdomain: false,
				name: verification.name
			}
		}
	}

	const showButton = (domain) => {
		if (domain.includes("deoapp.site")) {
			return false;
		}
		return true
	}

	useEffect(() => {
		console.log("use effect")
		if(globalState?.currentCompany)
	  		getData()
	
	  return () => {
		setData()
	  }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	
	return (
		<>
		<Stack p={[1, 1, 5]}>
			<Stack spacing={4}>
				<HStack>
					<Heading size={'md'} fontWeight={'bold'}>Domain Name</Heading>
					<Spacer />
					<Link to='new'>
						<Button colorScheme='green' size={'sm'}>+</Button>
					</Link>
				</HStack>
				<Stack bgColor={'white'} spacing={1} borderRadius={'xl'} p={3} m={[1, 1, 4]} shadow={'md'}>
					<Table variant='striped' colorScheme='gray'>
						{/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
						<Thead>
							<Tr>
								<Th>Domain Name</Th>
								<Th>Project</Th>
								<Th>type</Th>
								<Th>server</Th>
								<Th>status</Th>
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
							{data?.map((x,i) =>
								<Tr key={i}>
									<Td>
										<HStack>
											<Text>{x.domain}</Text>
											<a href={`https://${x.domain}`} target="_blank" rel="noreferrer">
											<ExternalLinkIcon />
											</a>
										</HStack>
									</Td>
									<Td>
										<Link to={`/projects/${x.projectId}`}>{x.projectId}</Link>
									</Td>
									<Td>{data?.detail?.find((z)=>z.domain===x)?.module.toString()}</Td>
									<Td>
										<HStack textAlign='center'>
											{x.server === 'netlify' ?
												<Image w='50px' src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Netlify_logo_%282%29.svg/600px-Netlify_logo_%282%29.svg.png' />
												:
												<svg aria-label="Vercel logotype" width="50px" role="img" viewBox="0 0 283 64" ><path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" fill="black"></path></svg>
											}
											<Box w='10px' h='10px' bgColor='green' borderRadius='full' />
										</HStack>
									</Td>
									<Td>
										{
											x.verification !== undefined ?
												<Box fontSize='2xs'>
													<Text>{x.verified?'verified':'unverified'}</Text>
													<Text>Type: {x.verification[0].type}</Text>
													<Text>Name: _vercel</Text>
													<Text>Value: {x.verification[0].value}</Text>
												</Box>
											:(
												getSubdomain(x).isSubdomain ? 
												<Box fontSize='2xs'>
													<Text>{x.verified?'verified':'unverified'}</Text>
													<Text>Type: CNAME</Text>
													<Text>Name: {getSubdomain(x).name}</Text>
													<Text>Value: cname.vercel-dns.com.</Text>
												</Box>
												:
												<Box fontSize='2xs'>
													<Text>{x.verified?'verified':'unverified'}</Text>
													<Text>Type: A</Text>
													<Text>Name: @</Text>
													<Text>Value: 76.76.21.21</Text>
												</Box>
											)
										}
									</Td>
									<Td >
										{showButton(x.domain) ? 
										<HStack>
											<Button onClick={()=> checkDomain(i)} bgColor={'green.500'} size={'sm'}>
												<RepeatIcon color={'white'}/>
											</Button>
											<Button onClick={() => deleteDomain(i)} bgColor={'red.500'} size={'sm'}>
												<DeleteIcon color={'white'} />
											</Button>
										</HStack> : ""}
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

export default DomainsPage