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
  useToast,
} from "@chakra-ui/react";
import { FiHelpCircle, FiSettings, FiUsers } from "react-icons/fi";
import store from "store";
import {
  FcKindle,
  FcEditImage,
  FcCalendar,
  FcSms,
  FcConferenceCall,
  FcSettings,
  FcLineChart,
  FcShare,
  FcSurvey,
  FcNext,
  FcPrevious,
  FcDatabase
} from "react-icons/fc";
import themeConfig from "../../Config/themeConfig";
import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";
import LogoDeoApp from "../../assets/1.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";


import { data } from "./DataMenu";
import useUserStore from "../../Hooks/Zustand/Store";
import { signOut } from "firebase/auth";
import { useState } from "react";

// ** Theme Configuration

function SidebarComponentV2({ layout }) {
  const [project, setProject] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [profileKey, setProfileKey] = useState("");
  const { setUserDisplay, userDisplay } = useUserStore();
  const [sideBarOpen, setSideBarOpen] = useState(true)

  const globalState = useUserStore();

  const handleCompanySelect = (e) => {
    const dataCompany = globalState.companies;

    const findCompany = dataCompany.find((x) => x.id === e);

    globalState.setCurrentCompany(findCompany.id || e);
    globalState.setCurrentXenditId(findCompany?.xenditId);

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
    const dataProject = globalState.projects;

    const findProject = dataProject.find((x) => x.id === e);

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

  const navigate = useNavigate()

  const toast = useToast()


  const logout = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast({
          status: "success",
          description: "Logged out success",
          duration: 2000,
        });

        globalState.setIsLoggedIn(false);
        navigate("/");
        store.clearAll();
      })
      .catch((error) => {
        console.log(error, "ini error");
      });
  };




  if (layout.type === "vertical" || layout.type === "vertical-horizontal")
    return (
      <>

        {sideBarOpen === true ?

          <Box
            height="full"
            width={{
              md: "14rem",
              xl: "18rem",
            }}
            display={{
              base: "none",
              lg: "initial",
            }}
            overflowY="auto"
            //   borderRightWidth="1px"
            // shadow={"base"}
            roundedBottomRight={"lg"}
            roundedTopRight={"lg"}
          >
            <>
              <Box position="sticky" overflowY="auto">
                <Flex align={'right'} justify={'right'} onClick={() => setSideBarOpen(!sideBarOpen)} cursor={'pointer'} position={'relative'} top={5}>
                  <Box position={'absolute'} boxShadow={'md'} p='3'>

                    <FcPrevious />
                  </Box>
                </Flex>

                <Flex as="section" minH="100vh" bg="white">
                  <Flex
                    flex="1"
                    bg="bg-surface"
                    boxShadow="sm"
                    maxW={{
                      base: "full",
                      sm: "xs",
                    }}
                    py={{
                      base: "4",
                      sm: "6",
                    }}
                    px={{
                      base: "4",
                      sm: "6",
                    }}
                  >


                      <Stack
                        spacing={{
                          base: "5",
                          sm: "6",
                        }}
                        shouldWrapChildren
                      >


                        {/* <Logo /> */}
                        <Center>
                          <Image src={LogoDeoApp} maxH={75} />
                        </Center>

                        <Stack>
                          <Stack alignItems={"center"}>
                            <Select
                              w={["100%", "100%", "100%"]}
                              size={"sm"}
                              defaultValue={globalState.companies[0]}
                              onChange={(e) => {
                                handleCompanySelect(e.target.value);
                              }}
                            >
                              {globalState.companies?.map((select, i) => (
                                <option
                                  defaultValue={globalState.currentCompany}
                                  key={i}
                                  value={select?.id}
                                >
                                  <Text textTransform={"capitalize"}>
                                    {select?.name}
                                  </Text>
                                </option>
                              ))}
                            </Select>
                          </Stack>

                          <Stack alignItems={"center"}>
                            <Select
                              w={["100%", "100%", "100%"]}
                              size={"sm"}
                              defaultValue={globalState.projects[0]}
                              onChange={(e) => {
                                handleProjectSelect(e.target.value);
                              }}
                            >
                              {globalState?.projects?.map((select, i) => (
                                <option
                                  defaultValue={globalState?.currentProject}
                                  key={i}
                                  value={select?.id}
                                >
                                  <Text textTransform={"capitalize"}>
                                    {select?.name}
                                  </Text>
                                </option>
                              ))}
                            </Select>
                          </Stack>


                          <Stack>
                            {/* <HStack>
                            <Icon as={FcDatabase} boxSize={5} />
                            <Text fontWeight={"semibold"} pl={3}>
                              Dashboard
                            </Text>
                          </HStack> */}
                            <Accordion>

                              {data.map((x, i) => (
                                <AccordionItem
                                  key={i} isDisabled={x.name === "Chat" || x.name === "Social Media" ? true : false}
                                >
                                  <h2>
                                    <AccordionButton>
                                      {x.name === 'Dashboard' ?
                                        <Flex m='0' p='0' gap='0' onClick={() => navigate(x?.link)}>
                                          <Icon as={x.icon} boxSize={5} />
                                          <Text fontWeight={"semibold"} pl={3}>
                                            {x.name}
                                          </Text>
                                        </Flex>
                                        :
                                        <>
                                          <Icon as={x.icon} boxSize={5} />
                                          <Text fontWeight={"semibold"} pl={3}>
                                            {x.name}
                                          </Text>
                                          <AccordionIcon />

                                        </>
                                      }
                                    </AccordionButton>
                                  </h2>
                                  {x.submenu ? (
                                    <>
                                      <AccordionPanel>
                                        <Stack>
                                          {x.submenu?.map((subitem, i) => (
                                            <Link to={subitem.link} key={i}>
                                              <HStack spacing="3">
                                                <Icon
                                                  as={subitem.icon}
                                                // boxSize="5"
                                                />
                                                <Text fontSize={"sm"}>
                                                  {subitem.name}
                                                </Text>
                                              </HStack>
                                            </Link>
                                          ))}
                                        </Stack>
                                      </AccordionPanel>
                                    </>
                                  ) : (
                                    <>{null}</>
                                  )}
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </Stack>
                        </Stack>

                        <Stack
                          spacing={{
                            base: "5",
                            sm: "6",
                          }}
                        >

                          <Stack spacing="1">
                            {/* <NavButton label="Help"  icon={FiHelpCircle} /> */}
                            <Button
                              as={Link}
                              to={"/settings"}
                              variant="ghost"
                              justifyContent="start"
                            >
                              <HStack spacing="3">
                                <Icon as={FiSettings} boxSize="5" color="subtle" />
                                <Text>Setting</Text>
                              </HStack>
                            </Button>
                            {/* <NavButton label="Settings" icon={FiSettings} /> */}
                          </Stack>

                          <Spacer  />

                          {layout.type === "vertical-horizontal" &&
                            layout.userProfile === "sidebar" ? (
                            <>
                              <Divider />

                              {globalState.setIsLoggedIn ? (
                                <>
                                  <UserProfile
                                    name={globalState.name}
                                    image={
                                      globalState.email === null
                                        ? "https://tinyurl.com/yhkm2ek8"
                                        : globalState.email
                                    }
                                  email={globalState.email}
                                  />
                                  <Button
                                    w={"full"}
                                    colorScheme="telegram"
                                    size={"sm"}
                                    onClick={() => console.log(globalState)}
                                  >
                                    Check state
                                  </Button>
                                  <Button
                                    w={"full"}
                                    colorScheme="red"
                                    variant={'outline'}
                                    size={"sm"}
                                    onClick={logout}
                                  >
                                    Logout
                                  </Button>
                                </>
                              ) : (
                                <Box>
                                  <Button>Login</Button>
                                </Box>
                              )}
                            </>
                          ) : layout.type === "vertical" ? (
                            <>
                              <Divider />
                              {globalState.isLoggedIn ? (
                                <>
                                  <UserProfile
                                    name={globalState.name}
                                    image={
                                      globalState.email === null
                                        ? "https://tinyurl.com/yhkm2ek8"
                                        : globalState.email
                                    }
                                  email={globalState.email}
                                  />
                                  <Button
                                    w={"full"}
                                    colorScheme="red"
                                    size={"sm"}
                                    variant='outline'
                                    onClick={logout}
                                  >
                                    Logout
                                  </Button>
                                </>
                              ) : (
                                <Box>
                                  <Button
                                    w={"full"}
                                    colorScheme="telegram"
                                    size={"sm"}
                                    as={Link}
                                    to={"/login"}
                                  >
                                    Login
                                  </Button>
                                </Box>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                          <Button
                            w={"full"}
                            colorScheme="telegram"
                            size={"sm"}
                            onClick={() => console.log(globalState)}
                          >
                            Check state
                          </Button>
                        </Stack>
                      </Stack>
                  </Flex>
                </Flex>
              </Box>
            </>


          </Box>
          :
          <Box >
            <Flex align={'right'} justify={'right'} onClick={() => setSideBarOpen(!sideBarOpen)} cursor={'pointer'} position={'relative'} top={5}>
              <Box boxShadow={'md'} p='3'>

                <FcNext />
              </Box>
            </Flex>
          </Box>

        }
      </>
    );

  return <></>;
}

export default SidebarComponentV2;
