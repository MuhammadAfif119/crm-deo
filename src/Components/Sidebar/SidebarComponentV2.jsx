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
            <Box position="sticky" overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  height: '0rem',
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                  // backgroundColor: 'whitesmoke'
                },
                '&::-webkit-scrollbar-thumb': {
                  // background: 'DarkGray',
                  height: '2px',
                  // borderRadius: '24px',
                }
              }}
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


                      <Stack mt='5'


                      >
                        {/* <HStack>
                            <Icon as={FcDatabase} boxSize={5} />
                            <Text fontWeight={"semibold"} pl={3}>
                              Dashboard
                            </Text>
                          </HStack> */}
                        {/* {data.map((x, i) => (
                            <>
                              {x.name === 'Scoreboard' || x.name === 'Contacts' ?
                                <Button onClick={() => navigate(x?.link)} variant={'ghost'} alignItems={'center'} justifyContent={'left'} key={i}>
                                  <Icon as={x.icon} boxSize={5} mr='2' />

                                  {x.name}
                                </Button> :
                                <Box mx='5' py={2} key={i}>
                                  <Text fontWeight={'medium'} size='sm' mx='4'>
                                    <Icon as={x.icon} boxSize={5} mr='2' />

                                    {x.name}</Text>

                                  {x.submenu.map((subitem, i) => (
                                    <Button fontWeight={'medium'} w='90%' ml='7' key={i} variant={'ghost'} alignItems={'center'} justifyContent={'left'} onClick={() => navigate(subitem?.link)} >
                                      <Icon as={subitem.icon} boxSize={5} mr='2' />

                                      {subitem.name}</Button>
                                  ))}
                                </Box>
                              }

                            </>
                          ))} */}
                        {/* <Button
                            as={Link}
                            to={"/settings"}
                            variant="ghost"
                            justifyContent="start"
                          >
                            <HStack spacing="3">
                              <Icon as={FiSettings} boxSize="5" color="subtle" />
                              <Text>Setting</Text>
                            </HStack>
                          </Button> */}
                        <Accordion allowToggle>

                          {data.map((x, i) => (
                            <AccordionItem
                              key={i} isDisabled={x.name === "Chat" || x.name === "Social Media" ? true : false}
                            >
                              <h2>
                                <AccordionButton>
                                  {x.name === 'Scoreboard' || x.name === 'Contacts' ?
                                    <Flex m='0' p='0' gap='0' onClick={() => navigate(x?.link)} align={'center'}>
                                      <Icon as={x.icon}
                                        boxSize={isDesktop ? 5 : 7}
                                      />
                                      {isDesktop && (
                                        <>
                                          <Text
                                            pl={3}
                                            fontWeight={500}
                                            fontSize="sm"
                                            noOfLines={1}
                                          >
                                            {x.name}
                                          </Text>
                                        </>
                                      )}
                                    </Flex>
                                    :
                                    <Flex w='full'>
                                      <Icon as={x.icon} boxSize={isDesktop ? 5 : 7} />
                                      {isDesktop && (
                                        <>
                                          <Text
                                            pl={3}
                                            fontWeight={500}
                                            fontSize="sm"
                                            noOfLines={1}
                                          >
                                            {x.name}
                                          </Text>
                                        </>
                                      )}
                                      <Spacer />
                                      <AccordionIcon />

                                    </Flex>
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
                    <Stack
                      spacing={{
                        base: "5",
                        sm: "6",
                      }}
                      bottom={5}
                      pos={'absolute'}
                      width={'82%'}
                    >

                      <Stack spacing="1">
                        <Button
                          as={Link}
                          to={"/settings"}
                          variant="ghost"
                          justifyContent="start"
                          w='fit-content'
                        >
                          <HStack spacing="3">
                            <Icon as={FiSettings} boxSize={isDesktop ? 5 : 7} color="subtle" />
                            {isDesktop &&
                              <Text>Setting</Text>
                            }
                          </HStack>
                        </Button>
                      </Stack>


                      {layout.type === "vertical-horizontal" && layout.userProfile === "sidebar" && (
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
                              {isDesktop ?
                                <Button
                                  w={"full"}
                                  colorScheme="red"
                                  variant={'outline'}
                                  size={"sm"}
                                  onClick={logout}
                                >
                                  Logout
                                </Button>
                                :
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
                              }
                            </>
                          ) : (
                            <Box>
                              <Button>Login</Button>
                            </Box>
                          )}
                        </>
                      )}

                      {layout.type === "vertical" && (
                        <>
                          <Divider />
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
                              <HStack overflowY={'auto'} justify={'center'} align={'center'} gap={5} css={{
                                '&::-webkit-scrollbar': {
                                  height: '0rem',
                                  width: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                  width: '6px',
                                  // backgroundColor: 'whitesmoke'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  // background: 'DarkGray',
                                  height: '2px',
                                  // borderRadius: '24px',
                                },
                              }}>
                                {dataApps.map((x, id) => (
                                  <a href={x.link} target="_blank" rel="noopener noreferrer" key={id}>
                                    <Stack justify={'center'} align={'center'} cursor={'pointer'} >
                                      <Icon as={x.icon} fontSize={'25px'} />
                                      <Text fontWeight={'medium'} size={'sm'}>{x.name}</Text>
                                    </Stack>
                                  </a>
                                ))}
                              </HStack>
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
                </Flex>
              </Flex>
            </Box>
          </>


        </Box>

      </>
    );

  return <></>;
}

export default SidebarComponentV2;
