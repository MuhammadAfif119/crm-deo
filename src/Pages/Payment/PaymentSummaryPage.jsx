import { Button, Divider, Flex, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'
import { getSingleDocumentFirebase } from '../../Api/firebaseApi'
import { formatFrice } from '../../Utils/Helper'

function PaymentSummaryPage() {

    const param = useParams()

    const [dataOrder, setDataOrder] = useState("")

    const getDataOrder = async () => {
        try {
            const result = await getSingleDocumentFirebase('orders', param.orderId)
            setDataOrder(result)
            console.log(result, 'ini resut')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataOrder()

        return () => {
        }
    }, [])


    return (
        <Stack>
            <Stack w="full" p="4" borderColor="gray.300" borderWidth={1} rounded="md" spacing={2}>
                <Heading size="sm" mb="2" align="center">
                    Order Summary
                </Heading>
                <Flex direction="column">
                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Order Status:</Text>
                        <Spacer />
                        <Text textAlign="right">Success</Text>
                    </HStack>

                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Order ID:</Text>
                        <Spacer />
                        <Text textAlign="right">{dataOrder?.orderId}</Text>
                    </HStack>



                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Name :</Text>
                        <Spacer />
                        <Text textAlign="right">{dataOrder?.name}</Text>
                    </HStack>

                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Number Phone :</Text>
                        <Spacer />
                        <Text textAlign="right">{dataOrder?.phoneNumber}</Text>
                    </HStack>


                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Quantity:</Text>
                        <Spacer />
                        <Text textAlign="right">{dataOrder?.quantity}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Ticket:</Text>
                        <Spacer />
                        {dataOrder?.orders?.length > 0 && (
                            <Text textAlign="right" textTransform={'capitalize'}>{dataOrder?.orders[0]?.name}</Text>

                        )}
                    </HStack>

                    {dataOrder.paymentMethod && (
                        <HStack justifyContent="space-between" fontSize="sm" my={1}>
                            <Text fontWeight="bold">Payment Method:</Text>
                            <Spacer />
                            <Text textAlign="right" textTransform={'capitalize'}>{dataOrder?.paymentMethod}</Text>
                        </HStack>
                    )}
                    <HStack justifyContent="space-between" fontSize="sm" my={1}>
                        <Text fontWeight="bold">Module:</Text>
                        <Spacer />
                        <Text textAlign="right" textTransform={'uppercase'}>{dataOrder?.module}</Text>
                    </HStack>

                    <Divider />
                    <HStack justifyContent="space-between" fontSize="sm" my={2}>
                        <Text fontWeight="bold">Total Price:</Text>
                        <Spacer />
                        <Text textAlign="right" fontWeight={700} fontSize={'lg'}>
                            Rp{" "}
                            {formatFrice(dataOrder?.amount)}
                        </Text>
                    </HStack>
                </Flex>

                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100px" }}
                    value={`https://crm.deoapp.web.app/payment/summary/${param?.orderId}`}
                    viewBox={`0 0 256 256`}
                />

                <Flex w='full' py={2}>
                    <Button w='full' borderRadius='lg' variant='outline' color='green.500' shadow='lg' borderColor="green.500" onClick={() => setThanksPage(false)}>
                        <Flex flexDir='row' justifyContent='space-bewtween' alignItems='center'>
                            {/* <IoMdArrowBack /> */}
                            <Text>Kembali</Text>
                        </Flex>
                    </Button>
                </Flex>
                <Text fontStyle={'italic'} fontSize='sm' color='red.400'>*Please screenshot this order summary for this action</Text>
            </Stack>
        </Stack>
    )
}

export default PaymentSummaryPage