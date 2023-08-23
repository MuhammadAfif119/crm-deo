import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FieldValue,
  collection,
  increment,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  addDocumentFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
} from "../../Api/firebaseApi";
import { db } from "../../Config/firebase";
import useUserStore from "../../Hooks/Zustand/Store";
import parse from "html-react-parser";
import DropboxUploader from "../DropBox/DropboxUploader";
import { MdOutlinePermMedia } from "react-icons/md";
import { decryptToken } from "../../Utils/encrypToken";

function MessageUser({ id, companyId, companyName, notif }) {
  const param = useParams();

  const globalState = useUserStore();

  const [userNotif, setUserNotif] = useState();
  const [userChat, setUserChat] = useState();

  const [isModalOpen, setModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [value, setValue] = useState("");

  const [accessTokenDb, setAccessTokenDb] = useState("");

  // const location = useLocation()
  // console.log(location.state, 'xxx')

  const [chat, setChat] = useState("");
  const [chatData, setChatData] = useState("");

  const handleShareLinkChange = (x) => {
    if (x !== "") {
      setShareLink({ link: x.link, type: x.type });
      const { link, type } = x;
      let htmlContent = "";

      if (type === "image") {
        htmlContent = `<p><img src="${link}" alt="Image" width="500px" /></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p>`;
      } else if (type === "audio") {
        htmlContent = `<p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src=${link}></iframe></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p>`;
      } else if (type === "video") {
        htmlContent = `<p><iframe class="ql-audio" frameborder="0" allowfullscreen="true" src=${link}></iframe></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p>`;
      } else {
        htmlContent = `<p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p><br/> `;
      }

      setValue((prevContent) => prevContent + ` ${htmlContent}`);
    }
  };


  const handleChatChange = (e) => {
    setChat(e.target.value);
  };

  const getDataChat = () => {
    try {
      const docsData = query(
        collection(db, `messages/${id}/conversation`),
        orderBy("createdAt", "asc")
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

  const getAccessToken = async () => {
    try {
      const result = await getSingleDocumentFirebase("token", "dropbox");
      const resultData = decryptToken(result?.access_token);
      setAccessTokenDb(resultData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataChat();
    getAccessToken();

    return () => {
      setChatData([]);
      setValue("");
    };
  }, [id]);


  const handleChat = async () => {
    const collectionName = `messages/${id}/conversation`;
    const data = {
      message: chat,
      createdAt: new Date(),
      uid: globalState.uid,
      media: value,
    };

    try {
      const docID = await addDocumentFirebase(collectionName, data, companyId);
      console.log("ID Dokumen Baru:", docID);
      if (docID) {
        const collectionNameFront = "messages";
        const docName = id;
        const data = {
          lastConversation: new Date(),
          lastChat: chat,
          adminNotification: increment(1),
          userNotification: 0,
        };

        try {
          const result = await setDocumentFirebase(
            collectionNameFront,
            docName,
            data
          );
          setValue("");
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        }
      }

      //   console.log(result);

      // setUserNotif(0);
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      setValue("");
    }

    setValue("");
  };

  const renderItemMessage = (item) => {
    const mediaData = item?.media;

    if (item.uid === globalState.uid)
      return (
        <HStack>
          <Spacer />
          <Box
            shadow={3}
            alignSelf={"flex-end"}
            bgColor="green.400"
            m="1"
            p="3"
            borderRadius="2xl"
            maxW="xs"
          >
            {mediaData && (
              <Stack fontSize={"2xs"}>
                {parse(mediaData, {
                  replace: (domNode) => {
                    if (domNode.type === "text") {
                      const textWithLinksReplaced = domNode.data.replace(
                        /(\b(?:https?:\/\/|www\.)[^\s]+)/g,
                        (match) => {
                          const url = match.startsWith("http")
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
            <Text textAlign="right" fontSize={"sm"}>
              {item.message}
            </Text>
            <Text fontSize="2xs">
              {moment(item?.createdAt?.seconds * 1000).fromNow()}
            </Text>
          </Box>
        </HStack>
      );
    if (item.uid !== globalState.uid)
      return (
        <Box
          shadow={3}
          alignSelf={"flex-start"}
          bgColor="yellow.400"
          m="1"
          p="3"
          borderRadius="2xl"
          maxW="xs"
        >
          {mediaData && (
            <Stack fontSize={"2xs"}>
              {parse(mediaData, {
                replace: (domNode) => {
                  if (domNode.type === "text") {
                    const textWithLinksReplaced = domNode.data.replace(
                      /(\b(?:https?:\/\/|www\.)[^\s]+)/g,
                      (match) => {
                        const url = match.startsWith("http")
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
          <Text fontSize={"sm"}>{item.message}</Text>
          <Text fontSize="2xs">
            {moment(item?.createdAt?.seconds * 1000).fromNow()}
          </Text>
        </Box>
      );
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter") {
      handleChat();
    }
  };

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <Stack>
      <Stack>
        <Stack p={3} bgColor="white">
          <HStack spacing={3}>
            <Avatar size="sm">
              <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar>
            <Text textTransform={"capitalize"} fontWeight={500}>
              Admin
            </Text>
            <Spacer />
            {notif === 0 ? null : (
              <Text color={"red.400"} fontWeight={500} fontSize={"sm"}>
                {notif} New Notification
              </Text>
            )}
          </HStack>
        </Stack>

        <Stack
          h={"400px"}
          px={3}
          overflowY="scroll"
          direction={"column-reverse"}
        >
          {chatData?.length > 0 && (
            <Stack>
              {chatData?.map((x, index) => {
                return <Stack key={index}>{renderItemMessage(x)}</Stack>;
              })}
            </Stack>
          )}
        </Stack>
        {value !== "" && (
          <Stack
            bgColor={"blackAlpha.700"}
            overflowY={"scroll"}
            alignItems="center"
            justifyContent={"center"}
            h="full"
            position="absolute"
            p={10}
          >
            <Stack fontSize="2xs">
              {parse(value, {
                replace: (domNode) => {
                  if (domNode.type === "text") {
                    const textWithLinksReplaced = domNode.data.replace(
                      /(\b(?:https?:\/\/|www\.)[^\s]+)/g,
                      (match) => {
                        const url = match.startsWith("http")
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
          </Stack>
        )}
        <Stack shadow={3}>
          <HStack
            p="2"
            alignItems={"center"}
            space={3}
            justifyContent={"space-evenly"}
          >
            <Button onClick={openModal} colorScheme={"blue"} variant="outline">
              <MdOutlinePermMedia />
            </Button>

            <Input
              placeholder="Text message here .."
              type="text"
              bgColor={"white"}
              width={"full"}
              defaultValue={chat}
              onChange={handleChatChange}
              onKeyDown={handleChatKeyDown}
            />
            <Button onClick={() => handleChat()}>
              <Text>Send</Text>
            </Button>
          </HStack>
        </Stack>
      </Stack>

      <DropboxUploader
        accessTokenDb={accessTokenDb}
        isActive={isModalOpen}
        onClose={closeModal}
        parentPath={`/${companyName}/chat`}
        shareLink={shareLink}
        setShareLink={handleShareLinkChange}
      />
    </Stack>
  );
}

export default MessageUser;
