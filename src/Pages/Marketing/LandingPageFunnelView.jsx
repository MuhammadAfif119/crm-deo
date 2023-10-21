import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../Hooks/Zustand/Store";
import {
  addDocumentFirebase,
  arrayUnionFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import BackButtons from "../../Components/Buttons/BackButtons";
import { FcMultipleDevices, FcPlus } from "react-icons/fc";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

function LandingPageFunnelView() {
  const param = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const globalState = useUserStore();
  const [page, setPage] = useState("");
  const [editedPage, setEditedPage] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [title, setTitle] = useState("");
  const [titlePage, setTitlePage] = useState("");
  const [dataFunnel, setDataFunnel] = useState();
  const [dataDomain, setDataDomain] = useState([]);
  const [allDomain, setAllDomain] = useState([]);
  const [modalDomain, setModalDomain] = useState(false);
  const [modalNewPage, setModalNewPage] = useState(false);
  const [dataFunnelPage, setDataFunnelPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePage = (id) => {
    getSingleDocumentFirebase(`funnels/${param.id}/page`, id).then((x) => {
      setPage({ ...x, id });
    });
  };

  const handleAddFunnel = () => {
    setIsLoading(true);
    addDocumentFirebase(
      `funnels/${param.id}/page`,
      {
        title: title,
        title_page: titlePage,
        projectId: globalState.currentProject,
      },
      globalState.currentCompany
    )
      .then((id) => {
        arrayUnionFirebase("funnels", param.id, "funnels", [id])
          .then((x) => {
            setModalNewPage(false);
            setIsLoading(false);
            getFunnel();
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));
  };

  const getEditedFunnelPage = async () => {
    console.log(page);
    try {
      const editedFunnel = await getCollectionFirebase(
        `funnels/${param.id}/page/${page.id}/html`
      );
      setEditedPage(editedFunnel[0]);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  console.log(param.id);
  console.log(page.id);

  const getFunnel = () => {
    getSingleDocumentFirebase("funnels", param.id)
      .then(async (x) => {
        setDataFunnel(x);
        setTitle(x?.title);

        const dataFunnel = x.funnels;

        if (dataFunnel.length > 0) {
          const conditions = [];
          const sortBy = { field: "createdAt", direction: "desc" };

          try {
            const res = await getCollectionFirebase(
              `funnels/${param.id}/page`,
              conditions,
              sortBy
            );
            setDataFunnelPage(res);
            console.log(res);
          } catch (error) {
            console.log(error, "ini error");
          }
        }
      })
      .catch((err) => console.log(err.message));
  };

  // const getDomain = async () => {
  //   const conditions = [
  //     { field: "companyId", operator: "==", value: globalState.currentCompany },
  //     { field: "projectId", operator: "==", value: globalState.currentProject },
  //   ];

  //   try {
  //     const res = await getCollectionFirebase("domains", conditions);

  //     setDataDomain(res);
  //   } catch (error) {
  //     console.log(error, "ini error");
  //   }
  // };

  const getAllDomain = async () => {
    try {
      const res = await getCollectionFirebase("domains");

      setAllDomain(res);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  // const handleAddDomain = async () => {
  //   setLoading(true);
  //   //find data
  //   const matchingData = allDomain.find((data) => data.name === domainName);

  //   if (matchingData === undefined) {
  //     if (domainName.includes("/")) {
  //       const docID = await addDocumentFirebase(
  //         "domains",
  //         {
  //           // vercelData: response.data,
  //           domain: [domainName],
  //           name: domainName,
  //           uid: globalState.uid,
  //           companyId: globalState.currentCompany,
  //           projectId: globalState.currentProject,
  //           type: "funnel",
  //           createdAt: new Date(),
  //         },
  //         globalState.currentCompany
  //       );

  //       const result = await updateDocumentFirebase("domains", docID, {
  //         pageId: page.id,
  //         funnelId: param.id,
  //       });
  //       console.log(result);

  //       const updateRes = await updateDocumentFirebase(
  //         `funnels/${param.id}/page`,
  //         page.id,
  //         {
  //           domain: domainName,
  //         }
  //       );

  //       toast({
  //         title: "Deoapp AI",
  //         description: "Add Domain Success",
  //         status: "success",
  //       });

  //       toast({
  //         status: "success",
  //         title: "Deoapp AI",
  //         description: "Domain Added",
  //         duration: 2000,
  //       });
  //       // console.log("ID Dokumen Baru:", docID);
  //       const resultUpdate = await addDocumentFirebase(
  //         "logs",
  //         {
  //           activity: `add domain`,
  //           uid: globalState.uid,
  //           projectId: globalState.currentProject,
  //           details: {
  //             domain: domainName,
  //           },
  //         },
  //         globalState.currentCompany
  //       );
  //     } else {
  //       const requestData = {
  //         domain_name: domainName,
  //         projectName: "domainview-react",
  //       };
  //       try {
  //         const response = await postDataApiBearer(
  //           `https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/vercelCreateDomain`,
  //           requestData
  //         );
  //         console.log(response);

  //         if (response.message === "Success") {
  //           const docID = await addDocumentFirebase(
  //             "domains",
  //             {
  //               vercelData: response.data,
  //               domain: [domainName],
  //               name: domainName,
  //               uid: globalState.uid,
  //               companyId: globalState.currentCompany,
  //               projectId: globalState.currentProject,
  //               type: "funnel",
  //               createdAt: new Date(),
  //             },
  //             globalState.currentCompany
  //           );

  //           toast({
  //             status: "success",
  //             title: "Deoapp AI",
  //             description: "Domain Added",
  //             duration: 2000,
  //           });

  //           const resultUpdate = await addDocumentFirebase(
  //             "logs",
  //             {
  //               activity: `add domain`,
  //               uid: globalState.uid,
  //               projectId: globalState.currentProject,
  //               details: {
  //                 domain: domainName,
  //               },
  //             },
  //             globalState.currentCompany
  //           );

  //           console.log(resultUpdate, "logs update");
  //         } else {
  //           toast({
  //             status: "error",
  //             title: "Deoapp AI",
  //             // description: `Error creating domain ${response.message}`,
  //             duration: 2000,
  //           });
  //         }
  //         setLoading(false);
  //         // Lakukan sesuatu dengan data response
  //       } catch (error) {
  //         console.log(error);
  //         // Tangani error dengan cara yang sesuai
  //       }
  //     }
  //   } else {
  //     toast({
  //       status: "error",
  //       title: "Deoapp AI",
  //       description: `Error creating domain`,
  //       duration: 2000,
  //       position: "top",
  //     });
  //   }
  // };

  const handleOpenDomain = () => {
    //   getDomain();
    setModalDomain(true);
  };

  const addToDomain = async (selectedDomain) => {
    try {
      const result = await updateDocumentFirebase(
        "domains",
        selectedDomain.id,
        { pageId: page.id, funnelId: param.id }
      );

      const updateRes = await updateDocumentFirebase(
        `funnels/${param.id}/page`,
        page.id,
        {
          domain: selectedDomain.name,
        }
      );

      toast({
        title: "Deoapp AI",
        description: "Add Domain Success",
        status: "success",
      });

      const resultUpdate = await addDocumentFirebase(
        "logs",
        {
          activity: `add domain`,
          uid: globalState.uid,
          projectId: globalState.currentProject,
          details: {
            domain: selectedDomain.name,
            pageId: page.id,
            funnelId: param.id,
          },
        },
        globalState.currentCompany
      );

      setModalDomain(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const toastComingSoon = (value) => {
    toast({
      title: "Deoapp",
      description: `${value} still in development. Coming Soon`,
      duration: 2000,
      position: "top",
    });
  };

  console.log(dataFunnel);
  console.log(page);

  useEffect(() => {
    getEditedFunnelPage();

    return () => {};
  }, [page]);

  useEffect(() => {
    getFunnel();
    //   getDomain();
    getAllDomain();

    return () => {};
  }, []);

  return (
    <Stack p={[1, 1, 5]} spacing={5}>
      <HStack>
        <BackButtons />
        <Spacer />
        <Heading size={"lg"} textTransform="capitalize">
          {dataFunnel?.title}
        </Heading>
      </HStack>

      <Flex
        gap={3}
        borderRadius="md"
        shadow="base"
        minH="80vh"
        flexDir={["column", null, "row"]}
      >
        <Box
          border="1px"
          borderRadius="md"
          p="5"
          minWidth="20%"
          bgColor={"white"}
        >
          <HStack>
            <Heading fontSize="lg" p="2">
              Pages
            </Heading>
            <Spacer />

            <Stack cursor={"pointer"} onClick={() => setModalNewPage(true)}>
              <FcPlus />
            </Stack>
          </HStack>
          {dataFunnel?.funnels?.map((z, i) => {
            const funnelPage = dataFunnelPage.find((page) => page.id === z);

            if (funnelPage) {
              return (
                <HStack
                  key={i}
                  borderTop="1px"
                  cursor={"pointer"}
                  onClick={() => handlePage(z)}
                >
                  <Icon as={FcMultipleDevices} />
                  <Text
                    noOfLines={1}
                    fontSize={"sm"}
                    py={2}
                    textTransform="capitalize"
                  >
                    {funnelPage.title_page}
                  </Text>
                </HStack>
              );
            } else {
              return null;
            }
          })}
        </Box>

        <Stack w={"full"} p="5" overflowY="auto" bgColor={"white"} border="1px">
          {page ? (
            page.message ? (
              <Box>
                <HStack>
                  <Text>{page.title_page}</Text>
                  <Spacer />
                  {page.domain ? (
                    <Text to={page?.domain}>{page?.domain}</Text>
                  ) : (
                    <Text>No domain added to this page</Text>
                  )}
                </HStack>
                <HStack>
                  {/* <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      placeholder={page?.domain ? page?.domain : "Enter Domain"}
                      onChange={(e) => setDomainName(e.target.value)}
                    />
                    <InputRightElement width="50">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        mr={2}
                        // onClick={handleAddDomain}
                      >
                        Add Domain
                      </Button>
                    </InputRightElement>
                  </InputGroup> */}
                  <Spacer />
                  {/* <Button
                    colorScheme="blue"
                    mt="2"
                    fontSize={"sm"}
                    onClick={() => handleOpenDomain()}
                  >
                    Domain List
                  </Button> */}
                  <Button
                    mt="2"
                    colorScheme="blue"
                    onClick={() =>
                      navigate(
                        `/marketing/funnel/create/${param.id}/lp-builder/${page.id}`,
                        { state: page }
                      )
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="blue"
                    mt="2"
                    onClick={() =>
                      //   window.open(`http://${page?.domain}`, "_blank")
                      toastComingSoon("View feature")
                    }
                  >
                    View
                  </Button>
                </HStack>
                <Stack>
                  {editedPage !== undefined ? (
                    <>
                      <Stack bgColor={"white"}>
                        <Text>Result</Text>
                        <Stack bgColor={"white"} color="black">
                          <div
                            style={{
                              backgroundColor: "white!important",
                              color: "black!important",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `
                              ${editedPage?.html} <style>${editedPage?.css}</style>`,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </>
                  ) : (
                    <>
                      {page?.message?.length > 0 &&
                        page?.message?.map((x, index) => {
                          return (
                            <Stack key={index} bgColor={"white"}>
                              <Text>{x.title}</Text>
                              <Stack bgColor={"white"} color="black">
                                {x.htmlContent ? (
                                  <div
                                    style={{
                                      backgroundColor: "white!important",
                                      color: "black!important",
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: x.htmlContent,
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </Stack>
                            </Stack>
                          );
                        })}
                    </>
                  )}
                </Stack>
              </Box>
            ) : (
              <Stack
                justifyContent="center"
                alignItems="center"
                h={"full"}
                spacing={5}
                bgColor={"white"}
              >
                <Heading size={"lg"} textTransform="capitalize">
                  Create new {page.title_page}
                </Heading>
                <HStack>
                  <Button
                    colorScheme="yellow"
                    onClick={() =>
                      navigate(
                        `/marketing/funnel/create/${param.id}/lp-builder/${page.id}`,
                        { state: page }
                      )
                    }
                  >
                    Start Creating Landingpage
                  </Button>
                </HStack>
              </Stack>
            )
          ) : (
            <Stack
              alignItems="center"
              justifyContent={"center"}
              h="full"
              bgColor={"white"}
            >
              <Heading size={"lg"} textTransform="capitalize">
                Please select your funnel page
              </Heading>
            </Stack>
          )}
        </Stack>
      </Flex>

      <Modal
        isOpen={modalNewPage}
        onClose={() => setModalNewPage(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Page</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              placeholder="Page Name"
              onChange={(e) => setTitlePage(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <Button
                isLoading={isLoading}
                leftIcon={<AddIcon boxSize={3} />}
                colorScheme="green"
                onClick={() => handleAddFunnel()}
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

      <Modal isOpen={modalDomain} onClose={() => setModalDomain(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>Select Domain</Text>
          </ModalHeader>
          <ModalBody>
            {dataDomain?.map((item) => (
              <HStack mb={4}>
                <Box>
                  {item.pageId ? (
                    <Text>
                      {item.name}
                      <Text as={"i"} color={"GrayText"}>
                        {" "}
                        {"(already used)"}{" "}
                      </Text>
                    </Text>
                  ) : (
                    <Text>{item.name}</Text>
                  )}
                </Box>
                <Spacer />
                {item.pageId ? null : (
                  <Button
                    size={"sm"}
                    onClick={() => addToDomain(item)}
                    colorScheme="green"
                  >
                    +
                  </Button>
                )}
              </HStack>
            ))}
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <Button
                isLoading={isLoading}
                // leftIcon={<AddIcon boxSize={3} />}
                size={"sm"}
                colorScheme="green"
                onClick={() => {
                  navigate("/create-domain");
                }}
              >
                Add New Domain
              </Button>
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                size={"sm"}
                colorScheme="red"
                onClick={() => {
                  setModalDomain(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default LandingPageFunnelView;
