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
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  Select,
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
import { data } from "./DataMenu";
import { isDisabled } from "@testing-library/user-event/dist/utils";
import { getSingleDocumentFirebase } from "../../Api/firebaseApi";

// ** Theme Configuration

function SidebarComponentV2({ layout }) {
  const { currentUser, company, signOut } = useContext(AuthContext);
  const [project, setProject] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [profileKey, setProfileKey] = useState("");
  const { setUserDisplay, userDisplay } = useUserStore();

  const toast = useToast();
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const result = await getSingleDocumentFirebase("users", currentUser.uid);
      setUserDisplay({
        ...userDisplay,
        uid: currentUser.uid,
        name: result.name,
        email: result.email,
      });

    } catch (error) {
      console.log(error);
    }
  };
  const getProject = async () => {
    if (currentUser) {

      try {
        const q = query(
          collection(db, "projects"),
          where("users", "array-contains", currentUser.uid)
        );
        const projectArray = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          projectArray.push({ id: doc.id, data: doc.data() });
        });

        setProject(projectArray);
        setUserDisplay({
          ...userDisplay,
          projects: projectArray,
          companies: company,
          currentCompany: company[0]?.id,
          currentProject: project[0]?.id
        });

        getCurrentProject();

        //get subcollection user inside selected projects
        try {
          const docRef = doc(
            db,
            "projects",
            projectId,
            "users",
            currentUser?.uid
          );
          const docSnapshot = getDoc(docRef);

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

  const getCurrentProject = async () => {
    try {
      const docRef = doc(db, "projects", projectId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists) {
        const docData = docSnapshot.data();

        setUserDisplay({
          ...userDisplay,
          profileKey: docData.ayrshare_account?.profileKey,
          projectTitle: docData.ayrshare_account?.title,
        });
        // setUserDisplay(docData.ayrshare_account?.profile_key);
      } else {
        console.log("Dokumen tidak ditemukan!");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const logout = async () => {
    signOut()
      .then(() => {
        toast({
          status: "success",
          description: "Logged out success",
          duration: 2000,
        });

        navigate("/login");
        store.clearAll();
      })
      .catch((error) => {
        console.log(error, "ini error");
      });
  };

  useEffect(() => {
    getProject();

    // getCurrentProject();
  }, [companyId, project.length, company?.length]);

  useEffect(() => {
    getCurrentProject();
    // getCurrentProject();
  }, [projectId]);

  useEffect(() => {
    setUserDisplay({
      uid: currentUser.uid,
    });
    getUserData();
  }, [currentUser, companyId]);

  useEffect(() => {
    console.log(userDisplay); // Check the updated value of userDisplay
  }, [userDisplay]);

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

                  <Stack>
                    <Select
                      // placeholder="Company Selection"
                      size={"sm"}
                      onChange={(e) => {
                        setCompanyId(e.target.value);
                        setUserDisplay({
                          ...userDisplay,
                          currentCompany: e.target.value,
                        });
                      }}
                    >
                      {company?.map((select, i) => (
                        <option
                          key={i}
                          value={select?.id}
                          defaultValue={company[0].id}
                        >
                          {capitalize(select?.name)}
                        </option>
                      ))}
                    </Select>

                    <Select
                      // placeholder="Project Selection"
                      size={"sm"}
                      onChange={(e) => {
                        setProjectId(e.target.value);
                        setUserDisplay({
                          ...userDisplay,
                          currentProject: e.target.value,
                        });
                      }}
                    >
                      {project?.map((select, i) => (
                        <option key={i} value={select?.id}
                          defaultValue={project[0].id}

                        >
                          {select.data?.name}
                        </option>
                      ))}
                    </Select>
                  </Stack>

                  <Stack>
                    <Accordion allowMultiple>
                      {data.map((x, i) => (
                        <AccordionItem
                          isDisabled={x.name === "Chat" || x.name === "Pipeline" || x.name === "Social Media" ? true : false}
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
