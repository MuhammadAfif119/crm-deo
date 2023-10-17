import {
  Box,
  Button,
  Heading,
  Modal,
  Stack,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormLabel,
  Input,
  FormControl,
  useToast,
  Avatar,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  useClipboard,
  Tooltip,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  addDocumentFirebase,
  arrayUnionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";
import BackButtons from "../../Components/Buttons/BackButtons";

const HomePageWelcome = () => {
  const globalState = useUserStore();

  const toast = useToast();
  const navigate = useNavigate();
  const modalCreateCompany = useDisclosure();
  const modalCreateProject = useDisclosure();
  const modalCreateDomain = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [listProject, setListProject] = useState([]);
  const [domainPage, setDomainPage] = useState();
  const [dataCompany, setDataCompany] = useState({
    name: "",
  });

  const [dataProject, setDataProject] = useState({
    name: "",
    description: "",
    modules: ["crm"],
  });

  const [dataDomain, setDataDomain] = useState({
    domain: "",
  });

  const getDataDomain = async () => {
    const res = await getSingleDocumentFirebase(
      "domains",
      globalState.currentProject
    );
    setDomainPage(res);
  };

  const handleCreateCompany = async () => {
    const data = {
      name: dataCompany.name,
      owner: [globalState.uid],
      users: [globalState.uid],
    };

    try {
      setIsLoading(true);
      if (dataCompany.name === "") {
        toast({
          title: "Deoapp CRM",
          description: "Please fill the form",
          status: "error",
          duration: 3000,
        });
      } else {
        const docRef = await addDoc(collection(db, "companies"), data);
        console.log("Document written with ID: ", docRef.id);
        setCompanyId(docRef.id);

        modalCreateCompany.onClose();
        modalCreateProject.onOpen();
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    const data = {
      ...dataProject,
      owner: [globalState.uid],
      users: [globalState.uid],
    };

    try {
      setIsLoading(true);
      if (dataProject.name === "" || dataProject.description === "") {
        toast({
          title: "Deoapp CRM",
          description: "Please fill the form",
          status: "error",
          duration: 3000,
        });
      } else {
        const res = await addDocumentFirebase("projects", data, companyId);
        console.log(res);
        console.log(data);

        toast({
          title: "Deoapp CRM",
          description: "Company and Project Created!",
          status: "success",
          duration: 3000,
        });
      }

      getDataProject();
      setIsLoading(false);
      modalCreateProject.onClose();
      // location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDomain = async () => {
    const data = {
      domain: [dataDomain.domain, dataDomain.domain.slice(0, -5)],
      companyId: globalState?.currentCompany,
    };

    try {
      setIsLoading(true);
      if (!domainPage?.domain) {
        const res = await setDocumentFirebase(
          "domains",
          globalState.currentProject,
          data
        );

        toast({
          title: "Deoapp CRM",
          description: "Domain Created!",
          status: "success",
          duration: 3000,
        });

        console.log(res);
      } else {
        const res = await arrayUnionFirebase(
          "domains",
          globalState.currentProject,
          "domain",
          [dataDomain.domain, dataDomain.domain.slice(0, -5)]
        );

        toast({
          title: "Deoapp CRM",
          description: "Domain Created!",
          status: "success",
          duration: 3000,
        });

        console.log(res);
      }

      setIsLoading(false);

      getDataDomain();
      modalCreateDomain.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataProject = async () => {
    const q = query(
      collection(db, "projects"),
      where("companyId", "==", globalState?.currentCompany)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectArr = [];
      querySnapshot.forEach((doc) => {
        projectArr.push({ ...doc.data(), id: doc.id });
      });
      setListProject(projectArr);
    });
  };

  const searchProject = globalState?.projects?.find(
    (x) => x.id === globalState?.currentProject
  );

  const copyToClipboard = (domain) => {
    navigator.clipboard.writeText(domain);

    toast({
      description: "text copied!",
      status: "success",
      duration: 1000,
    });
  };

  const handleSpacebarPress = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Prevents the space character from being entered

      toast({
        position: "top",
        title: "Deoapp CRM",
        description: "Domain name should not contain space character",
        status: "warning",
        duration: 800,
      });
    }
  };

  useEffect(() => {
    getDataProject();
    getDataDomain();
    return () => {};
  }, [globalState?.currentProject]);

  return (
    <Box>
      {/* <Heading align={"center"}>Welcome to Deoapp</Heading> */}
      <BackButtons />

      {globalState.companies?.length === 0 || globalState.projects === 0 ? (
        <Stack my={5} py={10} borderRadius={"md"} shadow={"md"} bg={"white"}>
          <Text align={"center"} fontSize={"sm"}>
            You don't have company and project
          </Text>
          <Box fontSize={"sm"} align={"center"}>
            <Button size={"sm"} onClick={modalCreateCompany.onOpen}>
              Create Company here
            </Button>
          </Box>
        </Stack>
      ) : (
        <Stack my={5} p={10} borderRadius={"md"} shadow={"md"} bg={"white"}>
          <Text fontWeight={500} align={"center"} fontSize={"sm"}>
            You have {globalState.companies.length} Company and{" "}
            {globalState?.projects?.length} Project
          </Text>

          <SimpleGrid columns={3} spacing={3} py={4}>
            {globalState.companies?.map((company, i) => (
              <Stack
                align={"center"}
                border={"1px"}
                borderColor={"gray.50"}
                shadow={"md"}
                key={company.id}
                p={2}
                borderRadius={"md"}
              >
                <Text fontWeight={500} textTransform={"capitalize"}>
                  {company.name}
                </Text>
                <Text fontSize={13}>Total User: {company.users?.length}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      )}

      <Stack my={5} py={10} borderRadius={"md"} shadow={"md"} bg={"white"}>
        {listProject?.length === 0 ? (
          <>
            <Text align={"center"} fontSize={"sm"}>
              Create or Edit your website
            </Text>
            <Box fontSize={"sm"} align={"center"}>
              {listProject?.length === 0 ? (
                <Tooltip label={"Create your Project first"}>
                  <Button
                    isDisabled
                    size={"sm"}
                    onClick={modalCreateCompany.onOpen}
                  >
                    Create here
                  </Button>
                </Tooltip>
              ) : (
                <Button size={"sm"} onClick={modalCreateCompany.onOpen}>
                  Create here
                </Button>
              )}
            </Box>
          </>
        ) : (
          <>
            {searchProject ? (
              <>
                <Stack
                  spacing={3}
                  justifyContent={"center"}
                  alignItems={"center"}
                  my={2}
                >
                  {/* <Avatar size="lg" name={userData?.name} src={user.photoURL} /> */}

                  <Avatar
                    size="xl"
                    name={searchProject?.name}
                    src={searchProject?.image ? searchProject?.image : ""}
                  />

                  <Heading>{searchProject?.name}</Heading>

                  {domainPage?.domain?.length === 0 || !domainPage?.domain ? (
                    <>
                      <Text>The project not setup domain</Text>
                      <Button size={"sm"} onClick={modalCreateDomain.onOpen}>
                        Create Domain
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box align={"center"}>
                        <InputGroup size="sm" w={300} borderRadius={"md"}>
                          <Input
                            isDisabled
                            bg={"gray.100"}
                            value={domainPage?.domain[0]}
                            borderRadius={"md"}
                          />
                          <InputRightAddon
                            cursor={"pointer"}
                            _hover={{ bg: "gray.400" }}
                            onClick={() =>
                              copyToClipboard(domainPage?.domain[0])
                            }
                            bg={"gray.300"}
                            borderRadius={"md"}
                            children="copy"
                          />
                        </InputGroup>
                      </Box>

                      <Button
                        mt={5}
                        size={"sm"}
                        onClick={() => navigate("dashboard")}
                      >
                        Dashboard website
                      </Button>
                    </>
                  )}
                </Stack>
              </>
            ) : (
              <>
                <Text align={"center"} fontSize={"sm"}>
                  Create or Edit your website
                </Text>
                <Box fontSize={"sm"} align={"center"}>
                  <Button size={"sm"} onClick={modalCreateCompany.onOpen}>
                    Create Company Here
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Stack>

      <Modal
        isOpen={modalCreateCompany.isOpen}
        onClose={modalCreateCompany.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fill the form correctly</Text>
            <FormLabel fontSize={14} my={3}>
              Company Name
              <Text as={"span"} color={"gray.400"} fontStyle={"italic"}>
                {"  "}
                {"("}use your name if you're individual{")"}
              </Text>
            </FormLabel>
            <Input
              onChange={(e) =>
                setDataCompany({ ...dataCompany, name: e.target.value })
              }
              placeholder={"Enter company name"}
            />
          </ModalBody>

          <ModalFooter>
            {/* <Button
              colorScheme="blue"
              mr={3}
              onClick={modalCreateCompany.onClose}
            >
              Close
            </Button> */}
            <Button variant="ghost" onClick={handleCreateCompany}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalCreateProject.isOpen}
        onClose={modalCreateProject.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Next Step: Create Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fill the form correctly</Text>

            <FormControl>
              <FormLabel fontSize={14} my={3}>
                Project Name
                <Text as={"span"} color={"gray.400"} fontStyle={"italic"}>
                  {"  "}
                  {"("}your business name{")"}
                </Text>
              </FormLabel>
              <Input
                onChange={(e) =>
                  setDataProject({ ...dataProject, name: e.target.value })
                }
                placeholder={"Enter project/business name"}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize={14} my={3}>
                Project Description
              </FormLabel>
              <Input
                onChange={(e) =>
                  setDataProject({
                    ...dataProject,
                    description: e.target.value,
                  })
                }
                placeholder={"Enter project/business description"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreateProject} variant="ghost">
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalCreateProject.isOpen}
        onClose={modalCreateProject.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fill the form correctly</Text>

            <FormControl>
              <FormLabel fontSize={14} my={3}>
                Project Name
                <Text as={"span"} color={"gray.400"} fontStyle={"italic"}>
                  {"  "}
                  {"("}your business name{")"}
                </Text>
              </FormLabel>
              <Input
                onChange={(e) =>
                  setDataProject({ ...dataProject, name: e.target.value })
                }
                placeholder={"Enter project/business name"}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize={14} my={3}>
                Project Description
              </FormLabel>
              <Input
                onChange={(e) =>
                  setDataProject({
                    ...dataProject,
                    description: e.target.value,
                  })
                }
                placeholder={"Enter project/business description"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreateProject} variant="ghost">
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalCreateDomain.isOpen}
        onClose={modalCreateDomain.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fill the form correctly</Text>

            <FormControl>
              <FormLabel fontSize={14} my={3}>
                Domain Name
              </FormLabel>
              <InputGroup>
                <Input
                  onKeyDown={handleSpacebarPress}
                  onChange={(e) =>
                    setDataDomain({
                      ...dataDomain,
                      domain: `${e.target.value}.deoapp.site`,
                    })
                  }
                  placeholder={
                    "Enter project/business domain. 1 letter no spacing"
                  }
                />
                <InputRightAddon
                  cursor={"pointer"}
                  _hover={{ bg: "gray.400" }}
                  bg={"gray.300"}
                  borderRadius={"md"}
                  children="deoapp.site"
                />
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreateDomain}>Create Domain</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HomePageWelcome;
