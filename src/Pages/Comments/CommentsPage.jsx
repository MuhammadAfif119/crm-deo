import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import store from "store";

import {
  FaFacebook,
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import moment from "moment";
import { AiOutlineComment } from "react-icons/ai";
import { TbPresentationAnalytics } from "react-icons/tb";
import { BiFilterAlt } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import ApiBackend from "../../Api/ApiBackend";

import useUserStore from "../../Hooks/Zustand/Store";

function CommentsPage() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const navigate = useNavigate();

  const toast = useToast();

  const [lastRecords, setLastRecord] = useState(0);
  const [lastDays, setLastDays] = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [comment, setComment] = useState("");
  const [displayComment, setDisplayComment] = useState();
  const [commentActive, setCommentActive] = useState("");
  const [postActive, setPostActive] = useState("");
  const [commentDetailList, setCommentDetailList] = useState([]);
  const [socialMediaKeysArr, setSocialMediaKeysArr] = useState([]);

  const [analyticsDetailList, setAnalyticsDetailList] = useState([]);

  const [loadingComment, setLoadingComment] = useState(false);

  const { loadingShow, loadingClose } = useContext(AuthContext);

  const [barStatus, setBarStatus] = useState(false);

  const contentWidth = barStatus ? "85%" : "95%";

  const { userDisplay } = useUserStore();

  const profileKey = userDisplay.profileKey;

  const cancelRef = React.useRef();

  const today = new Date().toISOString().substr(0, 10);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
  };

  const getHistory = async () => {
    if (profileKey) {
      if (startDate && endDate) {
        try {
          loadingShow();
          const res = await ApiBackend.post("history", {
            lastRecords: lastRecords,
            lastDays: lastDays,
            profileKey,
          });

          const filtered = res.data.filter((item) => {
            const dateLocal = moment(item.created).toLocaleString();
            const dateFormat = moment(dateLocal).format("YYYY-MM-DD");
            return (
              moment(dateFormat).isSameOrAfter(startDate, "day") &&
              moment(dateFormat).isSameOrBefore(endDate, "day")
            );
          });
          setHistoryList(filtered);
          loadingClose();
        } catch (error) {
          console.log(error, "ini error");
          loadingClose();
        }
      } else {
        try {
          loadingShow();
          const res = await ApiBackend.post("history", {
            lastRecords: lastRecords,
            lastDays: lastDays,
            profileKey,
          });
          if (res.data.status === "error") {
            toast({
              title: "Deoapp.com",
              description: res.data.message,
              status: "error",
              position: "top-right",
              isClosable: true,
            });
          }
          setHistoryList(res.data);
          loadingClose();
        } catch (error) {
          console.log(error, "ini error");
          loadingClose();
        }
      }
    }
    loadingClose();
  };

  const handleDeleteModal = (idPost) => {
    setDeleteModal(true);
    setPostActive(idPost);
  };

  const handleDelete = async () => {
    if (profileKey) {
      try {
        const res = await ApiBackend.post("delete", {
          id: postActive.id,
          profileKey,
        });
        if (res.status === 200) {
          toast({
            title: "Deoapp.com",
            description: "Success delete this post",
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          setDeleteModal(false);
          setPostActive("");
          getHistory();
        }
      } catch (error) {
        console.log(error, "ini error");
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: "You must set billing pricing",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleComment = async (idPost) => {
    console.log(idPost);
    if (profileKey) {
      setCommentModal(true);
      setCommentActive(idPost);
      setLoadingComment(true);
      try {
        const res = await ApiBackend.post("getcomment", {
          id: idPost.id,
          profileKey,
        });
        const obj = res.data;
        console.log(obj);
        const {
          id,
          status,
          tiktok,
          lastUpdated,
          nextUpdate,
          code,
          ...socialMedia
        } = obj; // memfilter properti id dan status dari objek
        if (status === "success") {
          console.log(socialMedia, "1");
          const socialMediaKeys = Object.keys(socialMedia); // mengambil array kunci properti objek socialMedia
          setSocialMediaKeysArr(socialMediaKeys);
          setDisplayComment([socialMedia]);
          console.log(socialMediaKeysArr);
          if (socialMediaKeys !== null) {
            setCommentDetailList(socialMedia);
            console.log(commentDetailList);
          }
          console.log(socialMediaKeys, "2");
        } else {
          toast({
            title: "Deoapp.com",
            description: socialMedia.message,
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        }
        setLoadingComment(false);
      } catch (error) {
        console.log(error, "ini error");
        setLoadingComment(false);
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: "You must set billing pricing",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }

    setLoadingComment(false);
  };

  const PlatformArr = [
    {
      name: "youtube",
      icon: <FaYoutube />,
    },
    {
      name: "twitter",
      icon: <FaTwitter />,
    },
    {
      name: "facebook",
      icon: <FaFacebook />,
    },
    {
      name: "instagram",
      icon: <FaInstagram />,
    },
    {
      name: "tiktok",
      icon: <FaTiktok />,
    },
    {
      name: "linkedin",
      icon: <FaLinkedin />,
    },
    {
      name: "google",
      icon: <FaGoogle />,
    },
    {
      name: "pinterest",
      icon: <FaPinterest />,
    },
  ];

  const handlePostComment = async () => {
    if (profileKey) {
      try {
        const res = await ApiBackend.post("postcomment", {
          id: commentActive?.id,
          platforms: commentActive?.postIds?.map((x) => x.platform),
          comment: comment,
          profileKey,
        });
        if (res.status === 200) {
          toast({
            title: "Deoapp.com",
            description: "Success comment.",
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          setCommentActive("");
          setComment("");
          setCommentModal(false);
        }
      } catch (error) {
        console.log(error, "ini error");
        toast({
          title: "Deoapp.com",
          description: error.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: "You must set billing pricing",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleAnalytics = async (idPost) => {
    if (profileKey) {
      setAnalyticsModal(true);

      try {
        const res = await ApiBackend.post("analyticspost", {
          id: idPost.id,
          platforms: idPost.platforms,
          profileKey,
        });
        const obj = res.data;
        console.log(obj, "xxx");
        const { id, status, ...analytics } = obj;
        setAnalyticsDetailList(analytics);
      } catch (error) {
        console.log(error, "ini error");
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: "You must set billing pricing",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getHistory();

    return () => {};
  }, [(startDate && endDate) || profileKey]);

  const handleErrorMessage = (message) => {
    toast({
      title: "Deoapp.com",
      description: message,
      status: "error",
    });
  };

  return (
    <>
      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        <Stack
          w={"100%"}
          transition={"0.2s ease-in-out"}
          minH={height}
          spacing={5}
          p={10}
        >
          <HStack>
            <SimpleGrid gap={2} columns={[1, null, 2]}>
              <Text fontSize={"xl"} fontWeight="bold" color={"gray.600"}>
                History post
              </Text>
              <Text fontSize={"md"} color="gray.500">
                ( {historyList.length} most recent )
              </Text>
            </SimpleGrid>
            <Spacer />

            <SimpleGrid alignItems="center" gap={2} columns={[1, 2, 3]}>
              <Box mr={2}>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={today}
                  size="sm"
                  fontSize={"sm"}
                  bgColor="white"
                  borderRadius={"lg"}
                  shadow="md"
                />
              </Box>
              <Box mr={2}>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={today}
                  size="sm"
                  fontSize={"sm"}
                  bgColor="white"
                  borderRadius={"lg"}
                  shadow="md"
                />
              </Box>
              <Button
                colorScheme={"blue"}
                fontSize="sm"
                size={"sm"}
                onClick={() => handleReset()}
              >
                <HStack spacing={2}>
                  <BiFilterAlt />
                  <Text>Reset</Text>
                </HStack>
              </Button>
            </SimpleGrid>
          </HStack>

          {historyList.length > 0 ? (
            <>
              {historyList.map((x, index) => {
                return (
                  <Stack
                    borderRadius="lg"
                    key={index}
                    shadow="md"
                    bgColor={"white"}
                    borderTopWidth={5}
                    borderColor="blue.500"
                    p={5}
                  >
                    <HStack>
                      <Stack spacing={5}>
                        <Stack>
                          <Text fontSize={"xs"}>
                            {moment(x.created).format("LLLL")}
                          </Text>
                        </Stack>
                        <Stack>
                          <Text fontSize={"xs"} color="gray.600">
                            {x.post}
                          </Text>
                        </Stack>
                        <Stack>
                          <HStack gap={2}>
                            {x.mediaUrls.length > 0 &&
                              x.mediaUrls.map((y, index) => {
                                return (
                                  <Stack key={index}>
                                    {y.endsWith(".mp4") ? (
                                      <video controls width="220" height="140">
                                        <source src={y} type="video/mp4" />
                                        Sorry, your browser doesn't support
                                        embedded videos.
                                      </video>
                                    ) : (
                                      <Image
                                        borderRadius={"lg"}
                                        w={"150px"}
                                        shadow={"md"}
                                        src={y}
                                        alt={y}
                                      />
                                    )}
                                  </Stack>
                                );
                              })}
                          </HStack>
                        </Stack>

                        <HStack spacing={5}>
                          <Stack
                            cursor={"pointer"}
                            onClick={() => handleComment(x)}
                          >
                            <AiOutlineComment size={20} />
                          </Stack>
                          <Stack
                            cursor={"pointer"}
                            onClick={() => handleAnalytics(x)}
                          >
                            <TbPresentationAnalytics size={20} />
                          </Stack>
                          <Stack
                            cursor={"pointer"}
                            onClick={() => handleDeleteModal(x)}
                          >
                            <BsTrash size={18} />
                          </Stack>
                        </HStack>
                      </Stack>

                      <Spacer />
                      <Stack
                        alignItems={"flex-end"}
                        spacing={3}
                        justifyContent="flex-end"
                      >
                        <Stack>
                          <Text color={"gray.500"} fontSize="sm">
                            {x.errors && x.postIds
                              ? "Response Active"
                              : "Response Inactive"}
                          </Text>
                        </Stack>

                        <HStack>
                          <HStack spacing={2}>
                            {x.postIds &&
                              x.postIds.map((z, index) => {
                                const filterSuccess = PlatformArr.filter((y) =>
                                  y.name.includes(z.platform)
                                );
                                const resIcon = filterSuccess[0]?.icon;

                                return (
                                  <a
                                    href={z.postUrl}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Stack
                                      color={"green"}
                                      key={z.id}
                                      cursor="pointer"
                                      onClick={() => console.log(z.postUrl)}
                                    >
                                      {resIcon}
                                    </Stack>
                                  </a>
                                );
                              })}
                          </HStack>

                          <HStack spacing={2}>
                            {x.errors &&
                              x.errors.map((z, index) => {
                                const filterError = PlatformArr.filter((y) =>
                                  y.name.includes(z.platform)
                                );
                                const resIcon = filterError[0]?.icon;

                                return (
                                  <Stack
                                    key={index}
                                    color="red"
                                    cursor="pointer"
                                    onClick={() =>
                                      handleErrorMessage(z.message)
                                    }
                                  >
                                    {resIcon}
                                  </Stack>
                                );
                              })}
                          </HStack>

                          {x.errors && x.postIds === undefined && (
                            <HStack spacing={2}>
                              {x.platforms &&
                                x.platforms.map((z, index) => {
                                  const filterError = PlatformArr.filter((y) =>
                                    y.name.includes(z)
                                  );
                                  const resIcon = filterError[0]?.icon;

                                  return (
                                    <Stack
                                      key={index}
                                      cursor="pointer"
                                      color={"gray"}
                                      onClick={() => console.log(z.message)}
                                    >
                                      {resIcon}
                                    </Stack>
                                  );
                                })}
                            </HStack>
                          )}
                        </HStack>
                      </Stack>
                    </HStack>
                  </Stack>
                );
              })}
            </>
          ) : (
            <Box>
              <Heading>No History</Heading>
              <Spinner />
            </Box>
          )}
        </Stack>
      </Flex>

      <AlertDialog
        isOpen={deleteModal}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteModal(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Posting
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure delete this posting? You can't undo this action
              afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteModal(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={commentModal} onClose={() => setCommentModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <AiOutlineComment size={20} />
              <Text fontSize={"md"}>Comments</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Stack spacing={3}>
                <Text fontSize={"sm"} color="gray.500">
                  Enter a new comments
                </Text>
                <Textarea
                  fontSize={"xs"}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="text your comment in here"
                />
                <Stack alignItems={"flex-end"} justifyContent="flex-end">
                  <Button
                    size={"sm"}
                    colorScheme="blue"
                    onClick={() => handlePostComment()}
                  >
                    <HStack spacing={2} alignItems="center">
                      <FiSend />
                      <Text fontSize={"sm"}>Comment</Text>
                    </HStack>
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={3}>
                <Text fontSize={"sm"} color="gray.500">
                  List Comments
                </Text>
              </Stack>
              <Stack p={3} spacing={3}>
                {loadingComment ? (
                  <Stack
                    alignItems={"center"}
                    justifyContent="center"
                    h={"200px"}
                  >
                    <Spinner size="sm" />
                  </Stack>
                ) : (
                  socialMediaKeysArr?.length > 0 &&
                  socialMediaKeysArr?.map((key) => (
                    <Stack>
                      {(displayComment.length > 0 || displayComment !== null) &&
                      displayComment[socialMediaKeysArr[0].length === 0] ? (
                        displayComment.map((data, index) => {
                          const filterError = PlatformArr?.filter((y) =>
                            y?.name?.includes(key && key)
                          );
                          const resIcon = filterError[0]?.icon;

                          console.log(displayComment);

                          // if (key === 'linkedin') {
                          return (
                            <>
                              {data[socialMediaKeysArr[0]]?.map(
                                (item, itemIndex) => (
                                  <HStack
                                    alignItems="flex-start"
                                    justifyContent={"flex-start"}
                                    key={itemIndex}
                                  >
                                    <a
                                      href={item?.from?.url}
                                      target={"_blank"}
                                      rel="noopener noreferrer"
                                    >
                                      <Avatar
                                        cursor={"pointer"}
                                        size="sm"
                                        src={item?.profileImageUrl}
                                        alt={item?.from?.name}
                                      >
                                        <AvatarBadge
                                          boxSize="1.7em"
                                          bg="green.500"
                                        >
                                          {resIcon && resIcon}
                                        </AvatarBadge>
                                      </Avatar>
                                    </a>
                                    <Stack
                                      alignItems={"flex-start"}
                                      justifyContent="center"
                                      shadow={"md"}
                                      bgColor={"blue.500"}
                                      maxW="60%"
                                      minH="50px"
                                      borderRadius={"lg"}
                                      p={3}
                                    >
                                      <Stack spacing={0} color="white">
                                        <Text
                                          fontSize={"xs"}
                                          fontWeight="bold"
                                          textTransform={"capitalize"}
                                        >
                                          {key === "linkedin"
                                            ? data?.from?.name
                                            : key === "instagram"
                                            ? `@${item?.username}`
                                            : ""}
                                        </Text>
                                        <Text fontSize={"xx-small"}>
                                          on{" "}
                                          {moment(item?.created).format("LLLL")}
                                        </Text>
                                      </Stack>
                                      <Stack color="white">
                                        <Text fontSize={"xs"}>
                                          {item?.comment}
                                        </Text>
                                      </Stack>
                                    </Stack>
                                  </HStack>
                                )
                              )}
                            </>
                          );
                          // }
                        })
                      ) : (
                        <Stack
                          alignItems={"center"}
                          justifyContent="center"
                          h={"200px"}
                        >
                          <Text fontSize={"xs"} color="gray.500">
                            No Comments
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  ))
                )}
              </Stack>
            </Stack>
          </ModalBody>

          <Divider />
          <ModalFooter>
            <Button
              colorScheme="blackAlpha"
              size="sm"
              mr={3}
              onClick={() => setCommentModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={analyticsModal} onClose={() => setAnalyticsModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <TbPresentationAnalytics size={20} />
              <Text fontSize={"md"}>Analytics</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Stack>
                {Object.entries(analyticsDetailList).map(([key, value]) => (
                  <Stack key={key}>
                    <Text
                      fontSize={"sm"}
                      fontWeight="bold"
                      textTransform={"capitalize"}
                    >
                      {key}
                    </Text>
                    <Divider />
                    <pre style={{ fontSize: "10px", width: "300px" }}>
                      {JSON.stringify(value.analytics, null, 2)}
                    </pre>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blackAlpha"
              mr={3}
              onClick={() => setAnalyticsModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentsPage;
