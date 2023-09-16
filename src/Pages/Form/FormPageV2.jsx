import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
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
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { IoLogoFacebook } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  addDocumentFirebase,
  deleteDocumentFirebase,
  getCollectionFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import { db } from "../../Config/firebase";
import { checkIdSelect } from "../../Hooks/Middleware/UserMiddleWare";
import useUserStore from "../../Hooks/Zustand/Store";
import { encryptToken } from "../../Utils/encrypToken";
import { FcPlus } from "react-icons/fc";
import { FiTrash } from "react-icons/fi";
import { clientTypessense } from "../../Api/Typesense";

function FormPageV2() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const globalState = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [inputSearch, setInputSearch] = useState("");
  const [dataSearchForms, setDataSearchForm] = useState([]);

  const deleteModal = useDisclosure();
  const [dataModal, setDataModal] = useState();

  const [dataForm, setDataForm] = useState([]);

  const [dataInput, setDataInput] = useState({
    title: "",
    projectId: "",
    category: [],
    description: "",
  });

  const navigate = useNavigate();

  const toast = useToast({
    position: "top",
    align: "center",
  });

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = dataForm.filter((form) => {
        const itemData = form.title
          ? form.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataSearchForm(newData);
      setInputSearch(text);
    } else {
      setDataSearchForm(dataForm);
      setInputSearch(text);
    }
  };

  const getData = async () => {
    const conditions = [
      { field: "companyId", operator: "==", value: globalState.currentCompany },
      { field: "projectId", operator: "==", value: globalState.currentProject },
    ];
    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = startIndex + itemsPerPage;

    try {
      const res = await getCollectionFirebase(
        "forms",
        conditions,
        sortBy,
        limitValue
      );
      setDataForm(res);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const handleLoadMore = () => {
    setStartIndex((prev) => prev + itemsPerPage); // Tambahkan jumlah data per halaman saat tombol "Load More" diklik
  };

  // const handleSearch = (q) => {
  //   setInputSearch(q);

  //   const searchParameters = {
  //     q: q,
  //     query_by: "title",
  //     filter_by: `projectId:${globalState.projectId}`,
  //     sort_by: "_text_match:desc",
  //   };
  //   clientTypessense
  //     .collections("forms")
  //     .documents()
  //     .search(searchParameters)
  //     .then((x) => {
  //       const hits = x.hits.map((x) => x.document);
  //       setDataSearchForm(hits);
  //     })
  //     .catch((err) => console.log(err.message));
  // };

  const totalItems = dataSearchForms?.length || dataForm?.length || 0;
  const shouldShowLoadMore = totalItems >= startIndex + itemsPerPage;

  useEffect(() => {
    getData();

    return () => {};
  }, [globalState.currentCompany, globalState.currentProject, startIndex]);

  const handleAddData = (e) => {
    const { name, value } = e.target;
    setDataInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categories = e.target.value
      .split(",")
      .map((category) => category.trim());
    setDataInput((prevData) => ({ ...prevData, category: categories }));
  };

  const handleSubmitModal = async () => {
    const validationResult = checkIdSelect(
      globalState.currentCompany,
      globalState.currentProject
    );

    if (!validationResult.success) {
      toast(validationResult.error);
      return;
    }

    setLoading(true);

    const collectionName = "forms";
    const data = {
      isActive: true,
      title: dataInput.title,
      projectId: globalState.currentProject,
      category: dataInput.category,
      description: dataInput.description,
    };

    try {
      const docID = await addDocumentFirebase(
        collectionName,
        data,
        globalState.currentCompany
      );
      if (docID) {
        const token = encryptToken(docID);

        const collectionNameUpdate = "forms";
        const docName = docID;
        const dataUpdate = {
          token: token,
        };

        try {
          const result = await updateDocumentFirebase(
            collectionNameUpdate,
            docName,
            dataUpdate
          );
          console.log(result); // Pesan toast yang berhasil
          toast({
            title: "Deoapp.com",
            description: "success add new form",
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          getData();
          onClose();
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        }
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (data) => {
    deleteModal.onOpen();
    setDataModal(data);
  };

  const handleDeleteForm = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteDocumentFirebase("forms", dataModal.id);
      setIsDeleting(false);

      toast({
        description: "Success delete form",
        title: "Deoapp CRM",
        duration: 3000,
        status: "success",
      });
      getData();
      deleteModal.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  return (
    <Stack p={[1, 1, 5]} spacing={5}>
      <HStack>
        <Heading size="md">Form Builder</Heading>
        <Spacer />
        <Button
          onClick={onOpen}
          bgColor={"white"}
          shadow="md"
          variant="outline"
          borderColor="#F05A28"
          color="#F05A28"
        >
          <HStack>
            <FcPlus />
            <Text>Form</Text>
          </HStack>
        </Button>
      </HStack>

      <Stack p={[1, 1, 5]}>
        <Input
          mb={3}
          type="text"
          placeholder="Search Forms ..."
          bgColor="white"
          color="black"
          sx={inputStyles}
          fontSize="sm"
          // onChange={(e) => searchFilterFunction(e.target.value)}
          onChange={(e) => searchFilterFunction(e.target.value)}
        />

        {inputSearch !== "" ? (
          <SimpleGrid columns={[1, 2, 3]} gap={3}>
            {dataSearchForms?.length > 0 &&
              dataSearchForms.map((x, index) => {
                return (
                  <Stack
                    key={index}
                    borderWidth="1px"
                    p={3}
                    bgColor="white"
                    shadow={"md"}
                    rounded={5}
                    cursor="pointer"
                    onClick={() => navigate(`/form-builder/${x.id}`)}
                    _hover={{
                      bg: "gray.100",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <Heading textTransform={"capitalize"} size="sm">
                      {x.title}
                    </Heading>
                    <Text color={"gray.700"}>{x.description}</Text>
                    <Spacer />

                    <HStack>
                      {x.isActive && <BsFillCheckCircleFill color="green" />}

                      {x.enableFacebookPixel && <IoLogoFacebook color="blue" />}

                      {x.category.length > 0 &&
                        x.category.map((y, index) => {
                          return (
                            <Text key={index} textTransform="capitalize">
                              {y}
                            </Text>
                          );
                        })}
                      <Spacer />
                      <Text fontSize={"xs"} color={"gray.500"}>
                        {moment(x.createdAt.seconds * 1000).fromNow()}
                      </Text>
                    </HStack>
                  </Stack>
                );
              })}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} gap={3}>
            {dataForm?.length > 0 &&
              dataForm.map((x, index) => {
                return (
                  <Stack
                    key={index}
                    borderWidth="1px"
                    p={3}
                    bgColor="white"
                    shadow={"md"}
                    rounded={5}
                    cursor="pointer"
                    _hover={{
                      bg: "gray.100",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <Stack onClick={() => navigate(`/form-builder/${x.id}`)}>
                      <Heading textTransform={"capitalize"} size="sm">
                        {x.title}
                      </Heading>
                      <Text color={"gray.700"}>{x.description}</Text>
                      <Spacer />

                      <HStack>
                        {x.isActive && <BsFillCheckCircleFill color="green" />}

                        {x.enableFacebookPixel && (
                          <IoLogoFacebook color="blue" />
                        )}

                        {x.category.length > 0 &&
                          x.category.map((y, index) => {
                            return (
                              <Text key={index} textTransform="capitalize">
                                {y}
                              </Text>
                            );
                          })}
                        <Spacer />
                        <Text fontSize={"xs"} color={"gray.500"}>
                          {moment(x.createdAt.seconds * 1000).fromNow()}
                        </Text>
                      </HStack>
                    </Stack>
                    <HStack>
                      <Text fontSize={9} mt={2}>
                        Created by: {x.createdBy}
                      </Text>
                      <Spacer />
                      <Button size={"xs"} onClick={() => handleOpenModal(x)}>
                        <Icon as={FiTrash} />
                      </Button>
                    </HStack>
                  </Stack>
                );
              })}
          </SimpleGrid>
        )}
      </Stack>

      <Stack alignItems={"center"} justifyContent="center">
        <Box>
          {shouldShowLoadMore && (
            <Button onClick={handleLoadMore} size="sm">
              Load More
            </Button>
          )}
        </Box>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Stack>
                <Text>Title</Text>
                <Input
                  name="title"
                  type="text"
                  placeholder="Judul Form"
                  onChange={handleAddData}
                />
              </Stack>

              <Stack>
                <Text>Description</Text>
                <Input
                  name="description"
                  type="text"
                  placeholder="Deskripsi Form"
                  onChange={handleAddData}
                />
              </Stack>

              <Stack>
                <Text>Category</Text>
                <Input
                  type="text"
                  placeholder="Kategori Form (pisahkan dengan koma)"
                  onChange={handleCategoryChange}
                />
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              variant={"outline"}
              size="sm"
              colorScheme="blue"
              mr={3}
              onClick={handleSubmitModal}
            >
              Submit
            </Button>
            <Button
              variant={"outline"}
              size="sm"
              colorScheme="red"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {dataModal?.title} Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this form?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isDeleting}
              variant={"outline"}
              size="sm"
              colorScheme="blue"
              mr={3}
              onClick={handleDeleteForm}
            >
              Yes
            </Button>
            <Button
              variant={"outline"}
              size="sm"
              colorScheme="red"
              mr={3}
              onClick={deleteModal.onClose}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default FormPageV2;
