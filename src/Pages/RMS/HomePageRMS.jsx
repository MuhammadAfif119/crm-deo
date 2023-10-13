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
  HStack,
  Center,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  addDocumentFirebase,
  arrayUnionFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
  updateDocumentFirebase,
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

const HomePageRMS = () => {
  const globalState = useUserStore();

  const toast = useToast();
  const navigate = useNavigate();
  const modalCreateCompany = useDisclosure();
  const modalCreateProject = useDisclosure();
  const modalCreateOutlet = useDisclosure();
  const modalCreateDetailOutlet = useDisclosure();
  const modalCreateDomain = useDisclosure();
  const [outlets, setOutlets] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [outletId, setOutletId] = useState("");
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

  const [dataOutlet, setDataOutlet] = useState({
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

  const getDataOutlets = async () => {
    const q = query(
      collection(db, "outlets"),
      where("projectId", "==", globalState?.currentProject)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const outletArr = [];
      querySnapshot.forEach((doc) => {
        outletArr.push({ ...doc.data(), id: doc.id });
      });
      setOutlets(outletArr);
    });
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

  const handleCreateOutlets = async () => {
    const data = {
      name: dataOutlet.name,
      owner: [globalState.uid],
      managers: [globalState.uid],
      users: [globalState.uid],
      projectId: globalState.currentProject,
    };

    const pageviewData = {
      name: dataOutlet?.name,
      color_view: "#F05A28",
      image_dashboard: [
        {
          data: "Restaurant",
          image:
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        },
      ],
      projectId: globalState.currentProject,
      companyId: globalState.currentCompany,
      stations: ["wook", "server"],
    };

    try {
      setIsLoading(true);
      if (dataOutlet.name === "") {
        toast({
          title: "Deoapp CRM",
          description: "Please fill the form",
          status: "error",
          duration: 3000,
        });
      } else {
        // const docRef = await addDoc(collection(db, "outlets"), data);
        const docRef = await addDocumentFirebase(
          "outlets",
          data,
          globalState.currentCompany
        );

        setOutletId(docRef);

        const addPageview = await setDocumentFirebase(
          "rms",
          globalState.currentProject,
          { ...pageviewData, outletId: docRef }
          // globalState.currentCompany
        );

        console.log(addPageview);

        toast({
          title: "Deoapp CRM",
          description: "Success Add Outlet",
          status: "success",
          duration: 2000,
        });

        modalCreateOutlet.onClose();
        modalCreateDetailOutlet.onOpen();
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

  const handleCreateDetailOutlet = async () => {
    const data = {
      ...dataOutlet,
    };

    console.log(data, "ini data");

    setIsLoading(true);

    try {
      if (dataOutlet.name === "" || dataOutlet.description === "") {
        toast({
          title: "Deoapp CRM",
          description: "Please fill the form",
          status: "error",
          duration: 3000,
        });
      } else {
        setIsLoading(true);
        const res = await updateDocumentFirebase("outlets", outletId, data);

        toast({
          title: "Deoapp CRM",
          description: "Outlet Created!",
          status: "success",
          duration: 3000,
        });
      }

      getDataOutlets();
      setIsLoading(false);
      modalCreateDetailOutlet.onClose();
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
    getDataOutlets();
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
            {outlets?.length} Outlets found in this project
          </Text>

          {outlets?.length > 0 ? (
            <SimpleGrid columns={3} spacing={3} py={4}>
              {outlets?.map((outlet, i) => (
                <Stack
                  align={"center"}
                  border={"1px"}
                  borderColor={"gray.50"}
                  shadow={"md"}
                  key={outlet.id}
                  py={5}
                  borderRadius={"md"}
                >
                  <Avatar size={"md"} name={outlet.name} src={outlet?.image} />

                  <Text fontWeight={500} textTransform={"capitalize"}>
                    {outlet.name}
                  </Text>
                  {/* <Text fontSize={13}>Total User: {outlet.users?.length}</Text> */}
                  <HStack>
                    <Button
                      colorScheme="blue"
                      size={"xs"}
                      onClick={() => navigate(`dashboard/${outlet.id}`)}
                    >
                      Dashboard Pageview
                    </Button>
                    <Button
                      colorScheme="yellow"
                      size={"xs"}
                      onClick={() =>
                        window.open("https://rms.deoapp.com", "_blank")
                      }
                    >
                      Go To Admin Page
                    </Button>
                    <Button
                      colorScheme="yellow"
                      size={"xs"}
                      onClick={() => navigate(`reports/${outlet.id}`)}
                    >
                      Go To Reports
                    </Button>
                  </HStack>
                </Stack>
              ))}
            </SimpleGrid>
          ) : (
            <Center>
              <Stack align={"center"}>
                <Text>Project has no outlets</Text>
                <Button size={"sm"} onClick={modalCreateOutlet.onOpen}>
                  Create Outlet / Office
                </Button>
              </Stack>
            </Center>
          )}
        </Stack>
      )}

      <Modal
        isOpen={modalCreateOutlet.isOpen}
        onClose={modalCreateOutlet.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Outlet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fill the form correctly</Text>
            <FormLabel fontSize={14} my={3}>
              Outlet Name
            </FormLabel>
            <Input
              onChange={(e) =>
                setDataOutlet({ ...dataOutlet, name: e.target.value })
              }
              placeholder={"Enter outlet name"}
            />

            <Text
              align={"center"}
              fontSize={12}
              my={3}
              fontWeight={500}
              color={"gray.400"}
            >
              The outlet will be assigned to the same project you currently in.
              You currently in {searchProject?.name}'s Project
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="blue"
              mr={3}
              onClick={modalCreateOutlet.onClose}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              colorScheme="green"
              onClick={handleCreateOutlets}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Modal
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
      </Modal> */}

      <Modal
        isOpen={modalCreateDetailOutlet.isOpen}
        onClose={modalCreateDetailOutlet.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Detail Outlet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Fill the form correctly</Text>

            <FormControl>
              <FormLabel fontSize={14}>
                Outlet Name
                <Text as={"span"} color={"gray.400"} fontStyle={"italic"}>
                  {"  "}
                  {"("}your Outlet name{")"}
                </Text>
              </FormLabel>
              <Input
                defaultValue={dataOutlet.name}
                onChange={(e) =>
                  setDataProject({ ...dataOutlet, name: e.target.value })
                }
                placeholder={"Enter project/business name"}
              />
            </FormControl>

            <FormControl my={3}>
              <FormLabel fontSize={14}>Outlet Description</FormLabel>
              <Input
                onChange={(e) =>
                  setDataOutlet({
                    ...dataOutlet,
                    description: e.target.value,
                  })
                }
                placeholder={"Enter project/business description"}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize={14}>Outlet Address</FormLabel>
              <Textarea
                type="text"
                placeholder={"Your Outlet Address"}
                onChange={(e) =>
                  setDataOutlet({ ...dataOutlet, fullAddress: e.target.value })
                }
              />
            </FormControl>

            <FormControl my={2}>
              <HStack>
                <Stack>
                  <Text fontWeight={500} fontSize={14}>
                    Subdistrict
                  </Text>
                  <Input
                    type="text"
                    placeholder={"outlet subdistrict"}
                    onChange={(e) =>
                      setDataOutlet({
                        ...dataOutlet,
                        subdistrict: e.target.value,
                      })
                    }
                  />
                </Stack>

                <Stack>
                  <Text fontWeight={500} fontSize={14}>
                    City/Region
                  </Text>
                  <Input
                    type="text"
                    placeholder={"outlet city"}
                    onChange={(e) =>
                      setDataOutlet({ ...dataOutlet, city: e.target.value })
                    }
                  />
                </Stack>
              </HStack>
            </FormControl>

            <HStack>
              <Stack>
                <Text fontWeight={500} fontSize={14}>
                  Postal Code
                </Text>
                <Input
                  type="number"
                  placeholder={"outlet postal code"}
                  onChange={(e) =>
                    setDataOutlet({ ...dataOutlet, postalCode: e.target.value })
                  }
                />
              </Stack>
              <Stack>
                <Text fontWeight={500} fontSize={14}>
                  Country
                </Text>
                <Input
                  type="text"
                  placeholder={"Outlet country"}
                  onChange={(e) =>
                    setDataOutlet({ ...dataOutlet, country: e.target.value })
                  }
                />
              </Stack>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              onClick={handleCreateDetailOutlet}
              colorScheme="green"
            >
              Create Outlet
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

export default HomePageRMS;
