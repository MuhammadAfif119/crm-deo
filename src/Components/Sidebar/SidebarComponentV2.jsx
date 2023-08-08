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
} from "@chakra-ui/react";
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
import { getCollectionFirebase } from "../../Api/firebaseApi";
import themeConfig from "../../Config/themeConfig";
import { logoutUserWithIp } from "../../Hooks/Middleware/sessionMiddleWare";

// ** Theme Configuration

function SidebarComponentV2({ layout }) {
  const [desktopShow, setDesktopShow] = useState(true);
  const isDesktop = useBreakpointValue({ base: false, lg: desktopShow });

  const [listProject, setListProject] = useState([])

  const globalState = useUserStore();

  const handleCompanySelect = (e) => {
    const dataCompany = globalState.companies;

    const findCompany = dataCompany.find((x) => x.id === e);

    globalState.setCurrentCompany(findCompany.id || e);
    globalState.setUsers(findCompany.users);
    globalState.setCurrentXenditId(findCompany?.xenditId);

    if (findCompany.id || e) {
      getProjectList(findCompany.id || e)
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

  const getProjectList = async (id) => {

    const conditions = [
      {
        field: "users",
        operator: "array-contains",
        value: globalState?.uid,
      },
      {
        field: "companyId",
        operator: "==",
        value: id,
      },
    ];

    try {

      const projects = await getCollectionFirebase("projects", conditions);

      globalState.setProjects(projects);
      globalState.setCurrentProject(projects[0]?.id);

      if (projects.length > 0 && projects[0].owner?.includes(globalState?.uid)) {
        globalState.setRoleProject("owner");
      } else if (projects.length > 0 && projects[0].managers?.includes(globalState?.uid)) {
        globalState.setRoleProject("managers");
      } else {
        globalState.setRoleProject("user");
      }
      setListProject(projects)



    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProjectList(globalState.currentCompany)

    return () => {
    }
  }, [globalState.currentCompany])


  const handleProjectSelect = (e) => {
    const dataProject = listProject

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
    await logoutUserWithIp(globalState.uid, 'crm')

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
      }).finally(() => {

        navigate("/login");
      })

  };

  const handleClick = () => {
    setDesktopShow(!desktopShow);
  };


  useEffect(() => {

  }, [globalState.isLoggedIn])

  if (layout.type === "vertical" || layout.type === "vertical-horizontal")
    return (
      <>
        <Box
          height="full"
          width={isDesktop ? "auto" : "150px"}
          transition={"0.2s ease-in-out"}
          display={"initial"}
          overflowY="auto"
          shadow={"xl"}
          overflow="wrap"
          roundedBottomRight={"lg"}
          roundedTopRight={"lg"}
          backgroundColor={themeConfig.color.colorFirst}
        >
          <Box position="sticky" overflowY="auto"
          >
            <Stack
              position={"absolute"}
              right={0}
              cursor={"pointer"}
              onClick={handleClick}
              alignItems="flex-end"
              justifyContent={"flex-end"}
              p={2}
            >
              {desktopShow ? (
                <IoIosArrowBack size={20} />
              ) : (
                <IoIosArrowForward size={20} />
              )}
            </Stack>
            <Flex as="section" minH="100vh" >
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
                  justify="space-between" spacing={3}
                >
                  <Stack spacing={4} shouldWrapChildren>
                    {/* <Logo /> */}
                    {isDesktop ? (
                      <Center>
                        <Image src={themeConfig.logo} maxH={100} />
                      </Center>
                    ) : (
                      <Center>
                        <Image
                          src={themeConfig.logokotak}
                          borderRadius="full"
                          maxH={50}
                        />
                      </Center>
                    )}

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
                        defaultValue={globalState?.projects[0]}
                        onChange={(e) => {
                          handleProjectSelect(e.target.value);
                        }}
                      >
                        {listProject?.map((select, i) => (
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


                    <Stack
                      alignItems={"center"}

                    >

                      <Accordion allowToggle>

                        {data.map((x, i) => (
                          <AccordionItem
                            key={i} isDisabled={x.name === "Chat" || x.name === "Social Media" ? true : false}
                          >
                            <h2>
                              <AccordionButton>
                                {x.name === 'Scoreboard' || x.name === 'Contacts' ?
                                  <HStack spacing={2} onClick={() => navigate(x?.link)} align={'center'}>
                                    <Icon as={x.icon}
                                      boxSize={isDesktop ? 5 : 7}
                                    />
                                    {isDesktop && (
                                      <>
                                        <Text
                                          fontWeight={500}
                                          fontSize="sm"
                                          noOfLines={1}
                                        >
                                          {x.name}
                                        </Text>
                                      </>
                                    )}
                                  </HStack>
                                  :
                                  <HStack spacing={2} >
                                    <Icon as={x.icon} boxSize={isDesktop ? 5 : 7} />
                                    {isDesktop && (
                                      <Text
                                        fontWeight={500}
                                        fontSize="sm"
                                        noOfLines={1}
                                      >
                                        {x.name}
                                      </Text>
                                    )}
                                    <Spacer />
                                    <AccordionIcon />

                                  </HStack>
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
                                            boxSize={5}
                                          />
                                          {isDesktop && (
                                            <>
                                              <Text
                                                pl={3}
                                                fontWeight={500}
                                                fontSize="sm"
                                                noOfLines={1}
                                              >
                                                {subitem.name}
                                              </Text>
                                            </>
                                          )}
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

                  <Spacer />
                  {/* <Button onClick={() => console.log(globalState)}>Check</Button> */}

                  <Stack>
                    <Button
                      as={Link}
                      to={"/settings"}
                      variant="ghost"
                      justifyContent="start"
                    >
                      <HStack spacing="3">
                        <Icon as={FiSettings} boxSize={isDesktop ? 5 : 7} color="subtle" />
                        {isDesktop &&
                          <Text>Setting</Text>
                        }
                      </HStack>
                    </Button>                                                   
                    <Divider />

                    <SimpleGrid columns={isDesktop ? [dataApps.length] : [1]} w={'auto'} overflowX={'scroll'} justify={'center'} align={'center'} gap={5} >
                      {dataApps.map((x, id) => (
                        <a href={x.link} target="_blank" rel="noopener noreferrer" key={id}>
                          <Stack justify={'center'} align={'center'} cursor={'pointer'} >
                            <Icon as={x.icon} fontSize={'25px'} />
                            <Text fontWeight={'medium'} size={'sm'}>{x.name}</Text>
                          </Stack>
                        </a>
                      ))}
                    </SimpleGrid>
                    <Divider />
                  </Stack>



                  <Stack alignItems={'center'} justifyContent='center'>
                    <Stack
                      spacing={{
                        base: "5",
                        sm: "6",
                      }}
                    >

                      {layout.type === "vertical" && (
                        <>
                          {globalState.isLoggedIn ? (
                            <>

                              {isDesktop ?
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
                                    variant={'outline'}
                                    size={"sm"}
                                    onClick={logout}
                                  >
                                    Logout
                                  </Button>
                                </>
                                :
                                <VStack justify={'left'} align={'left'}>
                                  <UserProfile
                                    image={
                                      globalState.email === null
                                        ? "https://tinyurl.com/yhkm2ek8"
                                        : globalState.email
                                    }
                                  />
                                  <Box pl='2'>
                                    <Icon
                                      as={FiLogOut}
                                      aria-current="page"
                                      boxSize={"40px"}
                                      p={3}
                                      borderRadius="md"
                                      cursor={"pointer"}
                                      shadow="inherit"
                                      color={"red"}
                                      border={'1px red solid'}
                                      onClick={() => logout()}
                                    />
                                  </Box>
                                </VStack>
                              }

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
                      )}

                      {!layout.type && (
                        <Stack>
                          {isDesktop ? (
                            <Button
                              icon={FiLogOut}
                              onClick={() => logout()}
                              size="sm"
                              colorScheme={"red"}
                            >
                              Logout
                            </Button>
                          ) : (
                            <Icon
                              as={FiLogOut}
                              aria-current="page"
                              boxSize={"40px"}
                              bgColor="red.400"
                              p={3}
                              borderRadius="md"
                              cursor={"pointer"}
                              shadow="inherit"
                              color={"white"}
                              onClick={() => logout()}
                            />
                          )}
                        </Stack>
                      )}
                    </Stack>

                  </Stack>






                </Stack>
              </Flex>
            </Flex>
          </Box>


        </Box>

      </>
    );

  return <></>;
}

export default SidebarComponentV2;
