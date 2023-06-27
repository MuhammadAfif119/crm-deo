import { Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  FiBarChart2,
  FiBookmark,
  FiCheckSquare,
  FiHelpCircle,
  FiHome,
  FiSearch,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import {
  FcKindle,
  FcEditImage,
  FcCalendar,
  FcSms,
  FcLineChart,
  FcShare,
} from "react-icons/fc";
import themeConfig from "../../Config/themeConfig";
import { NavButton } from "./NavButton";
import { UserProfile } from "./UserProfile";
import LogoDeoApp from "../../assets/1.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../Routes/hooks/AuthContext";
import { db } from "../../Config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import useUserStore, {
  useUserData,
  userData,
  setUserDisplay,
  userDisplay,
} from "../../Routes/Store";
import { capitalize } from "../../Utils/capitalizeUtil";

// ** Theme Configuration

function SidebarComponentV2({ layout }) {
  const { currentUser, company, signout } = useContext(AuthContext);
  const [project, setProject] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const { setUserDisplay, userDisplay } = useUserStore();

  const toast = useToast();
  const navigate = useNavigate();

  const handleSelectCompany = async (data) => {
    setCompanyId(data);
  };

  const handleSelectProject = async (data) => {
    setProjectId(data);
  };

  const getProject = async () => {
    if (currentUser) {
      try {
        const q = query(
          collection(db, "projects"),
          where("companyId", "==", companyId)
        );

        const projectArray = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          projectArray.push({ id: doc.id, data: doc.data() });
        });

        setProject(projectArray);
        setUserDisplay({
          ...userDisplay,
          projects: projectArray,
          companies: company,
        });

        //get subcollection user inside selected projects
        try {
          const docRef = doc(
            db,
            "projects",
            projectId,
            "users",
            currentUser?.uid
          );
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists) {
            const docData = docSnapshot.data();
            setUserDisplay({
              ...userDisplay,
              user_data: docData,
            });
          } else {
            console.log("Dokumen tidak ditemukan!");
          }
        } catch (error) {
          console.log(error, "ini error");
        }
      } catch (error) {
        console.log("Terjadi kesalahan:", error);
      }
    }
  };

  const logout = async () => {
    try {
      await signout();
      toast({
        status: "success",
        description: "Logged out success",
        duration: 2000,
      });
      navigate("/login");
    } catch (error) {
      console.log(error, "log out failed");
    }
  };

  useEffect(() => {
    getProject();
  }, [companyId, projectId]);

  useEffect(() => {
    setUserDisplay({
      ...userDisplay,
      uid: currentUser.uid,
    });
  }, [currentUser]);

  console.log(userDisplay);

  if (layout.type === "vertical" || layout.type === "vertical-horizontal")
    return (
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

                  {/* <InputGroup size={"sm"}>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="muted" boxSize="5" />
                    </InputLeftElement>
                    <Input placeholder="Search" />
                  </InputGroup> */}

                  <Stack>
                    <Select
                      // placeholder="Company Selection"
                      size={"sm"}
                      onChange={(e) => {
                        handleSelectCompany(e.target.value);
                        setUserDisplay({
                          ...userDisplay,
                          currentCompany: e.target.value,
                        });
                      }}
                    >
                      {company?.map((select, i) => (
                        <option
                          defaultValue={company[0].id}
                          key={i}
                          value={select?.id}
                        >
                          {capitalize(select.data?.name)}
                        </option>
                      ))}
                    </Select>

                    <Select
                      placeholder="Project Selection"
                      size={"sm"}
                      onChange={(e) => {
                        handleSelectProject(e.target.value);
                        setUserDisplay({
                          ...userDisplay,
                          currentProject: e.target.value,
                        });
                      }}
                    >
                      {project?.map((select, i) => (
                        <option key={i} value={select?.id}>
                          {select.data?.name}
                        </option>
                      ))}
                    </Select>
                  </Stack>

                  <Stack spacing="1">
                    <Link to="/my-feed">
                      <NavButton label="My Feed" icon={FcKindle} />
                    </Link>
                    <Link to={"/"}>
                      <NavButton
                        label="Create Post"
                        icon={FcEditImage}
                        aria-current="page"
                      />
                    </Link>
                    <Link to={"/calendar"}>
                      <NavButton label="Calendar" icon={FcCalendar} />
                    </Link>
                    <Link to={"/comment"}>
                      <NavButton label="Comments" icon={FcSms} />
                    </Link>
                    <Link to={"/reports"}>
                      <NavButton label="Reports" icon={FcLineChart} />
                    </Link>
                    <Link to={"/social-account"}>
                      <NavButton label="Social Account" icon={FcShare} />
                    </Link>
                  </Stack>
                </Stack>
                <Stack
                  spacing={{
                    base: "5",
                    sm: "6",
                  }}
                >
                  <Stack spacing="1">
                    <NavButton label="Help" icon={FiHelpCircle} />
                    <NavButton label="Settings" icon={FiSettings} />
                  </Stack>

                  {/* <Box bg="bg-subtle" px="4" py="5" borderRadius="lg">
                <Stack spacing="4">
                  <Stack spacing="1">
                    <Text fontSize="sm" fontWeight="medium">
                      Almost there
                    </Text>
                    <Text fontSize="sm" color="muted">
                      Fill in some more information about you and your person.
                    </Text>
                  </Stack>
                  <Progress
                    value={80}
                    size="sm"
                    aria-label="Profile Update Progress"
                  />
                  <HStack spacing="3">
                    <Button variant="link" size="sm">
                      Dismiss
                    </Button>
                    <Button variant="link" size="sm" colorScheme="blue">
                      Update profile
                    </Button>
                  </HStack>
                </Stack>
              </Box> */}

                  {layout.type === "vertical-horizontal" &&
                  layout.userProfile === "sidebar" ? (
                    <>
                      <Divider />

                      {currentUser ? (
                        <>
                          <UserProfile
                            name={currentUser.displayName}
                            image={
                              currentUser.photoURL === null
                                ? "https://tinyurl.com/yhkm2ek8"
                                : currentUser.photoURL
                            }
                            // email={currentUser.email}
                          />
                          <Button
                            w={"full"}
                            colorScheme="telegram"
                            size={"sm"}
                            onClick={() => console.log(userDisplay)}
                          >
                            Check state
                          </Button>
                          <Button
                            w={"full"}
                            colorScheme="telegram"
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
                      {currentUser ? (
                        <>
                          <UserProfile
                            name={currentUser.displayName}
                            image={
                              currentUser.photoURL === null
                                ? "https://tinyurl.com/yhkm2ek8"
                                : currentUser.photoURL
                            }
                            // email={currentUser.email}
                          />
                          <Button
                            w={"full"}
                            colorScheme="telegram"
                            size={"sm"}
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
                    onClick={() => console.log(userDisplay)}
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
