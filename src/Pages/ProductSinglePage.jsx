/* eslint-disable no-unused-expressions */
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { AspectRatio, Badge, Box, Button, Center, Container, Divider, Flex, Heading, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Skeleton, SkeletonText, Spacer, Spinner, Stack, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { transactionImportir, viewSingleProduct } from '../Api/importirApi';
import AppCarosel from '../Components/AppCarosel';
import AppHeader from '../Components/AppHeader'
import ButtonQuantity from '../Components/Basic/ButtonQuantity';
import { db } from '../Config/firebase';
import AuthContext from '../Routes/hooks/AuthContext';
import { getCountry } from '../Utils/country';
import { formatFrice } from '../Utils/Helper';
import  {IoCaretBackOutline } from 'react-icons/io5'
import colors from '../Utils/colors';

function ProductSinglePage() {

	const { isOpen, onOpen, onClose } = useDisclosure()
	const navigate = useNavigate()


	const [shipBy] = useState('Sea')

	const [product, setProduct] = useState()
	const [showModal, setShowModal] = useState(false)
	const [images, setImages] = useState([])
	const [supplier, setSupplier] = useState('')
	const [variantType, setVariantType] = useState(null)
	const [priceType, setPriceType] = useState(null)
	const [variants, setVariant] = useState([])
	const [variantActive, setVariantActive] = useState(null)
	const [price, setPrice] = useState(0)
	const [priceRange, setPriceRange] = useState([])
	const [variantIndexActive, setIndexVariantActive] = useState(0)
	const [productPrice, setProductPrice] = useState(0)
	const [weight] = useState('0')
	const [volume] = useState('0')
	// const [handlingFee, setHandlingFee] = useState(0)

	const [hasOrder, setHasOrder] = useState([])
	const [totalOrder, setTotalOrder] = useState(0)

	const param = useParams()
	const toast = useToast()

	const { userStorage, userDb, loadingShow, loadingClose, getCart } = useContext(AuthContext)

	const height = window.innerHeight



	const getProduct = async () => {
		loadingShow()

		try {
			const res = await viewSingleProduct(param.id, param.type)
			const data = res.data
			console.log(data, 'xxx')
			const variants = initVariant(data.variants)
			setImages(data?.product_images?.map((x) => x.link))
			setProduct(data)
			// setAddProduct(data.variants[0])
			setSupplier(data.supplier ? data.supplier.name : '')
			setVariantType(data.variant_type)
			setVariant(variants)
			setPriceType(data.price_type)
			setPrice(data.prices)
			setPriceRange(data.price_ranges)
			if (variants.length) {
				setVariantActive(variants[0])
			}

			//   console.log(data, 'ini data')
			//   if (route.params.id && route.params.flag && data?.category.name && data.prices) {
			// 	logEvent('product_shop', route.params.id, data?.category.name, route.params.flag, data.prices)

			//   }
			//variant_type
			//no_variants
			//multiple_items
			loadingClose()
		} catch (error) {
			console.log(error.message)
			loadingClose()
		}
		loadingClose()
	}

	const initVariant = (variant) => {
		return variant.map((x) => {
			x.order = '0'
			x.variant_items = x.variant_items
				.filter((f) => f.stock > 0)
				.map((y) => {
					y.order = '0'
					return y
				})
			return x
		})
	}


	const onAddQuantity = (types, index) => {
		if (variantType === 'multiple_items') {
			const variantAct = variantActive
			const item = variantAct.variant_items[index]
			if (types) {
				if (item.stock === item.order) {
					item.order
				} else {
					item.order = parseInt(item.order) + 1
				}
			} else {
				if (item.order <= 0) {
					item.order = 0
				} else {
					item.order = parseInt(item.order) - 1
				}
			}
			setVariantActive({ ...variantAct })
			const vrt = variants
			vrt[variantIndexActive] = variantAct
			setVariant([...vrt])
			if (item.order > 0) {
				const o = hasOrder
				const findOrder = o.findIndex((x) => x.specId === item.specId)
				if (findOrder >= 0) {
					o[findOrder].order = parseInt(item.order)
				} else {
					o.push(item)
				}

				setHasOrder(o)
			}

			const tOrder = hasOrder
				.map((item) => parseInt(item.order))
				.reduce((prev, next) => prev + next, 0)
			setTotalOrder(tOrder)
			generateProductPrice(tOrder)
		} else if (variantType === 'no_variants') {
			let qty = totalOrder

			if (types) {
				qty = parseInt(qty) + 1
			} else {
				if (qty <= 0) {
					qty = 0
				} else {
					qty = parseInt(qty) - 1
				}
			}
			setTotalOrder(qty)
			generateProductPrice(qty)
		}
	}

	const generateProductPrice = (quantity) => {
		if (quantity <= 0) return setProductPrice(0)

		let totalPrice = 0
		if (priceType === 'RANGE') {
			let initPrice = product.price_ranges.find((x) => {
				return quantity >= x.begin
			})

			if (typeof initPrice === 'undefined') {
				initPrice = product.price_ranges[0]
			}
			setPrice(initPrice.price)
			totalPrice = initPrice.price * quantity
			setProductPrice(totalPrice)
		} else if (priceType === 'PRICE_BY_VARIANTS') {
			const sumPrice = hasOrder
				.map((x) => parseFloat(x.price) * parseInt(x.order))
				.reduce((prev, next) => prev + next, 0)
			setProductPrice(sumPrice)
		}
	}

	const onSetVariant = (index) => {
		setVariantActive({ ...variants[index] })
		setIndexVariantActive(index)
	}

	const renderVariant = () => {
		return variants.map((x, index) => {
			return (
				<Box
					px="1"
					py="1"
					overflow="hidden"
					mb="2"
					key={index}
					bg={variantIndexActive === index ? 'green.400' : 'gray.100'}
				>
					<Stack onClick={() => onSetVariant(index)}>
						<Image
							src={
								x?.image
							}
							alt="Alternate Text"
							size="sm"
						/>
					</Stack>
				</Box>
			)
		})
	}

	const renderVariantItem = () => {
		if (!variantActive) return
		const children = () => {
			if (variantActive.variant_items.length)
				return variantActive.variant_items.map((x, index) => (
					<HStack space={2} justifyContent="center" px="2" mb="5" key={x.skuId}>
						<Box w="45%" rounded="md" alignItems="center">
							<Text fontSize="xs" lineHeight="sm" letterSpacing="sm">
								{x.title}
							</Text>
							<Text fontSize="xs" color="gray.500">
								Stock {x.stock}
							</Text>
							<Text fontSize="xs" color="gray.800">
								Rp {formatFrice(x.price)}
							</Text>
						</Box>
						<Box w="53%">
							<ButtonQuantity
								quantity={x.order.toString()}
								pressButton={(arg) => onAddQuantity(arg, index)}
							/>
						</Box>
					</HStack>
				))
			return <></>
		}

		return (
			<>
				<Flex px="2" direction="row" alignItems="center">
					<Box px="1" py="2">
						<Image
							src={variantActive?.image}
							alt="image"
							size="md"
						/>
					</Box>
					<Box px="1" py="2">
						<Heading size="xs" py="1" color="yellow.600">
							{variantActive.name ? variantActive.name : '-'}
						</Heading>
					</Box>
				</Flex>
				<Divider bg="gray.200" thickness="1" my="1.5" />
				<Stack maxH={'270px'} overflowY='scroll'>
					<Stack>{children()}</Stack>
				</Stack>

			</>
		)
	}

	const renderMultipleVariant = () => {
		if (variantType === 'multiple_items')
			return (
				<Flex direction="row" height="85%" width="100%" flexWrap="wrap">
					<Box width="30%" bg="#e5e7eb" maxH="500px" overflowY={'scroll'}>
						{/* <ScrollView> */}
						<Flex direction="column" alignItems="center" py="2.5">
							{renderVariant()}
						</Flex>
						{/* </ScrollView> */}
					</Box>
					<Box width="70%"  >{renderVariantItem()}</Box>
				</Flex>
			)
	}

	const renderNoVariant = () => {
		if (variantType === 'no_variants')
			return (
				<Box
					bg="white"
					mb="5"
					px="3"
					py="4"
					width="90%"
					mx="auto"
					mt="5"
					borderColor="coolGray.200"
					borderWidth="1"
				>
					<HStack
						space={[2, 3]}
						justifyContent="space-between"
						justifyItems="center"
					>
						<Image
							src={
								'https://cbu01.alicdn.com/img/ibank/2020/842/973/13302379248_1699996722.120x120.jpg_140x10000Q75.jpg_.webp'
							}
							alt="Alternate Text"
							size="sm"
							borderRadius={5}
						/>
						<Spacer />
						<Box>
							<ButtonQuantity
								quantity={totalOrder.toString()}
								pressButton={(arg) => onAddQuantity(arg, null)}
							/>
						</Box>
					</HStack>
				</Box>
			)

		return <></>
	}


	const renderPriceRange = () => {
		if (priceType == 'RANGE')
			return (
				<HStack alignItems="center" safeAreaBottom shadow={6}>
					{priceRange.map((x, index) => {
						return (
							<Stack flex={1} py="2" key={index} alignItems='center' justifyContent={'center'}>
								<Box py="1">
									<Text color="gray.700" fontSize="12">
										{x.begin}
									</Text>
								</Box>
								<Divider bg="gray.200" thickness="1" my="1.5" />
								<Box py="1">
									<Text color="red.700" fontWeight="bold" fontSize="12">
										Rp {formatFrice(x.price)}
									</Text>
								</Box>
							</Stack>
						)
					})}
				</HStack>
			)
	}

	const onAddToCart = () => {
		const paramVariant = hasOrder
			.filter((x) => x.order > 0)
			.map((x) => {
				return {
					quantity: x.order,
					specId: x.specId,
					skuId: typeof x.skuId != 'undefined' ? x.skuId : null,
					name: x.title,
				}
			})

		const params = {
			variants: paramVariant,
			variant_type: variantType,
			price_type: priceType,
			quantity: totalOrder,
			freight: shipBy,
			product_id: product.product_id,
			weight: '10',
			cbm: '0.0001',
		}

		if (!volume)
			return toast({
				title: 'BELANJA.ID',
				description: 'Volume estimation is required',
				status: 'error',
			})

		if (!weight)
			return toast({
				title: 'BELANJA.ID',
				description: 'Weight estimation is required',
				status: 'error',
			})

		if (totalOrder < product.moq)
			return toast({
				title: 'BELANJA.ID',
				description: 'Total order is not same with minimum order',
				status: 'error',
			})

		if (shipBy === '')
			return toast({
				title: 'BELANJA.ID',
				description: 'Please set up shipping ',
				status: 'error',
			})



		return postCart(params)
	}

	const postCart = async (params) => {
		// console.log(params, 'ini params')

		// const items = [
		// 	{ item_id: JSON.stringify(params.product_id), item_name: product?.category?.name, price: Number(formatFrice(price)), quantity: params.quantity },
		// ]

		// if(items && productPrice){
		//   addToCartsAnalytics('IDR', items, productPrice)
		// }
		setShowModal(false)

		try {
			loadingShow()
			const res = await transactionImportir(params, userStorage?.token)
			if (res.status === 200) {


				loadingClose()
				toast({
					title: 'BELANJA.ID',
					description: 'Berhasil menambahkan ke keranjang product.',
					status: 'success'
				})
				getCart()
				navigate(`/cart`)
			}

		} catch (error) {
			loadingClose()
			return toast({
				title: 'BELANJA.ID',
				description: error.message,
				status: 'error',
			})
		}
	}



	useEffect(() => {
		getProduct()
		// getDataHandling()

		return () => {
			setProduct()
			setImages([])
			// setAddProduct()
			setSupplier()
		}
	}, [])


	return (
		<>
			<Stack flex='1' >
			<HStack position={'absolute'} cursor='pointer' zIndex='100' m={5} p={2} alignItems='center' shadow={'base'} justifyContent={'center'} borderRadius='full' bgColor={colors.theme} onClick={() => navigate(-1)}>
						<IoCaretBackOutline size={15} />
						<Text fontSize={'xs'} letterSpacing={0.5}>Kembali</Text>
					</HStack>
				<Stack>
					{images.length > 0 ? (
						<AppCarosel images={images && images} />
					) :
						(
							<Skeleton w={'full'} h={height / 1.5}></Skeleton>
						)
					}

					<Box width='full' px={1} flex='1' shadow={'md'}>
						<HStack shadow={'md'} space={2} alignItems='center' justifyContent={'space-between'} bgColor='white' m='1' p='1' borderRadius='md'>
							<Center>
								{product ? (
									<Heading fontSize='2xl' fontWeight='extrabold' color={'gray.800'}>
										{product?.price_ranges.length > 1 ?
											`Rp. ${formatFrice(product?.price_ranges[0].price)}`
											:
											`Rp. ${formatFrice(product?.prices)}`
										} /Pcs
									</Heading>
								) : (
									<Skeleton w={'300px'} h='50px' />
								)}
							</Center>

							{product?.variant_type === 'no_variants' ?
								<Button m='1' p='2' bgColor='green.400' color={'white'} onClick={() => console.log('no VARIANT')}>+ Keranjang</Button>
								:
								<Button m='1' p='2' bgColor='green.400' color={'white'} onClick={() => setShowModal(true)}>+ Keranjang</Button>
							}
						</HStack>
					</Box>

					<Box mt="0.5">
						<Box overflow="hidden" bg="white" width="100%">
							<Stack p="4" space={3}>
								<Stack space={2} >
									<Heading size="sm">
										{product ? product.title : ''}
									</Heading>
									<Text
										fontSize="xs"
										_light={{
											color: 'blue.500',
										}}
										_dark={{
											color: 'blue.400',
										}}
										fontWeight="500"
										ml="-0.5"
										mt="-1"
									>
										{supplier}
									</Text>
									<HStack space={2}>
										{product?.platform_type && (
											getCountry(product?.platform_type)
										)}
									</HStack>
								</Stack>
							</Stack>
						</Box>
					</Box>

					<Stack pt={2}>

						<Stack p={2} bgColor='white' space={2}>
							<Heading size={'md'}> Variants</Heading>
						</Stack>

					</Stack>

					<Box mt="2">
						<Box overflow="hidden" bg="white" width="100%">
							<Stack p="4" space={2}>
								<Stack space={2}>
									<Heading size="md" ml="-1" mb="1">
										Prices
									</Heading>
								</Stack>
								{renderPriceRange()}
								{priceType == 'FIX' ? (
									<Box>
										<Heading size="sm" color="red.700">
											Rp {formatFrice(price)}
										</Heading>
									</Box>
								) : (
									<></>
								)}


								{priceType == 'PRICE_BY_VARIANTS' ? (
									<Box>
										<Heading size="sm" color="red.700">
											Start from Rp {formatFrice(price)}
										</Heading>
									</Box>
								) : (
									<></>
								)}
							</Stack>
						</Box>
					</Box>

					<Box mt="2">
						<Box overflow="hidden" bg="white" width="100%">
							<Stack p="4" space={3}>
								<Stack space={2}>
									<Heading size="md" ml="-1" mb="1">
										Product Info
									</Heading>

									<Divider bg="gray.200" thickness="1" my="1.5" />
									<Flex direction="row">
										<Box width="50%">
											<Text>Minimum Order</Text>
										</Box>
										<Box width="50%">
											<Text color="gray.500" fontSize="12">
												{product ? product.moq : '-'}
											</Text>
										</Box>
									</Flex>
									<Divider bg="gray.200" thickness="1" my="1.5" />
									<Flex direction="row">
										<Box width="50%">
											<Text>Supplier Name</Text>
										</Box>
										<Box width="50%">
											<Text color="gray.500" fontSize="12">
												{supplier ? supplier : '-'}
											</Text>
										</Box>
									</Flex>

								</Stack>
							</Stack>
						</Box>
					</Box>




					<Box mt='2' bgColor='white'>
						<Heading m='2' p='1' size={'md'}>Description</Heading>
						<Stack alignItems={'center'} justifyContent='center' maxW={'100%'} overflow='hidden'>
							<div dangerouslySetInnerHTML={{ __html: product?.description }} />
						</Stack>
					</Box>

				</Stack>


			</Stack>


			<Modal isOpen={showModal} onClose={() => setShowModal(false)} >
				<ModalOverlay />
				<ModalContent >
					<ModalHeader>Variant</ModalHeader>
					<ModalCloseButton />
					<ModalBody >
						{renderMultipleVariant()}
						{renderNoVariant()}
					</ModalBody>

					<ModalFooter>
						<HStack bg="white" alignItems="center"  safeAreaBottom>
							<Stack py="1.5" space={1} mx="auto">
								<HStack py="0.5" justifyContent="space-between">
									<Text fontSize="sm" fontWeight="bold" color="gray.600">
										Quantity : {totalOrder}
									</Text>
									<Text fontSize="sm" fontWeight="bold" color="green.600">
										Price : {formatFrice(productPrice)}
									</Text>
								</HStack>
								<Button shadow={'md'} width="100%" onClick={() => onAddToCart()} bg="green.600">
									<HStack alignItems={'center'} justifyContent='center' space={2}>
										{/* <Ionicons name="ios-cart-outline" size={25} color="white" /> */}
										<Text color="gray.100" fontWeight='bold'>Add to cart</Text>
									</HStack>
								</Button>
							</Stack>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>




		</>
	)
}

export default ProductSinglePage