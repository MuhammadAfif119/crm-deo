import React, { useState } from "react";
import BackButtons from "../../Components/Buttons/BackButtons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
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
  Spinner,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdOutlinePermMedia } from "react-icons/md";
import ReactQuill from "react-quill";
import { addDocumentFirebase, uploadFile } from "../../Api/firebaseApi";
import DropboxUploader from "../../Components/DropBox/DropboxUploader";
import useUserStore from "../../Hooks/Zustand/Store";
import { useNavigate } from "react-router-dom";

const NewsCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const modalTag = useDisclosure();
  const globalState = useUserStore();
  const modalUpload = useDisclosure();

  const [newTag, setNewTag] = useState("");
  const [content, setContent] = useState("");
  const [dataInput, setDataInput] = useState({
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);

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
      await uploadFile(dataInput.title, "news", file).then((uploadedImg) => {
        console.log(uploadedImg, "this is data result");
        setDataInput({
          ...dataInput,
          thumbnail: uploadedImg,
        });
        setIsUploading(false);
      });

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

  const contentChange = (value) => {
    setDataInput({ ...dataInput, content: value });
  };

  const handleSave = async () => {
    setLoading(true);
    setDataInput({
      ...dataInput,
      projectId: globalState?.currentProject,
      status: "active",
    });

    console.log(dataInput);
    //
    //

    // 1. save to news collection via adddoc
    addDocumentFirebase(
      "news",
      {
        ...dataInput,
        projectId: globalState?.currentProject,
        status: "active",
      },
      globalState?.currentCompany
    )
      .then((id) => {
        console.log("added with id ", id);
        toast({
          title: "Posting article success",
          isClosable: true,
          duration: 9000,
          status: "success",
        });
        navigate("/news");
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
  };

  const handleSaveTag = () => {
    let arr = [...dataInput.tags];
    arr.push(newTag);
    setDataInput({
      ...dataInput,
      tags: arr,
    });
    modalTag.onClose();
  };

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

      setContent((prevContent) => prevContent + ` ${htmlContent}`);
    }
  };

  const openModal = () => {
    setModalUploadOpen(true);
  };

  function closeModal() {
    setModalUploadOpen(false);
  }

  console.log(dataInput, "ini data input");
  return (
    <>
      <BackButtons />
      <Flex justifyContent="space-between">
        <Heading>Create News</Heading>
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
            <Button onClick={modalTag.onOpen} colorScheme="green" size="sm">
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
                      {/* <TagCloseButton onClick={() => deleteTag(i)} /> */}
                    </Tag>
                  ))}
                </HStack>
              </VStack>
            </Box>
          )}
        </Box>
        <Box mb="5">
          <Tooltip label="Thumbnail image for your articles">
            <Text fontWeight={600} color="gray.600">
              Thumbnail
            </Text>
          </Tooltip>
          {dataInput.thumbnailURL ? (
            <Image
              boxSize="200px"
              objectFit={"cover"}
              src={dataInput?.thumbnailURL}
            ></Image>
          ) : (
            <></>
          )}
          {/* <SimpleGrid columns={2} gap={2}> */}
          <Input
            mt="5"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            type="file"
            display={"none"}
            id="fileInput"
            onChange={(e) => handleDropImage(e.target.files[0])}
          />
          <label htmlFor="fileInput">
            <HStack cursor="pointer" mt="3">
              <Stack>
                <MdOutlinePermMedia />
              </Stack>
              <Text fontSize="sm" color="blue.600" fontStyle="italic">
                Add Image Thumbnail for News
              </Text>
            </HStack>
          </label>
          <Image
            maxW="300px"
            src={dataInput?.thumbnail?.replace("_800x800$1", "")}
          />
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
        <Box align={"right"} my={3}>
          <Button
            onClick={openModal}
            size="sm"
            colorScheme={"blue"}
            variant="outline"
          >
            Add File
          </Button>
        </Box>
        <ReactQuill onChange={(e) => contentChange(e)} />

        <Button
          isLoading={loading}
          my={3}
          size="md"
          colorScheme={"blue"}
          onClick={handleSave}
        >
          Save News
        </Button>
      </Box>

      <Modal isOpen={modalTag.isOpen} onClose={modalTag.onClose}>
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
            <Button variant="ghost" onClick={modalTag.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <DropboxUploader
        isActive={modalUploadOpen}
        onClose={closeModal}
        parentPath={`/${globalState.currentCompanies}/docs-file`}
        shareLink={shareLink}
        setShareLink={handleShareLinkChange}
      />
    </>
  );
};

export default NewsCreatePage;
