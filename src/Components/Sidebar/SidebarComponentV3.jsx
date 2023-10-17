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
  getCollectionFirebase,
  getSingleDocumentFirebase,
} from "../../Api/firebaseApi";
import themeConfig from "../../Config/themeConfig";
import { logoutUserWithIp } from "../../Hooks/Middleware/sessionMiddleWare";
import { removeSymbols } from "../../Utils/Helper";
import { BiAlignLeft } from "react-icons/bi";

// ** Theme Configuration

function SidebarComponentV3({ layout }) {
  const [menu, setMenu] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [userInfo, setUserInfo] = useState("");
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [desktopShow, setDesktopShow] = useState(true);
  const [hidden, setHidden] = useState(!isOpen);

  const detailSubMenu = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: desktopShow });

  const [listProject, setListProject] = useState([]);

  const globalState = useUserStore();

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
    const fetchProjectId = localStorage.getItem("currentProject");

    const searchProjectId = globalState?.projects?.find(
      (x) => x.companyId === id
    );

    console.log(fetchProjectId, "xxx");
    console.log(searchProjectId, "xxx");

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

    if (!fetchProjectId) {
      console.log("kondisi 1 jalan");

      try {
        globalState.setProjects(projects);
        // console.log(projects, "ini project");
        globalState.setCurrentProject(projects[0].id);
        localStorage.setItem("currentProject", projects[0].id);

        if (
          projects.length > 0 &&
          projects[0].owner?.includes(globalState.uid)
        ) {
          globalState.setRoleProject("owner");
        } else if (
          projects.length > 0 &&
          projects[0].managers?.includes(globalState.uid)
        ) {
          globalState.setRoleProject("managers");
        } else {
          globalState.setRoleProject("user");
        }
      } catch (error) {
        console.log(error, "ini error");
      }
    } else {
      console.log("kondisi 2 jalan");
      const getProjects = await getSingleDocumentFirebase(
        "projects",
        fetchProjectId
      );

      globalState.setProjects(projects);
      globalState.setCurrentProject(fetchProjectId);
      localStorage.setItem("currentProject", projects[0]?.id);

      if (getProjects?.owner?.includes(globalState.uid)) {
        globalState.setRoleProject("owner");
      } else if (getProjects?.managers?.includes(globalState.uid)) {
        globalState.setRoleProject("managers");
      } else {
        globalState.setRoleProject("user");
      }
    }

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

  const handleCompanySelect = (e) => {
    globalState.setIsLoading(true);
    const dataCompany = globalState.companies;

    const findCompany = dataCompany.find((x) => x.id === e);

    localStorage.setItem("currentCompany", findCompany.id || e);
    globalState.setCurrentCompany(findCompany.id || e);
    globalState.setUsers(findCompany.users);
    globalState.setCurrentXenditId(findCompany?.xenditId);

    if (findCompany.id || e) {
      fetchProjects(findCompany.id || e);
    }

    if (findCompany.owner && findCompany.owner.includes(e)) {
      // Jika iya, tambahkan field "owner" ke dalam objek data[0]
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
              right={-1}
              top={0}
              bg={"blue.100"}
              borderRadius={"md"}
              zIndex={1}
              cursor={"pointer"}
              p={1}
            >
              {isOpen ? (
                <IoIosArrowBack size={18} />
              ) : (
                <IoIosArrowForward size={18} />
              )}
            </Stack>

            <Flex as="section" minH="100vh" overflowY="scroll">
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
                              <Link to={subitem.link} key={i}>
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
                              </Link>
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
      </HStack>
    );

  return <></>;
}

export default SidebarComponentV3;
