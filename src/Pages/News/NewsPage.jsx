import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  deleteDocumentFirebase,
  deleteFileFirebase,
  getCollectionFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import { FcPlus } from "react-icons/fc";
import BackButtons from "../../Components/Buttons/BackButtons";

const NewsPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const globalState = useUserStore();
  const deleteModal = useDisclosure();

  const [news, setNews] = useState([]);
  const [dataModal, setDataModal] = useState();
  const [isDeleting, setIsDeleting] = useState(false);

  const [dataSearchNews, setDataSearchNews] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const getNewsData = async () => {
    const q = query(
      collection(db, "news"),
      where("projectId", "==", globalState.currentProject)
      // orderBy("createdAt", "desc"),
      // limit(startIndex + itemsPerPage)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newsArr = [];
      querySnapshot.forEach((doc) => {
        newsArr.push({ ...doc.data(), id: doc.id });
      });
      setNews(newsArr);
    });
  };

  const handleDeleteModal = async (data) => {
    deleteModal.onOpen();
    setDataModal(data);
  };

  const handleDeleteNews = async () => {
    const collectionName = "news";
    const docName = dataModal.id;

    try {
      deleteFileFirebase(`${dataModal.title}_800x800`, "articles").then(() => {
        deleteDocumentFirebase(collectionName, docName).then((res) => {
          toast({
            title: "Deleted!",
            description: res,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          deleteModal.onClose();
        });
      });
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = news.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataSearchNews(newData);
      setInputSearch(text);
    } else {
      setDataSearchNews(news);
      setInputSearch(text);
    }
  };

  const handleLoadMore = () => {
    setStartIndex((prev) => prev + itemsPerPage); // Tambahkan jumlah data per halaman saat tombol "Load More" diklik
  };

  const totalItems = news?.length || dataSearchNews?.length || 0;
  const shouldShowLoadMore = totalItems >= startIndex + itemsPerPage;

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  useEffect(() => {
    getNewsData();

    return () => { };
  }, [globalState.currentProject]);

  return (

    <Stack p={[1, 1, 5]}>
      <Stack spacing={4}>
        <HStack>
          <BackButtons />

          <Heading size={"md"} fontWeight="bold">
            News
          </Heading>
          <Spacer />
          <Button
            onClick={() => navigate("/news/create")}
            bgColor={"white"}
            shadow="md"
            variant="outline"
            borderColor="#F05A28"
            color="#F05A28"
          >
            <HStack>
              <FcPlus />
              <Text>News</Text>
            </HStack>
          </Button>
        </HStack>
        <HStack>
          <Input
            mb={3}
            mt={5}
            type="text"
            placeholder="Search News ..."
            bgColor="white"
            color="black"
            sx={inputStyles}
            fontSize="sm"
            onChange={(e) => searchFilterFunction(e.target.value)}
          />
        </HStack>
        <Stack>
          {inputSearch !== "" ? (
            <>
              {dataSearchNews?.length > 0 ? (
                <SimpleGrid columns={[1, null, 2]} spacing={3}>
                  {dataSearchNews.map((item, i) => (
                    <Flex
                      gap={3}
                      key={i}
                      bg={"white"}
                      borderRadius={"md"}
                      p={3}
                    >
                      <Stack w={"30%"}>
                        <Image
                          src={item?.thumbnail}
                          boxSize={"full"}
                          objectFit="cover"
                        />
                      </Stack>
                      <Stack w={"70%"}>
                        <Box>
                          <Heading size={"md"}>{item?.title}</Heading>
                          <Text size={"md"} my={1} fontSize={11}>
                            {moment(item?.createdAt.seconds * 1000).format(
                              "LLL"
                            )}
                          </Text>
                        </Box>

                        <Spacer />
                        <HStack>
                          <Button
                            variant={"unstyled"}
                            onClick={() => handleDeleteModal(item)}
                          >
                            <FiTrash2 size={15} />
                          </Button>
                          <Button
                            variant={"unstyled"}
                            onClick={() => navigate(`/news/edit/${item.id}`)}
                          >
                            <FiEdit2 size={15} />
                          </Button>
                        </HStack>
                      </Stack>
                    </Flex>
                  ))}
                </SimpleGrid>
              ) : (
                <Box bg={"white"} borderRadius={"md"} p={3}>
                  <Center>
                    <Heading size={"md"}>No News</Heading>
                  </Center>
                </Box>
              )}
            </>
          ) : (
            <>
              {news?.length > 0 ? (
                <SimpleGrid columns={[1, null, 2]} spacing={3}>
                  {news.map((item, i) => (
                    <Flex
                      gap={3}
                      key={i}
                      bg={"white"}
                      borderRadius={"md"}
                      p={3}
                    >
                      <Stack w={"30%"}>
                        <Image
                          src={item?.thumbnail}
                          boxSize={"full"}
                          objectFit="cover"
                        />
                      </Stack>
                      <Stack w={"70%"}>
                        <Box>
                          <Heading size={"md"}>{item?.title}</Heading>
                          <Text size={"md"} my={1} fontSize={11}>
                            {moment(item?.createdAt.seconds * 1000).format(
                              "LLL"
                            )}
                          </Text>
                        </Box>
                        {/* <Box>
                          <Text
                            fontSize={12}
                            cursor={"pointer"}
                            onClick={() => navigate(`/news/edit/${item.id}`)}
                          >
                            Edit news
                          </Text>
                        </Box> */}
                        <Spacer />
                        <HStack>
                          <Button
                            variant={"unstyled"}
                            onClick={() => handleDeleteModal(item)}
                          >
                            <FiTrash2 size={15} />
                          </Button>
                          <Button
                            variant={"unstyled"}
                            onClick={() => navigate(`/news/edit/${item.id}`)}
                          >
                            <FiEdit2 size={15} />
                          </Button>
                        </HStack>
                      </Stack>
                    </Flex>
                  ))}
                </SimpleGrid>
              ) : (
                <Box bg={"white"} borderRadius={"md"} p={3}>
                  <Center>
                    <Heading size={"md"}>No Products</Heading>
                  </Center>
                </Box>
              )}
            </>
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
      </Stack>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Article</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure want to delete article <b>{dataModal?.title}</b>?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              leftIcon={<DeleteIcon />}
              onClick={() => handleDeleteNews()}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default NewsPage;
