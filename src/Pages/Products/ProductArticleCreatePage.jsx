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
import moment from "moment";

const ProductArticleCreatePage = () => {
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
  const [files, setFiles] = useState([]);
  const [filesImage, setFilesImage] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
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

  const contentChange = (value) => {
    setContent(value);
  };

  const handleSave = async () => {
    setLoading(true);
    console.log({
      ...dataInput,
      content: content,
      projectId: globalState?.currentProject,
      type: "pages",
    });
    // setDataInput({
    //   ...dataInput,
    //   content: content,
    //   projectId: globalState?.currentProject,
    //   type: "pages",
    // });
    //
    //

    let data = {
      ...dataInput,
      content: content,
      projectId: globalState?.currentProject,
      type: "pages",
    };

    try {
      if (filesImage[0]) {
        const resImage = await uploadFile(
          `${dataInput?.title}-${moment(new Date()).valueOf()}`,
          "articles",
          filesImage[0]
        );
        data.thumbnailURL = resImage;
      }

      addDocumentFirebase("listings_product", data, globalState?.currentCompany)
        .then((id) => {
          toast({
            title: "Deoapp Business",
            description: "Article created!",
            status: "success",
            duration: 1000,
          });

          setTimeout(() => {
            navigate("/products/articles");
          }, 1000);
        })
        .catch((err) => {
          console.log(err.message);
          toast({
            title: "Which project you want to post this article to?",
            description:
              "Please select project from the sidebar on the left and make sure to fill the content",
            isClosable: true,
            duration: 1000,
            status: "warning",
          });
        });
    } catch (error) {
      console.log(error);

      toast({
        title: "Deoapp Business",
        description: error,
        status: "error",
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
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

  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;

    if (dataInput?.title === "" || dataInput?.title === undefined) {
      toast({
        status: "warning",
        title: " Deoapp CRM",
        description: "Please input title first",
        duration: 2000,
      });
    } else {
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
    }
  };

  const handleShareLinkChange = (x) => {
    if (x !== "") {
      setShareLink({ link: x.link, type: x.type });
      const { link, type } = x;
      let htmlContent = "";

      console.log(shareLink, "xxx");

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
      // setDataInput({ ...dataInput, content: content });

      console.log(dataInput);
    }

    closeModal();
  };

  const openModal = () => {
    setModalUploadOpen(true);
  };

  function closeModal() {
    setModalUploadOpen(false);
  }

  return (
    <>
      <BackButtons />
      <Flex justifyContent="space-between">
        <Heading>Article Product</Heading>
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
        <Box my={5}>
          <Tooltip label="Thumbnail image for your articles">
            <Text fontWeight={600} color="gray.600">
              Thumbnail
            </Text>
          </Tooltip>
          {imageUrl ? (
            <>
              <Image src={imageUrl} boxSize="300px" objectFit="cover" />
              <Flex justify={"center"}>
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
            </>
          ) : (
            <Flex justify={"center"}>
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

          {/* </SimpleGrid> */}
        </Box>
        {isUploading ? <Spinner /> : null}
        <FormControl isRequired>
          <FormLabel>
            Phone Number {"("}WhatsApp Active{")"}
          </FormLabel>
          <Input
            w={300}
            bg="white"
            value={dataInput?.phone}
            onChange={(e) =>
              setDataInput({ ...dataInput, phone: e.target.value })
            }
            type="number"
            placeholder="Whatsapp number here"
          />
        </FormControl>
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

        <ReactQuill value={content} onChange={(e) => contentChange(e)} />
        {/* {idProject ? (
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
        )} */}

        <Button
          isLoading={loading}
          my={3}
          size="md"
          colorScheme={"blue"}
          onClick={handleSave}
        >
          Save Article
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

export default ProductArticleCreatePage;
