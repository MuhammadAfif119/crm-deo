import { Button, Divider, Heading, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { BsCircleFill } from 'react-icons/bs'
import { FaPlane, FaShip } from 'react-icons/fa'
import _axios from '../Api/AxiosBarrier'
import AuthContext from '../Routes/hooks/AuthContext'
import { getCountry } from '../Utils/country'
import { formatFrice } from '../Utils/Helper'

function OrderPage() {

    const [orderList, setOrderList] = useState([])
    const [loading] = useState(false)
    const [detailModal, setDetailModal] = useState(false)
    const [detailOrder, setDetailOrder] = useState('')
    const [detailPrice, setDetailPrice] = useState('')
    const [count, setCount] = useState(1)


    const height = window.innerHeight
    const width = window.innerWidth

    const { loadingShow, loadingClose } = useContext(AuthContext)

    const titleBill = [
        { label: 'Products' },
    ]

    const getData = async () => {
        loadingShow()
        let productArr = []
        try {
            const res = await _axios(`api/blj-order?page=${count}`)
            if (res) {
                const dataArr = res.data
                productArr.push(...dataArr)
            }
            console.log(count, 'count')
            if (count > 1) {
                setOrderList([...orderList, ...productArr])
            } else {
                setOrderList(productArr)
            }
            loadingClose()
        } catch (error) {
            console.log(error)
            loadingClose()
        }

    }

    const handlePagination = async () => {
        setCount(count + 1)
        getData(count)
    }

    useEffect(() => {
        getData()

        return () => {
            setOrderList([])
        }
    }, [])


    const handleModalDetail = async (id) => {
        setDetailOrder('')
        setDetailPrice('')
        setDetailModal(true)
        // loadingShow()
        if (id !== undefined) {
            try {
                const res = await _axios.get(`api/blj-order/${id}`)
                setDetailOrder(res)

                const dataArr = res && res
                const map = dataArr?.details?.reduce((prev, next) => {
                    if (next.tag in prev) {
                        prev[next.tag].amount += next.amount
                    } else {
                        prev[next.tag] = next
                    }
                    return prev
                }, {})


                const result = Object.keys(map).map(id => map[id])
                setDetailPrice(result)
                // loadingClose()
            } catch (error) {
                console.log(error)
                // loadingClose()
            }
            //   loadingClose()
        }
    }

    return (
        <Stack bgColor={'gray.200'} p={5}>
            {orderList.length > 0 ? (
                orderList.map((x, index) => (
                    <Stack spacing={1} key={index} bgColor={'white'} borderRadius='xl' m={2} p={5} shadow={'md'}  >
                        <Stack mx={3}>
                            <Text color={'gray.600'} fontSize='xs'>{moment(x.created_at).format('LLL')}</Text>
                        </Stack>
                        <HStack alignItems='center' justifyContent={'space-between'} m={3}>
                            <Stack maxW={'30%'} >
                                <Image
                                    src={
                                        x.product_image
                                    }
                                    alt={x.product_name}
                                    w="300px"
                                    borderRadius={'xl'}
                                />
                            </Stack>

                            <Stack spacing={2}  maxW={'50%'} >
                                <Text fontSize={'lg'} fontWeight='bold'>{x.order_number}</Text>
                                <Text color={'gray.600'} fontSize='sm' numberOfLines={2}>{x.product_name}</Text>
                                <HStack alignItems={'center'} spacing={2} >
                                    <Stack>
                                        <Text>
                                            {x?.platform_type && (
                                                getCountry(x?.platform_type)
                                            )}
                                        </Text>
                                    </Stack>

                                    <Stack>
                                        <Text>{x.freight === 'Sea' ? <FaShip size={20} color="black" /> : x.freight === 'Air' ? <FaPlane size={20} color="black" /> : ''}</Text>
                                    </Stack>
                                </HStack>
                            </Stack>


                            <Stack maxW={'30%'}>
                                <Button shadow={'md'} borderRadius={'lg'} bgColor={'green.400'} onClick={() => handleModalDetail(x.order_number)}>
                                    <HStack>

                                        <Text color={'white'} fontWeight='bold' fontSize={'md'}>Detail</Text>
                                    </HStack>
                                </Button>
                            </Stack>
                        </HStack>
                        <Divider />

                        <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                            <Text fontSize={'sm'} color='gray.600'>Product ID</Text>
                            <Spacer />
                            <Text fontSize={'sm'}>{x?.product_id}</Text>
                        </HStack>


                        <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                            <Text fontSize={'sm'} color='gray.600'>Status</Text>
                            <Spacer />
                            {x?.last_status === null ? (
                                <HStack spacing={1} alignItems='center' justifyContent={'center'}>
                                    <Text fontSize={'sm'}>Menunggu Pembayaran</Text>
                                    <BsCircleFill size={8} color="red" />
                                </HStack>
                            ) : (
                                <HStack spacing={1} alignItems='center' justifyContent={'center'}>
                                    <Text fontSize={'sm'} textTransform='capitalize'>{x.last_status}</Text>
                                    <BsCircleFill size={8} color="green" />
                                </HStack>
                            )}
                        </HStack>

                        <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                            <Text fontSize={'sm'} color='gray.600' >Quantity</Text>
                            <Spacer />
                            <Text fontSize={'sm'}>{x?.quantity}</Text>
                        </HStack>

                        <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                            <Text fontSize={'sm'} color='gray.600'>Price</Text>
                            <Spacer />
                            <Text fontSize={'sm'} fontWeight='bold'>Rp. {formatFrice(x?.amount)}</Text>
                        </HStack>

                    </Stack>
                ))
            ) : (
                <Stack h={height / 2} alignItems={'center'} justifyContent='center' >
                    <Text color={'gray.500'} fontWeight='bold'>Tidak ada data order</Text>
                </Stack>
            )
            }

            {detailPrice && (
                <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} >
                    <ModalOverlay />
                    <ModalContent bgColor={'gray.200'}>
                        <ModalHeader>
                            <HStack>
                                <Heading size={'md'}>Order detail - {detailOrder?.order_number}</Heading>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={10} >
                            <Stack spacing={2}>
                                <Stack>
                                    <Text fontSize={'md'} fontWeight='bold'>Product Order</Text>
                                    <Stack bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <HStack alignItems='center' justifyContent={'space-between'}>
                                            <Stack alignItems={'center'} justifyContent='center'>
                                                <Image
                                                    src={
                                                        detailOrder.product_image
                                                    }
                                                    alt={detailOrder.product_name}
                                                    w="200px"
                                                    borderRadius={'xl'}
                                                />
                                            </Stack>
                                            <Stack maxW={'60%'} spacing={1} >

                                                <Text numberOfLines={2} fontWeight={'bold'} fontSize={'sm'}>{(detailOrder.product_name)}</Text>
                                                {/* <Text color={'gray.700'}>Total : {idrDecimalHelper(x.amount)}</Text> */}
                                                <Text color={'gray.700'} fontSize={'sm'}>Quantity : {detailOrder.quantity}</Text>
                                            </Stack>

                                        </HStack>
                                    </Stack>
                                </Stack>

                                <Stack>
                                    <Text fontSize={'md'} fontWeight='bold'>Detail</Text>
                                    <Stack bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <HStack alignItems={'center'}>
                                            <Stack spacing={1}>
                                                {titleBill?.map((x, index) => (
                                                    <Text fontSize={'sm'} color={'gray.700'} key={index}>{x.label}</Text>
                                                ))}
                                            </Stack>
                                            <Spacer />
                                            <Stack spacing={1}>
                                                {detailPrice?.map((x, index) => (
                                                    <Text fontSize={'sm'} key={index} fontWeight='bold'>Rp. {formatFrice(x.amount)}</Text>
                                                ))}
                                            </Stack>
                                        </HStack>
                                    </Stack>
                                </Stack>

                                <Stack>
                                    <Text fontSize={'md'} fontWeight='bold'>Address</Text>
                                    <Stack bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <Text textTransform={'capitalize'} fontWeight={'bold'} fontSize='sm'>{detailOrder.address.receiver}</Text>
                                        <Text fontSize={'sm'} >{detailOrder.address.phone}</Text>
                                        <Text fontSize={'sm'}>{detailOrder.address.address}</Text>
                                        <HStack >
                                            <Text fontSize={'sm'}>{detailOrder.address.district}</Text>
                                            <Text fontSize={'sm'}>, {detailOrder.address.city}</Text>
                                            <Text fontSize={'sm'}>, {detailOrder.address.province}</Text>
                                        </HStack>
                                        <Text fontSize={'sm'}>{detailOrder.address.postal_code}</Text>
                                    </Stack>
                                </Stack>

                                <Stack>
                                    <Text fontSize={'md'} fontWeight='bold'>Items</Text>
                                    {detailOrder.items.map((x, index) => (
                                        <Stack key={index} bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>
                                            <HStack >
                                                <Text color={'gray.700'} fontSize={'sm'} >Product</Text>
                                                <Spacer />
                                                <Text numberOfLines={1} maxWidth='200px' fontSize={'sm'}>{x.name}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text color={'gray.700'} fontSize={'sm'}>Quantity</Text>
                                                <Spacer />
                                                <Text fontSize={'sm'} >{x.quantity}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize={'sm'} color={'gray.700'} >Price</Text>
                                                <Spacer />
                                                <Text fontSize={'sm'} fontWeight={'bold'} >Rp. {formatFrice(x.price_idr)}</Text>
                                            </HStack>

                                        </Stack>
                                    ))}
                                </Stack>

                            </Stack>
                        </ModalBody>

                    </ModalContent>
                </Modal>
            )}

        </Stack >
    )
}

export default OrderPage