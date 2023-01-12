import { Box, Button, Center, Divider, Flex, Heading, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import _axios from '../Api/AxiosBarrier'
import { db } from '../Config/firebase'
import AuthContext from '../Routes/hooks/AuthContext'
import colors from '../Utils/colors'
import { formatFrice } from '../Utils/Helper'

function ProductLivePage() {



    const [dataProduct, setDataProduct] = useState({})
    const [priceCountry, setPriceCountry] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [orderQuantity, setOrderQuantity] = useState(0)
    const [loading] = useState(false)

    const [address, setAddress] = useState('')
    const [activeAddress, setActiveAddress] = useState('')
    const [modalAddress, setModalAddress] = useState(false)
    const [modalAddAddress, setModalAddAddress] = useState(false)

    const [numberPhone, setNumberPhone] = useState('')
    const [label, setLabel] = useState('')
    const [recipients, setRecipients] = useState('')
    const [city, setCity] = useState('')
    const [cityFix, setCityFix] = useState('')
    const [cityArr, setCityArr] = useState([])
    const [addressName, setAddressName] = useState('')
    const [posCode, setPosCode] = useState(0)

    const { userDb, currentUser } = useContext(AuthContext)
    console.log(userDb, 'db')


    const param = useParams()
    const toast = useToast()
    const navigate = useNavigate()

    const dataId = param.id

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
                    description: 'Berhasil Memilih Alamat.',
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

    const getDataSearch = () => {
        return new Promise((resolve, reject) => {
            _axios.get(`/api/blj-address/search?keyword=${city}`).then((res) => {
                setCityArr(res.data)

            })
                .catch(err => reject(err))
        })
    }

    useEffect(() => {
        getDataSearch()

        return () => {
            setCityArr([])
        }
    }, [city])

    const getDataDetail = () => {
        try {
            onSnapshot(doc(db, "product", dataId), (doc) => {
                setDataProduct(doc.data());

                const data = doc.data()
                const priceFind = data?.price.find((x) => x?.country === userDb?.country)
                setPriceCountry(priceFind?.prices[0].sea)

            });

        } catch (error) {
            console.log(error, 'message')
        }
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
                console.log(res)
                toast({
                    title: 'BELANJA.ID',
                    description: 'Berhasil menambahkan Alamat.',
                    status: 'success'
                })
                getAddress()
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

    const onAddToCart = async () => {
        let params = {
            from: dataProduct?.from,
            name: dataProduct?.name,
            image: dataProduct?.imageThumbnail,
            price_per_pcs: priceCountry,
            quantity: orderQuantity,
            weight_per_pcs: dataProduct?.weight,
            cbm_per_pcs: dataProduct?.cbm,
            freight: 'sea'
        }

        try {


            const docRef = doc(db, "product", dataId);
            const docSnap = await getDoc(docRef)
                .then(async (docSnap) => {
                    let dataStock = 0
                    if (docSnap.exists()) {
                        dataStock = docSnap?.data().stock
                    }
                    if (dataStock > orderQuantity) {
                        const res = await _axios.post('api/blj-shipping', params)
                        if (res.status === true) {

                            const ref = doc(db, "invoices", res.data.data.invoice.invoice_number);
                            await setDoc(ref, {
                                data: res.data.data,
                                userId: currentUser.uid,
                                userName: currentUser.displayName
                            })
                                .then(async () => {
                                    const docRef = doc(db, "product", dataId);
                                    const docSnap = await getDoc(docRef);
                                    if (docSnap.exists()) {
                                        await updateDoc(docRef, { stock: dataStock - orderQuantity });
                                        // console.log('test')
                                    } else {
                                        console.log("No such document!");
                                    }
                                    dataStock = 0
                                    setOrderQuantity(0)
                                    setShowModal(false)
                                    navigate('/shipping')
                                    toast({
                                        title: 'BELANJA.ID',
                                        description: 'Sukses menambahkan product.',
                                        status: 'success'
                                    })

                                })
                        }
                    }
                })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataDetail()
        getAddress()

        return () => {
            setDataProduct({})
        }
    }, [])




    return (
        <Stack >
            <Stack alignItems={'center'} justifyContent='center' bgColor={'black'}>



                <Image
                    src={dataProduct?.imageThumbnail}
                    alt="image"
                    size="md"
                />
            </Stack>

            {priceCountry > 0 && (
                <Box width='full' shadow={3}>
                    <HStack alignItems={'center'} justifyContent='space-between' shadow={'md'} space={2} bgColor='white' m='1' p='1' borderRadius='md'>
                        <Center>
                            <Heading fontSize='2xl' fontWeight='extrabold'>
                                Rp. {formatFrice(priceCountry)} / Pcs
                            </Heading>
                        </Center>
                        {/* <Center>
                <Tooltip ml='3' label="Dapatkan gratis ongkir dengan pembelian 2 pcs" openDelay={100}>
                  <Ionicons name="md-information-circle-outline" size={24} color="blue" />
                </Tooltip>
              </Center>
              <Spacer />
              <Center>
                <Pressable onPress={() => handleChat()}>
                  <Ionicons name="chatbox-ellipses-outline" size={48} color="#2CADE0" />
                </Pressable>
              </Center> */}

                        <Button m='1' p='2' bgColor='green.400' color={'white'} onClick={() => setShowModal(true)}>+ Keranjang</Button>
                    </HStack>
                </Box>
            )}

            <Stack shadow={'md'} borderRadius='xl' bgColor={'white'} my={3} p={4}>
                <Text fontSize={'lg'} fontWeight='bold'>Sent to</Text>
                {!activeAddress ? (
                    <>
                        <Text>Theres no address register.</Text>
                        <HStack>
                            {/* <TouchableOpacity onPress={() => setModalAddress(true)}> */}
                            <Text underline color={'blue.700'} italic >Change Address</Text>
                            {/* </TouchableOpacity> */}
                        </HStack>
                    </>
                ) : (
                    <Stack >
                        <Text fontSize={'md'} fontWeight='bold'>{activeAddress?.receiver} - ({activeAddress?.label})</Text>
                        <Stack >
                            <Text fontSize={'sm'} >{activeAddress?.phone}</Text>
                            <Text fontSize={'sm'} >{activeAddress?.full_address}</Text>
                            <HStack space={1}  >
                                <Text fontSize={'sm'} >{activeAddress?.district},</Text>
                                <Text fontSize={'sm'} >{activeAddress?.city}</Text>
                            </HStack>
                            <HStack space={1}>
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

            <Box mt="0.5" shadow={'md'}>
                <Box overflow="hidden" bg="white" width="100%">
                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <Heading size="xs" ml="-1">
                                {dataProduct ? dataProduct.name : ''}
                            </Heading>
                            <Text
                                fontSize="xs"
                                _light={{
                                    color: 'violet.500',
                                }}
                                _dark={{
                                    color: 'violet.400',
                                }}
                                fontWeight="500"
                                ml="-0.5"
                                mt="-1"
                            >
                                {dataProduct?.streamer?.username}
                            </Text>
                            {/* <HStack space={2}>
                    <Tag
                      size="sm"
                      bgColor={'red.300'}
                    >
                      <Text textTransform={'capitalize'} fontSize='xs' >{dataProduct?.from}</Text>
                    </Tag>
                  </HStack> */}
                        </Stack>
                    </Stack>
                </Box>
            </Box>

            {priceCountry > 0 && (
                <Box mt="2" shadow={'md'}>
                    <Box overflow="hidden" bg="white" width="100%">
                        <Stack p="4" space={1}>
                            <Stack space={2}>
                                <Heading size="md" ml="-1" mb="1">
                                    Prices
                                </Heading>
                            </Stack>
                            <Box>
                                <Heading size="sm" color="red.700">
                                    Rp {formatFrice(priceCountry)}
                                </Heading>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            )}

            <Box mt="2" shadow={'md'} pb={20}>
                <Box overflow="hidden" bg="white" width="100%">
                    <Stack p="4" space={3}>
                        <Stack space={2}>
                            <Heading size="md" ml="-1" mb="1">
                                Product Info
                            </Heading>

                            <Divider bg="gray.200" thickness="1" my="1.5" />
                            <Flex direction="row">
                                <Box width="50%">
                                    <Text>Stock Product</Text>
                                </Box>
                                <Box width="50%">
                                    <Text color="gray.500" fontSize="12">
                                        {dataProduct?.stock ? dataProduct?.stock : '-'}
                                    </Text>
                                </Box>
                            </Flex>
                            <Divider bg="gray.200" thickness="1" my="1.5" />
                            <Flex direction="row">
                                <Box width="50%">
                                    <Text>Product From</Text>
                                </Box>
                                <Box width="50%">
                                    <Text color="gray.500" fontSize="12" textTransform={'capitalize'}>
                                        {dataProduct?.from ? dataProduct?.from : '-'}
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
                                        {dataProduct?.streamer?.username ? dataProduct?.streamer?.username : '-'}
                                    </Text>
                                </Box>
                            </Flex>
                        </Stack>
                    </Stack>
                </Box>
            </Box>



            <Modal isOpen={showModal} onClose={() => setShowModal(false)} >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Buy now</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Stack alignItems={'center'} justifyContent='center' space={1} my={3}>
                            <Text color={'gray.600'}>Total Order</Text>
                            <HStack>
                                <Input onChange={(e) => setOrderQuantity(e.target.value)} width='50px' />
                            </HStack>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack bg="white" alignItems="center" shadow={'md'} safeAreaBottom>
                            <Stack py="1.5" space={1} mx="auto">
                                <VStack py="0.5" justifyContent="space-between">
                                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                                        Quantity : {dataProduct.stock - orderQuantity}
                                    </Text>
                                    <Text fontSize="sm" fontWeight="bold" color="green.600">
                                        Price : {formatFrice(priceCountry * orderQuantity)}
                                    </Text>
                                </VStack>
                                <Button shadow={'md'} width="100%" onClick={() => onAddToCart()} bg="green.600">
                                    <HStack alignItems={'center'} justifyContent='center' space={2}>
                                        {/* <Ionicons name="ios-cart-outline" size={25} color="white" /> */}
                                        <Text color="gray.100" fontWeight='bold'>Buy now</Text>
                                    </HStack>
                                </Button>
                            </Stack>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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

export default ProductLivePage