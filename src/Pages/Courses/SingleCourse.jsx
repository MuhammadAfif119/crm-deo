import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Stack,
  InputGroup,
  InputRightElement,
  Center,
  Button,
  Card,
  HStack,
  Heading,
  Icon,
  Image,
  Spacer,
  Text,
  useDisclosure,
  Input,
  Divider,
  Progress,
  SimpleGrid,
  Textarea,
  IconButton,
  useToast,
  Flex,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Container,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FiBookOpen,
  FiEdit2,
  FiFolder,
  FiPlus,
  FiVideo,
  FiVolume2,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Modals from "../../Components/Modals/Modals";
import { auth, storage } from "../../Config/firebase";
import BreadCrumbComponent from "../../Components/BreadCrumbs/BreadCrumbComponent";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";
import { deleteObject, ref } from "firebase/storage";
// import { useGlobalState } from "../../Hooks/Contexts";
import Swal from "sweetalert2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { formatFrice } from "../../Utils/numberUtil";
import {
  acceptStyle,
  baseStyle,
  focusedStyle,
  rejectStyle,
} from "../../Constants/constants";
import useUserStore from "../../Hooks/Zustand/Store";
import {
  addDocumentFirebase,
  arrayRemoveFirebase,
  arrayUnionFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
  updateDocumentFirebase,
  uploadFileFirebase,
} from "../../Api/firebaseApi";
import { addDoc, arrayUnion } from "firebase/firestore";

