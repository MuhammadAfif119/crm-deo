/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-expressions */
import { Icon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Image,
  Select,
  Spacer,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
  SimpleGrid,
  Drawer,
  useDisclosure,
  Avatar,
  TagLabel,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiSettings, FiLogOut } from "react-icons/fi";
import store from "store";
import {
  IoIosArrowForward,
  IoIosArrowBack,
  IoIosArrowDropdownCircle,
} from "react-icons/io";
import { UserProfile } from "./UserProfile";
import LogoDeoApp from "../../assets/1.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";

import { data, dataApps } from "./DataMenu";
import useUserStore from "../../Hooks/Zustand/Store";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  addDocumentFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
} from "../../Api/firebaseApi";
import themeConfig from "../../Config/themeConfig";
import { logoutUserWithIp } from "../../Hooks/Middleware/sessionMiddleWare";
import { removeSymbols } from "../../Utils/Helper";
import { BiAlignLeft } from "react-icons/bi";
import { BsPersonLinesFill } from "react-icons/bs";
import { encryptToken } from "../../Utils/encrypToken";

// ** Theme Configuration

function SidebarComponentV3({ layout }) {
  const [menu, setMenu] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [userInfo, setUserInfo] = useState("");
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [desktopShow, setDesktopShow] = useState(true);
  const [hidden, setHidden] = useState(!isOpen);
  const modalAddProject = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const [dataProject, setDataProject] = useState({
    name: "",
    description: "",
    modules: ["crm"],
  });

  const detailSubMenu = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: desktopShow });

  const [listProject, setListProject] = useState([]);

  const globalState = useUserStore();

  const uid = globalState?.uid;

  const encryptUid = encryptToken(uid);
  const encryptFix = encodeURIComponent(encryptUid);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    }, 800);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // console.log(globalState);

  const fetchProjects = async (id) => {
    const searchProjectId = globalState?.projects?.find(
      (x) => x.companyId === id
    );

    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: globalState.uid,
      },
      {
        field: "companyId",
        operator: "==",
        value: id,
      },
    ];

    const projects = await getCollectionFirebase("projects", conditions);

    const fetchProjectId = localStorage.getItem("currentProject");

    // Set the projects for the company
    globalState.setProjects(projects);

    if (!fetchProjectId) {
      // If there's no project explicitly selected, set the first project as the current project
      if (projects.length > 0) {
        globalState.setCurrentProject(projects[0].id);
        localStorage.setItem("currentProject", projects[0].id);
      } else {
        // Handle the case when no projects are available for the company
        globalState.setCurrentProject(null);
        localStorage.removeItem("currentProject");
      }
    } else {
      // Handle the case when a project was explicitly selected
      globalState.setCurrentProject(fetchProjectId);
    }
    // if (!fetchProjectId) {
    //   console.log("kondisi 1 jalan");

    //   try {
    //     globalState.setProjects(projects);
    //     // console.log(projects, "ini project");
    //     globalState.setCurrentProject(projects[0].id);
    //     localStorage.setItem("currentProject", projects[0].id);

    //     if (
    //       projects.length > 0 &&
    //       projects[0].owner?.includes(globalState.uid)
    //     ) {
    //       globalState.setRoleProject("owner");
    //     } else if (
    //       projects.length > 0 &&
    //       projects[0].managers?.includes(globalState.uid)
    //     ) {
    //       globalState.setRoleProject("managers");
    //     } else {
    //       globalState.setRoleProject("user");
    //     }
    //   } catch (error) {
    //     console.log(error, "ini error");
    //   }
    // } else {
    //   console.log("kondisi 2 jalan");
    //   const getProjects = await getSingleDocumentFirebase(
    //     "projects",
    //     fetchProjectId
    //   );

    //   if (searchProjectId === undefined) {
    //     globalState.setProjects(projects);
    //     globalState.setCurrentProject(fetchProjectId);
    //     localStorage.setItem("currentProject", projects[0]?.id);
    //   } else {
    //     globalState.setProjects(projects);
    //     globalState.setCurrentProject(fetchProjectId);
    //     localStorage.setItem("currentProject", projects[0]?.id);
    //   }

    //   if (getProjects?.owner?.includes(globalState.uid)) {
    //     globalState.setRoleProject("owner");
    //   } else if (getProjects?.managers?.includes(globalState.uid)) {
    //     globalState.setRoleProject("managers");
    //   } else {
    //     globalState.setRoleProject("user");
    //   }
    // }

    setListProject(projects);
  };

  const user = auth.currentUser;

  useEffect(() => {
    fetchProjects(globalState.currentCompany);

    return () => {};
  }, [globalState.currentCompany]);

  const navigate = useNavigate();

  const toast = useToast();

  const handleSelectMenu = (value) => {
    setMenu(value);

    if (value.status) {
      null;
    } else {
      if (value?.link?.includes("https")) {
        window.open(value?.link, "_blank");
      } else {
        navigate(value.link);
      }
    }
  };

  const logout = async () => {
    const pathLink = "crm";
    await logoutUserWithIp(
      window.location.hostname,
      globalState?.email,
      pathLink
    );

    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast({
          status: "success",
          description: "Logged out success",
          duration: 2000,
        });

        globalState.setIsLoggedIn(false);
        store.clearAll();
      })
      .catch((error) => {
        console.log(error, "ini error");
      })
      .finally(() => {
        navigate("/login");
      });
  };

  // const handleCompanySelect = (e) => {
  //   globalState.setIsLoading(true);
  //   const dataCompany = globalState.companies;

  //   const findCompany = dataCompany.find((x) => x.id === e);

  //   localStorage.setItem("currentCompany", findCompany.id || e);
  //   globalState.setCurrentCompany(findCompany.id || e);
  //   globalState.setUsers(findCompany.users);
  //   globalState.setCurrentXenditId(findCompany?.xenditId);

  //   if (findCompany.id || e) {
  //     fetchProjects(findCompany.id || e);
  //   }

  //   if (findCompany.owner && findCompany.owner.includes(e)) {
  //     // Jika iya, tambahkan field "owner" ke dalam objek data[0]
  //     globalState.setRoleProject("owner");
  //   } else if (findCompany.managers && findCompany.managers.includes(e)) {
  //     globalState.setRoleProject("managers");
  //   } else {
  //     globalState.setRoleProject("user");
  //   }

  //   setTimeout(() => {
  //     globalState.setIsLoading(false);
  //   }, 1000);
  // };

  const handleCompanySelect = async (e) => {
    globalState.setIsLoading(true);
    const dataCompany = globalState.companies;

    const findCompany = dataCompany.find((x) => x.id === e);

    localStorage.setItem("currentCompany", findCompany.id || e);
    globalState.setCurrentCompany(findCompany.id || e);
    globalState.setUsers(findCompany.users);
    globalState.setCurrentXenditId(findCompany?.xenditId);

    if (findCompany.id || e) {
      const conditions = [
        {
          field: "users",
          operator: "array-contains",
          value: globalState.uid,
        },
        {
          field: "companyId",
          operator: "==",
          value: findCompany.id || e,
        },
      ];

      const projects = await getCollectionFirebase("projects", conditions);

      globalState.setProjects(projects);

      const projectWithSameCompany = projects?.find(
        (project) =>
          project.companyId === localStorage.getItem("currentProject")
      );

      if (projectWithSameCompany) {
        globalState.setCurrentProject(projectWithSameCompany.id);
        localStorage.setItem("currentProject", projectWithSameCompany.id);
      } else if (projects.length > 0) {
        globalState.setCurrentProject(projects[0].id);
        localStorage.setItem("currentProject", projects[0].id);
      } else {
        globalState.setCurrentProject(null);
        localStorage.removeItem("currentProject");
      }
    }

    if (findCompany.owner && findCompany.owner.includes(e)) {
      globalState.setRoleProject("owner");
    } else if (findCompany.managers && findCompany.managers.includes(e)) {
      globalState.setRoleProject("managers");
    } else {
      globalState.setRoleProject("user");
    }

    setTimeout(() => {
      globalState.setIsLoading(false);
    }, 1000);
  };

  const handleProjectSelect = (e) => {
    if (e === "add project") {
      modalAddProject.onOpen();
    } else {
      globalState.setIsLoading(true);
      const dataProject = listProject;

      const findProject = dataProject.find((x) => x.id === e);
      localStorage.setItem("currentProject", findProject.id || e);
      globalState.setCurrentProject(findProject.id || e);

      if (findProject.owner && findProject.owner.includes(e)) {
        // Jika iya, tambahkan field "owner" ke dalam objek data[0]
        globalState.setRoleProject("owner");
      } else if (findProject.managers && findProject.managers.includes(e)) {
        globalState.setRoleProject("managers");
      } else {
        globalState.setRoleProject("user");
      }

      setTimeout(() => {
        globalState.setIsLoading(false);
      }, 1000);
    }
  };

  const handleAddProject = async () => {
    const data = {
      ...dataProject,
      owner: [globalState.uid],
      users: [globalState.uid],
    };
    setIsLoading(true);

    try {
      if (dataProject.name === "" || dataProject.description === "") {
        toast({
          title: "Deoapp CRM",
          description: "Please fill the form",
          status: "error",
          duration: 3000,
        });
      } else {
        const res = await addDocumentFirebase(
          "projects",
          data,
          globalState.currentCompany
        );

        localStorage.setItem("currentProject", res);
        globalState.setCurrentProject(res);

        toast({
          title: "Deoapp CRM",
          description: "Project Created!",
          status: "success",
          duration: 3000,
        });
      }

      setIsLoading(false);
      modalAddProject.onClose();
      location.reload();
      // window.open('/crm')
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (value) => {
    if (value?.link?.includes("https")) {
      window.open(`${value.link}?id=${encryptFix}`, "_blank");
    } else {
      navigate(value.link);
    }
  };

  if (layout.type === "vertical" || layout.type === "vertical-horizontal")
    return (
      <HStack spacing={"-1"}>
        <Box
          sx={{
            "&::-webkit-scrollbar": {
              w: "2",
              h: "3",
            },
            "&::-webkit-scrollbar-track": {
              w: "6",
              h: "5",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "10",
              bg: `gray.200`,
            },
          }}
          width={"100px"}
          transition={"0.2s ease-in-out"}
          shadow={"xl"}
          roundedBottomRight={"lg"}
          roundedTopRight={"lg"}
          backgroundColor={themeConfig.color.colorFirst}
        >
          <Box position="sticky">
            <Stack
              {...getButtonProps()}
              position={"absolute"}
              right={-5}
              top={300}
              bg={"blue.300"}
              h={50}
              borderRadius={"md"}
              zIndex={-1}
              cursor={"pointer"}
              p={1}
              alignItems={"center"}
              justify={"center"}
            >
              {isOpen ? (
                <IoIosArrowBack size={18} color="white" />
              ) : (
                <IoIosArrowForward size={18} color="white" />
              )}
            </Stack>

            <Flex as="section" minH="100vh">
              <Stack>
                <Box onClick={() => navigate("/")} cursor={"pointer"}>
                  <Image src={themeConfig.logokotak} borderRadius="full" />
                </Box>

                <Box px={2}>
                  <Divider />
                </Box>

                <Stack alignItems={"center"}>
                  <Select
                    w={["100%", "100%", "80%"]}
                    size={"sm"}
                    value={globalState?.currentCompany}
                    onChange={(e) => {
                      handleCompanySelect(e.target.value);
                    }}
                  >
                    {globalState.companies?.map((select, i) => (
                      <option key={i} value={select?.id}>
                        <Text textTransform={"capitalize"}>{select?.name}</Text>
                      </option>
                    ))}
                  </Select>
                </Stack>

                <Stack alignItems={"center"}>
                  <Select
                    w={["100%", "100%", "80%"]}
                    size={"sm"}
                    value={globalState?.currentProject}
                    onChange={(e) => {
                      handleProjectSelect(e.target.value);
                    }}
                  >
                    {listProject?.map((select, i) => (
                      <option key={i} value={select?.id}>
                        <Text textTransform={"capitalize"}>{select?.name}</Text>
                      </option>
                    ))}
                    <option value={"add project"} style={{ padding: "10px 0" }}>
                      + New Project
                    </option>
                  </Select>
                </Stack>

                <Stack
                  height={"55vh"}
                  overflowY="scroll"
                  sx={{
                    "&::-webkit-scrollbar": {
                      w: "2",
                      h: "3",
                    },
                    "&::-webkit-scrollbar-track": {
                      w: "6",
                      h: "5",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: "10",
                      bg: `gray.200`,
                    },
                  }}
                >
                  {data.map((menu, i) => (
                    <Stack
                      key={i}
                      pt={2}
                      spacing={1}
                      justifyContent={"center"}
                      alignItems={"center"}
                      onClick={() => handleSelectMenu(menu)}
                      cursor={"pointer"}
                      position="relative"
                    >
                      <Icon as={menu.icon} boxSize={6} />
                      <Text fontSize={10}>{menu.name}</Text>
                      {menu.status ? (
                        <Stack
                          size={"xs"}
                          position="absolute"
                          bgColor={"red"}
                          borderRadius="md"
                          visibility={isVisible ? "visible" : "hidden"}
                          top={2}
                        >
                          <Text
                            color={"white"}
                            fontSize={"xx-small"}
                            fontWeight={500}
                            py={"0.5"}
                            px={1}
                          >
                            Coming Soon
                          </Text>
                        </Stack>
                      ) : null}
                    </Stack>
                  ))}
                </Stack>

                <Stack alignItems={"center"} justifyContent="center">
                  <IoIosArrowDropdownCircle />
                </Stack>
                <Spacer />

                {/* <Button
                  as={Link}
                  to={"/settings"}
                  variant="ghost"
                  justifyContent="start"
                > */}
                <Stack
                  spacing="3"
                  align={"center"}
                  onClick={() => navigate("/administration/user-live")}
                  cursor={"pointer"}
                >
                  <Icon as={BsPersonLinesFill} boxSize={6} color="subtle" />
                  <Text fontSize={10}>Administrations</Text>
                </Stack>
                <Stack
                  spacing="3"
                  align={"center"}
                  onClick={() => navigate("/settings")}
                  cursor={"pointer"}
                >
                  <Icon as={FiSettings} boxSize={6} color="subtle" />
                  <Text fontSize={10}>Setting</Text>
                </Stack>

                {/* </Button> */}

                <Box py={3}>
                  <Center py={2}>
                    {/* <UserProfile
                      image={
                        globalState.email === null
                          ? userInfo.photoURL
                          : globalState.email
                        
                      }
                    /> */}
                    <Avatar
                      boxSize={10}
                      name={user?.displayName}
                      src={user?.photoURL}
                    />
                  </Center>

                  <Box align={"center"}>
                    <Button size={"xs"} colorScheme="red" onClick={logout}>
                      Logout
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Flex>
          </Box>
        </Box>

        <motion.div
          {...getDisclosureProps()}
          hidden={hidden}
          initial={false}
          onAnimationStart={menu?.submenu ? () => setHidden(false) : null}
          onAnimationComplete={menu?.submenu ? () => setHidden(!isOpen) : null}
          animate={menu?.submenu ? { width: isOpen ? 200 : 0 } : 0}
          style={{
            borderStartEndRadius: 20,
            borderEndEndRadius: 20,
            background: "#f5f5f5",
            overflow: "hidden",
            whiteSpace: "nowrap",
            // position: "absolute",
            // left: "0",
            height: "100vh",
            // top: "0",
          }}
        >
          <Stack p={3} h={"100vh"}>
            <Text
              color={"gray.600"}
              my={3}
              fontWeight={"semibold"}
              align={"center"}
              textTransform="uppercase"
            >
              Business Deoapp
            </Text>
            <Box>
              <Divider />
            </Box>
            <Stack spacing={3} pt={3}>
              <Accordion allowToggle>
                {menu.submenu?.map((sub, i) => (
                  <AccordionItem
                    key={i}
                    // isDisabled={x.name === "Social Media" ? true : false}
                  >
                    <h2>
                      <AccordionButton w={"100%"}>
                        <HStack spacing={2} w={"100%"}>
                          <Icon as={sub.icon} boxSize={isDesktop ? 5 : 7} />
                          {isDesktop && (
                            <Text fontWeight={500} fontSize="sm" noOfLines={1}>
                              {sub.name}
                            </Text>
                          )}
                          <Spacer />
                          <AccordionIcon />
                        </HStack>
                      </AccordionButton>
                    </h2>
                    {sub.submenu ? (
                      <>
                        <AccordionPanel>
                          <Stack>
                            {sub.submenu?.map((subitem, i) => (
                              <Box
                                cursor={"pointer"}
                                onClick={() => handleNavigate(subitem)}
                                key={i}
                              >
                                <HStack spacing="3">
                                  <Icon as={subitem.icon} boxSize={5} />
                                  {isDesktop && (
                                    <>
                                      <Text
                                        pl={3}
                                        fontWeight={300}
                                        fontSize="sm"
                                        noOfLines={1}
                                      >
                                        {subitem.name}
                                      </Text>
                                    </>
                                  )}
                                </HStack>
                                <Divider py={1} />
                              </Box>
                            ))}
                          </Stack>
                        </AccordionPanel>
                      </>
                    ) : (
                      <>{null}</>
                    )}
                  </AccordionItem>
                  // <Box
                  //   p={1}
                  //   key={i}
                  //   onClick={() => navigate(sub.link)}
                  //   cursor={"pointer"}
                  // >
                  //   <HStack spacing={3}>
                  //     <Icon as={sub.icon} boxSize={4} />
                  //     <Text fontWeight={500} fontSize={"sm"}>
                  //       {sub.name}
                  //     </Text>
                  //   </HStack>
                  //   <Divider py={1} />
                  // </Box>
                ))}
              </Accordion>
            </Stack>
            <Spacer />
            <Stack spacing={0} align={"center"} color={"gray.500"}>
              <Text fontSize={"xs"}>{globalState.name}</Text>
              <Text fontSize={"xs"}>{globalState.email}</Text>
            </Stack>
            <Divider />
            <Text
              color={"gray.500"}
              align={"center"}
              fontSize={12}
              fontWeight={"semibold"}
            >
              Business Deoapp
            </Text>
          </Stack>
        </motion.div>

        <Modal
          isOpen={modalAddProject.isOpen}
          onClose={modalAddProject.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Project</ModalHeader>
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
              <Button
                isLoading={isLoading}
                onClick={handleAddProject}
                colorScheme="green"
              >
                Add New Project
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
    );

  return <></>;
}

export default SidebarComponentV3;