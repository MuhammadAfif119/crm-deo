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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiSettings, FiLogOut } from "react-icons/fi";
import store from "store";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
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
  const [userInfo, setUserInfo] = useState("");
  const { getButtonProps, getDisclosureProps, isOpen } = useDisclosure();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [desktopShow, setDesktopShow] = useState(true);
  const [hidden, setHidden] = useState(!isOpen);

  const detailSubMenu = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: desktopShow });

  const [listProject, setListProject] = useState([]);

  const globalState = useUserStore();

  console.log(globalState, "xxx");

  const fetchProjects = async (id) => {
    const fetchProjectId = localStorage.getItem("currentProject");

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
      try {
        globalState.setProjects(projects);
        console.log(projects, "ini project");
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

  console.log(userInfo);

  const getUserData = async () => {
    const res = await getSingleDocumentFirebase("users", globalState.uid);
    console.log(res);
  };

  const user = auth.currentUser;

  // useEffect(() => {
  //   const getUserInfo = auth.currentUser;
  //   setUserInfo(getUserInfo);

  //   return () => {};
  // }, []);

  useEffect(() => {
    fetchProjects(globalState.currentCompany);

    return () => {};
  }, [globalState.currentCompany]);

  const navigate = useNavigate();

  const toast = useToast();

  const handleSelectMenu = (value) => {
    setMenu(value);
    navigate(value.link);
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

  const handleClick = () => {
    setDesktopShow(!desktopShow);
    setShowSubmenu((prev) => !prev);
  };

  const handleCompanySelect = (e) => {
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
  };

  const handleProjectSelect = (e) => {
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
          // py={5}
          height="100vh"
          // width={isDesktop ? "auto" : "150px"}
          width={"100px"}
          transition={"0.2s ease-in-out"}
          // display={"initial"}
          overflowY="scroll"
          shadow={"xl"}
          // overflow="wrap"
          roundedBottomRight={"lg"}
          roundedTopRight={"lg"}
          backgroundColor={themeConfig.color.colorFirst}
        >
          <Box position="sticky" overflowY="auto">
            <Stack
              {...getButtonProps()}
              position={"absolute"}
              right={-1}
              top={0}
              bg={"blue.100"}
              borderRadius={"md"}
              zIndex={1}
              cursor={"pointer"}
              // onClick={handleClick}
              // alignItems="flex-end"
              // justifyContent={"flex-end"}
              p={1}
            >
              {isOpen ? (
                <IoIosArrowBack size={18} />
              ) : (
                <IoIosArrowForward size={18} />
              )}
            </Stack>
            <Flex as="section" minH="100vh">
              <Stack>
                <Box onClick={() => navigate("/")} cursor={"pointer"}>
                  <Image
                    src={themeConfig.logokotak}
                    borderRadius="full"
                    // maxH={80}
                  />
                </Box>

                <Box px={2}>
                  <Divider />
                </Box>

                <Stack
                  // position={"absolute"}
                  // right={0}
                  cursor={"pointer"}
                  // onClick={handleClick}
                  // alignItems="flex-end"
                  // justifyContent={"flex-end"}
                  // p={2}
                  alignItems={"center"}
                >
                  {/* {desktopShow ? (
                <BiAlignLeft size={20} />
              ) : (
                <BiAlignLeft size={20} />
              )} */}
                  {/* {hidden ? (
                    <Text fontSize={10} textDecoration={"underline"}>
                      Submenu {">"}
                    </Text>
                  ) : (
                    <Text fontSize={10} textDecoration={"underline"}>
                      Submenu {"<"}
                    </Text>
                  )} */}
                </Stack>

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

                <Center>
                  <Stack>
                    {data.map((menu, i) => (
                      <Stack
                        key={i}
                        pt={2}
                        spacing={1}
                        justifyContent={"center"}
                        alignItems={"center"}
                        onClick={() => handleSelectMenu(menu)}
                        cursor={"pointer"}
                      >
                        <Icon as={menu.icon} boxSize={6} />
                        <Text fontSize={10}>{menu.name}</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Center>
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
            >
              DEOAPP CRM
            </Text>
            <Box>
              <Divider />
            </Box>
            <Stack spacing={3} pt={3}>
              {menu.submenu?.map((sub, i) => (
                <Box
                  p={1}
                  key={i}
                  onClick={() => navigate(sub.link)}
                  cursor={"pointer"}
                >
                  <HStack spacing={3}>
                    <Icon as={sub.icon} boxSize={4} />
                    <Text fontWeight={500} fontSize={"sm"}>
                      {sub.name}
                    </Text>
                  </HStack>
                  <Divider py={1} />
                </Box>
              ))}
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
              Deoapp CRM
            </Text>
          </Stack>
        </motion.div>
      </HStack>
    );

  return <></>;
}

export default SidebarComponentV3;
