import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
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
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AddButtons from "../../Components/Buttons/AddButtons";
import { FcPlus } from "react-icons/fc";
import { DeleteIcon } from "@chakra-ui/icons";

const ProductArticlePage = () => {
  const modalDelete = useDisclosure();
  const globalState = useUserStore();
  const navigate = useNavigate();
  const toast = useToast();

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const [dataProducts, setDataProducts] = useState([]);
  const [dataModal, setDataModal] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [searchedDataProduct, setSearchedDataProduct] = useState([]);

  const getDataProduct = async () => {
    const conditions = [
      { field: "projectId", operator: "==", value: globalState.currentProject },
      { field: "type", operator: "==", value: "pages" },
    ];
    // const sortBy = { field: "createdAt", direction: "desc" };
    // const limitValue = startIndex + itemsPerPage;

    try {
      const res = await getCollectionFirebase(
        "listings_product",
        conditions
        // sortBy,
        // limitValue
      );
      console.log(res);
      setDataProducts(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMore = () => {
    setStartIndex((prev) => prev + itemsPerPage); // Tambahkan jumlah data per halaman saat tombol "Load More" diklik
  };

  const totalItems = dataProducts?.length || searchedDataProduct?.length || 0;
  const shouldShowLoadMore = totalItems >= startIndex + itemsPerPage;

  const searchFilterFunction = (text) => {
    if (text || text !== "") {
      const newData = dataProducts.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchedDataProduct(newData);
      setSearchInput(text);
    } else {
      setSearchedDataProduct(dataProducts);
      setSearchInput(text);
    }
  };

  const handleModal = (data) => {
    modalDelete.onOpen();
    setDataModal(data);
  };

  console.log(dataModal);

  const handleDeletePages = async () => {
    const collectionName = "listings_product";
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
          modalDelete.onClose();
          getDataProduct();
        });
      });
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  useEffect(() => {
    getDataProduct();

    return () => {};
  }, [globalState.currentProject]);

  return (
    <Stack p={[1, 1, 5]}>
      <Stack spacing={4}>
        <HStack>
          <Heading size={"md"} fontWeight="bold">
            Products
          </Heading>
          <Spacer />
        </HStack>
        <HStack>
          <Input
            mb={3}
            mt={5}
            type="text"
            placeholder="Search Product ..."
            bgColor="white"
            color="black"
            sx={inputStyles}
            fontSize="sm"
            onChange={(e) => searchFilterFunction(e.target.value)}
          />
          <Spacer />
          <Button
            onClick={() => navigate("/products/articles/create")}
            bgColor={"white"}
            shadow="md"
            variant="outline"
            borderColor="#F05A28"
            color="#F05A28"
          >
            <HStack>
              <FcPlus />
              <Text>Article</Text>
            </HStack>
          </Button>
        </HStack>
        <Stack>
          {searchInput !== "" ? (
            <>
              {searchedDataProduct?.length > 0 ? (
                <SimpleGrid columns={[1, null, 2]} spacing={3}>
                  {searchedDataProduct.map((product, i) => (
                    <Flex
                      gap={3}
                      key={i}
                      bg={"white"}
                      borderRadius={"md"}
                      p={3}
                    >
                      <Stack>
                        <Image
                          src={product?.thumbnailURL}
                          boxSize="150px"
                          objectFit="cover"
                        />
                      </Stack>
                      <Stack>
                        <Box>
                          <Heading size={"md"}>{product?.title}</Heading>
                          <Text size={"md"} my={1} fontSize={11}>
                            {moment(product?.createdAt.seconds * 1000).format(
                              "LLL"
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            fontSize={12}
                            cursor={"pointer"}
                            onClick={() =>
                              navigate(`/products/article/view/${product.id}`)
                            }
                          >
                            View product article
                          </Text>
                          <Text
                            fontSize={12}
                            cursor={"pointer"}
                            onClick={() =>
                              navigate(`/products/article/edit/${product.id}`)
                            }
                          >
                            Edit product article
                          </Text>
                        </Box>
                        <Spacer />
                        <Button
                          variant={"unstyled"}
                          onClick={() => handleModal(product)}
                        >
                          <DeleteIcon />
                        </Button>
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
          ) : (
            <>
              {dataProducts?.length > 0 ? (
                <SimpleGrid columns={[1, null, 2]} spacing={3}>
                  {dataProducts.map((product, i) => (
                    <Flex
                      gap={3}
                      key={i}
                      bg={"white"}
                      borderRadius={"md"}
                      p={3}
                    >
                      <Stack>
                        <Image
                          src={product?.thumbnailURL}
                          boxSize="150px"
                          objectFit="cover"
                        />
                      </Stack>
                      <Stack>
                        <Box>
                          <Heading size={"md"}>{product?.title}</Heading>
                          <Text size={"md"} my={1} fontSize={11}>
                            {moment(product?.createdAt.seconds * 1000).format(
                              "LLL"
                            )}
                          </Text>
                        </Box>
                        <Box>
                          {/* <Text fontSize={12}>{product?.description}</Text> */}
                          <Text
                            fontSize={12}
                            cursor={"pointer"}
                            onClick={() =>
                              navigate(`/products/article/view/${product.id}`)
                            }
                          >
                            {/* <a href={`/products/article/${product.id}`}> */}
                            View product article
                            {/* </a> */}
                          </Text>
                          <Text
                            fontSize={12}
                            cursor={"pointer"}
                            onClick={() =>
                              navigate(`/products/article/edit/${product.id}`)
                            }
                          >
                            {/* <a href={`/products/article/${product.id}`}> */}
                            Edit product article
                            {/* </a> */}
                          </Text>
                        </Box>
                        <Spacer />
                        <Button
                          w={"fit-content"}
                          onClick={() => handleModal(product)}
                        >
                          <DeleteIcon boxSize={4} />
                        </Button>
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

      <Modal isOpen={modalDelete.isOpen} onClose={modalDelete.onClose}>
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
              onClick={() => handleDeletePages()}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default ProductArticlePage;