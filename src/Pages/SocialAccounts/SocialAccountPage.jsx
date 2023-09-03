import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  Text,
  Textarea,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MdOutlinePermMedia, MdSchedule } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import store from "store";
import { capitalize } from "../../Utils/capitalizeUtil";
import parse from "html-react-parser";

// import logodeo from "../assets/1.png";
import AppSideBar from "../../Components/AppSideBar";
import colors from "../../Utils/colors";
import axios from "axios";
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
import ApiBackend from "../../Api/ApiBackend";
import { TbPresentationAnalytics } from "react-icons/tb";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebase";
import useUserStore from "../../Hooks/Zustand/Store";
import {
  addDocumentFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
} from "../../Api/firebaseApi";
import { PlatformArr, platformArr } from "./PlatformArr";

function SocialAccountPage() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const globalState = useUserStore();

  const [isLoading, setIsLoading] = useState(false);

  const [barStatus, setBarStatus] = useState(false);

  const [socialAccountModal, setSocialAccountModal] = useState(false);
  const [titleAccount, setTitleAccount] = useState("");
  const [userData, setUserData] = useState("");
  const [socialAccountList, setSocialAccountList] = useState([]);
  const [socialMediaList, setSocialMediaList] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  console.log(globalState);

  const currentUser = globalState.uid;

  const profileKey = globalState.profileKey;

  const getListSocial = async () => {
    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: globalState?.uid,
      },
    ];

    try {
      // const res = await getCollectionFirebase("social_media", conditions);
      // console.log(res, "xx");

      const q = query(
        collection(db, "social_media"),
        where("projectId", "==", globalState.currentProject)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const socialArr = [];
        querySnapshot.forEach((doc) => {
          socialArr.push({ ...doc.data(), id: doc.id });
        });

        console.log(socialArr);
        setSocialAccountList(socialArr);
      });

      //get subcollection user inside project
      // const docRef = doc(
      //   db,
      //   "projects",
      //   globalState.currentProject,
      //   "users",
      //   globalState.uid
      // );
      // const docSnapshot = await getDoc(docRef);

      // if (docSnapshot.exists) {
      //   const docData = docSnapshot.data();
      //   console.log(docData);
      //   setSocialMediaList(docData.social_accounts);
      // } else {
      //   console.log("Dokumen tidak ditemukan!");
      // }

      // const usersConditions = [
      //   {
      //     field: "users",
      //     operator: "==",
      //     // value: globalState?.uid,
      //     value: "99tkBFd5y6yKKduP8amB",
      //   },
      // ];

      // const userSubcol = await getCollectionFirebase(
      //   `social_media/uKcwVmEpXA2hUxt0p2PN/users`
      // );
      // setSocialMediaList(userSubcol);
      // console.log(socialMediaList);
      // console.log(userSubcol, "ini subcol");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateAccount = async () => {
    //find role in company
    const conditions = [
      {
        field: "owners",
        operator: "array-contains",
        value: globalState?.uid,
      },
    ];

    const res = await getCollectionFirebase("companies", conditions);
    console.log(res);

    // if () {
    //   navigate(`/pricing/${currentUser.email}`);
    // }
    if (res?.length !== 0) {
      setSocialAccountModal(true);
    }
    if (res?.length === undefined) {
      toast({
        title: "Deoapp.com",
        description: "You must login",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
      // navigate(`/login`);
    }
  };

  const handleSubmitAccount = async () => {
    try {
      setIsLoading(true);
      const res = await ApiBackend.post("createprofile", {
        title: titleAccount,
      });
      if (res.status === 200) {
        console.log(res.data, "xxx");

        //add to socialMedia
        try {
          const docRef = await addDoc(collection(db, "social_media"), {
            ayrshare_account: res.data,
            companyId: globalState?.currentCompany,
            projectId: globalState?.currentProject,
            modules: arrayUnion("crm"),
            owner: arrayUnion(globalState?.uid),
            users: arrayUnion(globalState?.uid),
            name: titleAccount,
          });

          if (docRef.id) {
            await addDocumentFirebase(
              `social_media/${docRef.id}/users`,
              {
                name: globalState.name,
                uid: globalState.uid,
              },
              globalState.currentCompany
            );
          }

          toast({
            title: "Deoapp AI",
            description: "Account Update",
            duration: 3000,
            status: "success",
          });
          console.log("data created with ID", docRef.id);
          setIsLoading(false);
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        } finally {
          setIsLoading(false);
        }

        setSocialAccountModal(false);
      }
    } catch (error) {
      console.log(error, "ini error ");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDataAccount = async () => {
  //   try {
  //     const res = await ApiBackend.post("user", {
  //       profileKey: profileKey,
  //     });

  //     if (res.status === 200) {
  //       console.log(res.data);

  //       if (socialMediaList.length === 0) {
  //           await setDoc(
  //             doc(
  //               db,
  //               "social_media",
  //               globalState.currentProject,
  //               "users",
  //               globalState.uid
  //             ),
  //             {
  //               social_accounts: arrayUnion(res.data),
  //               role: "users",
  //               name: globalState.name,
  //             }
  //         );
  //       } else {
  //         await updateDoc(
  //           doc(
  //             db,
  //             "projects",
  //             globalState.currentProject,
  //             "users",
  //             globalState.uid
  //           ),
  //           {
  //             social_accounts: deleteField(),
  //           }
  //         );

  //         await updateDoc(
  //           doc(
  //             db,
  //             "projects",
  //             globalState.currentProject,
  //             "users",
  //             globalState.uid
  //           ),
  //           {
  //             social_accounts: arrayUnion(res.data),
  //           }
  //         );
  //       }

  //       getListSocial();
  //     }
  //   } catch (error) {
  //     toast({
  //       status: "error",
  //       title: "Deoapp",
  //       description: "Not Linked to any account",
  //       duration: 2000,
  //     });
  //   }
  // };

  const handleDisconnected = async (data) => {
    if (profileKey) {
      try {
        const res = await ApiBackend.post("unlinksocial", {
          platform: data.platform,
          profileKey,
        });
        if (res.status === 200) {
          toast({
            title: "Deoapp.com",
            description: "Succes to disconnect from social accounts",
            status: "success",
            position: "top-right",
            isClosable: true,
          });

          // update data linked social media
        }
      } catch (error) {
        console.log(error, "ini error ");
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

  const handleWindowConnected = async (key) => {
    if (key) {
      const res = await ApiBackend.post("/generateJWT", {
        domain: "importir",
        profileKey: key,
      });
      const url = res.data.url + "&logout=true";
      console.log(res);
      window.open(url, "_blank", "noreferrer");
    }
  };

  useEffect(() => {
    getListSocial();
    return () => {};
    // }, [globalState.uid]);
  }, [globalState.currentProject]);

  return (
    <>
      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        {/* <Stack >
                    <AppSideAccountBar setBarStatus={setBarStatus} />
                </Stack>

                <Spacer /> */}

        <Stack transition={"0.2s ease-in-out"} minH={height}>
          <Stack p={10} spacing={5}>
            <HStack>
              <Stack>
                <Text fontSize={"xl"} fontWeight="bold" color={"gray.600"}>
                  Social Accounts{" "}
                </Text>
              </Stack>
              <Spacer />
              <Stack>
                <Button
                  size="sm"
                  colorScheme={"twitter"}
                  onClick={() => handleCreateAccount()}
                >
                  <Text fontSize={"xs"}>+ Social Account</Text>
                </Button>
              </Stack>
            </HStack>

            <Stack
              shadow={"md"}
              justifyContent="center"
              borderRadius="lg"
              bgColor={"white"}
              borderTopWidth={5}
              borderColor="blue.500"
              p={5}
              spacing={3}
            >
              <Text fontSize={"sm"} color="gray.600">
                {moment(userData?.createdAt?.seconds * 1000).format("LLLL")}
              </Text>
              <HStack>
                <Text fontSize={"xs"} color="gray.600">
                  Email
                </Text>
                <Spacer />
                <Text fontSize={"xs"} color="gray.900" fontWeight={"bold"}>
                  {globalState?.email}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize={"xs"} color="gray.600">
                  Subscription
                </Text>
                <Spacer />
                <Stack>
                  <Text fontSize={"xs"} color="gray.900" fontWeight={"bold"}>
                    {userData?.subscription}
                  </Text>
                </Stack>
              </HStack>

              <HStack>
                <Text fontSize={"xs"} color="gray.600">
                  Phone Number
                </Text>
                <Spacer />
                <Stack>
                  <Text fontSize={"xs"} color="gray.900" fontWeight={"bold"}>
                    {userData?.nohp}
                  </Text>
                </Stack>
              </HStack>

              <Divider />

              {/* <HStack>
                <Text fontSize={"xs"} color="gray.600">
                  User Account
                </Text>
                <Spacer />
                <Stack>
                  {socialAccountList?.length > 0 &&
                    socialAccountList?.map((x, index) => {
                      return (
                        <HStack key={index}>
                          <Text
                            fontSize={"xs"}
                            color="gray.900"
                            fontWeight={"bold"}
                          >
                            {x?.title}
                          </Text>
                          <Spacer />
                          <Button size={"sm"}>
                            <Text
                              fontSize={"xs"}
                              onClick={() => handleWindowConnected(x)}
                            >
                              Connected
                            </Text>
                          </Button>
                        </HStack>
                      );
                    })}
                </Stack>
              </HStack> */}
            </Stack>

            <Box>
              <Text mb={2}>User Accounts</Text>
              <Box borderRadius={"md"}>
                <SimpleGrid
                  spacing={4}
                  columns={(2, null, 3)}
                  borderRadius={"md"}
                >
                  {socialAccountList?.map((project, i) => (
                    <>
                      <Box
                        key={i}
                        borderRadius={"md"}
                        bg={"white"}
                        p={5}
                        boxShadow={"md"}
                      >
                        {/* <Flex gap={2} alignItems={"center"}> */}
                        <Center>
                          <Avatar
                            // align={"center"}
                            size="md"
                            name={project?.ayrshare_account?.title}
                            src="#"
                          />
                        </Center>
                        <Box align={"center"} mt={3}>
                          <Text fontSize={"md"} fontWeight={"semibold"}>
                            {capitalize(project?.name)}
                          </Text>
                          {/* <HStack> */}
                          <Text fontSize={"xs"}>
                            Profile Key: {project?.ayrshare_account?.profileKey}
                          </Text>
                          {/* </HStack> */}
                        </Box>
                        {/* <Spacer /> */}
                        {/* </Flex> */}

                        <Box mt={5}>
                          <Text
                            textAlign={"center"}
                            fontSize="sm"
                            color={"gray.600"}
                            fontWeight={"semibold"}
                          >
                            Social Media Accounts
                          </Text>
                          {project.socialAccounts?.length > 0 ? (
                            <>
                              <SimpleGrid columns={2} mt={3} spacing={3}>
                                {project.socialAccounts?.map((x, i) => (
                                  <Box>
                                    <Stack
                                      shadow={"md"}
                                      alignItems={"center"}
                                      _hover={{
                                        transform: "scale(1.03)",
                                        shadow: "xl",
                                      }}
                                      transition={"0.2s ease-in-out"}
                                      justifyContent="center"
                                      borderRadius="lg"
                                      key={i}
                                      bgColor={"white"}
                                      borderTopWidth={5}
                                      borderColor="blue.500"
                                      p={5}
                                    >
                                      <Stack>
                                        <Avatar
                                          src={x.userImage}
                                          alt={x.displayName}
                                        >
                                          <AvatarBadge
                                            boxSize="1.25em"
                                            bg="green.500"
                                          >
                                            {" "}
                                            {platformArr.map((platform) =>
                                              platform.name === x.platform
                                                ? platform.icon
                                                : null
                                            )}
                                          </AvatarBadge>
                                        </Avatar>
                                      </Stack>
                                      <Spacer />
                                      <Stack>
                                        <Text
                                          textAlign={"center"}
                                          fontSize="xs"
                                          color={"gray.600"}
                                        >
                                          {x.displayName}
                                        </Text>
                                      </Stack>

                                      <Stack>
                                        <SimpleGrid columns={[1]} gap={2}>
                                          <Stack
                                            alignItems={"center"}
                                            justifyContent="center"
                                          >
                                            <a
                                              href={x.profileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <Button
                                                size={"sm"}
                                                colorScheme="twitter"
                                              >
                                                <Text fontSize={"xs"}>
                                                  Go to website
                                                </Text>
                                              </Button>
                                            </a>
                                          </Stack>
                                          <Stack
                                            alignItems={"center"}
                                            justifyContent="center"
                                          >
                                            <Button
                                              size={"sm"}
                                              colorScheme="blackAlpha"
                                              onClick={
                                                () => handleDisconnected(x)
                                                // console.log(x)
                                              }
                                            >
                                              <Text fontSize={"xs"}>
                                                Disconnect
                                              </Text>
                                            </Button>
                                          </Stack>
                                        </SimpleGrid>
                                      </Stack>
                                    </Stack>
                                  </Box>
                                ))}
                              </SimpleGrid>
                            </>
                          ) : (
                            <Box align={"center"} my={5}>
                              <Text
                                textAlign={"center"}
                                fontSize="sm"
                                fontStyle={"italic"}
                                color={"gray.600"}
                              >
                                No social media linked to this account
                              </Text>
                            </Box>
                          )}

                          <Box align={"center"} mt={4}>
                            <Button
                              colorScheme="telegram"
                              size={"xs"}
                              w={"fit-content"}
                              onClick={() =>
                                handleWindowConnected(
                                  project?.ayrshare_account?.profileKey
                                )
                              }
                            >
                              Connect More Account
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ))}
                </SimpleGrid>
              </Box>
            </Box>

            {/* <Stack>
              <HStack>
                <Text>Account</Text>
                <Spacer />
                <Button size={"sm"} colorScheme="twitter">
                  <Text fontSize={"xs"} onClick={() => handleDataAccount()}>
                    Update
                  </Text>
                </Button>
              </HStack>
              <SimpleGrid columns={[1, 2, 2]} gap={2}>
                {socialMediaList?.length > 0 &&
                  socialMediaList?.map((x, index) => {
                    return (
                      <Stack
                        key={index}
                        shadow={"md"}
                        borderRadius="lg"
                        bgColor={"white"}
                        borderWidth={2}
                        // borderColor={
                        //   x?.title === nameParams ? "blue.500" : "transparent"
                        // }
                        p={5}
                        spacing={3}
                      >
                        <HStack>
                          <Text fontSize={"xs"} color="gray.600">
                            Name
                          </Text>
                          <Spacer />
                          <Text
                            fontSize={"xs"}
                            color="gray.900"
                            fontWeight={"bold"}
                          >
                            {x?.name}
                          </Text>
                        </HStack>
                        <HStack>
                          <Text fontSize={"xs"} color="gray.600">
                            Monthly api calls
                          </Text>
                          <Spacer />
                          <Stack>
                            <Text fontSize={"xs"} color="gray.600">
                              {x?.monthlyApiCalls}
                            </Text>
                          </Stack>
                        </HStack>
                        <Stack w={"full"}>
                          <Progress
                            borderRadius={"xl"}
                            size="md"
                            value={(x?.monthlyApiCalls / 500) * 100}
                          />
                        </Stack>

                        <Stack>
                          <SimpleGrid columns={[1, 2, 4]} gap={3}>
                            {x?.socialAccounts?.length > 0 &&
                              x?.socialAccounts?.map((z, index) => {
                                const PlatformArr = [
                                  {
                                    name: "youtube",
                                    icon: <FaYoutube color="white" size={10} />,
                                  },
                                  {
                                    name: "twitter",
                                    icon: <FaTwitter color="white" size={10} />,
                                  },
                                  {
                                    name: "facebook",
                                    icon: (
                                      <FaFacebook color="white" size={10} />
                                    ),
                                  },
                                  {
                                    name: "instagram",
                                    icon: (
                                      <FaInstagram color="white" size={10} />
                                    ),
                                  },
                                  {
                                    name: "tiktok",
                                    icon: <FaTiktok color="white" size={10} />,
                                  },
                                  {
                                    name: "linkedin",
                                    icon: (
                                      <FaLinkedin color="white" size={10} />
                                    ),
                                  },
                                  {
                                    name: "google",
                                    icon: <FaGoogle color="white" size={10} />,
                                  },
                                  {
                                    name: "pinterest",
                                    icon: (
                                      <FaPinterest color="white" size={10} />
                                    ),
                                  },
                                ];

                                const filterError = PlatformArr.filter((y) =>
                                  y.name.includes(z.platform)
                                );
                                const resIcon = filterError[0]?.icon;

                                return (
                                  <Stack
                                    shadow={"md"}
                                    alignItems={"center"}
                                    _hover={{
                                      transform: "scale(1.03)",
                                      shadow: "xl",
                                    }}
                                    transition={"0.2s ease-in-out"}
                                    justifyContent="center"
                                    borderRadius="lg"
                                    key={index}
                                    bgColor={"white"}
                                    borderTopWidth={5}
                                    borderColor="blue.500"
                                    p={5}
                                  >
                                    <Stack>
                                      <Avatar
                                        src={z.userImage}
                                        alt={z.displayName}
                                      >
                                        <AvatarBadge
                                          boxSize="1.25em"
                                          bg="green.500"
                                        >
                                          {" "}
                                          {resIcon}
                                        </AvatarBadge>
                                      </Avatar>
                                    </Stack>
                                    <Spacer />
                                    <Stack>
                                      <Text
                                        textAlign={"center"}
                                        fontSize="xs"
                                        color={"gray.600"}
                                      >
                                        {z.displayName}
                                      </Text>
                                    </Stack>

                                    <Stack>
                                      <SimpleGrid columns={[1]} gap={2}>
                                        <Stack
                                          alignItems={"center"}
                                          justifyContent="center"
                                        >
                                          <a
                                            href={z.profileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Button
                                              size={"sm"}
                                              colorScheme="twitter"
                                            >
                                              <Text fontSize={"xs"}>
                                                Go to website
                                              </Text>
                                            </Button>
                                          </a>
                                        </Stack>
                                        <Stack
                                          alignItems={"center"}
                                          justifyContent="center"
                                        >
                                          <Button
                                            size={"sm"}
                                            colorScheme="blackAlpha"
                                            onClick={
                                              () => handleDisconnected(z)
                                              // console.log(x)
                                            }
                                          >
                                            <Text fontSize={"xs"}>
                                              Disconnect
                                            </Text>
                                          </Button>
                                        </Stack>
                                      </SimpleGrid>
                                    </Stack>
                                  </Stack>
                                );
                              })}
                          </SimpleGrid>
                        </Stack>
                      </Stack>
                    );
                  })}
              </SimpleGrid>
            </Stack> */}
          </Stack>
        </Stack>
      </Flex>

      <Modal
        isOpen={socialAccountModal}
        onClose={() => setSocialAccountModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <TbPresentationAnalytics size={20} />
              <Text fontSize={"md"}>New Social Account</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>Title</Text>
              <Input
                size={"sm"}
                placeholder="New Title"
                value={titleAccount}
                onChange={(e) => setTitleAccount(e.target.value)}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="blackAlpha"
              mr={3}
              onClick={() => setSocialAccountModal(false)}
            >
              Close
            </Button>
            {isLoading === true ? (
              <Button
                isLoading
                size={"sm"}
                colorScheme="twitter"
                mr={3}
                onClick={() => handleSubmitAccount()}
              >
                Submit
              </Button>
            ) : (
              <Button
                size={"sm"}
                colorScheme="twitter"
                mr={3}
                onClick={() => handleSubmitAccount()}
              >
                Submit
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SocialAccountPage;
