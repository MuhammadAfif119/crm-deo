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
  Center,
  Checkbox,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Icon,
  Img,
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
import ApiBackend from "../../Api/ApiBackend";
import AppSideAccountBar from "../../Components/AppSideAccountBar";
import { auth, db } from "../../Config/firebase";
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
import useUserStore from "../../Hooks/Zustand/Store";
import { capitalize } from "../../Utils/capitalizeUtil";
import TwitterPosts from "./TwitterPosts";
import YoutubePosts from "./YoutubePosts";
import InstagramPosts from "./InstagramPosts";
import PinterestPosts from "./PinterestPosts";
import { CheckVideoResolution } from "../Middleware";
import CommentsPage from "../Comments/CommentsPage";

function SocialBuildPage() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const navigate = useNavigate();

  const toast = useToast();
  const globalState = useUserStore();
  // const profileKey = userDisplay.profileKey;
  const title = globalState.currentProject;

  const [posting, setPosting] = useState("");
  const [shortenLinks, setShotenLinks] = useState(false);
  const [platformActive, setPlatformActive] = useState([]);
  const [files, setFiles] = useState([]);
  const [platformEndpoints, setPlatformEndpoints] = useState();
  const [mediaFile, setMediaFile] = useState([]);
  const [postTypes, setPostTypes] = useState();
  const [projectTitle, setProjectTitle] = useState("");
  const [scheduleActive, setScheduleActive] = useState(false);
  const [socialFilter, setSocialFilter] = useState([]);
  const [favoriteFeed, setFavoriteFeed] = useState([]);
  const [schedulePosting, setSchedulePosting] = useState();
  const [barStatus, setBarStatus] = useState(false);
  const [imageHeight, setImageHeight] = useState();
  const [imageWidth, setImageWidth] = useState();

  const [data, setData] = useState({
    post: "",
    platforms: ["twitter"],
    mediaUrls: mediaFile,
    shortenLinks: shortenLinks,
    scheduleDate: schedulePosting,
    // profileKey: profileKey,
  });

  const contentWidth = barStatus ? "85%" : "95%";

  const currentUser = auth.currentUser;

  const cancelRef = React.useRef();

  const getDataProject = async () => {
    try {
      const docRef = doc(db, "projects", globalState?.currentProject);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists) {
        const docData = docSnapshot?.data();
        setProjectTitle(docData?.ayrshare_account?.title);
        setData({ ...data, profileKey: docData?.ayrshare_account?.profileKey });
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
    console.log(newDateTime);
    setSchedulePosting(newDateTime);
    setData({ ...data, scheduleDate: schedulePosting });
  };

  const handleZoneChange = (event) => {
    const { value } = event.target;
    const newDateTime = momenttz(schedulePosting).tz(value).format();
    console.log(newDateTime);
    setSchedulePosting(newDateTime);
    setData({ ...data, scheduleDate: schedulePosting });
  };

  const getListSocial = async () => {
    if (globalState.profileKey) {
      try {
        const docRef = doc(
          db,
          "projects",
          globalState.currentProject,
          "users",
          currentUser.uid
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const socialArr = docSnap.data().social_accounts;
          console.log(socialArr);
          const socialFilterData = socialArr.filter((x) => x.title === title);
          setSocialFilter(socialFilterData);
          console.log(socialFilterData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log(error);
      }
    }
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
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  useEffect(() => {
    getDataFolderFeed();

    return () => {};
  }, [currentUser]);

  useEffect(() => {
    getListSocial();
    getDataProject();
    // }, [userDisplay.profileKey]);
  }, []);

  const handleAddPlatform = (media) => {
    setPlatformEndpoints(media);
    if (
      socialFilter?.filter((x) => x.activeSocialAccounts?.includes(media))
        .length > 0
    ) {
      setPlatformActive([media]);
      if (!platformActive.includes(media)) {
        setPlatformActive([...platformActive, media]);
        setData({ ...data, platforms: [...platformActive, media] });
      } else {
        setPlatformActive(
          platformActive.filter((platform) => platform !== media)
        );
        setData({
          ...data,
          platforms: platformActive.filter((platform) => platform !== media),
        });
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

  console.log(...data.platforms);

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

          if (fileData.isVideo === false) {
            const img = new Image();
            img.onload = () => {
              setImageHeight(img.height);
              setImageWidth(img.width);
            };
            img.src = reader.result;
          } else {
          }

          // if (imageWidth / imageHeight !== 0.5625) {
          //   toast({
          //     title: "Deoapp",
          //     status: "warning",
          //     description:
          //       "Image for stories should be in ratio 9:16 for better result",
          //     duration: null,
          //     position: "top-right",
          //   });
          // }

          console.log(fileData);
          newFileArray.push(fileData);

          if (i === newFiles.length - 1) {
            setFiles((prevFiles) => [...prevFiles, ...newFileArray]);
          }
        };
        reader.readAsDataURL(newFiles[i]);
      }
    }
  };

  const handleDeleteMedia = (x) => {
    console.log(x);
    console.log(files);
    if (files.length === 1) {
      setFiles([]);
    } else {
      const objectIndex = files.findIndex((item) => item.file === x.file);

      if (objectIndex > -1) {
        const newFiles = files.splice(objectIndex, 1);
        setFiles(newFiles);
      } else {
      }
    }
  };

  const handlePost = async () => {
    let fileImage = [];

    // if (profileKey) {
    if (globalState.currentProject) {
      if (files.length > 0) {
        files.forEach(async (x) => {
          try {
            // await CheckVideoResolution(x.file);
            const res = await ApiBackend.post("upload", {
              file: x.file,
              fileName: x.fileName,
              description: x.description,
            });
            fileImage.push(res.data.url);
            setMediaFile(fileImage);
            console.log(fileImage);
            setData({ ...data, mediaUrls: mediaFile });
            if (fileImage.length === files.length) {
              try {
                const res = await ApiBackend.post(`post`, {
                  ...data,
                  mediaUrls: fileImage,
                });

                if (res.status === 200 && res.data.status === "error") {
                  // Menampilkan pesan error dan informasi platform yang dikirim
                  res.data.posts.forEach((post) => {
                    console.log(res.data.posts);
                    if (post.status === "error") {
                      post.errors.forEach((error) => {
                        toast({
                          title: "Deoapp.com",
                          description: `Error posting to ${error.platform}: ${error.message}`,

                          status: "error",
                          position: "top-right",
                          isClosable: true,
                          duration: 5000,
                        });
                      });
                    } else if (post.status === "success") {
                      platformActive.forEach(async (x) => {
                        let firebaseData = {
                          startDate: data.scheduleDate
                            ? new Date(data.scheduleDate)
                            : new Date(),
                          endDate: data.scheduleDate
                            ? new Date(moment(data.scheduleDate).add(1, "hour"))
                            : new Date(moment().add(1, "hour")),
                          image: fileImage,
                          uid: currentUser.uid,
                          name: title,
                          post: data.post,
                          platform: x,
                          status: data.scheduleDate ? "schedule" : "active",
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
                  // toast({
                  //   title: "Deoapp.com",
                  //   description:
                  //     "Error posting: An error occurred while processing the request.",
                  //   status: "error",
                  //   position: "top-right",
                  //   isClosable: true,
                  // });
                  // Menampilkan pesan error jika terjadi kesalahan saat melakukan permintaan API
                  toast({
                    title: "Deoapp.com",
                    description: "Post success",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                  });
                }

                if (data.scheduleDate !== undefined) {
                  platformActive.forEach(async (x) => {
                    let firebaseData = {
                      startDate: data.scheduleDate
                        ? new Date(data.scheduleDate)
                        : new Date(),
                      endDate: data.scheduleDate
                        ? new Date(moment(data.scheduleDate).add(1, "hour"))
                        : new Date(moment().add(1, "hour")),
                      image: fileImage,
                      uid: currentUser.uid,
                      name: title,
                      post: data.post,
                      platform: x,
                      status: data.scheduleDate ? "schedule" : "active",
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
                }
              } catch (error) {
                console.log(error, "ini error ");
                // Menampilkan pesan error jika terjadi kesalahan saat melakukan permintaan API
                toast({
                  title: "Deoapp.com",
                  description: "Failed to post",
                  status: "error",
                  position: "top-right",
                  isClosable: true,
                });
              }
            }
          } catch (error) {
            console.log(error, "ini error");
          }
        });
      } else {
        if (posting !== "" || platformActive.length !== 0) {
          try {
            const res = await ApiBackend.post("post", data);
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
            }
          } catch (error) {
            console.log(error, "ini error ");
          }
        } else {
          toast({
            title: "Deoapp.com",
            description: "please check your posting",
            status: "warning",
            position: "top-right",
            isClosable: true,
          });
        }
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

  const handleDialogSchedule = () => {
    setSchedulePosting("");
    setScheduleActive(true);
  };

  console.log(data);

  return (
    <Stack>
      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        <Stack w="100%" transition={"0.2s ease-in-out"} minH={height}>
          <Stack p={5} spacing={5}>
            <Stack
              alignItems="center"
              justifyContent={"center"}
              spacing={5}
              bg={"white"}
              p={5}
              borderRadius={"md"}
            >
              <Stack>
                <Text color={"gray.500"} fontSize="sm" fontWeight={"semibold"}>
                  Choose Platform To Post
                </Text>
              </Stack>
              <SimpleGrid gap={10} columns={[3, 6, 9]}>
                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaTwitter
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("twitter")}
                    color={
                      platformActive.includes("twitter") ? "green" : "gray"
                    }
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaYoutube
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("youtube")}
                    color={
                      platformActive.includes("youtube") ? "green" : "gray"
                    }
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaTiktok
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("tiktok")}
                    color={platformActive.includes("tiktok") ? "green" : "gray"}
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaInstagram
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("instagram")}
                    color={
                      platformActive.includes("instagram") ? "green" : "gray"
                    }
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaLinkedin
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("linkedin")}
                    color={
                      platformActive.includes("linkedin") ? "green" : "gray"
                    }
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaTelegram
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("telegram")}
                    color={
                      platformActive.includes("telegram") ? "green" : "gray"
                    }
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaFacebook
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("facebook")}
                    color={
                      platformActive.includes("facebook") ? "green" : "gray"
                    }
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaGoogle
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("google")}
                    color={platformActive.includes("google") ? "green" : "gray"}
                  />
                </Center>

                <Center
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                  cursor={"pointer"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  borderRadius={"md"}
                  w={75}
                  h={100}
                  boxShadow={"sm"}
                >
                  <FaPinterest
                    size={40}
                    cursor="pointer"
                    onClick={() => handleAddPlatform("pinterest")}
                    color={
                      platformActive.includes("pinterest") ? "green" : "gray"
                    }
                  />
                </Center>
              </SimpleGrid>
            </Stack>
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
              onChange={(e) => setData({ ...data, post: e.target.value })}
            />

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
                      <>
                        {(imageWidth / imageHeight < 0.56 ||
                          imageWidth / imageHeight > 0.62) &&
                        (data.instagramOptions?.reels === true ||
                          data.instagramOptions?.stories === true) ? (
                          <>
                            <Text color={"red"} fontSize={"sm"}>
                              Media file aspect ratio should be 9:16
                            </Text>
                          </>
                        ) : null}
                        <Box position={"relative"}>
                          <CloseButton
                            onClick={() => handleDeleteMedia(x)}
                            position={"absolute"}
                            right={0}
                            zIndex={999}
                            borderRadius={"full"}
                            size={"sm"}
                            color={"white"}
                            bg={"gray.400"}
                          />
                          <Img
                            src={x.file}
                            borderRadius="xl"
                            alt={x.fileName}
                            shadow="md"
                          />
                        </Box>
                      </>
                    )}
                  </Stack>
                ))}
            </SimpleGrid>

            <Checkbox
              colorScheme="blue"
              defaultChecked
              onChange={(e) =>
                setData({ ...data, shortenLinks: e.target.checked })
              }
            >
              <Text fontSize={"sm"}>Shorten Links</Text>
            </Checkbox>

            <Stack>
              {platformActive.includes("twitter") ? (
                <Box my={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Detail Post for Twitter
                    </Text>
                    <Stack px={2}>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            twitterOptions: {
                              ...data.twitterOptions,
                              thread: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Twitter thread</Text>
                      </Checkbox>

                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            twitterOptions: {
                              ...data.twitterOptions,
                              threadNumber: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Thread number</Text>
                      </Checkbox>
                    </Stack>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("youtube") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for Youtube {"(Media should be a video)"}
                    </Text>
                    <Stack px={2}>
                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Video Title
                      </Text>
                      <Input
                        placeholder="My Best Video"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            youTubeOptions: {
                              ...data.youTubeOptions,
                              title: e.target.value,
                            },
                          })
                        }
                      />

                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            youTubeOptions: {
                              ...data.youTubeOptions,
                              shorts: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Youtube Shorts Content</Text>
                      </Checkbox>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            youTubeOptions: {
                              ...data.youTubeOptions,
                              madeForKids: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Made For Kids</Text>
                      </Checkbox>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            youTubeOptions: {
                              ...data.youTubeOptions,
                              notifySubscribers: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>notifySubscribers</Text>
                      </Checkbox>
                    </Stack>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("pinterest") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for Pinterest
                    </Text>
                    <Stack px={2}>
                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Pin Title
                      </Text>
                      <Input
                        placeholder="Limited to 100 characters"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            pinterestOptions: {
                              ...data.pinterestOptions,
                              title: e.target.value,
                            },
                          })
                        }
                      />

                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Link URL
                      </Text>
                      <Input
                        placeholder="For direct link when the image is clicked"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            pinterestOptions: {
                              ...data.pinterestOptions,
                              link: e.target.value,
                            },
                          })
                        }
                      />

                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Alternative Text
                      </Text>
                      <Input
                        placeholder="Limited to 500 characters"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            pinterestOptions: {
                              ...data.pinterestOptions,
                              altText: e.target.value,
                            },
                          })
                        }
                      />
                    </Stack>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("linkedin") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for LinkedIn
                    </Text>
                    <Stack px={2}>
                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Media Title
                      </Text>
                      <Input
                        placeholder="Limited to 100 characters"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            linkedInOptions: {
                              ...data.linkedInOptions,
                              title: e.target.value,
                            },
                          })
                        }
                      />

                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Alternative Text {"(For image media)"}
                      </Text>
                      <Input
                        placeholder="Limited to 500 characters"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            linkedInOptions: {
                              ...data.linkedInOptions,
                              altText: e.target.value,
                            },
                          })
                        }
                      />
                    </Stack>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("youtube") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for Telegram
                    </Text>
                    <Text fontSize={"sm"} color="gray.500">
                      Media for telegram posts can be animated gif
                    </Text>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("tiktok") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for Tiktok
                    </Text>
                    <Stack px={2}>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            tikTokOptions: {
                              ...data.tikTokOptions,
                              disableComments: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Disable Comments</Text>
                      </Checkbox>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            tikTokOptions: {
                              ...data.tikTokOptions,
                              disableDuet: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Disable Duet</Text>
                      </Checkbox>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            tikTokOptions: {
                              ...data.tikTokOptions,
                              disableStitch: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Disable Stitch</Text>
                      </Checkbox>
                    </Stack>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("facebook") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for Facebook Page
                    </Text>
                    <Stack px={2}>
                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            faceBookOptions: {
                              ...data.faceBookOptions,
                              reels: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Reels Content</Text>
                      </Checkbox>

                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Title
                      </Text>
                      <Input
                        isDisabled={
                          data?.faceBookOptions?.reels === false ? true : false
                        }
                        placeholder="Super title for the Reel"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            faceBookOptions: {
                              ...data?.faceBookOptions,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Media Caption
                      </Text>
                      <Input
                        placeholder="Super title for the Reel"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            faceBookOptions: {
                              ...data?.faceBookOptions,
                              mediaCaptions: e.target.value,
                            },
                          })
                        }
                      />
                    </Stack>
                  </Stack>
                </Box>
              ) : null}

              {platformActive.includes("instagram") ? (
                <Box py={2}>
                  <Stack>
                    <Text
                      fontSize={"sm"}
                      color="gray.500"
                      fontWeight={"semibold"}
                    >
                      Details Post for Instagram
                    </Text>

                    <Text fontSize={"sm"} color="gray.500">
                      Select Type Post
                    </Text>
                    <Select
                      size={"sm"}
                      placeholder="Select type post"
                      onChange={(e) => {
                        setPostTypes(e.target.value);
                      }}
                    >
                      <option value="post">Post</option>
                      <option value="reels">Reels</option>
                      <option value="stories">Stories</option>
                    </Select>

                    <Stack px={2}>
                      {postTypes === "reels" ? (
                        <>
                          <Checkbox
                            colorScheme="blue"
                            onChange={(e) =>
                              setData({
                                ...data,
                                instagramOptions: {
                                  ...data.instagramOptions,
                                  reels: e.target.checked,
                                },
                              })
                            }
                          >
                            <Text fontSize={"sm"}>Reels Content</Text>
                          </Checkbox>

                          <Checkbox
                            colorScheme="blue"
                            onChange={(e) =>
                              setData({
                                ...data,
                                instagramOptions: {
                                  ...data.instagramOptions,
                                  shareReelsFeed: e.target.checked,
                                },
                              })
                            }
                          >
                            <Text fontSize={"sm"}>Share reels to feed</Text>
                          </Checkbox>

                          <Text>Thumbnail Offset {"miliseconds"}</Text>
                          <Input
                            size={"sm"}
                            defaultValue={30000}
                            onChange={(e) =>
                              setData({
                                ...data,
                                instagramOptions: {
                                  ...data.instagramOptions,
                                  thumbNailOffset: e.target.value,
                                },
                              })
                            }
                          />

                          <Text>Cover URL</Text>
                          <Input
                            size={"sm"}
                            placeholder="https://image"
                            // defaultValue={30000}
                            onChange={(e) =>
                              setData({
                                ...data,
                                instagramOptions: {
                                  ...data.instagramOptions,
                                  coverURL: e.target.value,
                                },
                              })
                            }
                          />
                        </>
                      ) : null}

                      {postTypes === "stories" ? (
                        <>
                          <Checkbox
                            colorScheme="blue"
                            onChange={(e) =>
                              setData({
                                ...data,
                                instagramOptions: {
                                  ...data.instagramOptions,
                                  stories: e.target.checked,
                                },
                              })
                            }
                          >
                            <Text fontSize={"sm"}>Stories Content</Text>
                          </Checkbox>
                        </>
                      ) : null}

                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Locations {"Must be start with @, example: @Jakarta"}
                      </Text>
                      <Input
                        placeholder="Location"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            instagramOptions: {
                              ...data?.instagramOptions,
                              locationId: e.target.value,
                            },
                          })
                        }
                      />
                      <Text
                        fontSize={"sm"}
                        color="gray.500"
                        fontWeight={"semibold"}
                      >
                        Tag Users
                      </Text>
                      <Input
                        placeholder="Super title for the Reel"
                        fontSize={"sm"}
                        onChange={(e) =>
                          setData({
                            ...data,
                            instagramOptions: {
                              ...data?.instagramOptions,
                              userTags: [
                                { username: e.target.value, x: 0.5, y: 0.9 },
                              ],
                            },
                          })
                        }
                      />

                      <Checkbox
                        colorScheme="blue"
                        onChange={(e) =>
                          setData({
                            ...data,
                            instagramOptions: {
                              ...data.instagramOptions,
                              autoResize: e.target.checked,
                            },
                          })
                        }
                      >
                        <Text fontSize={"sm"}>Auto Resize</Text>
                      </Checkbox>
                    </Stack>
                  </Stack>
                </Box>
              ) : null}
            </Stack>

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
          <Box>
            <CommentsPage />
          </Box>
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
