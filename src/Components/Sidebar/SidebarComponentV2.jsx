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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiLogOut, FiSettings,} from "react-icons/fi";

import { UserProfile } from "./UserProfile";
import LogoDeoApp from "../../assets/1.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import store from 'store'


import { data } from "./DataMenu";
import useUserStore from "../../Hooks/Zustand/Store";
import { signOut } from "firebase/auth";

// ** Theme Configuration

function SidebarComponentV2({ layout }) {

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
      <Box
        height="full"
        width={{
          md: "14rem",
          xl: "21rem",
        }}
        display={{
          base: "none",
          lg: "initial",
        }}
        overflowY="auto"
        //   borderRightWidth="1px"
        shadow={"base"}
        roundedBottomRight={"lg"}
        roundedTopRight={"lg"}
      >
        <Box position="sticky" overflowY="auto">
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
              <Stack justify="space-between" spacing="1">
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
                    <Accordion allowMultiple>
                      {data.map((x, i) => (
                        <AccordionItem
                          key={i} isDisabled={x.name === "Chat" || x.name === "Social Media"? true : false}
                        >
                          <h2>
                            <AccordionButton>
                              <Icon as={x.icon} boxSize={5} />
                              <Text fontWeight={"semibold"} pl={3}>
                                {x.name}
                              </Text>
                              <AccordionIcon />
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

                  {layout.type === "vertical-horizontal" &&
                    layout.userProfile === "sidebar" ? (
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
                          // email={currentUser.email}
                          />
                          <Button
                            w={"full"}
                            colorScheme="telegram"
                            size={"sm"}
                            onClick={() => console.log(globalState)}
                          >
                            Check state
                          </Button>
                          {/* <Button
                            w={"full"}
                            colorScheme="telegram"
                            size={"sm"}
                            onClick={logout}
                          >
                            Logout
                          </Button> */}
                        </>
                      ) : (
                        <Box>
                          <Button
                          >Login</Button>
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
                        icon={FiLogOut}
                        onClick={() => logout()}
                        size="sm"
                        colorScheme={"red"}
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
      </Box>
    );

  return <></>;
}

export default SidebarComponentV2;
