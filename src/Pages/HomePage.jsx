import { Button, Heading, HStack, Image, SimpleGrid, Skeleton, Stack, Tag, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import AppCarosel from '../Components/AppCarosel'
import { AiFillStar } from 'react-icons/ai'
import { formatFrice } from '../Utils/Helper'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Routes/hooks/AuthContext'
import colors from '../Utils/colors'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { SlArrowRight } from 'react-icons/sl'
import { db } from '../Config/firebase'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'


function HomePage() {

	const [count, setCount] = useState(1)
	const [dashboardImage, setDashboardImage] = useState('')

	const { productData, getData } = useContext(AuthContext)


	const getDataDashboard = () => {
		try {
			const q = query(collection(db, "dashboard"), orderBy("createdAt", "desc"), limit(10));
			onSnapshot(q, (querySnapshot) => {
				const arrImage = [];
				querySnapshot.forEach((doc) => {
					const objData = doc.data()
					objData.id = doc.id
					arrImage.push(objData.image)
				});
				setDashboardImage(arrImage, 'arr')
			});
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getDataDashboard()

		return () => {
		}
	}, [])


	const height = window.innerHeight

	const navigate = useNavigate()




	const handlePagination = async () => {
		setCount(count + 1)
		await getData(count)
	}






	return (
		<Stack bgColor={'gray.100'} minH={height} >
			{dashboardImage ? (
				<AppCarosel images={dashboardImage} />
			) : (
				<Skeleton width={'100%'} h={height/2} />
			)}
			<Stack px={5}>
				<Heading fontSize={'lg'} textTransform='uppercase'>🛍️ Produk trending</Heading>
			</Stack>
			{productData.length > 0 ? (
				<HStack spacing={3} maxWidth={'100%'} p={5} overflowY={'scroll'}>{
					productData.map((x, index) => (
						<Stack shadow='md' key={index} borderRadius={'xl'} spacing={2} bgColor='white'  >
							<Stack alignItems={'center'} w='200px' >
								<Image src={x?.belanja_video_with_product_detail[0]?.product_detail?.image} alt='img' borderRadius={'md'} />
							</Stack>
							<Stack px={3}>
								<Text textTransform={'capitalize'} fontWeight='bold' fontSize={'xs'} noOfLines={2}> {x?.belanja_video_with_product_detail[0]?.product_detail?.title_en}</Text>
							</Stack>


							<SimpleGrid columns={[1, 2, 2]} alignItems={'flex-end'} px={4} spacing={0}>
								<Stack spacing={0}>
									<Text textTransform={'capitalize'} fontWeight='extrabold' color={'gray.600'} fontSize={'xs'}>harga</Text>
									<Text textTransform={'capitalize'} fontWeight='extrabold' color={'gray.00'} fontSize={'sm'}>Rp. {formatFrice(x?.belanja_video_with_product_detail[0]?.product_detail?.price_idr_markup)}</Text>
								</Stack>

								<Stack alignItems={'flex-end'} justifyContent='center'>
									<HStack>
										<Stack>
											<Tag size={'md'} fontSize='xs'>CN 🇨🇳</Tag>
										</Stack>
										{/* <Stack onClick={() => handleWishlist(x)}>
											<HiOutlineHeart
												style={{ fontSize: 20, color: 'red', }} />
										</Stack> */}

									</HStack>
									<HStack spacing={0}>
										<AiFillStar name='star' size={15} color='orange' />
										<AiFillStar name='star' size={15} color='orange' />
										<AiFillStar name='star' size={15} color='orange' />
										<AiFillStar name='star' size={15} color='orange' />
										<AiFillStar name='star' size={15} color='orange' />
									</HStack>
								</Stack>


							</SimpleGrid>

							<Stack p={3} >
								<Button size={'sm'} bgColor='green.400' onClick={() => navigate(`/product/${x?.belanja_video_with_product_detail[0]?.product_detail.flag}/${x?.belanja_video_with_product_detail[0]?.product_id}`)}>
									<Text color={'white'}>🛒 Order now</Text>
								</Button>
							</Stack>
						</Stack>
					))}
					<Button onClick={() => handlePagination()} h={'100%'} bgColor={'white'} alignItems='center' justifyContent={'center'} py={3}>
						<SlArrowRight fontSize={'30px'} />
					</Button>
				</HStack>
			) : (
				<HStack spacing={3} maxWidth={'100%'} p={5} overflowY={'scroll'}>
					<Skeleton height='300px' w={'500px'} />
					<Skeleton height='300px' w={'500px'} />
					<Skeleton height='300px' w={'500px'} />
				</HStack>
			)}
			<Stack>

			</Stack>

			<Stack px={5}>
				<Heading fontSize={'lg'} textTransform='uppercase'>🔴 Live produk dari luar negeri</Heading>
			</Stack>

			<Stack p={5} alignItems='center' justifyContent={'center'}>
				<Heading px={5} textAlign='center' fontSize={'6xl'} color='gray.500' >⚠️</Heading>
				<Heading px={5} textAlign='center' fontSize={'sm'} color='gray.500' >Kamu dapat mengakses live #dibelanjain langsung dari luar negeri dengan mengdownload aplikasi Belanja di android dan ios. </Heading>
			</Stack>
			<Stack p={5} bgColor='white' shadow={'lg'}>
				<Stack p={5} spacing={5}>
					<Heading textTransform={'uppercase'} fontSize='md' textAlign={'center'}>DOWNLOAD SEKARANG GRATIS!</Heading>
					<Heading fontSize='xs' textAlign={'center'} color={'gray.500'}>Dan nikmati berbagai fitur unggulan dari
						Belanja dengan lebih mudah dan murah bersama BELANJA.CO.ID</Heading>
				</Stack>
				<HStack alignItems={'center'} justifyContent='center'>
					<Stack>
						<a href={`https://play.google.com/store/apps/details?id=com.belanja.mobile`} target="_blank" rel="noopener noreferrer">
							<Image src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png?hl=id" w={'200px'} />
						</a>
					</Stack>
					<Stack>
						<a href={`https://apps.apple.com/us/app/belanja/id6444754803`} target="_blank" rel="noopener noreferrer">
							<Image w={'200px'} src="data:image/png;base64,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" />
						</a>
					</Stack>
				</HStack>
			</Stack>

			<Stack bgColor={colors.theme} p={10} spacing={5}>

				<HStack alignItems={'center'} justifyContent='center' spacing={10}>
					<a href={`https://www.instagram.com/belanja.coid/`} target="_blank" rel="noopener noreferrer">
						<Stack bgColor={'white'} borderRadius='full' p={3} shadow={'base'}>
							<FaInstagram size={30} color={colors.theme} />
						</Stack>
					</a>

					<a href={`https://www.tiktok.com/@belanja.co`} target="_blank" rel="noopener noreferrer">
						<Stack bgColor={'white'} borderRadius='full' p={3} shadow={'base'}>
							<FaTiktok size={30} color={colors.theme} />
						</Stack>
					</a>

					<a href={`https://api.whatsapp.com/send?phone=6281774941698&text=Halo, admin Belanja :)`} target="_blank" rel="noopener noreferrer">
						<Stack bgColor={'white'} borderRadius='full' p={3} shadow={'base'}>
							<FaWhatsapp size={30} color={colors.theme} />
						</Stack>
					</a >
				</HStack>

				<Stack>
					<Heading fontSize={'md'} color='white' textAlign='center' textTransform={'uppercase'}>Belanja.co.id</Heading>
					<Text fontSize={'sm'} color='white' textAlign='center'>Jl. Puri Utama No.7, RT.004/RW.008, Petir, Kec. Cipondoh, Kota Tangerang, Banten 15147</Text>
				</Stack>

				<Stack>
					<Text fontSize={'sm'} color='white' textAlign='center'>Copyright © 2022 Belanja.co.id All Rights Reserved
					</Text>
				</Stack>
			</Stack>

		</Stack>
	)
}

export default HomePage