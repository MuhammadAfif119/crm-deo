import { Button, Checkbox, Container, Heading, HStack, Input, Select, Text, Stack, Grid, Box, GridItem, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import BackButtonComponent from '../../Components/Buttons/BackButtons';
// import { createSource, initOauth } from '../../Apis/firebaseFunctions'
import { addDocumentFirebase, getCollectionFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi'
import useUserStore from '../../Hooks/Zustand/Store'
import { createSource, initOauth, updateSource } from '../../Api/firebaseFunction';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'


function DomainsNewPage() {
	const [data, setData] = useState({})
	const [sourceLists, setSourceLists]=useState([])
    const globalState = useUserStore();
	const [isLoading, setIsLoading] = useState(false);
	const [projects,setProjects]=useState()
	const navigate = useNavigate()
	const [ouaths, setOauths] = useState([])
	const [newOauth, setNewOauth] = useState("")
	const [collectionGoogleAds, setCollectionGoogleAds] = useState()
	const [collectionFacebookMarketing, setCollectionFacebookMarketing] = useState()
	const [collectionGoogleAnalyticDataApi, setCollectionGoogleAnalyticDataApi] = useState()
	const [collectionGoogleAnalyticV4, setCollectionGoogleAnalyticV4] = useState()
	const params = useParams();
	const [projectUpdate, setProjectUpdate] = useState({})
	const [oautSelected, setOauthSelected] = useState([])

	useEffect(() => {
	  setSourceLists(["google-ads", "facebook-marketing", "google-analytics-data-api", "google-analytics-v4"])
	  setCollectionGoogleAds([
		"account_labels",
		"account_performance_report",
		"ad_group_ad_labels",
		"ad_group_ad_report",
		"ad_group_ads",
		"campaign_bidding_strategies",
		"campaign_budget",
		"campaign_labels",
		"campaigns",
		"click_view",
		"display_keyword_performance_report",
		"display_topics_performance_report",
		"display_topics_performance_report",
		"keyword_report",
		"shopping_performance_report",
		"user_interest",
		"user_location_report"
	  ])
	setCollectionGoogleAnalyticDataApi([
		"daily_active_users",
  		"devices",
		"locations",
		"pages",
		"trafic_sources",
		"website_overview",
		"weekly_active_users"
	])
	setCollectionGoogleAnalyticV4([
		"daily_active_users",
		"devices",
		"locations",
		"pages",
		"trafic_sources",
		"website_overview",
		"weekly_active_users",
		"monthly_active_users"
	])
	setCollectionFacebookMarketing([
		"ad_account",
		"ad_creatives",
		"ad_sets",
		"ads",
		"ads_insights",
		"ads_insights_action_type",
		"ads_insights_age_and_gender",
		"ads_insights_delivery_device",
		"ads_insights_delivery_platform",
		"ads_insights_delivery_platform_and_device_platform",
		"ads_insights_demographics_age",
		"ads_insights_demographics_dma_region",
		"ads_insights_demographics_gender",
		"ads_insights_dma",
		"ads_insights_platform_and_device",
		"ads_insights_region",
		"campaigns",
		"custom_conversions",
		"images",
		"videos"
	])
		
	  getOauths()
	  if (params.id !== "new") {
	  	getProject()
	  } else {
		getProjects()
	  }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [globalState?.currentCompany])

	const getProject = async () => {
		const projectData = await getSingleDocumentFirebase("analytic_sources", params.id);
		if (projectData === undefined) {
			alert("the data is not found");
			navigate("/configuration/integration")
		}
		setProjectUpdate(projectData)
		// Set project use projectName
		console.log("projectdata", projectData)
		const proSelected = []
		proSelected.push({
			"name": projectData.projectName
		})
		setProjects(proSelected)
		setData(data => ({...data, sourceId: projectData.sourceId}))
		setData(data => ({...data, connectionId: projectData.connectionId}))
		setData(data => ({...data, projectId: projectData.projectId}))
		setData(data => ({...data, sourceType: projectData.sourceType}))
		setOauthSelected([
			{"secretId": projectData.secretId, "email": projectData.secretEmail}
		])
		const oauthData = {
			secretId: projectData.secretId,
			secretEmail: projectData.secretEmail,
		}
		setData(data => ({...data, secretId: oauthData.secretId}))
		setData(data => ({...data, secretEmail: oauthData.secretEmail}))
		setNewOauth(oauthData)
		setSourceLists([projectData.sourceType])
		setData(data => ({...data, collectionList: projectData.collectionList}))
		if (projectData.sourceType === "google-ads") {
			setData(data => ({...data, customerId: projectData.params.configuration.customer_id}))
			setData(data => ({...data, startDate: projectData.params.configuration.start_date}))
		} else if (projectData.sourceType === "facebook-marketing") {
			setData(data => ({...data, accountId: projectData.params.configuration.account_id}))
			var d = new Date(projectData.params.configuration.start_date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

			if (month.length < 2) 
				month = '0' + month;
			if (day.length < 2) 
				day = '0' + day;

			setData(data => ({...data, startDate: [year, month, day].join('-')}))
		} else if (projectData.sourceType === "google-analytics-data-api") {
			setData(data => ({...data, propertyId: projectData.params.configuration.property_id}))
			setData(data => ({...data, dateRangesStartDate: projectData.params.configuration.date_ranges_start_date}))
		} else if (projectData.sourceType === "google-analytics-v4") {
			setData(data => ({...data, viewId: projectData.params.configuration.view_id}))
			setData(data => ({...data, startDate: projectData.params.configuration.start_date}))
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

	const handleUpdate = async () => {
		console.log("data", data);
		setIsLoading(true)
		const response = await updateSource(data)
		setIsLoading(false)
		if (response.status) {
			const newData = projectUpdate
			newData.params = response.data.source
			newData.collectionList = data.collectionList
			await updateDocumentFirebase("analytic_sources", params.id, newData)
			Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Success to update'
			})
			navigate("/configuration/integration")
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: response.message
			})
			return
		}
		console.log("dta", response)
	};

	const handleSave = async () => {
		try {
			// if (data.collectionList === undefined) {
			// 	alert("Please select the collection list")
			// 	return
			// }
			// if (data.collectionList.length === 0) {
			// 	alert("Please select the collection list")
			// 	return
			// }
			setIsLoading(true)
			const response = await createSource(data)
			setIsLoading(false)
			if (response.status) {
				const dataResSource = response.data.source;
				const dataResConn = response.data.connection;
				const dataSave = {
					"companyId": globalState.currentCompany,
					"projectId": data.projectId,
					"projectName": data.projectName,
					"connectionId": dataResConn.connectionId,
					"connectionName": dataResConn.name,
					"sourceId": dataResSource.sourceId,
					"name": dataResSource.name,
					"workspaceId": data.workspaceId,
					"sourceType": data.sourceType,
					"params": dataResSource,
					"collectionList": [],
					"secretId": data.secretId,
					"secretEmail": data.secretEmail,
					"scheduleType": data.scheduleType,
				}
				console.log('dataSave', dataSave)
				await addDocumentFirebase('analytic_sources', dataSave, globalState.currentCompany)
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: 'Successfully save data'
				})
				navigate("/configuration/integration")
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: response.message
				})
				return
			}
		} catch (error) {
			setIsLoading(false)
		}
	}

	const changeSourceList = (selectedSource) => {
		setData(data => ({...data, sourceType: selectedSource}))
		if (selectedSource !== "") {
			if (ouaths.length > 0) {
				setOauthSelected(ouaths.filter(value => value.sourceType === selectedSource && value.projectId === data.projectId))
			}
		}
	}

	const chooseOauth = (id) => {
		const oauth = oautSelected[id]
		setData(data => ({...data, secretId: oauth.secretId}))
		setData(data => ({...data, secretEmail: oauth.email}))
		setNewOauth(oauth)
	}

	const changeProject = (id) => {
		const projectSelected = projects.find(val => val.id === id)
		setData(data => ({...data, sourceType: ""}))
		setNewOauth("")
		setData(data => ({...data, projectId: id}))
		if (projectSelected !== undefined) {
			setData(data => ({...data, projectName: projectSelected.name}))
		}
		setData(data => ({...data, companyId: globalState?.currentCompany}))
        setData(data => ({...data, workspaceId: "39d1492c-b5c8-4986-ad59-4049a8f1cc5c"}))
	}

	const changeCollectionName = (x) => {
		const collectionList = data.collectionList
		if (collectionList === undefined) {
			setData(data => ({...data, collectionList: [x]}))
		} else {
			if (collectionList.includes(x)) {
				setData(data => ({...data, collectionList: collectionList.filter(val => val !== x)}))
			} else {
				collectionList.push(x)
				setData(data => ({...data, collectionList: collectionList}))
			}
		}
	}
	
	return (<>
		<HStack mb='2'>
			<BackButtonComponent />
			<Stack p={4}>
				<Heading>{params.id === "new" ? "New Source" : "Edit Source"}</Heading>
			</Stack>
		</HStack>
		<Container shadow='xl' borderRadius={10} p='2' maxW={'container.sm'}>
			<FormControl mt={3}>
				<FormLabel>Your Project</FormLabel>
				<Select m='1' placeholder={params.id === "new" ? 'Project' : ''} onChange={(e) => changeProject(e.target.value)}>
					{projects?.map((x,i)=>
					<option key={i} value={x.id}>{x.name}</option>)}
				</Select>
			</FormControl>
			{
				data.projectId !== undefined ?
					data.projectId !== "" ? 
						<div>
							<FormControl mt={3}>
								<FormLabel>Sources</FormLabel>
								<Select m='1' value={data?.sourceType} mt={1} placeholder={params.id === "new" ? 'Sources' : ""} onChange={(e) => changeSourceList(e.target.value) }>
									{sourceLists?.map((x,i)=>
									<option key={i} value={x}>{x.toUpperCase()}</option>)}
								</Select>
							</FormControl>
                            {
								data.sourceType !== ""
								? 
									oautSelected?.length === 0 ? 
										<Stack mt={2}>
											{isLoading  ? 
											<Button colorScheme='blue' isLoading >Integrate It</Button>
											:
											<Button colorScheme='blue' onClick={() => navigate(`/configuration/integration/oauth/${data.projectId}/${data.sourceType}`)}>
												Connect to Your Account for {data.sourceType} platform
											</Button>}
										</Stack>
									:
										<>
											<FormControl mt={3}>
												<FormLabel>Your History Account for {data.sourceType}</FormLabel>
												{
													params.id === "new" ?
														<Select m='1' defaultValue={newOauth} mt={2} placeholder="Choose Oauth" onChange={(e) => chooseOauth(e.target.value) }>
															{oautSelected?.map((x,i)=>
															<option key={i} value={i}>{x.email} | {x.secretId}</option>)}
														</Select>
													:
														<Text>You use the email account: {data.secretEmail}</Text>
												}
												<FormHelperText color={"red.500"}>Make sure your account has an access to {data.sourceType}</FormHelperText>
											</FormControl>
											{
												newOauth ? 
													<>
														
														{
															data.sourceType === "google-analytics-data-api" ?
																<>
																	<FormControl mt={3}>
																		<FormLabel>Collection List</FormLabel>
																		<Grid m="1" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }} gap={{ base: 2, md: 3, lg: 4 }}>
																			{collectionGoogleAnalyticDataApi?.map(x => 
																				<GridItem w={'100%'} >
																						<Checkbox defaultChecked={data?.collectionList?.includes(x) ? true :  false} onChange={(e) => changeCollectionName(x)} wordBreak={'break-all'}>{x}</Checkbox>
																				</GridItem>
																			)}
																		</Grid>
																		<FormHelperText color={"red.500"}>You can pick the collection data</FormHelperText>
																	</FormControl>
																	<FormControl mt={3}>
																		<FormLabel>Property ID</FormLabel>
																		<Input m='1' type='text' defaultValue={data?.propertyId} placeholder='property_id' onChange={(e) => setData(data => ({ ...data, propertyId: e.target.value }))} /> 
																		<FormHelperText color={"red.500"}>A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body such as "123...". See the docs for more details.</FormHelperText>
																	</FormControl>
																	<FormControl mt={3}>
																		<FormLabel>Date</FormLabel>
																		<Input m='1' type='date' placeholder='date_ranges_start_date' defaultValue={data?.dateRangesStartDate} onChange={(e) => setData(data => ({ ...data, dateRangesStartDate: e.target.value }))} /> 
																		<FormHelperText color={"red.500"}>The date from which to replicate report data. Data generated before this date will not be included in the report. Not applied to custom Cohort reports.</FormHelperText>
																	</FormControl>
																</>
															: (
																data.sourceType === 'google-ads' ? 
																	<>
																		<FormControl mt={3}>
																			<FormLabel>Collection List</FormLabel>
																			<Grid m="1" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }} gap={{ base: 2, md: 3, lg: 4 }}>
																				{collectionGoogleAds?.map(x => 
																					<GridItem w={'100%'} >
																							<Checkbox defaultChecked={data?.collectionList?.includes(x) ? true :  false} onChange={(e) => changeCollectionName(x)} wordBreak={'break-all'}>{x}</Checkbox>
																					</GridItem>
																				)}
																			</Grid>
																			<FormHelperText color={"red.500"}>You can pick the collection data</FormHelperText>
																		</FormControl>
																		<FormControl mt={3}>
																			<FormLabel>Customer ID</FormLabel>
																			<Input m='1' type='text' placeholder='customer_id ex: 6783948572,5839201945' defaultValue={data?.customerId} onChange={(e) => setData(data => ({ ...data, customerId: e.target.value }))} /> 
																			<FormHelperText color={"red.500"}>Comma separated list of (client) customer IDs. Each customer ID must be specified as a 10-digit number without dashes. More instruction on how to find this value in our docs. Metrics streams like AdGroupAdReport cannot be requested for a manager account.</FormHelperText>
																		</FormControl>
																		<FormControl mt={3}>
																			<FormLabel>Date</FormLabel>
																			<Input m='1' type='date' placeholder='start_date' defaultValue={data?.startDate} onChange={(e) => setData(data => ({ ...data, startDate: e.target.value }))} /> 
																			<FormHelperText color={"red.500"}>UTC date and time in the format 2017-01-25. Any data before this date will not be replicated.</FormHelperText>
																		</FormControl>
																	</>
																:
																	data.sourceType === 'google-analytics-v4' ? 
																		<>
																			<FormControl mt={3}>
																				<FormLabel>Collection List</FormLabel>
																				<Grid m="1" templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }} gap={{ base: 2, md: 3, lg: 4 }}>
																					{collectionGoogleAnalyticV4?.map(x => 
																						<GridItem w={'100%'} >
																								<Checkbox defaultChecked={data?.collectionList?.includes(x) ? true :  false} onChange={(e) => changeCollectionName(x)} wordBreak={'break-all'}>{x}</Checkbox>
																						</GridItem>
																					)}
																				</Grid>
																				<FormHelperText color={"red.500"}>You can pick the collection data</FormHelperText>
																			</FormControl>
																			<FormControl mt={3}>
																				<FormLabel>View ID</FormLabel>
																				<Input m='1' type='text' placeholder='view_id' defaultValue={data?.viewId} onChange={(e) => setData(data => ({ ...data, viewId: e.target.value }))} /> 
																				<FormHelperText color={"red.500"}>The ID for the Google Analytics View you want to fetch data from. This can be found from the Google Analytics Account Explorer</FormHelperText>
																			</FormControl>
																			<FormControl mt={3}>
																				<FormLabel>Date</FormLabel>
																				<Input m='1' type='date' placeholder='start_date' defaultValue={data?.startDate} onChange={(e) => setData(data => ({ ...data, startDate: e.target.value }))} /> 
																				<FormHelperText color={"red.500"}>UTC date and time in the format 2017-01-25. Any data before this date will not be replicated.</FormHelperText>
																			</FormControl>
																		</>
																	:

																		data.sourceType === 'facebook-marketing' ? 
																			<>
																				<FormControl mt={3}>
																					<FormLabel>Collection List</FormLabel>
																					<Box overflowX="scroll">
																						<Grid m={1} templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }} gap={{ base: 2, md: 3, lg: 4 }}>
																							{collectionFacebookMarketing?.map(x => 
																							<GridItem>
																								<Checkbox m="1" defaultChecked={data?.collectionList?.includes(x) ? true :  false} onChange={(e) => changeCollectionName(x)}>{x}</Checkbox>
																							</GridItem>
																							)}
																						</Grid>
																					</Box>
																				</FormControl>
																				<FormControl mt={3}>
																					<FormLabel>Account ID</FormLabel>
																					<Input m='1' type='text' defaultValue={data?.accountId} placeholder='account_id' onChange={(e) => setData(data => ({ ...data, accountId: e.target.value }))} /> 
																					<FormHelperText color={"red.500"}>The Facebook Ad account ID to use when pulling data from the Facebook Marketing API. Open your Meta Ads Manager. The Ad account ID number is in the account dropdown menu or in your browser's address bar. See the docs for more information.</FormHelperText>
																				</FormControl>
																				<FormControl mt={3}>
																					<FormLabel>Date</FormLabel>
																					<Input m='1' type='date'  defaultValue={data?.startDate} placeholder='start_date' onChange={(e) => setData(data => ({ ...data, startDate: e.target.value }))} /> 
																					<FormHelperText color={"red.500"}>The date in the format YYYY-MM-DD. Any data before this date will not be replicated.</FormHelperText>
																				</FormControl>
																			</>
																		:
																		""
															)
														}
														{
															data.sourceType !== ""
															? 
																params.id === "new"
																?
																	<>
																		<FormControl mt={3}>
																			<FormLabel>Schedule Type</FormLabel>
																			<Select m='1' placeholder='Schedule Type' onChange={(e) => setData(data => ({...data, scheduleType: e.target.value})) }>
																				<option value="manual">Manual</option>
																				<option value="cron">Cron</option>
																			</Select>
																		</FormControl>
																	</>
																: ""
															: ""
														}
														{
															data.sourceType ? 
																params.id === "new" ?
																	isLoading  ? 
																	<Button isLoading colorScheme='green' m='1' width='full'>Save</Button>  : 
																	<Button colorScheme='green' m='1' width='full' onClick={() => handleSave()}>Save</Button>	
																: 
																	isLoading  ? 
																	<Button isLoading colorScheme='green' m='1' width='full'>Update</Button>  : 
																	<Button colorScheme='green' m='1' width='full' onClick={() => handleUpdate()}>Update</Button>	
															: ""
														}
													</>
												: 
													""
											}
										</>
								:
									""
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