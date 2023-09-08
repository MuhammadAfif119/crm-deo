import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Text,
  HStack,
  IconButton,
  SimpleGrid,
  Divider,
  AbsoluteCenter,
  Image,
  ModalFooter,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import {
  deleteDocumentFirebase,
  deleteFileFirebase,
  getSingleDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";

import { formatFrice } from "../../Utils/numberUtil";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { FcPhone } from "react-icons/fc";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiEye } from "react-icons/fi";

const ViewPageListing = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [categoryData, setCategoryData] = useState({});
  const [categoryModule, setCategoryModules] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCategoryNiche, setSelectedCategoryNiche] = useState(null);

  const [pageFilter, setPageFilter] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [detailActive, setDetailActive] = useState("");

  const [modalDetail, setModalDetail] = useState("");
  const [modalDelete, setModalDelete] = useState("");

  const globalState = useUserStore();

  const projectId = globalState.currentProject;

  // const companyId = userDisplay.currentProject;

  const getData = async (category) => {
    console.log(categoryData, "ini category data");
    try {
      const q = query(
        collection(db, "listings"),
        where("projectId", "==", projectId),
        // where("category", 'array-contains', categoryData)
        orderBy("createdAt", "asc"),
        limit(pageSize * page)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData });
        });

        const mappedData = {};
        data.forEach((listing) => {
          const categories = listing.category;
          categories.forEach((category) => {
            if (!mappedData[category]) {
              mappedData[category] = [];
            }
            mappedData[category].push(listing);
          });
        });

        // setCategoryData((prevData) => ({ ...prevData, ...mappedData }));
        setCategoryData(mappedData);
        setSelectedCategory("All");
        setSelectedCategoryNiche(null);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1); // Increment the page number to fetch the next page of data
  };

  const handleLoadMoreFilter = () => {
    setPageFilter(pageFilter + 1); // Increment the page number to fetch the next page of data
  };

  const handleCategory = async (value) => {
    if (categoryModule) {
      try {
        const result = await getSingleDocumentFirebase(
          `categories/${projectId}/listing`,
          "data"
        );
        setCategoryList(result);
        setSelectedCategory(value.toLowerCase());
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("category module error");
    }
  };

  const handleCategoryFilter = async (value) => {
    setSelectedCategoryNiche(value);
    console.log(value);
    try {
      const q = query(
        collection(db, "listings"),
        where("category", "array-contains", value?.toLowerCase()),
        where("projectId", "==", projectId),
        orderBy("createdAt", "asc"),
        limit(10 * pageFilter)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData });
        });

        const mappedData = {};
        data.forEach((listing) => {
          const categories = listing.category;
          categories.forEach((category) => {
            if (!mappedData[category]) {
              mappedData[category] = [];
            }
            mappedData[category].push(listing);
          });
        });

        setCategoryData(mappedData);
        console.log(mappedData);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const getDataCategory = async () => {
    try {
      const unsubscribe = onSnapshot(
        doc(db, "categories", projectId),
        (docCat) => {
          setCategoryModules({ id: docCat.id, ...docCat.data() });
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  useEffect(() => {
    getData();
    getDataCategory();

    return () => {
      setCategoryList([]);
      setSelectedCategory(null);
      setSelectedCategoryNiche(null);
    };
  }, [globalState.currentProject, page]);

  const handleDelete = async (listing) => {
    const collectionName = "listings";
    const docName = listing.id;

    try {
      deleteFileFirebase(`${listing.title}_800x800`, "listings").then(() => {
        deleteFileFirebase(`${listing.title}-logo_800x800`, "listings").then(
          () => {
            deleteDocumentFirebase(collectionName, docName).then((res) => {
              toast({
                title: "Deleted!",
                description: res,
                status: "success",
                duration: 9000,
                isClosable: true,
              });
              setModalDelete(false);
            });
          }
        );
      });
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const handleModalDelete = (value) => {
    setModalDelete(true);
    setDetailActive(value);
  };
  const handleCloseDelete = () => {
    setModalDelete(false);
    setDetailActive("");
  };
  const handleModalDetail = (value) => {
    setModalDetail(true);
    setDetailActive(value);
  };

  const handleCloseDetail = () => {
    setModalDetail(false);
    setDetailActive("");
  };

  const isLink = (value) => {
    const pattern = /^https?:\/\//i;
    return pattern.test(value);
  };

  const renderValue = (detail) => {
    if (isLink(detail.value)) {
      return (
        <a href={detail.value} target="_blank" rel="noopener noreferrer">
          <Text fontStyle={"italic"} color="blue.600" fontWeight={500}>
            Click here
          </Text>
        </a>
      );
    } else {
      return (
        <Text fontSize="sm" textTransform="capitalize">
          {detail.value}
        </Text>
      );
    }
  };

  useEffect(() => {
    if (!selectedCategoryNiche) {
      null;
    } else {
      handleCategoryFilter(selectedCategoryNiche);
    }
  }, [globalState.currentProject, pageFilter]);

  return (
    <Box>
      <Stack py={2}>
        <Text fontSize={"xl"} fontWeight={500}>
          Category
        </Text>
        {categoryModule?.data?.length > 0 && (
          <HStack spacing={3}>
            <Text
              cursor="pointer"
              onClick={() => getData()}
              textTransform="uppercase"
              fontWeight={selectedCategory === "All" ? 500 : "normal"}
              color={selectedCategory === "All" ? "blue.500" : "gray.600"}
            >
              All
            </Text>
            {categoryModule?.data?.map((x, index) => (
              <Text
                key={index}
                cursor="pointer"
                onClick={() => handleCategory(x)}
                textTransform="uppercase"
                fontWeight={selectedCategory === x ? 500 : "normal"}
                color={selectedCategory === x ? "blue.500" : "gray.600"}
              >
                {x === "listing" ? x : "listing"}
              </Text>
            ))}
          </HStack>
        )}

        {categoryList && selectedCategory !== "All" && (
          <HStack
            spacing={3}
            overflowY={"auto"}
            css={{
              "&::-webkit-scrollbar": {
                height: "0rem",
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
                // backgroundColor: 'whitesmoke'
              },
              "&::-webkit-scrollbar-thumb": {
                // background: 'DarkGray',
                height: "2px",
                // borderRadius: '24px',
              },
            }}
          >
            {categoryList?.category?.map((x, index) => (
              <Text
                key={index}
                onClick={() => handleCategoryFilter(x)}
                textTransform="capitalize"
                fontWeight={selectedCategoryNiche === x ? 500 : "normal"}
                color={selectedCategoryNiche === x ? "blue.500" : "gray.600"}
                cursor="pointer"
              >
                {x}
              </Text>
            ))}
          </HStack>
        )}
        <Divider />
      </Stack>

      {Object.entries(categoryData).map(([category, categoryListing]) => {
        return (
          (!selectedCategoryNiche || selectedCategoryNiche === category) && (
            <Stack spacing={2} key={category} py={2}>
              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter bg="black" borderRadius="md" p="2">
                  <Text fontWeight={500} fontSize={23} color="white">
                    {category?.toUpperCase()}
                  </Text>
                </AbsoluteCenter>
              </Box>
              <SimpleGrid columns={[1, 2, 3]} gap={5}>
                {categoryListing?.map((listing, index) => {
                  return (
                    <Stack
                      mb={2}
                      key={index}
                      borderRadius="md"
                      borderWidth={1}
                      shadow="md"
                      p={3}
                      _hover={{
                        bg: "gray.100",
                        transform: "scale(1.02)",
                        transition: "0.3s",
                        cursor: "pointer",
                      }}
                      transition={"0.2s ease-in-out"}
                    >
                      {listing.image && (
                        <Box flex="1" position={"relative"}>
                          <IconButton
                            icon={<MdDelete />}
                            aria-label="Delete Listing"
                            onClick={() => handleModalDelete(listing)}
                            position="absolute"
                            right={2}
                            bottom={2}
                          />
                          <Image
                            minH="150px"
                            objectFit={"fill"}
                            borderRadius={"md"}
                            src={listing.image}
                            alt={listing.title}
                            onClick={() => handleModalDetail(listing)}
                          />
                        </Box>
                      )}
                      <Stack
                        spacing={1}
                        onClick={() => handleModalDetail(listing)}
                      >
                        <HStack>
                          <Text fontWeight={"bold"} fontSize="lg">
                            Rp. {formatFrice(Number(listing.price))}
                          </Text>

                          {listing.priceEnd && (
                            <Text fontWeight={"bold"} fontSize="lg" mx="1">
                              {" "}
                              - Rp. {formatFrice(Number(listing.priceEnd))}{" "}
                            </Text>
                          )}
                        </HStack>

                        <Text
                          textTransform={"capitalize"}
                          color="gray.500"
                          noOfLines={1}
                        >
                          {listing.title}
                        </Text>
                        <Text color="gray.500" fontSize={"xs"} noOfLines={1}>
                          CP: {listing.contactPerson}
                        </Text>
                        <HStack>
                          <FiEye color="gray" size={15} />
                          <Text color="gray.500" fontSize={"xs"} noOfLines={1}>
                            {listing.seen ? listing.seen?.length : 0}
                          </Text>
                        </HStack>
                        {/* <Text>Details:</Text>
                  {listing?.details?.map((detail, index) => (
                    <HStack key={index} spacing={2} alignItems="center">
                      <Text fontWeight="bold">{detail.key}:</Text>
                      <Text>{detail.value}</Text>
                    </HStack>
                  ))} */}
                      </Stack>
                    </Stack>
                  );
                })}
              </SimpleGrid>
              {selectedCategory === "All" ? (
                <Box align={"center"}>
                  <Button
                    onClick={() => handleLoadMore()}
                    variant="outline"
                    colorScheme="blue"
                    size="md"
                    alignSelf="center"
                    mt={4}
                  >
                    Load More
                  </Button>
                </Box>
              ) : (
                <Box align={"center"}>
                  <Button
                    onClick={() => handleLoadMoreFilter()}
                    variant="outline"
                    colorScheme="blue"
                    size="md"
                    alignSelf="center"
                    mt={4}
                  >
                    Load More
                  </Button>
                </Box>
              )}
            </Stack>
          )
        );
      })}

      <Modal
        size={"2xl"}
        isOpen={modalDetail}
        onClose={() => handleCloseDetail()}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={1} py={3}>
              <Image
                borderRadius="md"
                src={detailActive.image}
                alt={detailActive.title}
              />
              <Stack spacing={1} py={2}>
                <Flex justify={"space-between"} gap="5">
                  <Text
                    textTransform="capitalize"
                    color="gray.800"
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    {detailActive.title}
                  </Text>
                  {detailActive.logo ? (
                    <>
                      <Spacer />
                      <Text color="gray.600">Logo:</Text>
                      <Image
                        src={detailActive.logo}
                        alt={detailActive.title}
                        w="100px"
                        h="50px"
                        objectFit={"contain"}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </Flex>
                <Text color="gray.500">{detailActive.description}</Text>
                <Stack justifyContent="space-around" alignItems="flex-start">
                  <Stack spacing={0} alignItems="flex-end" w={"full"}>
                    <Text color="gray.600">Price</Text>
                    <HStack>
                      <Text fontWeight={"bold"} fontSize="lg">
                        Rp. {formatFrice(Number(detailActive.price))}
                      </Text>

                      {detailActive?.priceEnd && (
                        <Text fontWeight={"bold"} fontSize="lg" mx="1">
                          {" "}
                          - Rp. {formatFrice(
                            Number(detailActive.priceEnd)
                          )}{" "}
                        </Text>
                      )}
                    </HStack>
                  </Stack>

                  <Spacer />
                  <Stack h={"250px"} overflowY="scroll">
                    <Text color="gray.600">Details:</Text>
                    {detailActive?.details?.map((detail, index) => (
                      <HStack key={index} spacing={2} alignItems="center">
                        <Text
                          fontSize="sm"
                          maxW={"500px"}
                          textTransform="capitalize"
                          fontWeight="bold"
                        >
                          {detail.key}:
                        </Text>
                        <Spacer />
                        {renderValue(detail)}
                      </HStack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack gap={3}>
              <HStack spacing={2}>
                <Text color="gray.900" fontWeight={500} fontSize="md">
                  CP:{detailActive.contactPerson}
                </Text>
                <FcPhone size={20} />
              </HStack>
              <HStack>
                {/* <Button leftIcon={<CloseIcon boxSize={3} />} colorScheme="red" onClick={() => handleCloseDetail()}>

                  Cancel
                </Button> */}
                <Button
                  leftIcon={<EditIcon boxSize={3} />}
                  colorScheme="green"
                  onClick={() =>
                    navigate(`/listing/edit?id=${detailActive.id}`)
                  }
                >
                  Edit
                </Button>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalDelete}
        onClose={() => handleCloseDelete()}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure want to delete listing <b>{detailActive.title}</b>?
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<MdDelete boxSize={3} />}
              colorScheme="red"
              onClick={() => handleDelete(detailActive)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ViewPageListing;
