import { Button, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { doc, setDoc } from 'firebase/firestore'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'
import { BsCircleFill } from 'react-icons/bs'
import { IoCaretBackOutline, IoHelpCircleOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import _axios from '../Api/AxiosBarrier'
import AppCarosel from '../Components/AppCarosel'
import { db } from '../Config/firebase'
import AuthContext from '../Routes/hooks/AuthContext'
import colors from '../Utils/colors'
import { formatFrice } from '../Utils/Helper'

function InvoiceListPage() {
    const [invoiceList, setInvoiceList] = useState('')
    const [invoiceDetail, setInvoiceDetail] = useState({})
    const [detailPrice, setDetailPrice] = useState('')
    const [bankAccount, setBankAccount] = useState('')
    const [detailModal, setDetailModal] = useState(false)
    const [virtualAccount, setVirtualAccount] = useState('')
    const [expired, setExpired] = useState('')
    const [loading, setLoading] = useState(false)

    const width = window.innerWidth
    const height = window.innerHeight

    const toast = useToast()

    const { currentUser, loadingShow, loadingClose } = useContext(AuthContext)

    const navigate = useNavigate()

    const titleBill = [
        { label: 'Products' },
    ]


    const getData = async () => {
        loadingShow()
        try {
            const res = await _axios.get('api/blj-invoices')
            setInvoiceList(res)
            // const dataArr = res.data.map((x) => x.details.map((z) => z?.order?.product_image))
            // setImagesView(dataArr)

            const ref = doc(db, "invoices", currentUser.uid);
            await setDoc(ref, {
                data: res.data,
                lastUpdated: new Date(),
            }, { merge: true });



              loadingClose()
        } catch (error) {
            console.log(error)
              loadingClose()
        }
    }

    useEffect(() => {
        getData()

        return () => {
            setInvoiceList('')
            setInvoiceDetail('')
            setDetailPrice('')
            setVirtualAccount('')
        }
    }, [])

    const handleModalDetail = async (id) => {

        setInvoiceDetail({})
        setDetailPrice('')
        // setVirtualAccount('')
        setDetailModal(true)
        loadingShow()
        if (id !== undefined) {
            try {
                const res = await _axios.get(`api/blj-invoices/${id}`)
                setInvoiceDetail({ ...res })
                const map = res.details.map(res => res.amount)
                    .reduce((prev, next) => {
                        return Number(prev) + Number(next)
                    }, 0)
                setDetailPrice(map)
                loadingClose()
            } catch (error) {
                console.log(error)
                loadingClose()
            }
        }
    }


    const handleVa = async (id, bank) => {
        setLoading(true)
        try {
            const res = await _axios.get(`api/blj-invoices/generate-va/${id}/${bank}`)
            console.log(res, 'ress')
            console.log(id, 'id')
            console.log(bank, 'bank')
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
            <HStack cursor='pointer' zIndex='100' w='100px' mx={5} mb={2} p={2} alignItems='center' shadow={'base'} justifyContent={'center'} borderRadius='full' bgColor={colors.theme} onClick={() => navigate(-1)}>
                <IoCaretBackOutline size={15} />
                <Text fontSize={'xs'} letterSpacing={0.5}>Kembali</Text>
            </HStack>
            {invoiceList?.data?.length > 0 ? (
                invoiceList?.data?.map((x, index) => {
                    const imageCarousel = x.details.map((z) => z?.order?.product_image)
                    return (
                        <Stack bgColor={'white'} spacing={1} key={index} borderRadius='xl' m={2} p={2} shadow={3}  >
                            <Stack>
                                <HStack alignItems='center' justifyContent={'space-between'} m={3}>
                                    <Stack spacing={1} >
                                        <Text fontSize='sm' color={'gray.600'}>{moment(x.created_at).format('LLL')}</Text>
                                        <Text fontSize={'xl'} fontWeight='bold'>{x.invoice_number}</Text>
                                        <Text fontWeight={'extrabold'} fontSize='lg'>Rp. {formatFrice(x.amount_total)} </Text>
                                    </Stack>


                                    <Stack>


                                        <Button shadow={'md'} borderRadius={'lg'} bgColor={'green.400'} onClick={() => handleModalDetail(x.invoice_number)}>
                                            <HStack>

                                                <Text color={'white'} fontWeight='bold' fontSize={'md'} shadow={3}>Detail</Text>
                                            </HStack>
                                        </Button>
                                    </Stack>
                                </HStack>
                                <Stack w={'100%'} justifyContent={'center'} >
                                    {imageCarousel && (
                                        <AppCarosel images={imageCarousel && imageCarousel} />
                                    )}

                                    {/* <Carousel
                          images={imageCarousel && imageCarousel}
                          style={{
                            width: '100%',
                            height: 250,
                            backgroundColor: 'rgba(0,0,0,0)',
                          }}
                        /> */}
                                    {x.paid_at !== null ? (
                                        <HStack alignItems={'center'} justifyContent='center' spacing={1}>
                                            <Text color={'gray.600'} fontSize='md'>Status :</Text>
                                            <Text color={'gray.600'} fontSize='md'>Pembayaran Berhasil</Text>
                                            <BsCircleFill size={8} color="green" />
                                        </HStack>
                                    ) : (
                                        <HStack alignItems={'center'} justifyContent='center' spacing={1}>
                                            <Text color={'gray.600'} fontSize='md'>Status :</Text>
                                            <Text color={'gray.600'} fontSize='md'>Menunggu Pembayaran</Text>
                                            <BsCircleFill size={8} color="red" />
                                        </HStack>
                                    )}

                                </Stack>


                            </Stack>
                        </Stack>
                    )
                })
            ) : (
                <Stack h={height} alignItems={'center'} justifyContent='center' >
                    <Text color={'gray.500'} fontWeight='bold'>Tidak ada data invoice</Text>
                </Stack>
            )}

            {detailPrice && (
                <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} >
                    <ModalOverlay />
                    <ModalContent bgColor='gray.200' >
                        <ModalHeader>
                            <HStack spacing={2} alignItems='center' >
                                {/* <FontAwesome5 name="file-invoice" size={22} color="black" /> */}
                                <Text fontSize={'lg'} fontWeight='bold'>Invoice {invoiceDetail.invoice_number} - {invoiceDetail.title}</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            <Stack spacing={2}>
                                <Stack>
                                    <Text fontSize={'lg'} fontWeight='bold'>Product Order</Text>
                                    {invoiceDetail.details.length > 0 ? (
                                        invoiceDetail.details.map((z, index) => {
                                            return (
                                                <Stack key={index} bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'base'}>
                                                    <HStack spacing={3} justifyContent='space-between'>
                                                        <Stack  >
                                                            <Image
                                                                src={
                                                                    z.order.product_image
                                                                }
                                                                alt={z.order.product_name}
                                                                w="300px"
                                                                borderRadius={'xl'}
                                                            />
                                                        </Stack>
                                                        <Stack spacing={1} >
                                                            <Text numberOfLines={2} fontWeight={'bold'} fontSize='sm'>{(z.order.product_name)}</Text>
                                                            <Text color={'gray.700'} fontSize='sm'>Total : Rp. {formatFrice(z.amount)}</Text>
                                                            <Text color={'gray.700'} fontSize='sm'>Quantity : {(z.order.quantity)}</Text>
                                                        </Stack>
                                                    </HStack>
                                                </Stack>
                                            )
                                        })
                                    ) : (
                                        <Text>Tidak ada product</Text>
                                    )}
                                </Stack>

                                <Stack>
                                    <Text fontSize={'lg'} fontWeight='bold'>Detail</Text>
                                    <Stack bgColor={'white'} spacing={1} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <HStack alignItems={'center'}>
                                            <Stack spacing={1}>
                                                {titleBill?.map((x, index) => (
                                                    <Text color={'gray.700'} key={index}>{x.label}</Text>
                                                ))}
                                            </Stack>
                                            <Spacer />
                                            <Stack spacing={1}>
                                                <Text fontWeight='bold'>Rp. {formatFrice(detailPrice)}</Text>
                                            </Stack>
                                        </HStack>
                                    </Stack>
                                </Stack>


                                <Stack >
                                    <HStack alignItems={'center'} spacing={2} >
                                        <Text fontSize={'lg'} fontWeight='bold'>Payment Method</Text>
                                        <Stack onClick={() => navigate('/information')}>
                                            <IoHelpCircleOutline size={20} color="black" />
                                        </Stack>
                                    </HStack>
                                    <Stack bgColor={'white'} spacing={5} borderRadius='xl' m={2} p={3} shadow={'md'}>

                                        <HStack alignItems={'center'} w='full' justifyContent={'center'}>
                                            <Stack >
                                                <Text color={'green.600'} fontWeight='bold' fontSize={'lg'}>Rp. {formatFrice(invoiceDetail.amount_total)}</Text>
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
                                        <Stack size={'sm'} alignItems='center' justifyContent={'center'} >
                                            {invoiceDetail.paid_at === null && (
                                                loading ? (
                                                    <Spinner color={'green'} />
                                                ) : (
                                                    <Button bgColor={'green.500'} onClick={() => handleVa(invoiceDetail.invoice_number, bankAccount)} >
                                                        <Text color={'white'} fontWeight='bold'>Generate Virtual Account</Text>
                                                    </Button>
                                                )
                                            )}
                                        </Stack>
                                        <Stack size={'sm'} alignItems='center' justifyContent={'center'} >
                                            {virtualAccount !== '' && (
                                                <Stack spacing={1} mb={3}>
                                                    <Text fontWeight={'bold'} fontSize={'md'}>Bank</Text>
                                                    <Text fontSize={'md'} >{bankAccount}</Text>

                                                    <Text fontWeight={'bold'} fontSize={'md'}>VA Number</Text>
                                                    <HStack spacing={2}>
                                                        <Text fontSize={'md'} >{virtualAccount}</Text>

                                                        <Stack cursor={'pointer'} onClick={() => handleCopy(virtualAccount)}>

                                                            <Text fontSize={'md'} ><AiOutlineCopy size={20} color="black" /></Text>
                                                        </Stack>
                                                    </HStack>

                                                    <Text fontWeight={'bold'} fontSize={'md'}>Expired At</Text>
                                                    <Text fontSize={'md'} >{new Date(expired).toLocaleString()}</Text>

                                                </Stack>

                                            )}
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={() => setDetailModal(false)}>
                                Close
                            </Button>
                            {/* <Button variant='ghost' onClick={() => console.log('submit')}>Submit</Button> */}
                        </ModalFooter>

                    </ModalContent>
                </Modal>
            )}


        </Stack>
    )
}

export default InvoiceListPage