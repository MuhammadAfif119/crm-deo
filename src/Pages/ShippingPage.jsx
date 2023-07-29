import { Button, Divider, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Spacer, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'
import { BsCircleFill } from 'react-icons/bs'
import { IoCaretBackOutline, IoHelpCircleOutline } from 'react-icons/io5'
import { SlArrowDown } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'
import _axios from '../Api/AxiosBarrier'
import colors from '../Utils/colors'
import { formatFrice } from '../Utils/Helper'

function ShippingPage() {

    const titleBill = [
        { label: 'Products' },
    ]

    const width = window.innerWidth
    const height = window.innerHeight



    const [shippingData, setShippingData] = useState([])
    const [loading, setLoading] = useState(false)
    const [invoiceDetail, setInvoiceDetail] = useState({})
    const [bankAccount, setBankAccount] = useState('')
    const [detailModal, setDetailModal] = useState(false)
    const [virtualAccount, setVirtualAccount] = useState('')
    const [expired, setExpired] = useState('')
    const [count, setCount] = useState(1)

    const navigate = useNavigate()
    const toast = useToast()


    const getData = async () => {
        let productArr = []
        try {
            const res = await _axios.get(`api/blj-shipping?page=${count}`)
            if (res) {
                const dataArr = res.data.shp_belanja.data
                productArr.push(...dataArr)
            }
            if (count > 1) {
                setShippingData([...shippingData, ...productArr])
            } else {
                setShippingData(productArr)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalDetail = async (id) => {

        setInvoiceDetail({})
        // setDetailPrice('')
        setDetailModal(true)
        if (id !== undefined) {
            try {
                const res = await _axios.get(`api/blj-shipping/${id}/detail`)
                setInvoiceDetail({ ...res.data })
                // console.log({ ...res.data }, 'yes')
                // const map = res.data.details.map(res => res.amount)
                //     .reduce((prev, next) => {
                //         return Number(prev) + Number(next);
                //     }, 0)
                // setDetailPrice(map)
                // loadingClose()
            } catch (error) {
                console.log(error)
                // loadingClose()
            }
        }
    }

    const handleVa = async (id, bank) => {
        setLoading(true)
        try {
            const res = await _axios.get(`api/blj-shipping/bill/generate-va/${id}/${bank}`)
            console.log(res, 'ress')
            if (res.status === true) {
                setVirtualAccount(res.data.account_number)
                setExpired(res.data.expiration_date)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    const handlePagination = async () => {
        setCount(count + 1)
        getData(count)
    }

    useEffect(() => {
        getData()

        return () => {

        }
    }, [])

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id)
        toast({
            title: 'Belanja.co.id',
            description: 'Copy to clipboard.',
            status: 'success'
        })
    }


    return (
        <Stack bgColor={'gray.200'} p={5}>
            <HStack w='100px' cursor='pointer' zIndex='100' mx={5} p={2} alignItems='center' shadow={'base'} justifyContent={'center'} borderRadius='full' bgColor={colors.theme} onClick={() => navigate(-1)}>
                <IoCaretBackOutline size={15} />
                <Text fontSize={'xs'} letterSpacing={0.5}>Kembali</Text>
            </HStack>

            {shippingData.length > 0 ? (
                <>
                    <Stack>
                        {shippingData.map((x, index) => (
                            <Stack spacing={1} bgColor={'white'} key={index} borderRadius='xl' m={2} p={5} shadow={'md'}  >
                                <Stack mx={3}>
                                    <Text color={'gray.600'} fontSize='sm' >{moment(x.created_at).format('LLL')}</Text>
                                </Stack>

                                <HStack alignItems='center' justifyContent={'space-between'} m={3}>
                                    <Stack >

                                        <Image
                                            src={x.image}
                                            alt={x.image}
                                            size='lg'
                                            borderRadius={'xl'}
                                            w='200px'
                                            h='200px'
                                        />

                                    </Stack>

                                    <Stack spacing={1}  >
                                        <Text fontSize={'lg'} fontWeight='bold'>{x.order_number}</Text>
                                        <Text color={'gray.600'} fontSize='sm' numberOfLines={2}>{x.name}</Text>
                                        <HStack alignItems={'center'} spacing={2} >
                                            <Stack>
                                                <Text textTransform={'capitalize'}>
                                                    from : {x.from}
                                                </Text>
                                            </Stack>

                                        </HStack>
                                    </Stack>


                                    <Stack >
                                        <Button shadow={'md'} borderRadius={'lg'} bgColor={'green.400'} onClick={() => handleModalDetail(x?.order_number)}>
                                            <HStack>

                                                <Text color={'white'} fontWeight='bold' fontSize={'md'}>Detail</Text>
                                            </HStack>
                                        </Button>
                                    </Stack>
                                </HStack>
                                <Divider />

                                <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                                    <Text fontSize={'sm'} color='gray.600' >Status</Text>
                                    <Spacer />
                                    <HStack spacing={1} alignItems='center' justifyContent={'center'}>
                                        <Text fontSize={'sm'} textTransform='capitalize'>{x?.last_status}</Text>
                                        <BsCircleFill size={7} color="green" />
                                    </HStack>
                                </HStack>

                                <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                                    <Text fontSize={'sm'} color='gray.600' >Quantity</Text>
                                    <Spacer />
                                    <Text fontSize={'sm'}>{x?.quantity}</Text>
                                </HStack>

                                <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                                    <Text fontSize={'sm'} color='gray.600'>Price / pcs</Text>
                                    <Spacer />
                                    <Text fontSize={'sm'} fontWeight='bold'>Rp. {formatFrice(x?.price_per_pcs)}</Text>
                                </HStack>

                                <HStack mx={3} alignItems='center' justifyContent={'space-evenly'}>
                                    <Text fontSize={'sm'} color='gray.600'>Total</Text>
                                    <Spacer />
                                    <Text fontSize={'sm'} fontWeight='bold' color={'green.600'}>Rp. {formatFrice(x?.price_per_pcs * x?.quantity)}</Text>
                                </HStack>

                            </Stack>
                        ))}
                    </Stack>
                    <Button onClick={() => handlePagination()} >
                        <SlArrowDown />
                    </Button>
                </>
            ) : (
                <Stack h={height} alignItems={'center'} justifyContent='center' >
                    <Text color={'gray.500'} fontWeight='bold'>Tidak ada data shipping</Text>
                </Stack>
            )}

            {invoiceDetail.bills !== undefined && (
                <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} >
                    <ModalOverlay />
                    <ModalContent bgColor={'gray.200'} pb={10} >
                        <ModalHeader>
                            <HStack spacing={2} alignItems='center' >
                                {/* <FontAwesome5 name="file-invoice" size={22} color="black" /> */}
                                <Text fontSize={'lg'} fontWeight='bold'>Invoice {invoiceDetail?.bills[0].invoice_number} - {invoiceDetail?.bills[0].title}</Text>
                            </HStack>
                        </ModalHeader>

                        <ModalCloseButton />
                        <ModalBody >
                            <Stack spacing={2}>

                                <Stack spacing={1} borderRadius='xl' m={1} >
                                    <Text fontSize={'md'} fontWeight='bold'>Address</Text>
                                    <Stack bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <Text textTransform={'capitalize'} fontWeight={'bold'} fontSize='sm'>{invoiceDetail?.address.receiver}</Text>
                                        <Text fontSize='sm'>{invoiceDetail?.address.phone}</Text>
                                        <Text fontSize='sm'>{invoiceDetail?.address.address}</Text>
                                        <HStack >
                                            <Text fontSize='sm'>{invoiceDetail?.address.district}</Text>
                                            <Text fontSize='sm'>, {invoiceDetail?.address.city}</Text>
                                            <Text fontSize='sm'>, {invoiceDetail?.address.province}</Text>
                                        </HStack>
                                        <Text fontSize='sm'>{invoiceDetail?.address.postal_code}</Text>
                                    </Stack>
                                </Stack>

                                <Stack>
                                    <Text fontSize={'md'} fontWeight='bold'>Detail</Text>
                                    <Stack bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <HStack alignItems={'center'}>
                                            <Stack spacing={1}>
                                                {titleBill?.map((x, index) => (
                                                    <Text color={'gray.700'} key={index} fontSize='sm'>{x.label}</Text>
                                                ))}
                                            </Stack>
                                            <Spacer />
                                            <Stack spacing={1}>
                                                <Text fontWeight='bold' fontSize='sm'>Rp. {formatFrice(invoiceDetail?.bills[0].amount_total)}</Text>
                                            </Stack>
                                        </HStack>
                                    </Stack>
                                </Stack>


                                <Stack >
                                    <HStack alignItems={'center'} spacing={2}>
                                        <Text fontSize={'md'} fontWeight='bold'>Payment Method</Text>
                                        <Stack onClick={() => navigate('/information')}>
                                            <IoHelpCircleOutline size={20} color="black" />
                                        </Stack>
                                    </HStack>
                                    <Stack bgColor={'white'} spacing={5} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <HStack alignItems={'center'} w='full' justifyContent={'center'}>
                                            <Stack w={'40%'} >
                                                <Text color={'green.600'} fontWeight='bold' fontSize={'sm'}>Rp. {formatFrice(invoiceDetail.bills[0].amount_total)}</Text>
                                            </Stack>
                                            <Stack>
                                                <Select fontSize='md' w='210px' bgColor={'white'} placeholder="Bank" onChange={(e) => setBankAccount(e.target.value)}>
                                                    <option value="BCA">BCA</option>
                                                    <option value="MANDIRI">MANDIRI</option>
                                                    <option value="BNI">BNI</option>
                                                    <option value="BRI">BRI</option>
                                                </Select>

                                            </Stack>

                                        </HStack>

                                        <Stack size={'md'} alignItems='center' justifyContent={'center'} >
                                            {invoiceDetail.bills[0].paid_at === null && (
                                                loading ? (
                                                    <Spinner color={'green'} />
                                                ) : (
                                                    <Button bgColor={'green.500'} onClick={() => handleVa(invoiceDetail.bills[0].invoice_number, bankAccount)} >
                                                        <Text color={'white'} fontWeight='bold' fontSize='sm'>Generate Virtual Account</Text>
                                                    </Button>
                                                )
                                            )}
                                        </Stack>

                                        <Stack size={'md'} alignItems='center' justifyContent={'center'} >
                                            {virtualAccount !== '' && (
                                                <Stack spacing={1} mb={3}>
                                                    <Text fontWeight={'bold'} fontSize={'sm'}>Bank</Text>
                                                    <Text fontSize={'md'} >{bankAccount}</Text>

                                                    <Text fontWeight={'bold'} fontSize={'sm'}>VA Number</Text>
                                                    <HStack spacing={2}>
                                                        <Text fontSize={'sm'} >{virtualAccount}</Text>

                                                        <Stack cursor={'pointer'} onClick={() => handleCopy(virtualAccount)}>

                                                            <Text fontSize={'md'} ><AiOutlineCopy size={20} color="black" /></Text>
                                                        </Stack>
                                                    </HStack>

                                                    <Text fontWeight={'bold'} fontSize={'sm'}>Expired At</Text>
                                                    <Text fontSize={'sm'} >{new Date(expired).toLocaleString()}</Text>

                                                </Stack>

                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ModalBody>

                    </ModalContent>
                </Modal>
            )}
        </Stack>
    )
}

export default ShippingPage