import { Button, Container, Heading, HStack, Input, Select, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import BackButtonComponent from '../../Components/Buttons/BackButtons';
// import { createSource, initOauth } from '../../Apis/firebaseFunctions'
import { addDocumentFirebase, getCollectionFirebase } from '../../Api/firebaseApi'
import useUserStore from '../../Hooks/Zustand/Store'
import { createSource, initOauth } from '../../Api/firebaseFunction';
import { useNavigate } from 'react-router-dom';


function DomainsNewPage() {
	const [data, setData] = useState({})
	const [sourceLists, setSourceLists]=useState([])
    const globalState = useUserStore();
	const [isLoading, setIsLoading] = useState(false);
	const [projects,setProjects]=useState()
	const navigate = useNavigate()
	const [ouaths, setOauths] = useState([])
	const [newOauth, setNewOauth] = useState("")

	useEffect(() => {
	  setSourceLists(["google-analytics-data-api", "google-analytics-v4", "google-ads", "facebook-marketing"])
	  getProjects()
	  getOauths()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalState?.currentCompany])

	const getProjects = ()=>{
		const conditions = [
		{ field: "companyId", operator: "==", value: globalState.currentCompany },
		];
		getCollectionFirebase('projects',conditions)
		.then((x)=>setProjects(x))
		.catch((err)=>console.log(err.message))
	}

	const getOauths = ()=>{
		const conditions = [
			{ field: "companyId", operator: "==", value: globalState.currentCompany },
		];
		getCollectionFirebase('analytic_oauths', conditions)
		.then((x)=> {
			setOauths(x)
		})
		.catch((err)=>console.log(err.message))
	}

	const handleSave = async () => {
		try {
			setIsLoading(true)
			const response = await createSource(data)
			setIsLoading(false)
			if (response.status) {
				const dataResSource = response.data.source;
				const dataResConn = response.data.connection;
				const dataSave = {
					"companyId": globalState.currentCompany,
					"projectId": data.projectId,
					"sourceId": dataResSource.sourceId,
					"name": dataResSource.name,
					"workspaceId": data.workspaceId,
					"sourceType": data.sourceType,
					"params": dataResSource,
					"connectionId": dataResConn.connectionId,
					"connectionName": dataResConn.name,
					"paramsConection": dataResConn,
				}
				console.log('dataSave', dataSave)
				await addDocumentFirebase('analytic_sources', dataSave, globalState.currentCompany)
				alert("Success to save")
				navigate("/configuration/integration")
			} else {
				alert(response.message)
				return
			}
		} catch (error) {
			setIsLoading(false)
		}
	}

	const changeSourceList = (selectedSource) => {
		setData(data => ({...data, sourceType: selectedSource}))
		setNewOauth("")
		if (selectedSource !== "") {
			if (ouaths.length === 0) {
				setNewOauth(selectedSource)
			} else {
				const selectedOauth = ouaths.find(value => value.sourceType === selectedSource && value.projectId === data.projectId)
				if (selectedOauth === undefined) {
					setNewOauth(selectedOauth)
				} else {
					setData(data => ({...data, secretId: selectedOauth.secretId}))
				}
			}
		}
	}

	const changeProject = (id) => {
		setData(data => ({...data, sourceType: ""}))
		setData(data => ({...data, projectId: id}))
		setData(data => ({...data, companyId: globalState?.currentCompany}))
        setData(data => ({...data, workspaceId: "39d1492c-b5c8-4986-ad59-4049a8f1cc5c"}))
	}

	const requestOauth = async () => {
		try {
			const redirectUrl = "https://new-admin.importir.com/api/general/callback-oauth/"+globalState.currentCompany+"/" + data.projectId + "/" + data.workspaceId + "/" + data.sourceType
			setIsLoading(true)
			console.log('response', data)
			const response = await initOauth({
				name: data.sourceType,
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
		} catch (error) {

		}
	}
	
	return (<>
		<HStack mb='2'>
			<BackButtonComponent />
			<Heading>New Source</Heading>
		</HStack>
		<Container shadow='base' p='2'>
			<Heading fontSize='md'>Add New Source</Heading>
			<Select m='1' placeholder='Project' onChange={(e) => changeProject(e.target.value)}>
				{projects?.map((x,i)=>
				<option key={i} value={x.id}>{x.name}</option>)}
			</Select>
			{
				data.projectId !== undefined ?
					data.projectId !== "" ? 
						<div>
                            <Select m='1' placeholder='Sources' onChange={(e) => changeSourceList(e.target.value) }>
                                {sourceLists?.map((x,i)=>
                                <option key={i} value={x}>{x.toUpperCase()}</option>)}
                            </Select>
                            {
                                newOauth !== "" ? 
                                    isLoading  ? 
                                    <Button colorScheme='blue' isLoading >Integrate It</Button>
                                    :
                                    <Button colorScheme='blue' onClick={() => requestOauth()}>Integrate It</Button>
                                :
                                <>
									
                                    {
                                        data.sourceType === "google-analytics-data-api" ?
                                            <div>
                                                <Input m='1' type='text' placeholder='property_id' onChange={(e) => setData(data => ({ ...data, propertyId: e.target.value }))} /> 
                                                <Text fontSize='sm' color="tomato" as="i" ml={2}>A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body such as "123...". See the docs for more details.</Text>
                                                <Input m='2' type='date' placeholder='date_ranges_start_date' onChange={(e) => setData(data => ({ ...data, dateRangesStartDate: e.target.value }))} /> 
                                                <Text fontSize='sm' color="tomato" as="i" ml={2}>The start date from which to replicate report data. Data generated before this date will not be included in the report. Not applied to custom Cohort reports.</Text>
                                            </div>
                                        : (
                                            data.sourceType === 'google-ads' ? 
                                                <div>
                                                    <Input m='1' type='text' placeholder='customer_id ex: 6783948572,5839201945' onChange={(e) => setData(data => ({ ...data, customerId: e.target.value }))} /> 
                                                    <Text fontSize='sm' color="tomato" as="i" m={2}>Comma separated list of (client) customer IDs. Each customer ID must be specified as a 10-digit number without dashes. More instruction on how to find this value in our docs. Metrics streams like AdGroupAdReport cannot be requested for a manager account.</Text>
                                                    <Input m='2' type='date' placeholder='start_date' onChange={(e) => setData(data => ({ ...data, startDate: e.target.value }))} /> 
                                                    <Text fontSize='sm' color="tomato" as="i" ml={2}>UTC date and time in the format 2017-01-25. Any data before this date will not be replicated.</Text>
                                                </div>
                                            :
                                                data.sourceType === 'google-analytics-v4' ? 
                                                    <div>
                                                        <Input m='1' type='text' placeholder='view_id' onChange={(e) => setData(data => ({ ...data, viewId: e.target.value }))} /> 
                                                        <Text fontSize='sm' color="tomato" as="i" m={2}>The ID for the Google Analytics View you want to fetch data from. This can be found from the Google Analytics Account Explorer.</Text>
                                                        <Input m='2' type='date' placeholder='start_date' onChange={(e) => setData(data => ({ ...data, startDate: e.target.value }))} /> 
                                                        <Text fontSize='sm' color="tomato" as="i" ml={2}>The date in the format YYYY-MM-DD. Any data before this date will not be replicated.</Text>
                                                    </div>
                                                :

                                                    data.sourceType === 'facebook-marketing' ? 
                                                        <div>
                                                            <Input m='1' type='text' placeholder='account_id' onChange={(e) => setData(data => ({ ...data, accountId: e.target.value }))} /> 
                                                            <Text fontSize='sm' color="tomato" as="i" m={2}>The Facebook Ad account ID to use when pulling data from the Facebook Marketing API. Open your Meta Ads Manager. The Ad account ID number is in the account dropdown menu or in your browser's address bar. See the docs for more information.</Text>
                                                            <Input m='2' type='date' placeholder='start_date' onChange={(e) => setData(data => ({ ...data, startDate: e.target.value }))} /> 
                                                            <Text fontSize='sm' color="tomato" as="i" ml={2}>The date in the format YYYY-MM-DD. Any data before this date will not be replicated.</Text>
                                                        </div>
                                                    :
                                                    ""
                                        )
                                    }
									{
										data.sourceType !== ""
										? 
											<>
												<Select m='1' placeholder='Schedule Type' onChange={(e) => setData(data => ({...data, scheduleType: e.target.value})) }>
													<option value="manual">Manual</option>
													<option value="cron">Cron</option>
												</Select>
											</>
										: ""
									}
                                    {
                                        data.sourceType ? 
                                            isLoading  ? 
                                            <Button isLoading colorScheme='green' m='1' width='full'>Save</Button>  : 
                                            <Button colorScheme='green' m='1' width='full' onClick={() => handleSave()}>Save</Button>	
                                        : ""
                                    }
                                </>
                            }
                            
                        </div>
                    : ""
				: ""
			}
			
			
			
		</Container>
	</>
	)
}

export default DomainsNewPage