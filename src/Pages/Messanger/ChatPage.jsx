import { Avatar, Badge, Box, Button, Divider, Flex, Heading, HStack, Icon, Image, Input, SimpleGrid, Spacer, Spinner, Stack, Tag, Text, VStack } from '@chakra-ui/react'
import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { MdOutlineFilterList, MdSettings, MdSupportAgent } from 'react-icons/md';
import { db } from '../../Config/firebase';
import useUserStore from '../../Hooks/Zustand/Store';

function ChatPage() {

    const [chatList, setChatList] = useState();
    const [chat, setChat] = useState();
    const [dataChat, setDataChat] = useState("");
    const [inputChat, setInputChat] = useState("");
    const [productChat, setProductChat] = useState("");
    const [idUser, setIdUser] = useState("");
    const [dataUser, setDataUser] = useState({});
    const [wishListProducts, setWishlistProducts] = useState([]);
    const [cartsProducts, setCartProducts] = useState([]);

    const globalState = useUserStore();




    const getChatList = async () => {
        try {
            const q = query(
                collection(db, "messages"),
                where("uids", "array-contains", "admin"),
                where("companyId", "==", globalState.currentCompany),
                where("projectId", "==", globalState.currentProject),
                orderBy("lastConversation", "desc"),
                limit(25)
            );
            onSnapshot(q, (querySnapshot) => {
                const queryData = [];

                querySnapshot.forEach((doc) => {
                    let forData = doc.data();
                    forData.id = doc.id;
                    queryData.push(forData);
                });
                setChatList(queryData);
            });
        } catch (error) {
            console.log(error.message);
        }
    };


    const getChatConversation = async (id) => {
        console.log(id, 'ini id')
        setDataChat(id);
        try {
            const unsub = onSnapshot(doc(db, "messages", id), (doc) => {
                setIdUser(doc.data().uids[0]);
                console.log(doc.data().uids[0], 'data user');
            });

            const q = query(
                collection(db, `messages/${id}/conversation`),
                // where("uids","array-contains","admin"),
                orderBy("createdAt", "asc"),
                limit(25)
            );

            onSnapshot(q, (querySnapshot) => {
                const queryData = [];

                querySnapshot.forEach((doc) => {
                    let forData = doc.data();
                    forData.id = doc.id;
                    queryData.push(forData);
                });

                setChat(queryData);
                console.log(queryData, 'ini query');
            });
        } catch (error) {
            console.log(error.message);
        }
    };



    const handleEnter = async () => {
        const title = "You have a new message";
        console.log(idUser, "user");

        const addData = { message: inputChat, createdAt: new Date(), uid: "Admin" };

        try {
            // set chat
            const docRef = await addDoc(
                collection(db, `messages/${dataChat}/conversation`),
                addData
            );
            if (docRef) {
                // set front chat
                const refUser = doc(db, "messages", dataChat);
                await updateDoc(refUser, {
                    last_chat: inputChat,
                    lastConversation: new Date(),
                });


            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getChatList();

        return () => {
            setChat();
        };
    }, [globalState.currentProject]);


    return (
        <Stack p={1}>
            <Stack  spacing={5}>
                <Heading size={'md'}>Chat</Heading>

                <Stack borderRadius='md' shadow={'md'} bgColor='white'>
                    <Box >

                        <Flex h="80vh">
                            <Box
                                borderRightWidth="1px"
                                width={"28%"}
                                display={{ base: "none", md: "initial" }}
                                pos={"relative"}
                            >
                                <Box
                                    bgColor={"#ffd600"}
                                    borderColor={"white"}
                                    boxShadow={"sm"}
                                    pos={"relative"}
                                >
                                    <HStack>
                                        <Spacer />

                                        <Icon as={MdOutlineFilterList} />
                                        <Icon as={MdSupportAgent} />
                                        <Icon as={MdSettings} />
                                    </HStack>

                                    <HStack m="1">
                                        <Input type="text" bgColor={"white"} />
                                        <Button placeholder="Search Chat">Search</Button>
                                    </HStack>

                                    <SimpleGrid columns="3" textAlign="center" width="full" m="1">
                                        <Text bgColor={"#EAC401"}>All</Text>
                                        <Text>Read</Text>
                                        <Text>
                                            Unread{" "}
                                            <Badge bgColor="red" color="white">
                                                93
                                            </Badge>
                                        </Text>
                                    </SimpleGrid>
                                    {/* <Divider />? */}
                                </Box>

                                <Box overflowY="auto" h={"68vh"}>
                                    {chatList ? (
                                        chatList.map((x, i) => (
                                            <Box>
                                                <HStack
                                                    key={x.id}
                                                    m="1"
                                                    p="1"
                                                    onClick={() => getChatConversation(x.id)}
                                                    cursor="pointer"
                                                >
                                                    <Avatar />
                                                    <Box>
                                                        <Text fontSize={"md"}>
                                                            {x?.name[0]}-{x?.name[1]}
                                                        </Text>
                                                        <Text fontSize={"sm"}>{x.last_chat}</Text>
                                                    </Box>
                                                    <Spacer />
                                                    <Box>
                                                        <Text fontSize="2xs" textAlign="end">
                                                            {moment(x.lastConversation.seconds * 1000).format(
                                                                "ddd"
                                                            )}{" "}
                                                            {moment(x.lastConversation.seconds * 1000).format(
                                                                "HH:mm"
                                                            )}
                                                        </Text>
                                                        <Text fontSize="2xs" textAlign="end">
                                                            {moment(x.lastConversation.seconds * 1000).format(
                                                                "DD/MM/yy"
                                                            )}{" "}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                                <Divider key={i} />
                                            </Box>
                                        ))
                                    ) : (
                                        <>
                                            <Spinner />
                                        </>
                                    )}
                                </Box>
                            </Box>

                            <Box width={"45%"}>
                                <Stack
                                    h={"71.5vh"}
                                    overflowY="scroll"
                                    width={"100%"}
                                    spacing={2}
                                    p={5}
                                    pos={"relative"}
                                >
                                    {chat ? (
                                        chat.map((x) => {
                                            return (
                                                <Stack
                                                    alignItems={x.uid === "Admin" ? "flex-end" : "flex-start"}
                                                    justifyContent="center"
                                                >
                                                    <Tag py={2} px={4} maxW={"40%"} boxShadow="base">
                                                        <VStack spacing={2}>
                                                            <Text fontSize={"md"} alignSelf={"flex-start"}>
                                                                {x.message}
                                                            </Text>
                                                            <Text
                                                                alignSelf={"flex-end"}
                                                                color={"gray.500"}
                                                                fontSize="xs"
                                                            >
                                                                {moment(x?.createdAt?.seconds * 1000).format(
                                                                    "DD/MM/YY HH:mm"
                                                                )}
                                                            </Text>
                                                        </VStack>
                                                    </Tag>
                                                </Stack>
                                            );
                                        })
                                    ) : (
                                        <VStack>
                                            <Image w={"20em"} src={'www.google.com'} />
                                            <Heading fontSize={20}>Waiting Message</Heading>
                                            <Text fontSize={15}>
                                                Click one of the user displayed in left side to start a chat
                                            </Text>
                                        </VStack>
                                    )}
                                </Stack>
                                <Box w={"full"}>
                                    <HStack width="full" p={3} bgColor={"#ffd600"}>
                                        <Input
                                            type="text"
                                            bgColor={"white"}
                                            width="full"
                                            pos={"relative"}
                                            onChange={(e) => setInputChat(e.target.value)}
                                            onKeyDown={(event) => {
                                                event.key === "Enter" ? handleEnter() : <></>;
                                            }}
                                        />
                                        <Button>Enter</Button>
                                    </HStack>
                                </Box>
                            </Box>
                            {chat ? (
                                <Box
                                    flex="1"
                                    maxW="md"
                                    overflowY="auto"
                                    width={"27%"}
                                    pos={"relative"}
                                >
                                    <Box bgColor="gray.50" p="3" borderRadius="md" m="1">
                                        <Stack gap={3} align={"center"} spacing={"none"}>
                                            <Avatar size={"sm"} />
                                            <Heading fontSize="lg"></Heading>
                                            <Text mt={-1}>
                                                {/* {"("} {dataUser?.role} {")"} */}
                                            </Text>
                                        </Stack>
                                        {/* <Text fontSize={14}>Assign to</Text> */}
                                        <Stack columns="2" fontSize={14} align="center">
                                            <Text>Telp :</Text>
                                            <Text>Email : </Text>
                                            <Text>ID User : </Text>
                                        </Stack>
                                    </Box>w

                                </Box>
                            ) : (
                                <></>
                            )}
                        </Flex>
                    </Box>
                </Stack>

            </Stack>


        </Stack>
    )
}

export default ChatPage