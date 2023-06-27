import React, { useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  AiOutlineCloudUpload,
  AiOutlineComment,
  AiOutlineSave,
} from "react-icons/ai";
import {
  MdArrowForwardIos,
  MdArrowBackIos,
  MdOutlineAnalytics,
  MdOutlineCalendarToday,
  MdStarRate,
  MdLibraryAdd,
  MdOutlineDeleteForever,
  MdOutlineShare,
} from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/1.png";
// import logokotak from '../assets/kotakputih.png'
import { FiRss } from "react-icons/fi";
import { useContext } from "react";
import AuthContext from "../Routes/hooks/AuthContext";
import store from "store";
import { async } from "@firebase/util";
import { createRssFetch } from "../Api/FetchRss";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { db } from "../Config/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import moment from "moment";

// const FolderFeed = [
// 	{
// 		name: 'folder 1',
// 		id: 1,
// 		data_folder_feed: [
// 			"data 1", "data 2"
// 		]
// 	},
// 	{
// 		name: 'folder 2',
// 		id: 2,
// 		data_folder_feed: [
// 			"data 3", "data 4"
// 		]
// 	},
// ]

// const data = ['Jokowi', 'gayung', 'auk apa', 'loncat dari gedung lantai 5']

const AppSideBarFeedV2 = () => {
  const height = window.innerHeight;

  const sidebarBg = {
    light: "white",
    dark: "gray.800",
  };

  const sidebarColor = {
    light: "gray.900",
    dark: "white",
  };

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [urlFeed, setUrlFeed] = useState()

  let [searchParams, setSearchParams] = useSearchParams();

  const [titleFolder, setTitleFolder] = useState("");

  const [selectedFolder, setSelectedFolder] = useState("");
  const [newData, setNewData] = useState("");

  const [titleFile, setTitleFile] = useState("");
  const [apiFile, setApiFile] = useState("");

  const [folders, setFolders] = useState([]);

  const toast = useToast();

  const { currentUser, loadingShow, loadingClose } = useContext(AuthContext);

  const getDataFolderFeed = () => {
    try {
      onSnapshot(doc(db, "feed", currentUser.uid), (doc) => {
        setFolders(doc.data().folder_feed);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataFolderFeed();

    return () => {};
  }, [currentUser]);

  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.value);
  };

  // const handleDataChange = (event) => {
  // 	setNewData(event.target.value);
  // };

  const handleAddData = async () => {
    const newData = `title=${titleFile}&api=${apiFile}`;
    const folderIndex = folders.findIndex(
      (folder) => folder.name === selectedFolder
    );
    const newFolderData = [...folders[folderIndex].data_folder_feed, newData];
    const updatedFolder = {
      ...folders[folderIndex],
      data_folder_feed: newFolderData,
    };
    const newFolderFeed = [
      ...folders.slice(0, folderIndex),
      updatedFolder,
      ...folders.slice(folderIndex + 1),
    ];

    loadingShow();
    try {
      const ref = doc(db, "feed", currentUser.uid);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          folder_feed: newFolderFeed,
          createdAt: new Date(),
        },
        { merge: true }
      );
      loadingClose();
      setSelectedFolder("");
      setTitleFile("");
      setApiFile("");
      onClose();
      toast({
        title: "Deoapp.com",
        description: "success save folder",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      loadingClose();
    }
    loadingClose();
  };

  // const createRss = async () => {
  // 	try {
  // 		const response = await createRssFetch(urlFeed)
  // 		console.log(response)
  // 	} catch (error) {
  // 		console.log(error)

  // 	}
  // }

  const handleCreateFolder = async () => {
    loadingShow();
    let dataFolder = {
      name: titleFolder,
      id: `${titleFolder}-${moment(new Date()).valueOf()}`,
      data_folder_feed: [],
    };
    try {
      const ref = doc(db, "feed", currentUser.uid);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          folder_feed: arrayUnion(dataFolder),
          createdAt: new Date(),
        },
        { merge: true }
      );

      toast({
        title: "Deoapp.com",
        description: "success add new folder",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      loadingClose();
    } catch (error) {
      console.log(error, "ini error");
      loadingClose();
    }
    loadingClose();
  };

  const handleDeleteFolder = async (dataFolder) => {
    loadingShow();
    try {
      const ref = doc(db, "feed", currentUser.uid);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          folder_feed: arrayRemove(dataFolder),
          createdAt: new Date(),
        },
        { merge: true }
      );

      toast({
        title: "Deoapp.com",
        description: "success delete folder",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
      loadingClose();
    } catch (error) {
      console.log(error, "ini error");
      loadingClose();
    }
    loadingClose();
  };

  const handleDrop = async (e, folderId) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const fromFolderIndex = folders.findIndex((folder) =>
      folder.data_folder_feed.includes(data)
    );
    const toFolderIndex = folders.findIndex((folder) => folder.id === folderId);
    const fromFolder = folders[fromFolderIndex];
    const toFolder = folders[toFolderIndex];
    const newData = [...toFolder.data_folder_feed];
    const dataIndex = fromFolder.data_folder_feed.findIndex((d) => d === data);

    if (dataIndex !== -1) {
      newData.splice(toFolderIndex, 0, fromFolder.data_folder_feed[dataIndex]);
      fromFolder.data_folder_feed.splice(dataIndex, 1);
    }

    const newFolders = folders.map((folder) => {
      if (folder.id === fromFolder.id) {
        return { ...folder, data_folder_feed: fromFolder.data_folder_feed };
      }
      if (folder.id === toFolder.id) {
        return { ...folder, data_folder_feed: newData };
      }
      return folder;
    });

    setFolders(newFolders);
    console.log(`Data '${data}' dropped into folder '${toFolder.name}'`);
  };

  const handleSaveUpdate = async () => {
    loadingShow();
    try {
      const ref = doc(db, "feed", currentUser.uid);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          folder_feed: folders,
          createdAt: new Date(),
        },
        { merge: true }
      );
      loadingClose();
      toast({
        title: "Deoapp.com",
        description: "success save folder",
        status: "success",
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      loadingClose();
    }
    loadingClose();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, data) => {
    e.dataTransfer.setData("text", data);
  };

  return (
    <>
      <Stack
        bg={sidebarBg[colorMode]}
        color={sidebarColor[colorMode]}
        w={"200px"}
        py={5}
        px={3}
        transition="width .3s ease"
        shadow="sm"
        position="fixed"
        overflow="auto"
        borderRightRadius="xl"
        boxShadow="lg"
        h={height}
        spacing={5}
      >
        <Box>
          <HStack alignItems={"center"} justifyContent="center">
            <HStack>
              {/* <Icon as={MdStarRate} /> */}
              <Text fontWeight={"bold"} fontSize="sm">
                My Feeds
              </Text>
            </HStack>

            <Spacer />

            <Button
              bgColor={"transparent"}
              size="sm"
              onClick={() => handleSaveUpdate()}
            >
              <AiOutlineSave size={"20px"} />
            </Button>
          </HStack>
        </Box>

        {/* <Box>

					<HStack>
						<Icon as={MdStarRate} />
						<Heading fontSize='sm'>Favorites</Heading>
					</HStack>

				</Box> */}

        <Stack
          alignItems={"center"}
          justifyContent="space-between"
          h="90%"
          w="100%"
        >
          <Stack h={"90%"} overflowY="scroll">
            <Accordion allowMultiple>
              {folders?.map((folder, index) => (
                <AccordionItem key={index}>
                  <HStack>
                    <Text
                      as="span"
                      flex="1"
                      fontSize={"sm"}
                      textAlign="left"
                      cursor={"pointer"}
                      onClick={() => setSearchParams(`title=${folder.name}`)}
                    >
                      {folder.name}
                    </Text>
                    <h2>
                      <AccordionButton>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                  </HStack>

                  <AccordionPanel
                    onDrop={(e) => handleDrop(e, folder.id)}
                    onDragOver={handleDragOver}
                  >
                    <Stack w={"100%"}>
                      <HStack>
                        <Spacer />
                        <Icon as={MdOutlineShare} color="blue" />

                        <Icon
                          as={MdOutlineDeleteForever}
                          cursor="pointer"
                          onClick={() => handleDeleteFolder(folder)}
                          color="red"
                        />
                      </HStack>

                      {folder?.data_folder_feed?.map((data) => {
                        const dataString = data;
                        const dataArray = dataString.split("&");
                        const dataObj = {};

                        dataArray.forEach((data) => {
                          const [key, value] = data.split("=");
                          dataObj[key] = value;
                        });

                        const { title, api } = dataObj;

                        return (
                          <HStack
                            key={data}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, data)}
                            m={1}
                            padding={2}
                            background="gray.100"
                            borderRadius={"md"}
                            shadow="md"
                            overflow={"hidden"}
                            w="150px"
                            alignItems={"center"}
                            justifyContent="center"
                            cursor={"pointer"}
                            onClick={() =>
                              setSearchParams(`title=${title}&detail=${api}`)
                            }
                          >
                            <Text noOfLines={1} fontSize="xs">
                              {title}
                            </Text>
                            <Spacer />
                            <ChevronRightIcon />
                          </HStack>
                        );
                      })}
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>

          <Spacer />

          <Center mt="2">
            <Button onClick={onOpen} colorScheme="twitter" size={"sm"}>
              <Text fontSize={"xs"}>+ New Folder</Text>
            </Button>
          </Center>
        </Stack>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Feeds</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>Folder</Tab>
                <Tab>URL</Tab>
                <Tab>Topic</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack
                    spacing={3}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Input
                      type="text"
                      placeholder="What would you like to name your folder?"
                      size={"sm"}
                      onChange={(e) => setTitleFolder(e.target.value)}
                    />
                    <Button
                      mt="1"
                      colorScheme={"twitter"}
                      w="full"
                      onClick={() => handleCreateFolder()}
                      size="sm"
                    >
                      Add Folder
                    </Button>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    <Select
                      placeholder="Select Folder"
                      size={"sm"}
                      value={selectedFolder}
                      onChange={handleFolderChange}
                    >
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.name}>
                          {folder.name}
                        </option>
                      ))}
                    </Select>
                    <Input
                      placeholder="Title your feed"
                      size={"sm"}
                      value={titleFile}
                      onChange={(e) => setTitleFile(e.target.value)}
                    />
                    <Input
                      placeholder="Api your new feed"
                      size={"sm"}
                      value={apiFile}
                      onChange={(e) => setApiFile(e.target.value)}
                    />
                    <Button
                      onClick={() => handleAddData()}
                      size="sm"
                      colorScheme={"twitter"}
                    >
                      Add Data
                    </Button>
                  </Stack>
                  {/* <Input type='text' placeholder='URL here' onChange={(e) => setUrlFeed(e.target.value)} />
									<Button mt='1' width='full' onClick={() => createRss()}>Get Feed</Button> */}
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppSideBarFeedV2;