const SingleCourse = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courseDetail, setCourseDetail] = useState(null);
  const [editPriceActive, setEditPriceActive] = useState(false);
  const [priceType, setPriceType] = useState("free");
  const [datas, setDatas] = useState(null);
  const [update, setUpdate] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [editActive, setEditActive] = useState(false);
  const [dataEdit, setDataEdit] = useState({
    description: courseDetail?.description || "",
  });
  const [progress, setProgress] = useState(0);
  const [editTitle, setEditTitle] = useState(false);
  const [defaultIndex, setDefaultIndex] = useState(0);
  const [type, setType] = useState("youtube");
  const [newTitle, setNewTitle] = useState("");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState("");

  const globalState = useUserStore();
  const { currentProject } = globalState;
  const toast = useToast();

  const videoRef = useRef();

  const onEditPrice = () => {
    setEditPriceActive(true);
    setDataEdit({ ...dataEdit, price: courseDetail.price });
    setCourseDetail({ ...courseDetail, price: parseInt(dataEdit.price) });
  };

  const uid = auth?.currentUser?.uid;
  const params = useParams();

  const data = [
    { title: "Home", link: "/" },
    { title: "Courses", link: "/courses" },
    { title: courseDetail?.title, link: `/courses/${courseDetail}` },
  ];

  const getCourseDetail = async () => {
    if (uid) {
      const result = await getSingleDocumentFirebase(
        "courses",
        params.id_course
      );
      setCourseDetail(result);
      setPriceType(result?.priceType);
      setUpdate(false);
    } else return;
  };

  // const getLesson = async () => {
  // 	if (uid) {
  // 		// const conditions = [
  // 		// 	{ field: "createdBy", operator: "==", value: uid },
  // 		// ];

  // 		const conditions = [];
  // 		const sortBy = null;
  // 		const limitValue = null;
  // 		// const res = await getCollectionFirebase(
  // 		// 	`courses/${params.id_course}/lessons`,
  // 		// 	{ conditions },
  // 		// 	{ sortBy },
  // 		// 	{ limitValue: null }
  // 		// );
  // 		const res = await getCollectionFirebase(`courses/${params?.id_course}/lessons`, { conditions }, { sortBy }, { limitValue })
  // 		setLesson(res);
  // 	} else return;
  // };

  console.log(priceType, "ini pricetype");

  const handleSaveEditPrice = async () => {
    if (priceType === "paid") {
      await updateDocumentFirebase("courses", params.id_course, {
        price: parseInt(dataEdit.price),
        priceType,
      });
      getCourseDetail();
      setEditPriceActive(false);
    } else {
      await updateDocumentFirebase("courses", params.id_course, {
        price: 0,
        priceType,
      });
      getCourseDetail();
      setEditPriceActive(false);
    }
    // console.log(priceType)
  };

  const handleSaveEditCategory = async () => {
    const categoryArray = categoryEdit?.toLowerCase()?.split(",");

    try {
      //save to courses
      await updateDocumentFirebase("courses", params.id_course, {
        category: categoryArray,
      });
    } catch (error) {
      console.log("error saving category", error.message);
    }

    //save to listings collection
    const checkCategories = await getSingleDocumentFirebase(
      "categories",
      currentProject
    );
    if (checkCategories !== undefined) {
      console.log("already existed");
      //set Doc
      try {
        await arrayUnionFirebase("categories", currentProject, "data", [
          "course",
        ]);
      } catch (error) {
        console.log("error saving category 111:  ", error.message);
      }

      try {
        await setDocumentFirebase(
          `categories/${currentProject}/course`,
          "data",
          { category: categoryArray }
        );
      } catch (error) {
        console.log("error saving category 222:  ", error.message);
      }
    } else {
      console.log("adding new document");
      //add Doc
      try {
        await setDocumentFirebase("categories", currentProject, {
          data: categoryArray,
        });
      } catch (error) {
        console.log("error saving category 333:  ", error.message);
      }

      try {
        await setDocumentFirebase(
          `categories/${currentProject}/course`,
          "data",
          { category: categoryArray }
        );
      } catch (error) {
        console.log("error saving category 444:  ", error.message);
      }
    }
    setIsEditingCategory(false);
    setCourseDetail((prev) => ({ ...prev, category: categoryArray }));
  };

  const getPerLesson = (section) => {
    if (courseDetail?.lessons?.length !== 0) {
      const result = courseDetail?.lessons
        ?.filter((x) => x?.section === section?.title)
        .sort((a, b) => a?.createdAt?.seconds - b?.createdAt?.seconds);
      return result;
    }
  };

  const handleModal = (type, course, lesson) => {
    onOpen();
    const obj = {
      type: type,
      title: type,
      id: params.id_course,
      course: course,
    };

    if (type === "deleteLesson") obj.lesson = lesson;

    setDatas({ ...obj });
  };

  const activateEdit = () => {
    setEditActive(true);
    setDataEdit({ description: courseDetail.description });
  };

  const handleSaveDescription = async () => {
    await updateDocumentFirebase("courses", params.id_course, {
      description: dataEdit.description,
    });
    getCourseDetail();
    setEditActive(false);
  };

  const submitYoutubeUrl = async () => {
    await updateDocumentFirebase("courses", params.id_course, {
      media: videoRef.current,
      sourceType: "youtube",
    });
    getCourseDetail();
  };

  const saveNewTitle = async () => {
    await updateDocumentFirebase("courses", params.id_course, {
      title: newTitle,
    });
    getCourseDetail();
    setEditTitle(false);
  };

  const deleteMediaMiniCourse = async () => {
    await updateDocumentFirebase("courses", params.id_course, {
      media: "",
      mediaPath: "",
    });

    if (courseDetail?.courseType === "full_course") {
      const videoRef = ref(storage, courseDetail?.mediaPath);

      // // Delete the file
      deleteObject(videoRef)
        .then(() => {
          // File deleted successfully
          console.log("success deleting from storage");
        })
        .then(() => {})
        .catch((error) => {
          toast({
            title: "Gagal menghapus video",
            description: `Error when deleting video ${courseDetail?.title}, message : ${error.message}`,
            isClosable: true,
            duration: 9000,
            status: "error",
          });
        });
    }
    getCourseDetail();
    setEditTitle(false);
  };

  const handleUploadVideoToStorage = async (file) => {
    console.log(file);
    try {
      uploadFileFirebase(file, setProgress, null, { type: null }).then(
        (result) => {
          console.log(result);
          updateDocumentFirebase(`courses`, params.id_course, {
            ...courseDetail,
            mediaPath: result?.path,
            media: result.image_url,
          }).then(() => {
            console.log("Video thumbnail has been saved!");
            getCourseDetail();
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMedia = async () => {
    // Create a reference to the file to delete
    Swal.fire({
      title: "Are you sure to delete media?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        //deleting from firestore
        setDocumentFirebase(
          `courses`,
          params.id_course,
          {
            ...courseDetail,
            videoThumbnail: null,
            videoThumbnailPath: "",
          },
          currentProject
        )
          .then((res) => {
            //deleting from state
            setCourseDetail({
              ...courseDetail,
              videoThumbnail: null,
              videoThumbnailPath: "",
            });
          })
          .catch((e) => console.log(e.message));
      }
    });
  };

  //================================================================================================
  //=======================================COMPONENTS===============================================
  //================================================================================================
  const MyDropzone = () => {
    const onDrop = useCallback(async (acceptedFiles) => {
      // Do something with the files
      console.log(acceptedFiles);
      await handleUploadVideoToStorage(acceptedFiles[0]);
    }, []);

    const {
      getRootProps,
      getInputProps,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: {
        "video/*": [
          ".avi",
          ".mp4",
          ".mpeg",
          ".ogv",
          ".webm",
          ".3gp",
          ".mov",
          ".mkv",
        ],
      },
      onDrop,
    });

    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isFocused, isDragAccept, isDragReject]
    );

    return (
      <div className="container">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag drop you video course here, or click to select files</p>
          {progress !== 0 && progress !== 100 ? (
            <p>progress is {progress?.toFixed(2)}%</p>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  const MediaType = () => (
    <Tabs
      isFitted
      variant="soft-rounded"
      defaultIndex={defaultIndex}
      onChange={(index) => setDefaultIndex(index)}
    >
      <TabList>
        <Tab>
          <HStack>
            <FiVideo />
            <Text>Video</Text>
          </HStack>
        </Tab>
        <Tab>
          <HStack>
            <FiVolume2 />
            <Text>Audio</Text>
          </HStack>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box borderRadius="md" p="5">
            <Flex
              my={5}
              gap={5}
              flexDirection="row"
              w="full"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                bg="rgba(174,182,183, 0.1)"
                p={3}
                borderRadius={5}
                cursor="pointer"
                fontWeight={type === "youtube" ? "bold" : ""}
                color={type === "youtube" ? "blue" : "#2d2d2d"}
                onClick={() => setType("youtube")}
              >
                Youtube
              </Box>
              <Box
                bg="rgba(174,182,183, 0.1)"
                p={3}
                borderRadius={5}
                cursor="pointer"
                fontWeight={type === "upload" ? "bold" : ""}
                color={type === "upload" ? "blue" : "#2d2d2d"}
                onClick={() => setType("upload")}
              >
                Upload
              </Box>
            </Flex>

            {type === "upload" ? (
              <>
                <MyDropzone />
                <Text fontWeight="bold" fontSize={12}>
                  Please Note! Accepted file types are :{" "}
                </Text>
                <Text color="red" fontWeight="bold" fontSize={12}>
                  '.avi', '.mp4', '.mpeg', '.ogv', '.webm', '.3gp', '.mov',
                  '.mkv'
                </Text>
              </>
            ) : type === "youtube" ? (
              <>
                <InputGroup>
                  <Input
                    shadow="sm"
                    bg="white"
                    placeholder="Input link (e.g. youtube, dropbox, etc.)"
                    onChange={(e) => {
                      videoRef.current = e.target.value;
                    }}
                  />
                  <InputRightElement w="fit-content">
                    <Button onClick={submitYoutubeUrl}>Submit</Button>
                  </InputRightElement>
                </InputGroup>
              </>
            ) : null}
            {progress === 0 || progress === 100 || isNaN(progress) ? null : (
              <>
                <Progress value={progress} />
                <Text>{progress?.toFixed(2)} %</Text>
              </>
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Container
            borderRadius="md"
            p="5"
            border="1px"
            borderColor="gray"
            borderStyle="dotted"
          >
            <Center>
              <FiVolume2 size={15} />
            </Center>
            <Center>
              {/* <Button type={"file"} size={"sm"}>
                Upload Audio
              </Button> */}

              <MyDropzone />
            </Center>
          </Container>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );

  //================================================================================================
  //=====================================  USEEFFECTS  =============================================
  //================================================================================================

  useEffect(() => {
    getCourseDetail();
    // getLesson();
  }, [update]);

  return (
    <>
      <BreadCrumbComponent data={data} />
      <Flex flexDir="row" justifyContent="center">
        <Box alignSelf="center" w="90%">
          <Card my={2}>
            <HStack
              // maxH="32"
              borderRadius="md"
              p="1"
              m="1"
              width="full"
            >
              <Stack>
                <Image
                  width="200px"
                  objectFit="cover"
                  src={courseDetail?.thumbnail}
                  alt={courseDetail?.title}
                />
                <Button
                  fontSize={8}
                  size="xs"
                  onClick={() => {
                    setDatas({
                      ...datas,
                      type: "changeThumbnail",
                      courseId: params?.courseId,
                    });
                    onOpen();
                  }}
                >
                  Change <br />
                  thumbnail
                </Button>
              </Stack>
              <Box w="full">
                {/* <Grid
									bg='red'
									templateRows='repeat(2, 1fr)'
									templateColumns='repeat(9, 1fr)'
									gap={2}
								>
									<GridItem colSpan={1}>
										<Text>Title: </Text>
									</GridItem>
									<GridItem colSpan={8}>
										{editTitle ?
											<HStack flexDirection="row">
												<Heading size="md">
													{newTitle}
												</Heading>
												<Input placeholder="Digital Marketing Facebook Ads" onChange={e => (setNewTitle(e.target.value))} />
												<Button mx={2} onClick={saveNewTitle}>Save</Button>
											</HStack>
											:
											<HStack>
												<Heading size="md">
													{courseDetail?.title}
												</Heading>
												<Button
													onClick={() => setEditTitle(!editTitle)}
													color="rgba(0,0,0,0.3)" variant='link'
													fontWeight={400} fontSize={12} mt={-5}
												>
													Edit
												</Button>
											</HStack>
										}
									</GridItem>
									<GridItem colSpan={1}>
										<Text>ID: </Text>
									</GridItem>
									<GridItem colSpan={8}>
										<Text fontSize={10} color="rgba(0,0,0,0.3">{courseDetail?.id}</Text>
									</GridItem>
								</Grid> */}

                <HStack>
                  <Text>Title: </Text>
                  {editTitle ? (
                    <HStack flexDirection="row">
                      <Heading size="md">{newTitle}</Heading>
                      <Input
                        placeholder="Digital Marketing Facebook Ads"
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Button mx={2} onClick={saveNewTitle}>
                        Save
                      </Button>
                    </HStack>
                  ) : (
                    <HStack>
                      <Heading size="md">{courseDetail?.title}</Heading>
                      <Button
                        onClick={() => setEditTitle(!editTitle)}
                        color="rgba(0,0,0,0.3)"
                        variant="link"
                        fontWeight={400}
                        fontSize={12}
                        mt={-5}
                      >
                        Edit
                      </Button>
                    </HStack>
                  )}
                </HStack>

                <HStack fontSize={10} fontWeight={500} my={1}>
                  <Text>ID : </Text>
                  <Text color="rgba(0,0,0,0.3">{courseDetail?.id}</Text>
                </HStack>
                {/* <HStack>
										<Text> Overview</Text>
										<Text>Customize</Text>
										<Text>Offers</Text>
										<Text>Members</Text>
										<Text>Settings</Text>
									</HStack> */}
              </Box>
              <Spacer />
            </HStack>
          </Card>

          <SimpleGrid
            columns={courseDetail?.courseType === "full_course" ? 2 : 1}
            my={5}
            gap={3}
          >
            <Card bg="#CDF0EA" p={5} borderRadius="xl">
              <Heading size="md" color="blackAlpha.800">
                Description :{" "}
              </Heading>
              {!editActive ? (
                <HStack>
                  <Text fontSize={12} color="blackAlpha.800">
                    {courseDetail?.description?.length !== 0 &&
                      courseDetail?.description}
                  </Text>
                  <Button variant="ghost" onClick={() => activateEdit()}>
                    Edit
                  </Button>
                </HStack>
              ) : (
                <HStack>
                  <Textarea
                    defaultValue={courseDetail.description}
                    value={dataEdit?.description}
                    onChange={(e) =>
                      setDataEdit({ description: e.target.value })
                    }
                  />
                  <Button onClick={() => handleSaveDescription()}>Save</Button>
                </HStack>
              )}
            </Card>

            {courseDetail?.courseType === "full_course" ? (
              <Card bg="#F8E8EE" p={5} borderRadius="xl">
                <Heading size="sm" color="blackAlpha.800">
                  Video thumbnail :{" "}
                </Heading>
                {courseDetail?.videoThumbnail ? (
                  <>
                    <ReactPlayer
                      width="full"
                      controls={true}
                      url={courseDetail?.videoThumbnail}
                      autoPlay
                    />
                    <Button
                      my={2}
                      colorScheme="red"
                      onClick={handleDeleteMedia}
                    >
                      Delete Media
                    </Button>
                  </>
                ) : (
                  <MyDropzone />
                )}
                {progress !== 0 && progress !== 100 ? (
                  <Progress value={progress} />
                ) : null}
              </Card>
            ) : null}
            <Card my={5} p={5} bg="#FFFEC4">
              <Heading my={2} size="sm" color="blackAlpha.800">
                Price Type:{" "}
              </Heading>
              <Flex gap="2" justifyContent="space-between">
                <Select
                  w="30%"
                  value={priceType ?? courseDetail?.priceType}
                  defaultValue={courseDetail?.priceType}
                  onChange={(e) => setPriceType(e.target.value)}
                  bg="white"
                >
                  <option value="paid">Paid</option>
                  <option value="free">Free</option>
                </Select>
                {priceType === "free" &&
                courseDetail?.priceType !== priceType ? (
                  <Button
                    colorScheme="green"
                    onClick={() => handleSaveEditPrice()}
                  >
                    Save
                  </Button>
                ) : (
                  <></>
                )}
                {priceType !== "free" ? (
                  !editPriceActive ? (
                    <HStack>
                      <Text fontSize={20} fontWeight="bold" color="red">
                        IDR{" "}
                        {formatFrice(
                          //   courseDetail?.price?.length !== 0 ||
                          courseDetail?.price
                        )}
                      </Text>
                      <Button variant="ghost" onClick={() => onEditPrice()}>
                        Edit
                      </Button>
                    </HStack>
                  ) : editPriceActive ? (
                    <HStack>
                      <Input
                        defaultValue={courseDetail.price}
                        value={dataEdit?.price}
                        type="number"
                        onChange={(e) => setDataEdit({ price: e.target.value })}
                      />
                      <Button
                        colorScheme="green"
                        onClick={() => handleSaveEditPrice()}
                      >
                        Save
                      </Button>
                    </HStack>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </Flex>
            </Card>
            <Card my={5} p={5} bg="#CBFFA9">
              <Stack>
                <Heading y={2} size="sm" color="blackAlpha.800">
                  Category
                </Heading>
                {isEditingCategory ? (
                  <>
                    <Text fontSize={12} color="gray.600">
                      Please write categories, <strong>WITHOUT</strong> any
                      space, seperate with comma (example : beauty,fashion,food,{" "}
                      <strong>NOT</strong> beauty, fashion, food)
                    </Text>
                    <Input
                      bg="white"
                      onChange={(e) => setCategoryEdit(e.target.value)}
                    />
                    <Button onClick={handleSaveEditCategory}>Save</Button>
                  </>
                ) : (
                  <>
                    <UnorderedList mx={5}>
                      {courseDetail?.category?.map((x, i) => (
                        <ListItem key={i}>{x}</ListItem>
                      ))}
                    </UnorderedList>
                    <Button onClick={() => setIsEditingCategory(true)}>
                      Edit
                    </Button>
                  </>
                )}
              </Stack>
            </Card>
          </SimpleGrid>

          {/* ============================== QR CODE GENERATOR*/}
          {/* <Card my={5} p={5}>
						<Heading>Qr code:</Heading>
						<QRCode
							size={256}
							style={{ height: "auto", maxWidth: "100px" }}
							value={`https://indonesiaspicingtheworld.deoapp.site/course/${courseDetail?.id}`}
							viewBox={`0 0 256 256`}
						/>
						<Link
							target="_blank"
							to={`https://indonesiaspicingtheworld.deoapp.site/course/${courseDetail?.id}`}
						>
							{`https://indonesiaspicingtheworld.deoapp.site/course/${courseDetail?.id}`}
						</Link>
					</Card> */}
          {courseDetail?.courseType === "full_course" ? (
            <Card my={2} mb={20} bg="white">
              <Flex
                flexDir="row"
                w="full"
                alignItems="center"
                justifyContent="space-between"
              >
                <Heading m={5} size="md">
                  Sections
                </Heading>
                <Box p="2">
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="green"
                    onClick={() => handleModal("section")}
                  >
                    Add New Section
                  </Button>
                </Box>
              </Flex>
              <Accordion allowMultiple>
                {courseDetail?.sections?.length > 0 ? (
                  courseDetail?.sections?.map((x, i) => (
                    <AccordionItem
                    // borderBottom="1px"
                    // borderColor="gray.50"
                    >
                      <h2>
                        <AccordionButton
                          borderBottomColor="rgba(0,0,0,0.2)"
                          height={20}
                        >
                          <Box as="span" flex="1" textAlign="left">
                            <HStack>
                              <Icon as={FiFolder} />
                              <Text>{x.title}</Text>
                            </HStack>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel p="2" ml={50}>
                        <HStack my={2}>
                          <Heading fontSize="md" pl="5">
                            Lessons
                          </Heading>
                          <Spacer />
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleModal("lesson", x.title)}
                          >
                            Add Lesson
                          </Button>
                        </HStack>
                        {getPerLesson(x) ? (
                          getPerLesson(x).map((z) => (
                            <Box
                              borderBottom="1px"
                              borderTop="1px"
                              pl="10"
                              mb="2"
                              borderColor="gray.50"
                              height={12}
                              borderBottomColor="rgba(0,0,0,0.2)"
                              id="box1"
                            >
                              <HStack>
                                <Icon as={z.media ? FiVideo : FiBookOpen} />
                                <Box
                                  onClick={() => console.log(`lesson/${z.id}`)}
                                >
                                  {/* <Link to={`lesson/${z.id}`} > */}
                                  <Text m="0">{z.title}</Text>
                                  <Text m="0" fontSize="3xs">
                                    ID: {z.id}
                                  </Text>
                                  {/* </Link> */}
                                </Box>
                                <Spacer />
                                {/* {z.status ? <Badge colorScheme={z.status === "published" ? "green" : "red"}>{z.status}</Badge>
																	:
																	<Badge colorScheme="red">
																		status : null
																	</Badge>} */}
                                {/* <Icon as={FiEye} /> */}
                                <Link
                                  to={`lesson/${z.id}`}
                                  state={courseDetail}
                                >
                                  <IconButton
                                    icon={<FiEdit2 />}
                                    size="xs"
                                    colorScheme="blue"
                                    onClick={() =>
                                      handleModal(
                                        "deleteLesson",
                                        courseDetail,
                                        z
                                      )
                                    }
                                  />
                                </Link>
                                {/* <Icon as={FiMessageCircle} /> */}
                                <IconButton
                                  icon={<MdOutlineDeleteOutline />}
                                  size="xs"
                                  colorScheme="red"
                                  onClick={() =>
                                    handleModal("deleteLesson", courseDetail, z)
                                  }
                                />
                              </HStack>
                            </Box>
                          ))
                        ) : (
                          <></>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  ))
                ) : (
                  <Box bg="white" p={10} borderRadius={5}>
                    <Divider my={5} />
                    <Text>
                      Kamu belum punya section untuk course{" "}
                      <strong>{courseDetail?.title}</strong>, silahkan klik "Add
                      Section" di pojok kanan atas untuk menambah section.
                    </Text>
                  </Box>
                )}
              </Accordion>
            </Card>
          ) : courseDetail?.courseType === "mini_course" &&
            courseDetail?.media ? (
            <Card bg="white" p={5} my={2}>
              <ReactPlayer
                width="full"
                controls={true}
                url={courseDetail?.media}
              />
              <Button
                my={5}
                w="md"
                colorScheme="red"
                onClick={deleteMediaMiniCourse}
              >
                Delete Video
              </Button>
            </Card>
          ) : (
            <Card bg="white" p={5} my={2}>
              <MediaType />
            </Card>
          )}
          {/* <Grid column={1} gap={3}> */}
          {/* </Grid> */}
        </Box>
      </Flex>
      <Modals
        isOpen={isOpen}
        onClose={onClose}
        datas={datas}
        setUpdate={setUpdate}
        update={update}
      />
    </>
  );
};

export default SingleCourse;
