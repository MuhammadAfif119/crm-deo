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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getCollectionFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ProductArticlePage = () => {
  const globalState = useUserStore();
  const navigate = useNavigate();

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const [dataProducts, setDataProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchedDataProduct, setSearchedDataProduct] = useState([]);

  const getDataProduct = async () => {
    const conditions = [
      { field: "projectId", operator: "==", value: globalState.currentProject },
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
        <Box>
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
        </Box>
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
                          src={product?.image}
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
                          src={product?.image}
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
    </Stack>
  );
};

export default ProductArticlePage;