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
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
import { MdOutlinePermMedia, MdSchedule } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import store from "store";
import momenttz from "moment-timezone";

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
import AuthContext from "../../Routes/hooks/AuthContext";
import ApiBackend from "../../Api/ApiBackend";
import AppSideAccountBar from "../../Components/AppSideAccountBar";
import { db } from "../../Config/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { BsGlobe2, BsStarFill, BsTrash } from "react-icons/bs";
import ImageProxy from "../../Components/Image/ImageProxy";
import useUserStore from "../../Routes/Store";

function SocialBuildPage() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const navigate = useNavigate();

  const toast = useToast();

  const [posting, setPosting] = useState("");
  const [shortenLinks, setShotenLinks] = useState(false);
  const [platformActive, setPlatformActive] = useState([]);
  const [files, setFiles] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [scheduleActive, setScheduleActive] = useState(false);
  const [socialFilter, setSocialFilter] = useState([]);
  const [favoriteFeed, setFavoriteFeed] = useState([]);

  const [barStatus, setBarStatus] = useState(false);

  const contentWidth = barStatus ? "85%" : "95%";

  let [searchParams, setSearchParams] = useSearchParams();

  const { userDisplay } = useUserStore();
  const profileKey = userDisplay.profileKey;

  const title = projectTitle;

  const { currentUser, loadingShow, loadingClose } = useContext(AuthContext);

  const cancelRef = React.useRef();

  const [schedulePosting, setSchedulePosting] = useState();

  const getDataProject = async () => {
    try {
      const docRef = doc(db, "projects", userDisplay.currentProject);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists) {
        const docData = docSnapshot.data();
        setProjectTitle(docData.ayrshare_account.title);
      } else {
        console.log("Dokumen tidak ditemukan!");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      return null;
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    const newDateTime = momenttz(value).format();
    setSchedulePosting(newDateTime);
  };

  const handleZoneChange = (event) => {
    const { value } = event.target;
    const newDateTime = momenttz(schedulePosting).tz(value).format();
    setSchedulePosting(newDateTime);
  };

  const getListSocial = async () => {
    loadingShow();
    if (profileKey) {
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const socialArr = docSnap.data().social_accounts;
          console.log(socialArr);
          const socialFilterData = socialArr.filter((x) => x.title === title);
          setSocialFilter(socialFilterData);
        } else {
          console.log("No such document!");
        }
        loadingClose();
      } catch (error) {
        console.log(error);
        loadingClose();
      }
    }
    loadingClose();
  };

  const getDataFolderFeed = () => {
    try {
      onSnapshot(doc(db, "favorite", currentUser.uid), (doc) => {
        setFavoriteFeed(doc.data().feed);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFavorite = async (data) => {
    loadingShow();
    try {
      const ref = doc(db, "favorite", currentUser.uid);
      await setDoc(
        ref,
        {
          uid: currentUser.uid,
          feed: arrayRemove(data),
          createdAt: new Date(),
        },
        { merge: true }
      );

      toast({
        title: "Deoapp.com",
        description: "success delete favorite",
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

  useEffect(() => {
    getDataFolderFeed();

    return () => {};
  }, [currentUser]);

  useEffect(() => {
    getListSocial();
    getDataProject();

    return () => {};
  }, [profileKey]);

  const handleAddPlatform = (media) => {
    if (
      socialFilter.filter((x) => x.activeSocialAccounts.includes(media))
        .length > 0
    ) {
      setPlatformActive([media]);
      if (!platformActive.includes(media)) {
        setPlatformActive([...platformActive, media]);
      } else {
        setPlatformActive(
          platformActive.filter((platform) => platform !== media)
        );
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: `${media} need to enabled. please go to Social Accounts page to set up`,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };
  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;
    if (newFiles.length) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
            isVideo: newFiles[i].type.startsWith("video/"),
          };
          newFileArray.push(fileData);
          if (i === newFiles.length - 1) {
            setFiles((prevFiles) => [...prevFiles, ...newFileArray]);
          }
        };
        reader.readAsDataURL(newFiles[i]);
      }
    }
  };
  const handlePost = async () => {
    loadingShow();

    let fileImage = [];

    if (profileKey) {
      loadingShow();
      if (files.length > 0) {
        files.forEach(async (x) => {
          try {
            const res = await ApiBackend.post("upload", {
              file: x.file,
              fileName: x.fileName,
              description: x.description,
            });
            fileImage.push(res.data.url);
            if (fileImage.length === files.length) {
              try {
                loadingShow();
                const res = await ApiBackend.post("post", {
                  post: posting,
                  platforms: platformActive,
                  mediaUrls: fileImage,
                  shortenLinks: shortenLinks,
                  scheduleDate: schedulePosting,
                  profileKey,
                });

                if (res.status === 200 && res.data.status === "error") {
                  // Menampilkan pesan error dan informasi platform yang dikirim
                  res.data.posts.forEach((post) => {
                    if (post.status === "error") {
                      post.errors.forEach((error) => {
                        toast({
                          title: "Deoapp.com",
                          description: `Error posting to ${error.platform}: ${error.message}`,
                          status: "error",
                          position: "top-right",
                          isClosable: true,
                        });
                      });
                    } else if (post.status === "success") {
                      platformActive.forEach(async (x) => {
                        let firebaseData = {
                          startDate: schedulePosting
                            ? new Date(schedulePosting)
                            : new Date(),
                          endDate: schedulePosting
                            ? new Date(moment(schedulePosting).add(1, "hour"))
                            : new Date(moment().add(1, "hour")),
                          image: fileImage,
                          uid: currentUser.uid,
                          name: title,
                          post: posting,
                          platform: x,
                          status: schedulePosting ? "schedule" : "active",
                        };
                        const ref = doc(db, "schedule", currentUser.uid);
                        await setDoc(
                          ref,
                          {
                            uid: currentUser.uid,
                            data: arrayUnion(firebaseData),
                            createdAt: new Date(),
                          },
                          { merge: true }
                        );
                      });

                      post.postIds.forEach((postId) => {
                        toast({
                          title: "Deoapp.com",
                          description: `Successfully posted to ${postId.platform}. Post ID: ${postId.id}`,
                          status: "success",
                          position: "top-right",
                          isClosable: true,
                        });
                      });
                    }
                  });

                  setPosting("");
                  setFiles([]);
                  setPlatformActive([]);
                  setShotenLinks(false);
                  setSchedulePosting("");
                } else {
                  // Menampilkan pesan error jika terjadi kesalahan saat melakukan permintaan API
                  toast({
                    title: "Deoapp.com",
                    description:
                      "Error posting: An error occurred while processing the request.",
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                  });
                }

                loadingClose();
              } catch (error) {
                console.log(error, "ini error ");
                // Menampilkan pesan error jika terjadi kesalahan saat melakukan permintaan API
                toast({
                  title: "Deoapp.com",
                  description:
                    "Error posting: An error occurred while processing the request.",
                  status: "error",
                  position: "top-right",
                  isClosable: true,
                });

                loadingClose();
              }
              loadingClose();
            }
            loadingClose();
          } catch (error) {
            console.log(error, "ini error");
          }
        });
      } else {
        if (posting !== "" || platformActive.length !== 0) {
          try {
            const res = await ApiBackend.post("post", {
              post: posting,
              platforms: platformActive,
              mediaUrls: null,
              shortenLinks: shortenLinks,
              scheduleDate: schedulePosting,
              profileKey,
            });
            if (res.status === 200) {
              if (
                res?.data?.status === "success" ||
                res?.data?.posts[0].postIds.length > 0
              ) {
                platformActive.forEach(async (x) => {
                  let firebaseData = {
                    startDate: schedulePosting
                      ? new Date(schedulePosting)
                      : new Date(),
                    endDate: schedulePosting
                      ? new Date(moment(schedulePosting).add(1, "hour"))
                      : new Date(moment().add(1, "hour")),
                    image: fileImage,
                    uid: currentUser.uid,
                    name: title,
                    post: posting,
                    platform: x,
                    status: schedulePosting ? "schedule" : "active",
                  };
                  const ref = doc(db, "schedule", currentUser.uid);
                  await setDoc(
                    ref,
                    {
                      uid: currentUser.uid,
                      data: arrayUnion(firebaseData),
                      createdAt: new Date(),
                    },
                    { merge: true }
                  );
                });
              } else {
                toast({
                  title: "Deoapp.com",
                  description: res.data.message,
                  status: "error",
                  position: "top-right",
                  isClosable: true,
                });
              }

              toast({
                title: "Deoapp.com",
                description: "Success posting.",
                status: "success",
                position: "top-right",
                isClosable: true,
              });
              setPosting("");
              setFiles([]);
              setPlatformActive([]);
              setShotenLinks(false);
              setSchedulePosting("");
              loadingClose();
            }
          } catch (error) {
            console.log(error, "ini error ");
          }
          loadingClose();
        } else {
          loadingClose();
          toast({
            title: "Deoapp.com",
            description: "please check your posting",
            status: "warning",
            position: "top-right",
            isClosable: true,
          });
        }
        loadingClose();
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: "You must set billing pricing",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      loadingClose();
    }
    loadingClose();
  };

  const handleDialogSchedule = () => {
    setSchedulePosting("");
    setScheduleActive(true);
  };

  return (
    <Stack>
      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        <Stack w="100%" transition={"0.2s ease-in-out"} minH={height}>
          <Stack p={10}>
            <Stack>
              <Text fontSize={"xl"} fontWeight="bold" color={"gray.600"}>
                Create a post
              </Text>
            </Stack>
            <Stack
              borderRadius="lg"
              bgColor={"white"}
              shadow="md"
              spacing={3}
              p={5}
            >
              <Text fontSize={"sm"} color="gray.500">
                Type your post
              </Text>
              <Textarea
                placeholder="Here is a sample placeholder"
                fontSize={"sm"}
                onChange={(e) => setPosting(e.target.value)}
              />
              <Checkbox
                colorScheme="blue"
                defaultChecked
                onChange={(e) => setShotenLinks(e.target.checked)}
              >
                <Text fontSize={"sm"}>Shorten Links</Text>
              </Checkbox>
              <Checkbox
                colorScheme="blue"
                defaultChecked
                onChange={(e) => console.log(e.target.checked, "shorten")}
              >
                <Text fontSize={"sm"}>Twitter thread</Text>
              </Checkbox>
              <HStack spacing={2} alignItems="center">
                <Stack>
                  <Input
                    type="file"
                    onChange={handleFileInputChange}
                    accept="image/*,video/*" // Menentukan bahwa file yang diterima bisa berupa gambar atau video
                    multiple // Mengizinkan memilih beberapa file
                    display="none"
                    id="fileInput"
                  />
                  <label htmlFor="fileInput">
                    <HStack cursor={"pointer"}>
                      <Stack>
                        <MdOutlinePermMedia />
                      </Stack>
                      <Text fontSize={"sm"}>Add Image / Video</Text>
                    </HStack>
                  </label>
                </Stack>
              </HStack>
              <SimpleGrid columns={[1, 2, 3]} gap={3}>
                {files.length > 0 &&
                  files.map((x, index) => (
                    <Stack key={index}>
                      {x.isVideo ? (
                        <video controls width={300}>
                          <source src={x.file} type={x.description} />
                          Sorry, your browser doesn't support embedded videos.
                        </video>
                      ) : (
                        <Image
                          src={x.file}
                          borderRadius="xl"
                          alt={x.fileName}
                          shadow="md"
                        />
                      )}
                    </Stack>
                  ))}
              </SimpleGrid>
              <HStack spacing={5} alignItems="center">
                <Button
                  size={"sm"}
                  p={5}
                  shadow="lg"
                  onClick={() => handlePost()}
                >
                  <HStack spacing={2}>
                    <FiSend />
                    <Text fontSize={"sm"}>Post</Text>
                  </HStack>
                </Button>

                <Button
                  size={"sm"}
                  p={5}
                  shadow="lg"
                  onClick={() => handleDialogSchedule()}
                >
                  <HStack spacing={2}>
                    <MdSchedule />
                    <Text fontSize={"sm"}>Schedule</Text>
                  </HStack>
                </Button>

                {schedulePosting && (
                  <Stack spacing={0}>
                    <Text fontSize={"xs"} color="gray.500">
                      Schedule
                    </Text>
                    <Text fontSize={"sm"} color="gray.800">
                      {moment(schedulePosting).format("LLLL")}
                    </Text>
                  </Stack>
                )}
              </HStack>
            </Stack>
            <Stack
              p={5}
              alignItems="center"
              justifyContent={"center"}
              spacing={5}
            >
              <Stack>
                <Text color={"gray.500"} fontSize="sm">
                  Post the these networks
                </Text>
              </Stack>
              <SimpleGrid gap={10} columns={[3, 6, 9]}>
                <Stack>
                  <FaTwitter
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("twitter")}
                    color={
                      platformActive.includes("twitter") ? "green" : "gray"
                    }
                  />
                </Stack>

                <Stack>
                  <FaYoutube
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("youtube")}
                    color={
                      platformActive.includes("youtube") ? "green" : "gray"
                    }
                  />
                </Stack>

                <Stack>
                  <FaTiktok
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("tiktok")}
                    color={platformActive.includes("tiktok") ? "green" : "gray"}
                  />
                </Stack>

                <Stack>
                  <FaInstagram
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("instagram")}
                    color={
                      platformActive.includes("instagram") ? "green" : "gray"
                    }
                  />
                </Stack>

                <Stack>
                  <FaLinkedin
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("linkedin")}
                    color={
                      platformActive.includes("linkedin") ? "green" : "gray"
                    }
                  />
                </Stack>

                <Stack>
                  <FaTelegram
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("telegram")}
                    color={
                      platformActive.includes("telegram") ? "green" : "gray"
                    }
                  />
                </Stack>

                <Stack>
                  <FaFacebook
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("facebook")}
                    color={
                      platformActive.includes("facebook") ? "green" : "gray"
                    }
                  />
                </Stack>

                <Stack>
                  <FaGoogle
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("google")}
                    color={platformActive.includes("google") ? "green" : "gray"}
                  />
                </Stack>

                <Stack>
                  <FaPinterest
                    size={20}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("pinterest")}
                    color={
                      platformActive.includes("pinterest") ? "green" : "gray"
                    }
                  />
                </Stack>
              </SimpleGrid>
            </Stack>
          </Stack>

          <Stack px={10} pb={10} spacing={5}>
            <HStack>
              <Text fontSize={"xl"} fontWeight="bold" color={"gray.600"}>
                Feeds Favorite
              </Text>
              <Text fontSize={"md"} color="gray.500">
                ( {favoriteFeed?.length} most recent )
              </Text>
            </HStack>
            <Stack>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={5}>
                {favoriteFeed?.length > 0 &&
                  favoriteFeed?.map((item, index) => {
                    return (
                      <Stack
                        shadow={"md"}
                        alignItems={"center"}
                        _hover={{ transform: "scale(1.1)", shadow: "xl" }}
                        transition={"0.2s ease-in-out"}
                        justifyContent="center"
                        borderRadius="lg"
                        key={index}
                        bgColor={"white"}
                        borderTopWidth={5}
                        borderColor="blue.500"
                        p={5}
                        spacing={5}
                      >
                        <HStack>
                          <Text>{item.title[0]}</Text>
                        </HStack>
                        <Divider borderStyle={"dotted"} />
                        {item.enclosure[0] && (
                          <Stack>
                            <ImageProxy imageUrl={item.enclosure[0].$.url} />
                            {/* <Image crossOrigin="anonymous" src={item.enclosure[0].$.url} alt={'img'} borderRadius='md' /> */}
                          </Stack>
                        )}
                        <Spacer />
                        <Stack>
                          <Text
                            textAlign={"center"}
                            fontSize="xs"
                            color={"gray.600"}
                            noOfLines={3}
                          >
                            {item.description[0]}
                          </Text>
                        </Stack>

                        <HStack w={"100%"}>
                          <Stack>
                            {item["dc:creator"].length > 0 &&
                              item["dc:creator"].map((y, index) => {
                                return (
                                  <Text
                                    key={index}
                                    textAlign={"center"}
                                    fontSize="xs"
                                    color={"gray.400"}
                                  >
                                    {y}
                                  </Text>
                                );
                              })}
                          </Stack>

                          <Spacer />
                          <Text
                            textAlign={"center"}
                            fontSize="xs"
                            color={"gray.400"}
                          >
                            {moment(item.pubDate[0]).fromNow()}
                          </Text>
                        </HStack>

                        <SimpleGrid columns={[2]} gap={2}>
                          <Stack>
                            <Button
                              size={"sm"}
                              colorScheme="twitter"
                              onClick={() => handleDeleteFavorite(item)}
                            >
                              <BsTrash />
                            </Button>
                          </Stack>
                          <Stack>
                            <a
                              href={item.link[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size={"sm"} colorScheme="twitter">
                                <BsGlobe2 />
                              </Button>
                            </a>
                          </Stack>
                        </SimpleGrid>
                      </Stack>
                    );
                  })}
              </SimpleGrid>
            </Stack>
          </Stack>
        </Stack>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setScheduleActive(false)}
        isOpen={scheduleActive}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            {" "}
            <Text fontSize={"md"}>Posting Schedule</Text>
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {/* <Stack>
                            <Text fontSize={'sm'} color='gray.500'>Do you want to schedule a post for this ?
                            </Text>
                            <Input type={'datetime-local'} fontSize='sm' size={'sm'} onChange={(e) => setSchedulePosting(e.target.value)} />
                        </Stack> */}

            <Stack spacing={4}>
              <Input
                type="datetime-local"
                size={"sm"}
                onChange={handleDateChange}
              />
              <Select
                placeholder="Select Time Zone"
                size={"sm"}
                onChange={handleZoneChange}
              >
                {momenttz.tz.names().map((zone) => (
                  <option key={zone} value={zone}>
                    {zone} - {momenttz.tz(zone).format("Z")}
                  </option>
                ))}
              </Select>
              {schedulePosting && (
                <Text fontSize={"sm"} color="gray.500">
                  {momenttz(schedulePosting).format("YYYY-MM-DDTHH:mm:ssZ")}
                </Text>
              )}
            </Stack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setScheduleActive(false)}>
              No
            </Button>
            <Button
              colorScheme="blue"
              ml={3}
              onClick={() => setScheduleActive(false)}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
}

export default SocialBuildPage;
