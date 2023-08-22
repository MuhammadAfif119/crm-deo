import { Box, Button, Divider, Flex, Heading, HStack, Image, Input, Radio, RadioGroup, SimpleGrid, Spacer, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate, useParams } from 'react-router-dom'
import { addDocumentFirebase, deleteDocumentFirebase, getCollectionFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi'
import TicketCard from '../../Components/Card/TicketCard'
import PaymentTicketDetail from '../../Components/Payment/PaymentTicketDetail'
import { decryptToken } from '../../Utils/encrypToken'
import { formatFrice } from '../../Utils/Helper'

function PaymentTicketPage() {


    const param = useParams()

    const [dataLeads, setDataLeads] = useState("")
    const [dataTicket, setDataTicket] = useState("")


    const navigate = useNavigate()




    const getDataLeads = async () => {
        const conditions = [
            { field: "projectId", operator: "==", value: param.id },
            { field: "phoneNumber", operator: "==", value: param.phone },
        ];
        const sortBy = { field: "createdAt", direction: "asc" };
        const limitValue = 1;

        try {
            const res = await getCollectionFirebase(
                "leads",
                conditions,
                sortBy,
                limitValue
            );

            setDataLeads(...res)
            getDataTicket(res[0].formId)

            if (res[0].orderId !== undefined) {
                checkOrderSummary(res[0].orderId)
            }
        } catch (error) {
            console.log(error, "ini error");
        }
    };

    const getDataTicket = async (formId) => {

        const conditions = [
            { field: "formId", operator: "==", value: decryptToken(formId) },
        ];
        const sortBy = { field: "createdAt", direction: "asc" };
        const limitValue = 1;

        try {
            const res = await getCollectionFirebase(
                "tickets",
                conditions,
                sortBy,
                limitValue
            );
            setDataTicket(...res);
            if (res[0]?.gtmId) {
                getLeadsGTM(res[0]?.gtmId)
            }

        } catch (error) {
            console.log(error, "ini error");
        }
    }

    useEffect(() => {
        getDataLeads()

        return () => {
        }
    }, [])


    const checkOrderSummary = (id) => {
        navigate(`/payment/summary/${id}`)
    }

    const getLeadsGTM = (gtmId) => {
        const script = document.createElement('script');
        script.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(script);

    }








    return (
        <Stack h={'100vh'} alignItems='center' justifyContent={'center'}>
            <Box p={2} >
                <Stack >
                    {param.method !== "none" ? (
                        <SimpleGrid columns={[1, null, 2]} gap={3} >
                            {dataTicket && (
                                <Stack bgColor={'white'} p={[1, 1, 5]} spacing={5} borderRadius='md' shadow={'md'}>
                                    <Heading size={'md'}>Product Active</Heading>
                                    <Stack onClick={() => console.log(dataTicket, 'ini xx')}>
                                        <TicketCard item={dataTicket} />
                                    </Stack>
                                </Stack>
                            )}
                            <Stack p={[1, 1, 5]} bgColor={'white'} minH={'530px'} spacing={5} borderRadius='md' shadow={'md'}>
                                {dataLeads === "" || dataLeads === undefined ? (
                                    <>
                                        <Stack>
                                            <Heading size={'md'}>Recipient data: </Heading>
                                        </Stack>

                                        <Stack spacing={3} p={[1, 1, 5]}>
                                            <Text>Tidak ada data leads</Text>
                                        </Stack>
                                    </>
                                ) : (
                                    <>
                                        <Stack>
                                            {param.method === "xendit" ? (
                                                <PaymentTicketDetail dataLeads={dataLeads} dataTicket={dataTicket} />

                                            ) : (
                                                <Stack>
                                                    <Heading size={'md'}>We dont have any method payment</Heading>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </>
                                )}

                            </Stack>
                        </SimpleGrid>
                    ) : (
                        <Stack alignItems={'center'} justifyContent='center'>
                            <Heading> Terimakasih Sudah Mengisi Form ! </Heading>
                        </Stack>
                    )}

                </Stack>
            </Box>
        </Stack>
    )
}

export default PaymentTicketPage