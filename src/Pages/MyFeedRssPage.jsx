import { Button, Checkbox, Divider, Flex, HStack, Image, Input, Progress, SimpleGrid, Spacer, Stack, Tag, Text, Textarea, } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'


import axios from 'axios'
import moment from 'moment'
import AppSideBarFeedV2 from '../Components/AppSideBarFeedV2'
import AuthContext from '../Routes/hooks/AuthContext'
import { db } from '../Config/firebase'
import { doc, getDoc } from 'firebase/firestore'

function MyFeedRssPage() {

	const height = window.innerHeight

	const [listData, setListData] = useState([])
	const [barStatus, setBarStatus] = useState(false)
	const [titlePage, setTitlePage] = useState("")

	const contentWidth = "85%";

	let [searchParams, setSearchParams] = useSearchParams();

	const detailParams = searchParams.get("detail")
	const titleParams = searchParams.get("title")

	const { currentUser, loadingShow, loadingClose } = useContext(AuthContext)

	const getFeedFolder = async () => {
		loadingShow()
		setTitlePage(titleParams)
		try {
			const docRef = doc(db, "feed", currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const resData = docSnap?.data()?.folder_feed
				const resFilter = resData.find((x) => x.name === titleParams)
				const folderArr = resFilter.data_folder_feed

				const ArrData = [];

				await Promise.all(folderArr.map(async (data) => {
					const dataString = data;
					const dataArray = dataString.split('&');
					const dataObj = {};

					dataArray.forEach(data => {
						const [key, value] = data.split('=');
						dataObj[key] = value;
					});

					const { title, api } = dataObj;

					try {
						const res = await axios.get(api)
						if (res.status === 200) {
							ArrData.push(res?.data?.items)
						}
					} catch (error) {
						console.log(error, 'ini error ')
					}
				}));

				console.log(ArrData.flat(), 'xxxx')
				setListData(ArrData.flat())
				loadingClose()
			} else {
				console.log("No such document!");
				loadingClose()
			}
		} catch (error) {
			console.log(error, 'ini error')
			loadingClose()
		}
		loadingClose()
	}

	const getFeedDetail = async () => {
		loadingShow()
		try {
			const res = await axios.get(detailParams)
			if (res.status === 200) {
				setListData(res.data.items)
				setTitlePage(titleParams)
			}
			loadingClose()
		} catch (error) {
			console.log(error, 'ini error ')
			loadingClose()
		}
		loadingClose()
	}


	const getFeedParams = async () => {
		if (!detailParams) {
			getFeedFolder()
		}
		if (detailParams) {
			getFeedDetail()

		}

	}


	useEffect(() => {
		getFeedParams()

		return () => {
		}
	}, [titleParams])



	return (
		<Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
			<Stack zIndex={100}>
				<AppSideBarFeedV2 setBarStatus={setBarStatus} />
			</Stack>
			<Spacer
			/>
			<Stack
				Stack
				w={contentWidth}
				transition={"0.2s ease-in-out"}
				minH={height}
			>
				<Stack transition={"0.2s ease-in-out"} minH={height}  >
					<Stack p={10} spacing={5}>
						<HStack>
							<Text fontSize={'xl'} fontWeight='bold' color={'gray.600'}>Feeds</Text>
							<Text fontSize={'md'} color='gray.500'>( {titlePage} - {listData?.length} most recent )</Text>
						</HStack>
						<Stack >
							<SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={5}>
								{listData?.length > 0 && listData?.map((x, index) => {

									return (
										<Stack shadow={'md'} alignItems={'center'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} justifyContent='center' borderRadius='lg' key={index} bgColor={'white'} borderTopWidth={5} borderColor='green.400' p={5} spacing={5} >
											<HStack>
												<Text >{x.title}</Text>


											</HStack>
											<Divider borderStyle={'dotted'} />
											{x.image && (
												<Stack>
													<Image crossOrigin="anonymous" src={x?.image} alt={'img'} borderRadius='md' />
												</Stack>
											)}
											<Spacer />
											<Stack>
												<Text textAlign={'center'} fontSize='xs' color={'gray.600'} noOfLines={3}>{x.content_text}</Text>
											</Stack>

											<HStack>
												<Stack>
													{x?.authors?.length > 0 &&
														x?.authors?.map((y, index) => {
															return (
																<Text key={index} textAlign={'center'} fontSize='xs' color={'gray.400'}>{y.name}</Text>

															)
														})
													}
												</Stack>

												<Spacer />
												<Text textAlign={'center'} fontSize='xs' color={'gray.400'}>{moment(x.date_published).fromNow()}</Text>
											</HStack>

											<SimpleGrid columns={[1]} gap={2}>
												<Stack>
													<a href={x.url} target="_blank" rel="noopener noreferrer">
														<Button size={'sm'} colorScheme='green' >
															<Text fontSize={'xs'}>Go to website</Text>
														</Button>
													</a>
												</Stack>
											</SimpleGrid>

										</Stack>
									)
								})}
							</SimpleGrid>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Flex>

	)
}

export default MyFeedRssPage