import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  MdOutlineFilterList,
  MdSettings,
  MdSupportAgent,
} from "react-icons/md";
import { db } from "../../Config/firebase";
import useUserStore from "../../Hooks/Zustand/Store";
import parse from "html-react-parser";
import {
  getSingleDocumentFirebase,
  setDocumentFirebase,
} from "../../Api/firebaseApi";

function ChatPage() {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState([]);
  const [dataChat, setDataChat] = useState("");
  const [inputChat, setInputChat] = useState("");
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    id: "",
  });

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
        const queryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatList(queryData);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDataUser = async (id, name) => {
    if (name !== "visitor") {
      try {
        const result = await getSingleDocumentFirebase("users", id);

        setDataUser((prev) => ({
          ...prev,
          name: result.name || "",
          email: result.email || "",
          phoneNumber: result.phone || "",
          id: id || "",
        }));
      } catch (error) {
        console.log(error);
      }
    } else {
      setDataUser((prev) => ({
        ...prev,
        name: name || "",
        email: name || "",
        phoneNumber: "",
        id: id || "",
      }));
    }
  };

  const getChatConversation = async (id) => {
    setDataChat(id);

    const collectionNameFront = "messages";
    const docName = id;
    const data = {
      adminNotification: 0,
    };

    try {
      //updateDataMessage
      const result = await setDocumentFirebase(
        collectionNameFront,
        docName,
        data
      );

      const unsub = onSnapshot(doc(db, "messages", id), (doc) => {
        getDataUser(doc?.data()?.uids[0], doc.data()?.name[0]);
      });

      const q = query(
        collection(db, `messages/${id}/conversation`),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      onSnapshot(q, (querySnapshot) => {
        const queryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChat(queryData);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEnter = async () => {
    const addData = { message: inputChat, createdAt: new Date(), uid: "Admin" };

    try {
      const docRef = await addDoc(
        collection(db, `messages/${dataChat}/conversation`),
        addData
      );
      if (docRef) {
        const refUser = doc(db, "messages", dataChat);
        await updateDoc(refUser, {
          lastChat: inputChat,
          lastConversation: new Date(),
          userNotification: increment(1),
        });
      }

      setInputChat("");
    } catch (error) {
      console.log(error);
    } finally {
      setInputChat("");
    }
  };

  useEffect(() => {
    getChatList();
    return () => {
      setChat([]);
    };
  }, [globalState.currentProject]);

  return (
    <Stack>
      <Stack spacing={5}>
        <Heading size={"md"}>Chat</Heading>

        <Stack borderRadius="md" shadow={"md"} bgColor="white">
          <Box>
            <Grid templateColumns={{ base: "1fr", md: "1fr 2fr 1fr" }}>
              <Box borderRightRadius={"md"} shadow="md">
                <Stack bgColor={"blue.700"} p={2} spacing={3}>
                  <HStack>
                    <Spacer />

                    <Icon as={MdOutlineFilterList} />
                    <Icon as={MdSupportAgent} />
                    <Icon as={MdSettings} />
                  </HStack>

                  <HStack mx={2}>
                    <Input
                      size={"sm"}
                      borderRadius="md"
                      type="text"
                      placeholder="search.."
                      bgColor={"white"}
                    />
                  </HStack>

                  <SimpleGrid
                    mx={2}
                    columns="3"
                    fontSize={"sm"}
                    gap={2}
                    textAlign="center"
                    width="full"
                  >
                    <Text cursor={"pointer"} color="white" fontWeight={500}>
                      All
                    </Text>
                    <Text cursor={"pointer"} color="white" fontWeight={500}>
                      Read
                    </Text>
                    <Text cursor={"pointer"} color="white" fontWeight={500}>
                      Unread
                    </Text>
                  </SimpleGrid>
                </Stack>

                <Box overflowY="auto" h={"75vh"}>
                  {chatList ? (
                    chatList.map((x, i) => (
                      <Box key={i} cursor="pointer">
                        <HStack
                          p={2}
                          onClick={() => getChatConversation(x.id)}
                          cursor="pointer"
                          spacing={3}
                          alignItems="center"
                          justifyContent={"center"}
                        >
                          <Box pos={"relative"} p={1}>
                            {!x.adminNotification ||
                            x.adminNotification === 0 ? null : (
                              <Box
                                right={-1}
                                top={-1}
                                pos={"absolute"}
                                fontSize={"9"}
                                bg={"red"}
                                w={"20px"}
                                h={"20px"}
                                align={"center"}
                                alignSelf={"center"}
                                p={1}
                                borderRadius={"full"}
                                color={"white"}
                                zIndex={999}
                              >
                                {x.adminNotification}
                              </Box>
                            )}

                            <Avatar size="sm">
                              <AvatarBadge boxSize="1.25em" bg="green.500" />
                            </Avatar>
                          </Box>
                          <Box>
                            <Text
                              fontSize={"sm"}
                              textTransform="capitalize"
                              fontWeight={500}
                            >
                              {x?.name[0]}-{x?.name[1]}
                            </Text>
                            <Text fontSize={"xs"} color="gray.600">
                              {x.lastChat}
                            </Text>
                          </Box>
                          <Spacer />
                          <Box>
                            <Text
                              textAlign={"end"}
                              fontSize="2xs"
                              fontWeight={"bold"}
                              textTransform="uppercase"
                            >
                              {x.module}
                            </Text>
                            <Text fontSize="2xs" textAlign="end">
                              {moment(x.lastConversation.seconds * 1000).format(
                                "ddd"
                              )}{" "}
                              {moment(x.lastConversation.seconds * 1000).format(
                                "HH:mm"
                              )}
                            </Text>
                            <Text fontSize="3xs" textAlign="end">
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

              <Box>
                <Stack
                  h={"80vh"}
                  overflowY="scroll"
                  width={"100%"}
                  spacing={2}
                  p={5}
                  direction="column-reverse"
                >
                  {chat.length > 0 ? (
                    chat.map((x, index) => {
                      const mediaData = x?.media;

                      return (
                        <Stack
                          alignItems={
                            x.uid === "Admin" ? "flex-end" : "flex-start"
                          }
                          justifyContent="center"
                          key={index}
                        >
                          <Box py={2} px={4} boxShadow="base">
                            <VStack spacing={2}>
                              {mediaData && (
                                <Stack fontSize={"2xs"}>
                                  {parse(mediaData, {
                                    replace: (domNode) => {
                                      if (domNode.type === "text") {
                                        const textWithLinksReplaced =
                                          domNode.data.replace(
                                            /(\b(?:https?:\/\/|www\.)[^\s]+)/g,
                                            (match) => {
                                              const url = match.startsWith(
                                                "http"
                                              )
                                                ? match
                                                : `https://${match}`;
                                              return `<a href="${url}" target="_blank">${match}</a>`;
                                            }
                                          );
                                        return parse(textWithLinksReplaced);
                                      }
                                    },
                                  })}
                                </Stack>
                              )}

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
                          </Box>
                        </Stack>
                      );
                    })
                  ) : (
                    <Stack
                      alignItems={"center"}
                      justifyContent="center"
                      h={"full"}
                    >
                      <Heading fontSize={20}>Waiting Message</Heading>
                      <Text fontSize={15} color="gray.500" fontWeight={500}>
                        Click one of the user displayed in left side to start a
                        chat
                      </Text>
                    </Stack>
                  )}
                </Stack>
                <Spacer />
                <Box w={"full"} shadow={"md"}>
                  <HStack
                    width="full"
                    borderRadius="md"
                    p={4}
                    bgColor={"blue.700"}
                  >
                    <Input
                      type="text"
                      bgColor={"white"}
                      width="full"
                      size={"sm"}
                      placeholder="text..."
                      pos={"relative"}
                      value={inputChat}
                      onChange={(e) => setInputChat(e.target.value)}
                      onKeyDown={(event) => {
                        event.key === "Enter" ? handleEnter() : <></>;
                      }}
                    />
                    <Button size={"sm"} onClick={handleEnter}>
                      Send
                    </Button>
                  </HStack>
                </Box>
              </Box>

              {chat.length > 0 ? (
                <Box
                  flex="1"
                  maxW="md"
                  overflowY="auto"
                  pos={"relative"}
                  shadow="md"
                  borderLeftRadius={"md"}
                >
                  <Stack
                    bgColor={"blue.700"}
                    shadow="md"
                    p={5}
                    borderRadius="md"
                    spacing={4}
                  >
                    <Stack gap={3} align={"center"} spacing={"none"}>
                      <Avatar size="sm">
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </Avatar>
                    </Stack>
                    <Stack color={"white"} fontSize={"sm"} spacing={1}>
                      <HStack>
                        <Text color={"gray.300"}>ID:</Text>
                        <Spacer />
                        <Text fontWeight={500} noOfLines={1}>
                          {dataUser?.id}
                        </Text>
                      </HStack>

                      <HStack>
                        <Text color={"gray.300"}>Name:</Text>
                        <Spacer />
                        <Text
                          fontWeight={500}
                          noOfLines={1}
                          textTransform="capitalize"
                        >
                          {dataUser?.name}
                        </Text>
                      </HStack>

                      <HStack>
                        <Text color={"gray.300"}>Phone:</Text>
                        <Spacer />
                        <Text fontWeight={500} noOfLines={1}>
                          {dataUser?.phoneNumber}
                        </Text>
                      </HStack>

                      <HStack>
                        <Text color={"gray.300"}>Email:</Text>
                        <Spacer />
                        <Text fontWeight={500} noOfLines={1}>
                          {dataUser?.email}
                        </Text>
                      </HStack>
                    </Stack>
                  </Stack>
                </Box>
              ) : (
                <></>
              )}
            </Grid>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default ChatPage;
