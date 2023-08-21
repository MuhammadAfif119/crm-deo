import { Box, Button, HStack, Input, Spacer, Stack, Text } from '@chakra-ui/react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { addDocumentFirebase, setDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi'
import BackButtons from '../../Components/Buttons/BackButtons'
import { db } from '../../Config/firebase'
import useUserStore from '../../Hooks/Zustand/Store'

function ChatUserPage() {

    const param = useParams()

    const globalState = useUserStore();



    // const location = useLocation()
    // console.log(location.state, 'xxx')

    const [chat, setChat] = useState("")
    const [chatData, setChatData] = useState("")


    const handleChatChange = (e) => {
        setChat(e.target.value)
    }


    const getDataChat = () => {
        try {
            const docsData = query(
                collection(db, `messages/${param?.id}/conversation`),
                orderBy('createdAt', 'asc')
            );

            const unsubscribe = onSnapshot(docsData, (snapshot) => {
                const docs = snapshot.docs.map((doc) => doc.data());
                setChatData(docs);
            });

            // Jangan lupa untuk mengembalikan fungsi unsubscribe jika diperlukan
            return unsubscribe;
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getDataChat()

        return () => {
            setChatData([])
            setChat('')
        }
    }, [param.id])


    const handleChat = async () => {

        const companyId = param?.id

        const collectionName = `messages/${param.id}/conversation`;
        const data = {
            message: chat,
            createdAt: new Date(),
            uid: globalState.uid,
        };

        try {
            const docID = await addDocumentFirebase(collectionName, data, companyId);
            console.log('ID Dokumen Baru:', docID);
            if (docID) {

                const collectionNameFront = 'messages';
                const docName = param.id;
                const data = {
                    lastConversation: new Date(),
                    lastChat: chat,
                };



                try {
                    const result = await setDocumentFirebase(collectionNameFront, docName, data);
                    console.log(result); // Pesan toast yang berhasil
                } catch (error) {
                    console.log('Terjadi kesalahan:', error);
                }
            }
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
    }


    const renderItemMessage = (item) => {
        if (item.uid === globalState.uid) return (
            <HStack>
                <Spacer />
                <Box shadow={3} alignSelf={'flex-end'} bgColor='green.400' m='1' p='3' borderRadius='2xl' maxW='xs'>
                    <Text textAlign='right'>{item.message}</Text>
                    <Text fontSize='2xs'>{moment(item?.createdAt?.seconds * 1000).fromNow()}</Text>
                </Box>
            </HStack>
        )
        if (item.uid !== globalState.uid) return (
            <Box shadow={3} alignSelf={'flex-start'} bgColor='yellow.400' m='1' p='3' borderRadius='2xl' maxW='xs'>
                <Text >{item.message}</Text>
                <Text fontSize='2xs'>{moment(item?.createdAt?.seconds * 1000).fromNow()}</Text>
            </Box>
        )
    }


    return (
        <Stack>
            <Stack>

                <BackButtons />
                <Stack>

                    {chatData?.length > 0 && (
                        <Stack>
                            {chatData?.map((x, index) => {
                                return (
                                    <Stack key={index}>
                                        {renderItemMessage(x)}

                                    </Stack>
                                )
                            })}
                        </Stack>
                    )}
                </Stack>

                <Stack shadow={3}>
                    <HStack p='2' alignItems={'center'} space={3} justifyContent={'space-evenly'}>
                        <Input placeholder='Text message here ..' type='text' bgColor={'white'} m='2' p={3} width={'full'}
                            value={chat}
                            onChange={handleChatChange}
                        />
                        <Button onClick={() => handleChat()}>
                            <Text>Kirim</Text>
                            {/* <Ionicons name="ios-send-sharp" size={25} color="black" /> */}
                        </Button>
                    </HStack>
                </Stack>

            </Stack>
        </Stack>
    )
}

export default ChatUserPage