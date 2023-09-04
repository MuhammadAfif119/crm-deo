import { Box, Button, Divider, Flex, Heading, HStack, Image, Input, Radio, RadioGroup, SimpleGrid, Spacer, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { off } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate, useParams } from 'react-router-dom'
import { addDocumentFirebase, deleteDocumentFirebase, getCollectionFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi'
import TicketCard from '../../Components/Card/TicketCard'
import PaymentTicketDetail from '../../Components/Payment/PaymentDetail'
import PaymentXenditRecurring from '../../Components/Payment/PaymentXenditRecurring'
import { decryptToken, encryptToken } from '../../Utils/encrypToken'
import _axios from '../../Api/AxiosBarrier';
import MembershipCard from '../../Components/Card/MembershipCard'
import { formatFrice } from '../../Utils/Helper'
import PaymentDetail from '../../Components/Payment/PaymentDetail'

function PaymentPage() {


    const param = useParams()

    const [dataLeads, setDataLeads] = useState("")
    const [dataTicket, setDataTicket] = useState("")
    const [dataProduct, setDataProduct] = useState("")
    const [dataForm, setDataForm] = useState("")
    const [membershipList, setMembershipList] = useState([])

    const [packageActive, setPackageActive] = useState("")


    const navigate = useNavigate()

    console.log(param.type, 'xxx')




    const getDataLeads = async () => {
        const conditions = [
            { field: "projectId", operator: "==", value: param.id },
            { field: "phoneNumber", operator: "==", value: param.phone },
            { field: "name", operator: "==", value: param.name },
        ];
        const sortBy = { field: "createdAt", direction: "asc" };
        const limitValue = 10;

        try {
            const res = await getCollectionFirebase(
                "leads",
                conditions,
                sortBy,
                limitValue
            );


            setDataLeads(...res)
            getDataForm(res[0].formId)

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

        } catch (error) {
            console.log(error, "ini error");
        }
    }

    const getDataForm = async (formId) => {


        const conditions = [
            { field: "token", operator: "==", value: formId },
        ];
        const sortBy = { field: "createdAt", direction: "asc" };
        const limitValue = 1;

        try {
            const res = await getCollectionFirebase(
                "forms",
                conditions,
                sortBy,
                limitValue
            );

            console.log(res, 'ini res')

            if (res[0].membership_used) {
                getDataMembership(res[0].membership_used)
            }
            setDataForm(...res)

            if (res[0]?.facebookPixelId) {
                getLeadsGTM(res[0]?.facebookPixelId)
            }

            if(res[0].ticket_used){
                getDataTicket(res[0].ticket_used)
            }
            if(res[0].product_used){
                getDataProduct(res[0].product_used)
            }

        } catch (error) {
            console.log(error, "ini error");
        }

    }

    const getDataProduct = (formId) => {
        console.log(formId, 'xxx')
        setDataProduct()
    }


    const getDataMembership = async (data) => {
        try {
            const res = await _axios.get('membershipList');
            const dataArr = res.message;

            const filteredMemberships = dataArr.filter((membership) => data.includes(membership.package_code));
            setMembershipList(filteredMemberships)
            setPackageActive(filteredMemberships[0].package_code)
        } catch (error) {
            console.log(error, 'ini error');
        }
    };

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

                            {membershipList.length > 0 && (
                                <Stack  bgColor={'white'} p={[1, 1, 5]} spacing={5} borderRadius='md' shadow={'md'}>
                                    <SimpleGrid columns={[1, 2, 3]} gap={3}>
                                        {membershipList?.map((x, index) => {
                                            return (
                                                <Stack
                                                    bgColor='white'
                                                    borderRadius={'md'}
                                                    shadow='md'
                                                    p={5}
                                                    alignItems={'center'}
                                                    justifyContent='center'
                                                    key={index}
                                                    onClick={() => setPackageActive(x.package_code)}
                                                    cursor='pointer'
                                                     borderColor={packageActive === x.package_code ? "#ffd600" : "black"}
                                                     borderWidth={0.5}

                                                >
                                                    <Text textTransform={'capitalize'} fontWeight={500}>{x.package_name}</Text>
                                                    <Heading size={'lg'}>Rp.{formatFrice(x.package_amount)}</Heading>
                                                    <Text textTransform={'capitalize'}>{x.package_expired_duration || x.package_expired}</Text>
                                                    <Text textTransform={'uppercase'}>{x.package_code}</Text>
                                                </Stack>

                                            )
                                        })}
                                    </SimpleGrid>
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
                                                <PaymentDetail dataLeads={dataLeads} dataTicket={dataTicket} dataProduct={dataProduct} dataForm={dataForm} />

                                            ) :
                                                param.method === "xendit recurring" ? (
                                                    <PaymentXenditRecurring dataLeads={dataLeads} dataTicket={dataTicket} dataForm={dataForm} packageActive={packageActive} membershipList={membershipList}/>
                                                ) : (
                                                    <Stack>
                                                        <Heading size={'md'}>We dont have any method payment</Heading>
                                                    </Stack>
                                                )
                                            }
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

export default PaymentPage