import { Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getCollectionFirebase } from '../../Api/firebaseApi'
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


    const dataParam = location.state

    const getdataMessageEmail = async() => {
          const conditions = [
            { field: "type", operator: "==", value: "email" },
            { field: "companyId", operator: "==", value: globalState.currentCompany },
            { field: "projectId", operator: "==", value: globalState.currentProject },
          ];
          const sortBy = { field: "createdAt", direction: "desc" };
          try {
            const res = await getCollectionFirebase(
              `contacts/${dataParam?.id}/messages`,
              conditions,
              sortBy
            );
            setEmailHistory(res);
          } catch (error) {
            console.log(error, "ini error");
          }
    }

    useEffect(() => {
        getdataMessageEmail()

        return () => {
        }
    }, [globalState.currentCompany,globalState.currentProject, "email" ])





    return (
        <Stack p={[1, 1, 5]}>
            <HStack>
                <BackButtons />
                <Heading size={'md'}>Contact Detail</Heading>
            </HStack>
            <Stack >
                <Grid templateColumns={{ base: '1fr', md: '1fr 2fr 1fr' }} gap={2}>
                    <Stack bgColor={'white'} borderRadius='md' shadow={'md'} minH='500px'>
                        <EditContactFrom data={dataParam}  />
                    </Stack>
                    <Stack bgColor={'white'} borderRadius='md' shadow={'md'} minH='500px'>
                        <MessageContact data={dataParam} />
                    </Stack>
                    <Stack bgColor={'white'} borderRadius='md' shadow={'md'} minH='500px'>
                        {emailHistory.length > 0 ? (
                        <EmailHistory data={emailHistory}/>

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