// import { Box, Button, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Skeleton, Spacer, Spinner, Stack, Tag, Text, useToast, } from '@chakra-ui/react'
// import React, { useContext, useEffect, useState } from 'react'
// import { MdSearch } from 'react-icons/md';
// import { BiFilterAlt } from 'react-icons/bi';
// import { HiOutlineHeart } from 'react-icons/hi';
// import { Link, useNavigate } from 'react-router-dom';
// import colors from '../Utils/colors';
// import { AiFillStar } from 'react-icons/ai';
// import { get } from '../Api/importirApi';
// import { formatFrice } from '../Utils/Helper'
// import { db } from '../Config/firebase';
// import { arrayUnion, doc, setDoc } from 'firebase/firestore';
// import { SlArrowDown } from 'react-icons/sl'

// function ProductPage() {
// 	const [category, setCategory] = useState('')
// 	const [count, setCount] = useState(1)
// 	const [imageView, setImageView] = useState('')
// 	const [detailModal, setDetailModal] = useState(false)

// 	const navigate = useNavigate()
// 	const toast = useToast()

// 	const height = window.innerHeight

// 	const { currentUser, loadingShow, loadingClose, activeCategory, productList, getDataProduct, handleKeyDown, getProductList } = useContext(AuthContext)

// 	const getCategory = async () => {
// 		try {
// 			const result = await get('category-list')
// 			if (result) {
// 				setCategory(result?.data)
// 				console.log(result.data, 'category')
// 			}
// 		} catch (error) {
// 			console.log(error, 'error')
// 		}
// 	}

// 	const handleWishlist = async (item) => {
// 		let firebaseData = {}
// 		firebaseData = { ...item }

// 		loadingShow()

// 		try {

// 			const ref = doc(db, "wishlist", currentUser.uid);
// 			await setDoc(ref, {
// 				uid: currentUser.uid,
// 				data: arrayUnion(firebaseData),
// 				createdAt: new Date()
// 			}, { merge: true });

// 			firebaseData = {}
// 			loadingClose()

// 			toast({
// 				title: 'BELANJA.ID',
// 				description: 'Berhasil menambahkan product ke wishlist.',
// 				status: 'success'
// 			})
// 		} catch (error) {
// 			loadingClose()
// 			toast({
// 				title: 'BELANJA.ID',
// 				description: error.message,
// 				status: 'error'
// 			})
// 		}
// 	}

// 	useEffect(() => {
// 		getCategory()

// 		return () => {
// 			setImageView('')
// 		}
// 	}, [])

// 	const handlePagination = async () => {
// 		setCount(count + 1)
// 		await getDataProduct(count)
// 	}

// 	const handleImage = (data) => {
// 		setImageView(data)
// 		setDetailModal(true)
// 	}

// 	return (
// 		<Stack bgColor={'gray.100'} minH={height}>
// 			<HStack bgColor={colors.theme} alignItems={'center'} justifyContent='center' p={2} spacing={2} shadow={'md'}>
// 				<Stack>
// 					<MdSearch size={25} />
// 				</Stack>
// 				<Input
// 					borderRadius={'lg'}
// 					w={'50%'}
// 					placeholder="Cari barang kamu disini .."
// 					fontSize={'sm'}
// 					size='xs'
// 					shadow={'md'}
// 					bgColor={'white'}
// 					color={colors.black}
// 					// onChange={() => setSearch(e.target.value)}
// 					onKeyDown={handleKeyDown}
// 				/>
// 			</HStack>

// 			<Stack bgColor={'gray.100'} px={2}>
// 				<SimpleGrid columns={[1, null, category?.length]} alignItems={'center'} gap={2} justifyContent='center' maxW={'100%'} overflowX='scroll' my={3}>
// 					{/* <HStack   alignItems={'center'} gap={2} justifyContent='center'  spacing={5}  m={3} > */}
// 					{category?.length > 0 && category.map((x, index) =>
// 						<Stack key={index} onClick={() => getProductList(x.id, x.name)} cursor='pointer' alignItems={'center'} justifyContent='center'>
// 							<Text color={x.name === activeCategory ? 'blue.400' : 'gray.600'} fontSize={'sm'}>{x.name}</Text>
// 						</Stack>
// 					)}
// 					{/* </HStack> */}
// 				</SimpleGrid>
// 				{productList?.length > 0 ? (
// 					<>
// 						<SimpleGrid columns={2} gap={5} mx={5}>
// 							{
// 								productList.map((x, i) =>
// 									<Stack shadow='md' key={i} borderRadius={'xl'} spacing={2} bgColor='white' >
// 										<Stack alignItems={'center'} cursor='pointer' onClick={() => handleImage(x)}>
// 											{x.image ? (
// 												<Image src={x.image} alt='img' borderRadius={'md'} />
// 											) : (
// 												<Skeleton w={'200px'} h='300px' borderRadius={'md'} />
// 											)}

// 										</Stack>
// 										<Stack px={3}>
// 											<Text textTransform={'capitalize'} fontWeight='bold' fontSize={'sm'} noOfLines={2}> {x.title_en}</Text>
// 										</Stack>

