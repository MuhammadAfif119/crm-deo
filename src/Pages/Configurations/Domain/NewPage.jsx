import { Box, Button, Container, Heading, HStack, Input, Select, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDocumentFirebase, getCollectionFirebase, getSingleDocumentFirebase, setDocumentFirebase } from '../../../Api/firebaseApi'
import BackButtonComponent from '../../../Components/Buttons/BackButtons';
import { createDomainCustom } from '../../../Api/vercelAPI'
import useUserStore from '../../../Hooks/Zustand/Store';

function NewPage() {
    const globalState = useUserStore();
	const [data, setData] = useState({})
	const [projects,setProjects]=useState()
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(false);
	const [textVerif, setTextVerif] = useState(null);
	const [isComplete, setIsComplete] = useState(false)

	const handleSave = async () => {
		if(!data.name) {
			alert("Please fill the name of domain!")
			return
		}
		if(!data.projectId) {
			alert("Please fill the project!")
			return
		}
		setIsLoading(true);
		// Rules domain di comment di firestorate rule
		const response = (await createDomainCustom(data))
        setIsLoading(false);
		if (response.status) {
			let domainData = response.data
			let domain = await getSingleDocumentFirebase('domains', data.projectId)
			if (domain === undefined) {
				domain = {"domain": [data.name]}
			} else {
				domain.domain.push(data.name)
			}
			await setDocumentFirebase("domains", data.projectId, domain)

			domainData.domain = data.name
			domainData.companyId = globalState.currentCompany
			domainData.projectId = data.projectId
            domainData.projectVercel = data.projectVercel
			addDocumentFirebase('domain_lists', domainData, domainData.companyId )
			if (domainData.verification !== undefined) {
				setTextVerif(domainData.verification[0])
			} else {
				if (domainData.name !== domainData.apexName) {
					const subdomain = domainData.name.replaceAll("."+domainData.apexName, "")
					setData({...data, verif: subdomain, isSubdomain: true})
				} else {
					setData({...data, verif: domainData.name, isSubdomain: false})
				}
			}
			setIsComplete(true)
		} else {
			alert(response.message);
		}
	}

	const getProjects = ()=>{
		    const conditions = [
      { field: "companyId", operator: "==", value: globalState.currentCompany },
    ];
		getCollectionFirebase('projects',conditions)
		.then((x)=>setProjects(x))
		.catch((err)=>console.log(err.message))
	}

	useEffect(() => {
	  getProjects()
	
	  return () => {
		setProjects()
	  }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalState?.currentCompany])
	
	return (<>
		<HStack mb='2'>
			<BackButtonComponent />
			<Heading>Domain Name</Heading>
			{/* <Button onClick={() => console.log(data)}>check console</Button> */}
		</HStack>
		<Container shadow='base' p='2'>
			<Heading fontSize='md'>Add new domain name</Heading>
			<Input m='1' type='text' placeholder='domain name ex: mydomain.com' onChange={(e) => setData({ ...data, name: e.target.value })} />
			<Select m='1' placeholder='Project' onChange={(e) => setData({ ...data, projectId: e.target.value })}>
				{projects?.map((x,i)=>
				<option key={i} value={x.id}>{x.name}</option>)}
			</Select>
			<Select m='1' placeholder='Project Vercel' onChange={(e) => setData({ ...data, projectVercel: e.target.value })}>
				<option value="pageview">Deoapp Pageview</option>
                <option value="domainview-react">Deoapp Domainview React</option>
			</Select>

			{textVerif ? 
			<Box p='5'>
				<Text>Create an {textVerif.type} record for {data?.name} pointing to our server.</Text>
				<HStack bgColor='gray.100' p='3' gap={2}>
				<Box>
					<Text>Type</Text>
					<Text>{textVerif.type}</Text>
				</Box>
				<Box>
					<Text>Name</Text>
					<Text>_vercel</Text>
				</Box>
				<Box>
					<Text>Value</Text>
					<Text>{textVerif.value}</Text>
				</Box>
				</HStack>
			</Box> : ""}
			
			{data?.verif? 
				!data.isSubdomain ?
					<Box p='5'>
						<Text>Create an A record for {data?.name} pointing to our server.</Text>
						<HStack bgColor='gray.100' p='3' gap={2}>
						<Box>
							<Text>Type</Text>
							<Text>A</Text>
						</Box>
						<Box>
							<Text>Name</Text>
							<Text>@</Text>
						</Box>
						<Box>
							<Text>Value</Text>
							<Text>76.76.21.21</Text>
						</Box>
						</HStack>
					</Box>
					:
					<Box p='5'>
						<Text>Set the following record on your DNS provider to continue.</Text>
						<HStack bgColor='gray.100' p='3' gap={2}>
						<Box>
							<Text>Type</Text>
							<Text>CNAME</Text>
						</Box>
						<Box>
							<Text>Name</Text>
							<Text>{data.verif}</Text>
						</Box>
						<Box>
							<Text>Value</Text>
							<Text>cname.vercel-dns.com</Text>
						</Box>
						</HStack>
					</Box>
				:
				<></>

			}

			{!isComplete ? 
				(isLoading ? 
					<Button isLoading colorScheme='green' m='1' width='full'>Save</Button> : 
					<Button colorScheme='green' m='1' width='full' onClick={() => handleSave()}>Save</Button>
				)
			: 
				<Button colorScheme='green' m='1' width='full' onClick={() =>navigate("/configuration/domain")}>Complete</Button>}		
		</Container>
	</>
	)
}

export default NewPage