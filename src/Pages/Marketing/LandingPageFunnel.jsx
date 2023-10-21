import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import useUserStore from "../../Hooks/Zustand/Store";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
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
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import {
  addDocumentFirebase,
  deleteDocumentFirebase,
} from "../../Api/firebaseApi";
import { FcPlus } from "react-icons/fc";
import { Link } from "react-router-dom";
import moment from "moment/moment";

function LandingPageFunnel() {
  const globalState = useUserStore();
  const [lastDoc, setLastDoc] = useState(null);
  const [dataFunnel, setDataFunnel] = useState({});
  const [title, setTitle] = useState("");
  const [funnels, setFunnels] = useState([]);
  const [searchedFunnel, setSearchedFunnel] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [modalNewPage, setModalNewPage] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const deleteFunnelModal = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast({
    position: "top",
    align: "center",
  });

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  const getFunnels = async () => {
    if (!globalState?.currentCompany) {
      return toast({
        title: "Error",
        description: "Please check your select company",
        status: "error",
      });
    }
    if (!globalState?.currentProject) {
      return toast({
        title: "Error",
        description: "Please check your select project",
        status: "error",
      });
    }

    try {
      let q = query(
        collection(db, "funnels"),
        where("projectId", "==", globalState.currentProject),
        where("companyId", "==", globalState.currentCompany),
        orderBy("createdAt", "desc")
      );

      // if (lastDoc) {
      //   q = query(q, startAfter(lastDoc));
      // }

      // q = query(q, limit(9));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const funnelArr = [];
        querySnapshot.forEach((doc) => {
          funnelArr.push({ ...doc.data(), id: doc.id });
        });
        // setFunnels((prevData) => [...prevData, ...funnelArr]);
        setFunnels(funnelArr);

        // if (querySnapshot.size > 0) {
        //   const lastVisible = querySnapshot.docs[querySnapshot.size - 1];
        //   setLastDoc(lastVisible);
        // } else {
        //   setLastDoc(null);
        // }
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  // const loadMoreData = () => {
  //   getFunnels(lastUpdated);
  // };

  const handleOpenModal = (dataFunnel) => {
    deleteFunnelModal.onOpen();
    setDataFunnel(dataFunnel);
  };

  const handleDeleteFunnel = async () => {
    try {
      const result = await deleteDocumentFirebase("funnels", dataFunnel.id);

      toast({
        status: "success",
        title: "Deoapp AI",
        description: "Template Deleted",
        duration: 1000,
      });

      deleteFunnelModal.onClose();
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const handleNewPage = async () => {
    setIsLoading(true);
    if (!globalState?.currentCompany) {
      return toast({
        title: "Error",
        description: "Please check your select company",
        status: "error",
      });
    }
    if (!globalState?.currentProject) {
      return toast({
        title: "Error",
        description: "Please check your select project",
        status: "error",
      });
    }

    const dataPage = {
      title: title,
      funnels: [],
      type: "website",
      projectId: globalState.currentProject,
    };

    const collectionName = "funnels";
    const data = dataPage;

    try {
      const docID = await addDocumentFirebase(
        collectionName,
        data,
        globalState.currentCompany
      );

      setModalNewPage(false);
      getFunnels();
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setIsLoading(false);
      setModalNewPage(false);
    }
  };

  const searchFunnel = (text) => {
    if (text) {
      const newData = funnels?.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchedFunnel(newData);
      setInputSearch(text);
    } else {
      setSearchedFunnel(funnels);
      setInputSearch(text);
    }
  };

  useEffect(() => {
    getFunnels();

    // return () => {
    //   setFunnels([]);
    //   setLastUpdated(null);
    // };
  }, [globalState.currentProject, globalState.currentCompany]);

  return (
    <Stack p={[1, 1, 5]}>
      <HStack>
        <Heading>Funnels</Heading>
        <Spacer />
        <Button
          colorScheme="green"
          variant="outline"
          onClick={() => setModalNewPage(true)}
        >
          <HStack spacing={2}>
            <FcPlus />
            <Text textTransform="uppercase" fontSize="sm" fontWeight={500}>
              New Landing Page
            </Text>
          </HStack>
        </Button>
      </HStack>

      <Input
        type="text"
        placeholder="Search Files ..."
        bgColor="white"
        color="black"
        sx={inputStyles}
        my={4}
        fontSize="sm"
        onChange={(e) => searchFunnel(e.target.value)}
      />

      <Stack>
        <SimpleGrid columns={[1, 2, 3]} gap="4">
          {inputSearch === "" ? (
            <>
              {funnels?.length > 0 ? (
                <>
                  {funnels?.map((x, i) => (
                    <Stack
                      _hover={{
                        transform: "scale(1.03)",
                        transition: "0.2s ease-in-out",
                      }}
                      spacing={2}
                      borderTopWidth={3}
                      borderColor="green.500"
                      bgColor={"white"}
                      key={i}
                      py={4}
                      px={4}
                      borderRadius="md"
                      shadow="md"
                    >
                      <Link to={`view/${x.id}`}>
                        <Text
                          fontWeight={"semibold"}
                          textTransform={"capitalize"}
                        >
                          {x.title}
                        </Text>
                        <Text>Landing Page</Text>
                      </Link>
                      <Spacer />
                      <HStack mt={5}>
                        <Text fontSize={"sm"}>
                          {moment
                            .unix(
                              x?.lastUpdated?.seconds ?? x?.createdAt?.seconds
                            )
                            .fromNow()}
                        </Text>
                        <Spacer />
                        <Button size={"xs"} onClick={() => handleOpenModal(x)}>
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </Stack>
                  ))}
                </>
              ) : (
                <Box>
                  <Text textAlign="center" fontWeight="semibold">
                    No Data Funnel, Please Create One
                  </Text>
                </Box>
              )}
            </>
          ) : (
            <>
              {searchedFunnel?.length > 0 ? (
                <>
                  {searchedFunnel?.map((x, i) => (
                    <Stack
                      _hover={{
                        transform: "scale(1.05)",
                        shadow: "xl",
                      }}
                      transition={"0.2s ease-in-out"}
                      spacing={2}
                      borderTopWidth={3}
                      borderColor="green.500"
                      bgColor={"#2B2B2B"}
                      key={i}
                      py={4}
                      px={4}
                      borderRadius="md"
                      shadow="md"
                    >
                      <Link to={`view/${x.id}`}>
                        <Text fontWeight={"semibold"}>{x.title}</Text>
                        <Text>{x.items} Landing Page</Text>
                      </Link>
                      <HStack mt={5}>
                        <Text fontSize={"sm"}>
                          {moment
                            .unix(
                              x?.lastUpdated?.seconds ?? x?.createdAt?.seconds
                            )
                            .fromNow()}
                        </Text>
                        <Spacer />
                        <Button size={"xs"} onClick={() => handleOpenModal(x)}>
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </Stack>
                  ))}
                </>
              ) : (
                <Box>
                  <Text textAlign="center" fontWeight="semibold">
                    No Data Funnel, Please Create One
                  </Text>
                </Box>
              )}
            </>
          )}
        </SimpleGrid>

        {/* <Center>
          {searchedFunnel === 0 || inputSearch !== "" ? null : (
            <>
              {funnels?.length % 9 === 0 && (
                <Button mt="2" colorScheme="green" onClick={loadMoreData}>
                  Load more
                </Button>
              )}
            </>
          )}
        </Center> */}
      </Stack>

      <Modal
        isOpen={modalNewPage}
        onClose={() => setModalNewPage(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Funnels</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              placeholder="Funnels Name"
              onChange={(e) => setTitle(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Flex gap={5}>
              <Button
                isLoading={isLoading}
                leftIcon={<AddIcon boxSize={3} />}
                colorScheme="green"
                onClick={() => handleNewPage()}
              >
                Add New
              </Button>
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalNewPage(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={deleteFunnelModal.isOpen}
        onClose={deleteFunnelModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{dataFunnel.title} Funnel</ModalHeader>
          <ModalBody>Funnel will be deleted, are you sure?</ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                size={"sm"}
                colorScheme="green"
                onClick={handleDeleteFunnel}
              >
                Yes
              </Button>
              <Button
                size={"sm"}
                colorScheme="red"
                onClick={deleteFunnelModal.onClose}
              >
                No
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default LandingPageFunnel;
