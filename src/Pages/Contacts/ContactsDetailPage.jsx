import { Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getCollectionFirebase, getCollectionFirebaseV2, getCollectionWhereFirebase, getSingleDocumentFirebase } from '../../Api/firebaseApi'
import BackButtons from '../../Components/Buttons/BackButtons'
import EmailHistory from '../../Components/Chat/EmailHistory'
import EditContactFrom from '../../Components/Form/EditContactFrom'
import MessageContact from '../../Components/Form/MessageContact'
import useUserStore from '../../Hooks/Zustand/Store'

function ContactsDetailPage() {

    const params = useParams()


    const location = useLocation()
    const globalState = useUserStore();

    const [emailHistory, setEmailHistory] = useState("")
    const [templateEmail, setTemplateEmail] = useState([])

    const [dataParam, setDataParam] = useState("")


    // const dataParam = location.state.result
    const dataPipeline = location.state.pipeline

    const price = location.state.price


    const getDataMessageDetail = async () => {
        try {
                  const result = await getSingleDocumentFirebase('contacts', params.id)
                  setDataParam(result)
                } catch (error) {
                  console.log(error)
                }
    }

    const getdataMessageEmail = async () => {

        const link = `contacts/${params?.id}/messages`
        const conditions = [
            { field: "type", operator: "==", value: "email" },
            { field: "companyId", operator: "==", value: globalState.currentCompany },
            { field: "projectId", operator: "==", value: globalState.currentProject },
        ];
        const sortBy = { field: "createdAt", direction: "desc" };
        try {
            const res = await getCollectionFirebase(
                link,
                conditions,
                sortBy,
            );

            setEmailHistory(res);
        } catch (error) {
            console.log(error, "ini error");
        }
    }
    const getTemplateEmail = async () => {
        try {
            const res = await getCollectionWhereFirebase('templates', 'category', '==', 'email')
            setTemplateEmail(res)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataMessageDetail()
        getdataMessageEmail()
        getTemplateEmail()
        return () => {
            setEmailHistory("")
        }
    }, [globalState.currentProject, "email"])





    return (
        <Stack p={[1, 1, 5]}>
            <HStack>
                <BackButtons />
                <Heading size={'md'}>Contact Detail</Heading>
            </HStack>
            <Stack >
                <Grid templateColumns={{ base: '1fr', md: '1fr 2fr 1fr' }} gap={2}>
                    <Stack bgColor={'white'} borderRadius='md' shadow={'md'} minH='500px'>
                        <EditContactFrom data={dataParam || dataPipeline} />
                    </Stack>
                    <Stack bgColor={'white'} borderRadius='md' shadow={'md'} minH='500px'>
                        <MessageContact data={dataParam || dataPipeline} templateEmail={templateEmail} dataPipeline={dataPipeline} price={price} />
                    </Stack>
                    <Stack bgColor={'white'} borderRadius='md' shadow={'md'} minH='500px'>
                        {emailHistory.length > 0 ? (
                            <EmailHistory data={emailHistory} />

                        ) : (
                            <Stack alignItems={'center'} justifyContent='center' minH='500px'>
                                <Text color={'gray.400'} fontWeight='bold'>You dont have any messages</Text>
                            </Stack>
                        )}
                    </Stack>
                </Grid>
            </Stack>
        </Stack>
    )
}

export default ContactsDetailPage