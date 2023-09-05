import { Box, Button, Divider, Flex, Heading, HStack, Image, Input, Radio, RadioGroup, SimpleGrid, Spacer, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import QRCode from 'react-qr-code';
import { useLocation, useParams } from 'react-router-dom';
import { addDocumentFirebase, deleteDocumentFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi';
import { formatFrice } from '../../Utils/Helper';

function PaymentDetail({ dataLeads, dataTicket, dataProduct }) {

    const param = useParams()

    let dataParam = ""

    if(param.type === "product"){
        dataParam = dataProduct
    }

    if(param.type === "ticket"){
        dataParam = dataTicket
    }

    const [paymentVA, setPaymentVA] = useState("");
    const [orderId, setOrderId] = useState("")

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [selectedPaymentMethodImage, setSelectedPaymentMethodImage] = useState("");

    const [orderSummary, setOrderSummary] = useState("")

    const [quantity, setQuantity] = useState('')

    const [loadingPay, setLoadingPay] = useState(false)

    const [thanksPage, setThanksPage] = useState(false)

    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;

        if (newQuantity === '' || (newQuantity >= 1 && newQuantity <= 3)) {
            setQuantity(newQuantity);
        }
    };




    const toast = useToast({
        position: "top",
        align: "center",
    });


    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        const imageFind = banks.find((x) => x.name === method);
        setSelectedPaymentMethodImage(imageFind.uri);
    };

    const handleCopy = (id) => {
        navigator.clipboard.writeText(id);
        toast({
            title: "Announce",
            description: "Copy to clipboard.",
            status: "success",
        });
    };



    const handlePaymentTransfer = async (id, updatedOrder, fixPrice) => {
        setOrderId(id);
        setLoadingPay(true)

        const baseUrl =
            "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/";

        const data = {
            xenditId: "6479f64913999eb3b3fe7283",
            orderId: id,
            amount: fixPrice,
            bankCode: selectedPaymentMethod,
            name: updatedOrder.name,
            companyId: dataParam.companyId,
            projectId: dataParam.projectId,
            outletId: dataParam.projectId,
            module: "crm",
            userId: dataLeads.id,
            feeRule: true
        };


        const options = {
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.REACT_APP_PAYMENT_KEY,
            },
        };


        try {
            const res = await axios.post(`${baseUrl}/paymentCreateVA`, data, options);
            if (res.data.status === true) {
                setPaymentVA(res.data.data);
                setLoadingPay(false)
            } else {
                console.log(res.data.data);

                toast({
                    title: 'Warning!',
                    description: 'Terjadi Kesalah Generate VA, Silahkan menghubungi Admin.',
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                })

                setLoadingPay(false)

            }
        } catch (error) {
            console.log(error, "ini error");

            toast({
                title: 'Error!',
                description: 'Terjadi Kesalah, Silahkan menghubungi Admin.',
                status: error,
                duration: 9000,
                isClosable: true,
            })

            setLoadingPay(false)

        }
        setLoadingPay(false)

    };




    const banks = [
        {
            name: "BNI",
            uri: "https://www.xendit.co/wp-content/uploads/2019/11/logo-bni.png",
        },
        {
            name: "MANDIRI",
            uri: "https://www.xendit.co/wp-content/uploads/2019/11/logo-mandiri.png",
        },
        {
            name: "PERMATA",
            uri: "https://www.xendit.co/wp-content/uploads/2019/11/logo-permatabank.png",
        },
        {
            name: "BRI",
            uri: "https://www.xendit.co/wp-content/uploads/2019/11/logo-bri.png",
        },
    ];

    const handleOrderPayConfirm = async () => {
        setPaymentVA("");



        const fixPrice = dataParam.price * quantity

        const dataOrder = [
            {
                name: dataParam.title,
                price: dataParam.price,
                qty: quantity,
                id: dataParam.id,
            }
        ]



        const updatedOrder = {
            orders: dataOrder,
            paymentStatus: "open",
            orderStatus: "onProcess",
            paymentMethod: "XENDIT_VA",
            module: "crm",
            category: param.type === "ticket" ?  "ticket" : "product",
            companyId: dataParam.companyId,
            projectId: dataParam.projectId,
            outletId: dataParam.projectId,
            name: dataLeads.name || "",
            email: dataLeads.email || "",
            phoneNumber: dataLeads.phoneNumber || "",
            amount: Number(dataParam.price) * quantity,
            quantity: quantity,
            userId: dataLeads.id || ""
        };



        addDocumentFirebase("orders", updatedOrder, dataParam.companyId).then((x) => {
            setOrderSummary(updatedOrder);
            return handlePaymentTransfer(x, updatedOrder, fixPrice);
        });
    };



    const handleCancelPayment = async () => {
        try {
            const result = await deleteDocumentFirebase("orders", orderId);
            if (result) {
                setOrderId("");
                setPaymentVA("");
            }
        } catch (error) {
            console.log(error, "ini error");
        }
    };


    const sucessOrder = (res) => {

        updateDocumentFirebase("leads", dataLeads.id, {
            status: "won",
            opportunity_value: Number(dataParam.price) * quantity,
            orderId: orderId,
        }).then((res) => {
            console.log('berhasil update')
            setThanksPage(true)

        }).catch((err) => console.log(err, 'ini err'))


    }

    const handleInputPayment = async () => {
        try {
            const result = await getSingleDocumentFirebase("payments", orderId);
            if (result.status === "PENDING") {
                toast({
                    title: "Announcement",
                    description:
                        "Kamu Belum Melakukan Transfer, harap segera transfer.",
                    status: "warning",
                    duration: 9000,
                    isClosable: true,
                });
            }
            if (result.status === "PAID") {
                updateDocumentFirebase("orders", orderId, {
                    paymentStatus: "PAID",
                    updated_bill: new Date(),
                    orderStatus: "success"
                }).then((res) => {
                    if (res) {
                        sucessOrder(res);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };



    if (thanksPage === true) {
        return (
            <Stack>
                <Heading size={'md'}>Thanks for order</Heading>

                {orderSummary && (
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
                                <Text textAlign="right">{orderId}</Text>
                            </HStack>



                            <HStack justifyContent="space-between" fontSize="sm" my={1}>
                                <Text fontWeight="bold">Name :</Text>
                                <Spacer />
                                <Text textAlign="right">{orderSummary.name}</Text>
                            </HStack>

                            <HStack justifyContent="space-between" fontSize="sm" my={1}>
                                <Text fontWeight="bold">Number Phone :</Text>
                                <Spacer />
                                <Text textAlign="right">{orderSummary.phoneNumber}</Text>
                            </HStack>


                            <HStack justifyContent="space-between" fontSize="sm" my={1}>
                                <Text fontWeight="bold">Quantity:</Text>
                                <Spacer />
                                <Text textAlign="right">{orderSummary.quantity}</Text>
                            </HStack>
                            <HStack justifyContent="space-between" fontSize="sm" my={1}>
                                <Text fontWeight="bold">Ticket:</Text>
                                <Spacer />
                                <Text textAlign="right" textTransform={'capitalize'}>{dataParam.title}</Text>
                            </HStack>

                            {orderSummary.paymentMethod && (
                                <HStack justifyContent="space-between" fontSize="sm" my={1}>
                                    <Text fontWeight="bold">Payment Method:</Text>
                                    <Spacer />
                                    <Text textAlign="right" textTransform={'capitalize'}>{orderSummary.paymentMethod}</Text>
                                </HStack>
                            )}
                            <HStack justifyContent="space-between" fontSize="sm" my={1}>
                                <Text fontWeight="bold">Module:</Text>
                                <Spacer />
                                <Text textAlign="right" textTransform={'uppercase'}>{orderSummary.module}</Text>
                            </HStack>

                            <Divider />
                            <HStack justifyContent="space-between" fontSize="sm" my={2}>
                                <Text fontWeight="bold">Total Price:</Text>
                                <Spacer />
                                <Text textAlign="right" fontWeight={700} fontSize={'lg'}>
                                    Rp{" "}
                                    {formatFrice(orderSummary.amount)}
                                </Text>
                            </HStack>
                        </Flex>

                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100px" }}
                            value={`https://kodok.deoapp.site/orders/${orderId}`}
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
                )}
            </Stack>
        )
    }


    return (
        <Stack spacing={4}>
            <Stack>
                <Heading size={'md'}>Receipent: </Heading>
            </Stack>
            <Stack>
                <HStack justifyContent="space-between" fontSize="sm" my={1}>
                    <Text fontWeight="bold">Name :</Text>
                    <Spacer />
                    <Text textAlign="right">{dataLeads?.name}</Text>
                </HStack>

                <HStack justifyContent="space-between" fontSize="sm" my={1}>
                    <Text fontWeight="bold">Number Phone :</Text>
                    <Spacer />
                    <Text textAlign="right">{dataLeads?.phoneNumber}</Text>
                </HStack>

                <HStack justifyContent="space-between" fontSize="sm" my={1}>
                    <Text fontWeight="bold">Email :</Text>
                    <Spacer />
                    <Text textAlign="right">{dataLeads?.email}</Text>
                </HStack>

            </Stack>
            <Stack>
                <Heading size={'md'}>Payment: </Heading>
            </Stack>
            <Stack>
                {paymentVA !== "" ? (
                    <Stack>
                        <HStack w="full" px={5}>
                            <Image
                                src={selectedPaymentMethodImage}
                                alt={paymentVA?.bank_code}
                                w="80px"
                                borderRadius="xl"
                            />

                            <Spacer />

                            <Text fontSize="sm" textTransform="uppercase">
                                {paymentVA?.status}
                            </Text>
                        </HStack>

                        <Box bg="white" px={5}>
                            <Text>No. Virtual Account : </Text>
                            <Divider my={2} />
                            <Box
                                display="flex"
                                flexDirection="row"
                                justifyContent="space-between"
                            >
                                <Text fontSize={20} color="gray.500">
                                    {paymentVA ? paymentVA?.account_number : "none"}
                                </Text>
                                <Text
                                    color="blue.600"
                                    cursor="pointer"
                                    onClick={() => handleCopy(paymentVA?.account_number)}
                                >
                                    SALIN
                                </Text>
                            </Box>
                            <Divider my={2} />
                            <HStack py={1}>
                                {/* <Text fontSize="sm" textTransform={'uppercase'}>{store}</Text> */}
                                <Spacer />
                                <Text fontSize="sm">
                                    Rp. {formatFrice(paymentVA?.expected_amount)}
                                </Text>
                            </HStack>
                            <Divider my={2} />

                            <Text fontSize={10} color="gray.600">
                                Proses verifikasi otomatis kurang dari 10 menit setelah
                                pembayaran berhasil
                            </Text>
                            <Spacer />
                            <Text fontSize={10} color="gray.600">
                                Bayar ke Virtual Account di atas sebelum membuat donasi baru
                                dengan Virtual account agar nomor tetap sama.
                            </Text>
                        </Box>
                        <Box bg="white" p={5}>
                            <Text fontSize={10} color="gray.600">
                                Petunjuk Transfer mBanking :
                            </Text>
                            <Divider />
                            <Text fontSize={10} color="gray.600">
                                1. Login ke mBanking-mu, pilih Transaksi, kemudian cari {paymentVA.bank_code} Virtual Account
                            </Text>
                            <Text fontSize={10} color="gray.600">
                                2. Masukkan nomor Virtual Account
                            </Text>
                            <Text fontSize={10} color="gray.600">
                                3. Pastikan nama dan nominal bayar benar
                            </Text>
                            <Text fontSize={10} fontWeight={500} color="red.500">
                                4. Jika kamu sudah melakukan pembayaran, klik tombol done
                            </Text>
                        </Box>

                        <HStack alignItems="center" justifyContent="center">
                            <Box>
                                <Button
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleCancelPayment()}
                                >
                                    Cancel payment
                                </Button>
                            </Box>

                            <Box>
                                <Button
                                    colorScheme="green"
                                    size="sm"
                                    onClick={() => handleInputPayment()}
                                >
                                    Done
                                </Button>
                            </Box>
                        </HStack>
                    </Stack>
                ) : (
                    <Stack>
                        <Stack>
                            <Text>Quantity :</Text>
                            <Input
                                placeholder='quantity'
                                value={quantity}
                                onChange={handleQuantityChange}
                                type='number'
                                min={1}
                                max={3}
                            />
                        </Stack>

                        <Stack>
                            <Text>Amount :</Text>
                            <Text fontWeight={500} >Rp. {formatFrice(Number(dataParam?.price) * quantity)}</Text>
                        </Stack>

                        <Text mt="4">Pilih metode pembayaran :</Text>
                        <RadioGroup
                            value={selectedPaymentMethod}
                            onChange={handlePaymentMethodSelect}
                            mt="2"
                        >
                            <SimpleGrid py={2} columns={[2, null, 4]} align="start">
                                {banks?.map((x, index) => (
                                    <Radio key={index} value={x.name}>
                                        <Image src={x.uri} w="70px" />
                                    </Radio>
                                ))}
                            </SimpleGrid>
                        </RadioGroup>
                        <Spacer />

                        <Button colorScheme="green"
                            isLoading={loadingPay}
                            onClick={() => handleOrderPayConfirm()}>Bayar</Button>


                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}

export default PaymentDetail