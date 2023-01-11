import { Box, Button, Heading, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Spacer, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { doc, setDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaHome, FaPlane, FaShip } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import _axios from '../Api/AxiosBarrier'
import { db } from '../Config/firebase'
import AuthContext from '../Routes/hooks/AuthContext'
import colors from '../Utils/colors'
import { formatFrice } from '../Utils/Helper'

function CheckoutPage() {

    const [address, setAddress] = useState('')
    const [activeAddress, setActiveAddress] = useState('')
    const [modalAddress, setModalAddress] = useState(false)
    const [modalAddAddress, setModalAddAddress] = useState(false)
    const [cart, setCart] = useState([])
    const [cartsBuy, setCartsBuy] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [inputCodePromo] = useState('')

    const [numberPhone, setNumberPhone] = useState('')
    const [label, setLabel] = useState('')
    const [recipients, setRecipients] = useState('')
    const [city, setCity] = useState('')
    const [cityFix, setCityFix] = useState('')
    const [cityArr, setCityArr] = useState([])
    const [addressName, setAddressName] = useState('')
    const [posCode, setPosCode] = useState(0)

    const navigate = useNavigate()
    const toast = useToast()

    const width = window.innerWidth
    const height = window.innerHeight

    const { currentUser } = useContext(AuthContext)

    const getAddress = async () => {
        try {
            const res = await _axios('api/blj-address')
            setAddress(res.data)

            const dataAddress = res.data
            const addressFind = dataAddress.find((x) => x.is_active > 0)
            setActiveAddress(addressFind)
        } catch (error) {
            console.log(error)
        }
    }

    const handleActiveAddress = async (item) => {
        try {
            const res = await _axios.post(`api/blj-address/${item}/set-active`)
            if (res.status === true) {
                toast({
                    title: 'BELANJA.ID',
                    description: 'Address sudah aktif.',
                    status: 'success'
                })
                getAddress()
                setModalAddress(false)
            }
        } catch (error) {
            console.log(error, 'error')
            toast({
                title: 'BELANJA.ID',
                description: error.message,
                status: 'error'
            })

        }
    }

    const getCart = async () => {
        // loadingShow()
        let sum = 0
        try {
            const res = await _axios('api/blj-cart/index')
            if (res) {
                setCart(res)
                const dataArr = res.data
                dataArr.forEach(item => {
                    sum += (parseInt(item.price))
                    setTotalPrice(sum)
                }
                )
                let dataCarts = []
                dataArr.forEach(() => {
                    dataCarts.push({
                        fragile: false,
                        wood_packing: false,
                        packing_note: null,
                        shipping_method: '',
                        shipping_fee_local: 0,
                        shipping_fee: 0
                    })
                })
                setCartsBuy(dataCarts)
            }
            //   loadingClose()
        } catch (error) {
            console.log(error.message, 'in getcart')
            //   loadingClose()
        }
    }


    const getDataSearch = () => {
        return new Promise((resolve, reject) => {
            _axios.get(`/api/blj-address/search?keyword=${city}`).then((res) => {
                setCityArr(res.data)

            })
                .catch(err => reject(err))
        })
    }


    const handleSubmit = async () => {
        const addressSplit = cityFix.split(',')

        const params = {
            province: addressSplit[2],
            city: addressSplit[1],
            district: addressSplit[0],
            label: label,
            postal_code: posCode,
            phone: numberPhone,
            address: addressName,
            receiver: recipients,
        }
        if (params) {
            try {
                // loadingShow()
                const res = await _axios.post('/api/blj-address', params)
                if (res) {
                    toast({
                        title: 'BELANJA.ID',
                        description: 'Berhasil menambahkan Alamat.',
                        status: 'success'
                    })
                    getAddress()
                }
                setModalAddAddress(false)
            } catch (error) {
                console.log(error.message)
                toast({
                    title: 'BELANJA.ID',
                    description: error.message,
                    status: 'error'
                })
            }
            // loadingClose()
        }
    }

    const handleBuy = async () => {
        // loadingShow()
        const orders = cartsBuy.map(x => {
            return {
                fragile: x.fragile,
                wood_packing: x.wood_packing,
                packing_note: x.packing_note,
                shipping_method: x.shipping_method,
                shipping_fee_local: x.shipping_fee_local,
                shipping_fee: x.shipping_fee
            }
        })

        const params = {
            orders,
            promo_code: inputCodePromo ? inputCodePromo : null
        }

        console.log(params, 'paramss')


        try {
            const res = await _axios.post('api/blj-checkout', params)
            console.log(res, 'iniress')
            if (res.status === true) {


                const ref = doc(db, "invoices", currentUser.uid);
                await setDoc(ref, {
                    data: res.data,
                    userId: currentUser.uid,
                    userName: currentUser.displayName
                }, { merge: true });

                console.log(res.data.invoice_number, 'ini res invoice')
                navigate(`invoices/${res.data.invoice_number}`)
                toast({
                    title: 'Belanja.co.id',
                    description: 'Berhasil checkout product',
                    status: 'success'
                })

            }
            if (res.status === false) {
                toast({
                    title: res.message,
                    status: 'error'
                })
            }
            //   loadingClose()
        } catch (error) {
            console.log(error)
            //   loadingClose()
        }
    }


    useEffect(() => {
        getAddress()
        getCart()

        return () => {
        }
    }, [])

    useEffect(() => {
        getDataSearch()

        return () => {
            setCityArr([])
        }
    }, [city])


    return (
        <Stack bgColor={'gray.200'}>
            <Stack shadow={'md'} borderRadius='xl' bgColor={'white'} p={4} m={3}>
                <Text fontSize={'lg'} fontWeight='bold'>Kirim ke</Text>
                {!activeAddress ? (
                    <>
                        <Text>Anda tidak memiliki alamat yang terdaftar.</Text>
                        <HStack>
                            <Stack onClick={() => setModalAddress(true)}>
                                <Text underline color={'blue.700'} italic >Ubah alamat</Text>
                            </Stack>
                        </HStack>
                    </>
                ) : (
                    <Stack spacing={1} >
                        <Text fontSize={'md'} fontWeight='bold'>{activeAddress?.receiver} - ({activeAddress?.label})</Text>
                        <Stack >
                            <Text fontSize={'sm'} >{activeAddress?.phone}</Text>
                            <Text fontSize={'sm'} >{activeAddress?.full_address}</Text>
                            <HStack spacing={1}  >
                                <Text fontSize={'sm'} >{activeAddress?.district},</Text>
                                <Text fontSize={'sm'} >{activeAddress?.city}</Text>
                            </HStack>
                            <HStack spacing={1}>
                                <Text fontSize={'sm'} >{activeAddress?.province}</Text>
                                <Text fontSize={'sm'} >-</Text>
                                <Text fontSize={'sm'} >{activeAddress?.postal_code}</Text>
                            </HStack>
                        </Stack>
                        <HStack>
                            <Stack cursor={'pointer'} onClick={() => setModalAddress(true)}>
                                <Text fontStyle={'italic'} textDecoration='underline' color={'blue'} fontSize='sm'  >Ubah alamat</Text>
                            </Stack>
                        </HStack>
                    </Stack>
                )}
            </Stack>

            <Stack mb={3} p={4} flex={1}>
                <Text fontSize={'lg'} fontWeight='bold'>Produk</Text>
                <Stack flex={1} spacing={3} borderRadius='xl' >
                    {cart?.data?.length > 0 ? (
                        cart?.data?.map((x, index) => (
                            <Stack bgColor={'white'} borderRadius='xl' shadow={'md'} mb={2}>
                                <HStack m={3} justifyContent={'space-between'}>
                                    <Stack shadow={'md'}>
                                        <Image src={x.product_image} alt={x.product_name} borderRadius={'xl'} w='150px' />
                                    </Stack>
                                    <Stack maxW={'60%'} spacing={1} >
                                        <Text numberOfLines={3} fontWeight={'bold'} fontSize='sm'>{(x.product_name)}</Text>
                                        <Text color={'gray.700'} fontSize='sm'>Rp. {formatFrice(x.price / x.quantity)} / pcs</Text>
                                        <Text color={'gray.700'} fontSize='sm'>Quantity : {(x.quantity)}</Text>
                                        <Text color={'gray.700'} fontWeight='bold' fontSize={'sm'}>Total : Rp. {formatFrice(x.price)}</Text>
                                    </Stack>


                                    <Stack maxW={'20%'} spacing={2} alignItems='flex-end' justifyContent={'flex-end'} >

                                        <Stack>
                                            <Text>{x.freight === 'Sea' ? <FaShip size={20} color="black" /> : x.freight === 'Air' ? <FaPlane size={20} color="black" /> : ''}</Text>
                                        </Stack>

                                    </Stack>
                                </HStack>
                            </Stack>
                        ))
                    ) : (
                        <Stack>
                            <Spinner />
                        </Stack>
                    )}
                </Stack>
            </Stack>

            <Box bgColor='gray.200' shadow={'md'} p={5} >
                <HStack>
                    <Box>
                        <Text color={'gray.700'}>Total Harga</Text>
                        <Heading size={'lg'} fontWeight='extrabold'>Rp {formatFrice(totalPrice)}</Heading>
                    </Box>
                    <Spacer />
                    <Stack alignItems={'center'} justifyContent='center'>
                        <Button bgColor={'green.600'} onClick={() => handleBuy()} size='md'>
                            <HStack spacing={2} alignItems='center' justifyContent={'center'}>
                                {/* <Ionicons name='cart-outline' size='xl'
                                    style={{ fontSize: 20, color: 'white' }}
                                /> */}
                                <Text fontSize={'md'} color='white' fontWeight={'bold'}>Checkout</Text>
                            </HStack>
                        </Button>
                    </Stack>
                </HStack>
            </Box>

            {/* modal address */}

            {address && (
                <Modal isOpen={modalAddress} onClose={() => setModalAddress(false)} >
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader>
                            <Stack cursor={'pointer'} onClick={() => setModalAddAddress(true)}>
                                <HStack spacing={2} alignItems='center' >
                                    <FaHome size={24} color="black" />
                                    <Text fontSize={'lg'} fontWeight='bold'>Tambah alamat baru</Text>
                                </HStack>
                            </Stack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody >
                            <SimpleGrid >
                                {address?.map((x, index) => (
                                    <Stack cursor={'pointer'} onClick={() => handleActiveAddress(x.id, index)}>
                                        <Stack spacing={1} shadow={'md'} bgColor={x.is_active > 0 ? 'gray.100' : 'white'} border={'solid 1px black'} borderColor={x.is_active > 0 ? 'cyan.500' : 'white'} borderRadius={'xl'} p={5} m={2} >
                                            <Text fontSize={'sm'} fontWeight='bold'>{x.receiver} - ({x.label})</Text>
                                            <Text fontSize={'sm'} >{x.phone}</Text>
                                            <Stack spacing={1}>
                                                <Text fontSize={'sm'} noOfLines={3}>{x.full_address}</Text>
                                                <HStack spacing={2}>
                                                    <Text fontSize={'sm'} >{x.district},</Text>
                                                    <Text fontSize={'sm'} >{x.city}</Text>
                                                </HStack>
                                                <HStack spacing={1}>
                                                    <Text fontSize={'sm'} >{x.province}</Text>
                                                    <Text fontSize={'sm'} >-</Text>
                                                    <Text fontSize={'sm'} >{x.postal_code}</Text>
                                                </HStack>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                ))}
                            </SimpleGrid>
                        </ModalBody>

                    </ModalContent>
                </Modal>
            )}

            {/* modal add address */}

            <Modal isOpen={modalAddAddress} onClose={() => setModalAddAddress(false)} >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>
                        <HStack spacing={2} alignItems='center' >
                            <Text fontSize={'lg'} fontWeight='bold'>Alamat baru</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <VStack spacing={5} m={10}>

                            <Input
                                id="label"
                                color={colors.black}

                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Label"
                            />

                            <Input
                                id="numberPhone"
                                type="number"
                                color={colors.black}
                                onChange={(e) => setNumberPhone(e.target.value)}
                                placeholder="Nomor hp"
                            />

                            <Input
                                id="recipients"
                                color={colors.black}
                                onChange={(e) => setRecipients(e.target.value)}
                                placeholder="Penerima"
                            />

                            <Input
                                id="city"
                                color={colors.black}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Kota"
                            />

                            <Input
                                id="city"
                                type='number'
                                color={colors.black}
                                onChange={(e) => setPosCode(e.target.value)}
                                placeholder="Kode pos"
                            />

                            {city.length > 0 && (

                                <Select fontSize='md' bgColor={'white'} placeholder="Pilih alamat" onChange={(e) => setCityFix(e.target.value)}>
                                    {cityArr.map((x, index) => (
                                        <option value={x} key={index}>{x}</option>
                                    ))}
                                </Select>


                            )}

                            <Input
                                id="address"
                                color={colors.black}
                                onChange={(e) => setAddressName(e.target.value)}
                                placeholder="Alamat Lengkap"
                            />
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => setModalAddAddress(false)}>
                            Close
                        </Button>
                        <Button variant='ghost' onClick={() => handleSubmit()}>Submit</Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>


        </Stack>
    )
}

export default CheckoutPage