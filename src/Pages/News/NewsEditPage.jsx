import {
  Box,
  Button,
  Flex,
  Heading,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Modal,
  Input,
  Text,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  VStack,
  Spinner,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid,
  Tooltip,
  Image,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  addDocumentFirebase,
  deleteFileFirebase,
  getSingleDocumentFirebase,
  updateDocumentFirebase,
  UploadBlob,
  uploadFile,
  uploadFileV2,
} from "../../Api/firebaseApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { serverTimestamp } from "firebase/firestore";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useUserStore from "../../Hooks/Zustand/Store";

import BackButtons from "../../Components/Buttons/BackButtons";
import { MdOutlinePermMedia } from "react-icons/md";
import moment from "moment";

const NewsEditPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const idProject = params.id;
  const location = useLocation();
  const datas = location.state;

  const navigate = useNavigate();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const globalState = useUserStore();

  const projectId = globalState.currentProject;
  const companyId = globalState.currentCompany;

  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesImage, setFilesImage] = useState([]);
  const [dataInput, setDataInput] = useState({
    tags: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef();

  const toast = useToast();

  const getNews = async () => {
    const res = await getSingleDocumentFirebase("news", idProject);

    setDataInput({
      title: res.title,
      // thumbnail: res.thumbnail,
      content: res.content,
      tags: res.tags,
    });
    setFiles(res?.thumbnail);
    setImageUrl(res?.thumbnail);
  };

  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;

    if (newFiles.length) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          setFiles(newFileArray);

          if (i === 0) {
            setImageUrl(reader.result);
          }
        };
      }
      setFilesImage(newFiles);
    }
  };

  useEffect(() => {
    if (idProject) {
      getNews();
    }
  }, [idProject]);

  const handleDropImage = async (file) => {
    const filesFormats = ["image/jpg", "image/jpeg", "image/png", "image/heic"];
    const isRightFormat = filesFormats.includes(file?.type);
    if (!isRightFormat) {
      toast({
        title: "Please upload image with the following formats:",
        description: ".png, .jpeg, .jpg, .webp, .heic",
        isClosable: true,
        duration: 9000,
        status: "error",
      });
      return;
    }
    setIsUploading(true);

    if (dataInput.title || dataInput.title === "") {
      await uploadFile(dataInput.title, "articles", file).then(
        (uploadedImg) => {
          console.log(uploadedImg, "this is data result");
          setDataInput({
            ...dataInput,
            thumbnailURL: uploadedImg,
          });
          setIsUploading(false);
        }
      );

      setIsUploading(false);
    } else {
      toast({
        status: "warning",
        title: " Deoapp CRM",
        description: "Please input title first",
        duration: 2000,
      });
    }

    setIsUploading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setDataInput({
      ...dataInput,
      content: contentRef.current,
      projectId: projectId,
    });
    //
    //
    if (Object.keys(projectId)?.length === 0) {
      setLoading(false);
      toast({
        title: "Which project you want to post this article to?",
        description: "Please select project from the sidebar on the left",
        isClosable: true,
        duration: 9000,
        status: "warning",
      });
    } else {
      // 1. save to news collection via adddoc
      addDocumentFirebase(
        "news",
        {
          ...dataInput,
          content: contentRef.current,
          status: "active",
          createdAt: new Date(),
          timestamp: serverTimestamp(),
          projectId: globalState.currentProject,
          thumbnail:
            dataInput?.thumbnailURL ??
            "https://cdn0-production-images-kly.akamaized.net/vX9Wn584ZkWXU4ehZAr2hpApnKM=/640x360/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3181463/original/093797600_1594883363-r5t6y7u8989HL.jpg",
        },
        companyId
      )
        .then((id) => {
          console.log("added with id ", id);
          toast({
            title: "Posting article success",
            isClosable: true,
            duration: 9000,
            status: "success",
          });
          navigate(-1);
        })
        .catch((err) => {
          console.log(err.message);
          toast({
            title: "Which project you want to post this article to?",
            description:
              "Please select project from the sidebar on the left and make sure to fill the content",
            isClosable: true,
            duration: 9000,
            status: "warning",
          });
        });
      ////2. save to tags by project id, field : news, array union
      // updateDocumentFirebase('tags', currentProject?.id, {
      //     news: [...dataInput.tags]
      // }).finally(() => {
      //     setLoading(true)
      // })
    }
  };

  const handleEdit = async () => {
    setLoading(true);

    let data = {
      ...dataInput,
    };

    if (Object.keys(projectId)?.length === 0) {
      setLoading(false);
      toast({
        title: "Which project you want to post this article to?",
        description: "Please select project from the sidebar on the left",
        isClosable: true,
        duration: 1000,
        status: "warning",
      });
    } else {
      deleteFileFirebase(`${dataInput.title}_800x800`, "articles");

      if (filesImage[0]) {
        const resImage = await uploadFile(
          `${dataInput?.title}-${moment(new Date()).valueOf()}`,
          "articles",
          filesImage[0]
        );
        data.thumbnail = resImage;
      }

      updateDocumentFirebase("news", idProject, data, companyId)
        .then((id) => {
          toast({
            title: "Edit article success",
            isClosable: true,
            duration: 1000,
            status: "success",
          });

          setTimeout(() => {
            navigate(-1);
          }, 1000);
        })
        .catch((err) => {
          console.log(err.message);
          toast({
            title: "Which project you want to post this article to?",
            description: "Please select project from the sidebar on the left",
            isClosable: true,
            duration: 1000,
            status: "warning",
          });
        });
    }
  };

  const handleSaveTag = () => {
    let arr = [...dataInput.tags];
    arr.push(newTag);
    setDataInput({
      ...dataInput,
      tags: arr,
    });
    onClose();
  };

  const deleteTag = (i) => {
    let arr = [...dataInput.tags];
    if (arr.length === 1) {
      arr = [];
      setDataInput({
        ...dataInput,
        tags: arr,
      });
    } else {
      arr.splice(i, 1);
      setDataInput({
        ...dataInput,
        tags: arr,
      });
    }
  };

  const contentChange = (value) => {
    contentRef.current = value;

    setDataInput({ ...dataInput, content: value });
  };

  return (
    <>
      <BackButtons />
      <Flex justifyContent="space-between">
        <Heading>News</Heading>
      </Flex>
      {/* <BreadCrumbComponent data={breadcrumbData} /> */}
      <Box my={10}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            bg="white"
            value={dataInput.title}
            onChange={(e) =>
              setDataInput({ ...dataInput, title: e.target.value })
            }
            placeholder="Title Here"
          />
        </FormControl>
        <Box my={2}>
          <HStack>
            <Text>Tags: </Text>
            <Button onClick={onOpen} colorScheme="green" size="sm">
              Add New Tag
            </Button>
          </HStack>
          {dataInput?.tags?.length > 0 && (
            <Box
              padding={5}
              mt={5}
              bg="white"
              display="flex"
              flexDirection="row"
            >
              <VStack>
                <HStack spacing={4}>
                  {dataInput?.tags?.map((x, i) => (
                    <Tag
                      size={"md"}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="green"
                      key={i}
                    >
                      <TagLabel>{x}</TagLabel>
                      <TagCloseButton onClick={() => deleteTag(i)} />
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            </Box>
          )}
        </Box>
        <Box mb="5">
          <Tooltip label="Thumbnail image for your news / articles">
            <Text fontWeight={600} color="gray.600">
              Thumbnail
            </Text>
          </Tooltip>
          {imageUrl ? (
            <Stack alignItems={"center"}>
              <Image
                src={imageUrl}
                boxSize="100%"
                maxWidth={300}
                borderRadius="xl"
                alt={idProject ? dataInput?.title : files[0]?.name}
                shadow="sm"
              />
              <Flex>
                <Input
                  type="file"
                  onChange={handleFileInputChange}
                  display="none"
                  id="fileInput"
                />

                <label htmlFor="fileInput">
                  <HStack cursor="pointer">
                    <Stack>
                      <MdOutlinePermMedia />
                    </Stack>
                    <Text fontSize="sm" color="blue.600" fontStyle="italic">
                      Change Image thumbnail
                    </Text>
                  </HStack>
                </label>
              </Flex>
            </Stack>
          ) : (
            <Flex
              border={"2px"}
              borderRadius={"md"}
              borderStyle={"dashed"}
              borderColor={"gray.300"}
              h={250}
              w={300}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Input
                type="file"
                onChange={handleFileInputChange}
                display="none"
                id="fileInput"
              />

              <label htmlFor="fileInput">
                <HStack cursor="pointer">
                  <Stack>
                    <MdOutlinePermMedia />
                  </Stack>
                  <Text fontSize="sm" color="blue.600" fontStyle="italic">
                    Add Image thumbnail
                  </Text>
                </HStack>
              </label>
            </Flex>
          )}
          {/* <SimpleGrid columns={2} gap={2}> */}
          {/* <Input
            mt="5"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            type="file"
            // minH='50px'
            // variant={'ghost'}
            // placeholder='Insert image here'
            display={"none"}
            id="fileInput"
            onChange={(e) => handleDropImage(e.target.files[0])}
          /> */}
          {/* <label htmlFor="fileInput">
            <HStack cursor="pointer" mt="3">
              <Stack>
                <MdOutlinePermMedia />
              </Stack>
              <Text fontSize="sm" color="blue.600" fontStyle="italic">
                Add Image Thumbnail for News
              </Text>
            </HStack>
          </label> */}
          {/* <Image
            maxW="300px"
            src={dataInput?.thumbnail?.replace("_800x800$1", "")}
          /> */}
          {/* </SimpleGrid> */}
        </Box>
        {isUploading ? <Spinner /> : null}
        {/* <ReactQuill
                    // theme="snow"
                    value={contentRef.current}
                    onChange={(e) => contentChange(e)}
                // className='quill'
                // style={{
                //     marginTop: 50,
                //     backgroundColor: 'white',
                //     marginBottom: 20
                // }}
                /> */}
        <ReactQuill
          value={idProject ? dataInput?.content : contentRef.current}
          onChange={(e) => contentChange(e)}
        />
        {idProject ? (
          <Button
            mt="5"
            positon="absolute"
            w="full"
            colorScheme="facebook"
            onClick={() => handleEdit(contentRef.current)}
            disabled={loading}
          >
            {loading ? <Spinner mx={5} /> : <Text>Edit</Text>}
          </Button>
        ) : (
          <Button
            mt="5"
            positon="absolute"
            w="full"
            colorScheme="facebook"
            onClick={() => handleSave(contentRef.current)}
            disabled={loading}
          >
            {loading ? <Spinner mx={5} /> : <Text>Save</Text>}
          </Button>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="enter tag here"
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTag();
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveTag}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewsEditPage;