// 										<SimpleGrid columns={[1, 2, 2]} alignItems={'flex-end'} px={4} spacing={0}>
// 											<Stack spacing={0}>
// 												<Text textTransform={'capitalize'} fontWeight='extrabold' color={'gray.600'} fontSize={'sm'}>harga</Text>
// 												<Text textTransform={'capitalize'} fontWeight='extrabold' color={'black'} fontSize={'md'}>Rp. {formatFrice(x.price_idr_markup)}</Text>
// 											</Stack>

// 											<Stack alignItems={'flex-end'} justifyContent='center'>
// 												<HStack>
// 													<Stack>
// 														<Tag>CN 🇨🇳</Tag>
// 													</Stack>
// 													<Stack onClick={() => handleWishlist(x)}>
// 														<HiOutlineHeart
// 															style={{ fontSize: 20, color: 'red', }} />
// 													</Stack>

// 												</HStack>
// 												<HStack spacing={0}>
// 													<AiFillStar name='star' color='orange' />
// 													<AiFillStar name='star' color='orange' />
// 													<AiFillStar name='star' color='orange' />
// 													<AiFillStar name='star' color='orange' />
// 													<AiFillStar name='star' color='orange' />
// 												</HStack>
// 											</Stack>

// 										</SimpleGrid>

// 										<Stack p={3} >
// 											<Button size={'sm'} bgColor='green.400' onClick={() => navigate(`${x.flag}/${x.product_id}`)}>
// 												<Text color={'white'}>🛒 Order now</Text>
// 											</Button>
// 										</Stack>
// 									</Stack>

// 								)
// 							}

// 						</SimpleGrid>
// 						<Button onClick={() => handlePagination()} >
// 							<SlArrowDown />
// 						</Button>
// 					</>
// 				) : (
// 					<Stack alignItems={'center'} justifyContent='center'>
// 						<Text textAlign={'center'} fontSize='sm' letterSpacing={0.5} color='gray.500' >Sedang mencari Produk ...</Text>
// 						<SimpleGrid columns={[1, null, 2]} gap={5} mx={5}>
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 							<Skeleton width={'280px'} h='400px' borderRadius={'xl'} />
// 						</SimpleGrid>
// 					</Stack>
// 				)}

// 			</Stack>

// 			{imageView !== "" && (
// 				<Modal isOpen={detailModal} onClose={() => setDetailModal(false)} >
// 					<ModalOverlay />
// 					<ModalContent bgColor={'white'} >
// 						<ModalHeader>
// 							<HStack spacing={2} alignItems='center' >
// 								{/* <FontAwesome5 name="file-invoice" size={22} color="black" /> */}
// 								<Text fontSize={'lg'} fontWeight='bold'>Detail</Text>
// 							</HStack>
// 						</ModalHeader>

// 						<ModalCloseButton />
// 						<ModalBody >
// 							<Stack  borderRadius={'xl'} spacing={3} bgColor='white' >
// 								<Stack alignItems={'center'} justifyContent='center'>
// 									<Image w='100%' src={imageView.image} borderRadius='lg' alt='belanja.co.id' />
// 								</Stack>
// 								<Stack px={3}>
// 									<Text textTransform={'capitalize'} fontWeight='bold' fontSize={'sm'}> {imageView.title_en}</Text>
// 								</Stack>

// 								<SimpleGrid columns={[1, 2, 2]} alignItems={'flex-end'} px={4} spacing={0}>
// 									<Stack spacing={0}>
// 										<Text textTransform={'capitalize'} fontWeight='extrabold' color={'gray.600'} fontSize={'sm'}>harga</Text>
// 										<Text textTransform={'capitalize'} fontWeight='extrabold' color={'black'} fontSize={'lg'}>Rp. {formatFrice(imageView.price_idr_markup)}</Text>
// 									</Stack>

// 									<Stack alignItems={'flex-end'} justifyContent='center'>
// 										<HStack>
// 											<Stack>
// 												<Tag>CN 🇨🇳</Tag>
// 											</Stack>
// 											<Stack onClick={() => handleWishlist(imageView)}>
// 												<HiOutlineHeart
// 													style={{ fontSize: 20, color: 'red', }} />
// 											</Stack>

// 										</HStack>
// 										<HStack spacing={0}>
// 											<AiFillStar name='star' color='orange' />
// 											<AiFillStar name='star' color='orange' />
// 											<AiFillStar name='star' color='orange' />
// 											<AiFillStar name='star' color='orange' />
// 											<AiFillStar name='star' color='orange' />
// 										</HStack>
// 									</Stack>

// 								</SimpleGrid>

// 							</Stack>
// 						</ModalBody>

// 						<ModalFooter>
// 							<HStack spacing={5}>
// 							<Button bgColor='green.400' onClick={() => navigate(`${imageView.flag}/${imageView.product_id}`)}>
// 								<Text color={'white'}>🛒 Order now</Text>
// 							</Button>
// 							<Button colorScheme='red' mr={3} onClick={() => setDetailModal(false)}>
// 								Close
// 							</Button>
// 							</HStack>
// 						</ModalFooter>

// 					</ModalContent>
// 				</Modal>
// 			)}
// 		</Stack>
// 	)
// }

// export default ProductPage
