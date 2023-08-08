import { Button, Checkbox, Container, Heading, HStack, Input, Select, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import BackButtonComponent from '../../Components/Buttons/BackButtons';
// import { createSource, initOauth } from '../../Apis/firebaseFunctions'
import { addDocumentFirebase, getCollectionFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi'
import useUserStore from '../../Hooks/Zustand/Store'
import { createSource, initOauth, updateSource } from '../../Api/firebaseFunction';
import { useNavigate, useParams } from 'react-router-dom';


function DomainsNewPage() {
	const [data, setData] = useState({})
    const globalState = useUserStore();
	const [isLoading, setIsLoading] = useState(false);
	const params = useParams()

	useEffect(() => {
		setData({
			"companyId": globalState?.currentCompany,
			"projectId": params.projectId,
			"sourceType": params.sourceType,
			"workspaceId": "39d1492c-b5c8-4986-ad59-4049a8f1cc5c",
		})
		console.log("global", globalState)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalState?.currentCompany])

	const handleSave = async () => {
		setIsLoading(true)
		console.log("data", data)
		const resultSave = await addDocumentFirebase("analytic_oauths", data, globalState?.currentCompany);
		console.log("result save", resultSave);
		const redirectUrl = "https://new-admin.importir.com/api/general/callback-oauth/"+ resultSave
		const response = await initOauth({
			name: params.sourceType,
			workspaceId: data.workspaceId,
			redirectUrl: redirectUrl
		})
		setIsLoading(false)
		if (response.status) {
			window.location.href = response.data.consentUrl
		} else {
			alert(response.message)
			return
		}
	}
	
	return (<>
		<HStack mb='2'>
			<BackButtonComponent />
			<Heading>Integrate Page</Heading>
		</HStack>
		<Container shadow='base' p='2'>
			<Heading fontSize='md'>Submit Email</Heading>
			<Input m='1' mt={4} type='text' placeholder='Email here' onChange={(e) => setData(data => ({ ...data, email: e.target.value }))} /> 
			{
				isLoading  ? 
				<Button isLoading colorScheme='green' m='1' width='full'>Save</Button>  : 
				<Button colorScheme='green' m='1' width='full' onClick={() => handleSave()}>Integrate</Button>	
			}
			<Text color="red">You will add a new oauth to {params.sourceType}</Text>
		</Container>
	</>
	)
}

export default DomainsNewPage