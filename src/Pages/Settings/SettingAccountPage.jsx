import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { MdDateRange, MdOutlineEmail, MdPhone } from "react-icons/md";
import { auth, db } from "../../Config/firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updatePassword } from "@firebase/auth";
import SettingTeamPage from "./SettingTeamPage";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { addDoc, collection } from "firebase/firestore";
import moment from "moment";
import { FaCoins } from "react-icons/fa";
import { addDocumentFirebase, deleteFileFirebase, getCollectionFirebase, getSingleDocumentFirebase, updateProfileFirebase, UploadBlob } from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";

export const SettingAccountPage = () => {
  const globalState = useUserStore();
  const [userData, setUserData] = useState();
  const [tokens, setTokens] = useState();
  const [data, setData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [input, setInput] = useState({ password: null, confirmPassword: null });

  const [secretKey, setSecretKey] = useState("");
  const [modalSecret, setModalSecret] = useState(false);
  const [dataInput, setDataInput] = useState({
    secret_key: "",
    company_name: "",
    project_name: "",
  });

  const user = auth.currentUser;
  const toast = useToast();

  const handleClick = (type) => {
    if (type === "password") {
      setShow({ ...show, password: !show.password });
    } else {
      setShow({ ...show, confirmPassword: !show.confirmPassword });
    }
  };

  const getUserData = async () => {
    try {
      const result = await getSingleDocumentFirebase("users", globalState.uid);
      setUserData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    await updateProfileFirebase(data);

    const resultUpdate = await addDocumentFirebase(
      "logs",
      {
        activity: `update user profile`,
        uid: globalState.uid,
        projectId: globalState.currentProject,
      },
      globalState.currentCompany
    );
    console.log(resultUpdate, "logs updated");
  };

  const handleUploadThumbnail = async (file) => {
    console.log(data, "data");
    console.log(file, "ni file");
    setIsUploading(true);
    UploadBlob(file, user?.uid, "profile", file.name, setIsUploading).then(
      (uploadedImg) => {
        console.log(uploadedImg, "this is data result");
        updateProfileFirebase({
          photoURL: uploadedImg.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
        });
        setIsUploading(false);
      }
    );

    const resultUpdate = await addDocumentFirebase(
      "logs",
      {
        activity: `upload user photo`,
        uid: globalState.uid,
        projectId: globalState.currentProject,
      },
      globalState.currentCompany
    );
    console.log(resultUpdate, "logs updated");
  };

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  const handleDeletePhoto = async () => {
    const splitArr = user?.photoURL.split("?");
    // console.log(splitArr, "splitarr");
    const splitSecond = splitArr[0].split("%2F");
    setIsUploading(true);
    deleteFileFirebase(user?.uid, "profile", splitSecond[2]).then(() => {
      updateProfileFirebase({ photoURL: "" }).then(() => {
        setIsUploading(false);
      });
    });

    const resultUpdate = await addDocumentFirebase(
      "logs",
      {
        activity: `delete user photo`,
        uid: globalState.uid,
        projectId: globalState.currentProject,
      },
      globalState.currentCompany
    );
    console.log(resultUpdate, "logs updated");
  };

  const getTokenUser = async () => {
    const conditions = [
      { field: "uid", operator: "==", value: globalState.uid },
    ];
    const sortBy = { field: "tokenUsage", direction: "asc" };

    try {
      const res = await getCollectionFirebase("logs", conditions, sortBy);
      const totalTokens = res.reduce((accumulator, currentObject) => {
        return accumulator + currentObject.tokenUsage;
      }, 0);
      setTokens(totalTokens);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const handleUpdatePassword = () => {
    if (
      input.password === null ||
      input.password === "" ||
      Input.confirmPassword === null ||
      Input.confirmPassword === ""
    ) {
      toast({
        title: "Error",
        description: "Fields are required!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (input.password === input.confirmPassword) {
      updatePassword(user, input.password)
        .then(() => {
          toast({
            title: "Success",
            description: "Password has been edited!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch((error) => {
          toast({
            title: error.code,
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Error",
        description: "Password did not match!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleNew = () => {
    setModalSecret(true);
    setSecretKey("");
  };

  const handleAddNew = (e) => {
    const { name, value } = e.target;
    setDataInput((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmitNew = async () => {
    const secret = process.env.REACT_APP_ACCOUNT_KEY;

    const dataCompany = {
      name: dataInput.company_name,
      owner: [globalState.uid],
      users: [globalState.uid],
      expired_at: moment().add(1, "months").toISOString(),
    };

    if (dataInput.secret_key === secret) {
      try {
        const companyRef = collection(db, "companies");
        const docRef = await addDoc(companyRef, dataCompany);

        if (docRef.id) {
          const dataProject = {
            name: dataInput.project_name,
            owner: [globalState.uid],
            users: [globalState.uid],
            modules: ["ai"],
            companyId: docRef.id,
            createdAt: new Date(),
            createdBy: globalState.uid,
          };

          const projectRef = collection(db, "projects");
          const docRefProject = await addDoc(projectRef, dataProject);

          if (docRefProject.id) {
            toast({
              title: "Success!",
              description: "Success Add new Account!",
              status: "success",
              duration: 9000,
              isClosable: true,
            });
            setModalSecret(false);
          }
        }
      } catch (error) {
        console.error("Error adding document:", error);
      }
    } else {
      toast({
        title: "Error",
        description: "You dont have any access!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    return () => {};
  }, [isUploading]);

  useEffect(() => {
    getUserData();
    getTokenUser();
    return () => {};
  }, []);

  return (
    <Flex gap={4}>
      <Box
        w={"80%"}
        borderTopWidth={3}
        borderColor="green.500"
        py={4}
        px={2}
        borderRadius="md"
        shadow="md"
        bgColor={'white'}
      >
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Edit Profile</Tab>
            <Tab>Change Password</Tab>
            <Tab>Team</Tab>
          </TabList>
          <TabPanels>
            
            <TabPanel>
              <Box
                as="section"
                py={{
                  base: "4",
                  md: "8",
                }}
              >
                <Stack spacing={5}>
                  <FormControl id="name">
                    <Stack
                      direction={{
                        base: "column",
                        md: "row",
                      }}
                      spacing={{
                        base: "1.5",
                        md: "8",
                      }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Name</FormLabel>
                      <Input
                        bgColor="white"
                        color="black"
                        sx={inputStyles}
                        resize="none"
                        onChange={(e) =>
                          setData({ ...data, displayName: e.target.value })
                        }
                        maxW={{
                          md: "3xl",
                        }}
                        defaultValue={user?.displayName ? user.displayName : ""}
                      />
                    </Stack>
                  </FormControl>

                  <FormControl id="email">
                    <Stack
                      direction={{
                        base: "column",
                        md: "row",
                      }}
                      spacing={{
                        base: "1.5",
                        md: "8",
                      }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Email</FormLabel>
                      <Input
                        bgColor="white"
                        color="black"
                        sx={inputStyles}
                        resize="none"
                        type="email"
                        disabled
                        maxW={{
                          md: "3xl",
                        }}
                        defaultValue={user?.email ? user.email : ""}
                      />
                    </Stack>
                  </FormControl>

                  <FormControl id="phone">
                    <Stack
                      direction={{
                        base: "column",
                        md: "row",
                      }}
                      spacing={{
                        base: "1.5",
                        md: "8",
                      }}
                      justify="space-between"
                    >
                      <FormLabel variant="inline">Phone</FormLabel>
                      <InputGroup
                        maxW={{
                          md: "3xl",
                        }}
                      >
                        <InputLeftAddon children="+62" />
                        <Input
                          bgColor="white"
                          color="black"
                          sx={inputStyles}
                          resize="none"
                          type="number"
                          onChange={(e) =>
                            setData({
                              ...data,
                              phoneNumber: e.target.value,
                            })
                          }
                          defaultValue={
                            user?.phoneNumber ? user.phoneNumber : ""
                          }
                        />
                      </InputGroup>
                    </Stack>
                  </FormControl>
                </Stack>
                <Box my={4} align={"right"}>
                  <Button colorScheme="green" onClick={() => handleUpdate()}>
                    Save{" "}
                  </Button>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel>
              <Box
                as="section"
                py={{
                  base: "4",
                  md: "8",
                }}
              >
                <Stack spacing="5">
                  <Stack
                    spacing="4"
                    direction={{
                      base: "column",
                      sm: "row",
                    }}
                    justify="space-between"
                  >
                    <Box>
                      <Text fontSize="lg" fontWeight="medium">
                        Password
                      </Text>
                      <Text color="muted" fontSize="sm">
                        Change your password
                      </Text>
                    </Box>
                  </Stack>
                  <Divider />
                  <Stack spacing="5" divider={<StackDivider />}>
                    <FormControl id="name" isRequired>
                      <Stack
                        direction={{
                          base: "column",
                          md: "row",
                        }}
                        spacing={{
                          base: "1.5",
                          md: "8",
                        }}
                        justify="space-between"
                      >
                        <FormLabel
                          variant="inline"
                          w={{ base: "100%", md: "30%" }}
                        >
                          Password
                        </FormLabel>
                        <InputGroup size="md">
                          <Input
                            bgColor="white"
                            color="black"
                            sx={inputStyles}
                            resize="none"
                            pr="4.5rem"
                            type={show.password ? "text" : "password"}
                            placeholder="Enter password"
                            onChange={(e) =>
                              setInput({ ...input, password: e.target.value })
                            }
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClick("password")}
                            >
                              {show.password ? <FiEye /> : <FiEyeOff />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </Stack>
                    </FormControl>
                    <FormControl id="name" isRequired>
                      <Stack
                        direction={{
                          base: "column",
                          md: "row",
                        }}
                        spacing={{
                          base: "1.5",
                          md: "8",
                        }}
                        justify="space-between"
                      >
                        <FormLabel
                          variant="inline"
                          w={{ base: "100%", md: "30%" }}
                        >
                          Confirm Password
                        </FormLabel>
                        <InputGroup size="md">
                          <Input
                            bgColor="white"
                            color="black"
                            sx={inputStyles}
                            resize="none"
                            pr="4.5rem"
                            type={show.confirmPassword ? "text" : "password"}
                            placeholder="Enter password"
                            onChange={(e) =>
                              setInput({
                                ...input,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                          <InputRightElement width="4.5rem">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClick("confirmPassword")}
                            >
                              {show.confirmPassword ? <FiEye /> : <FiEyeOff />}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </Stack>
                    </FormControl>
                    <Flex direction="row-reverse">
                      <Button
                        onClick={() => handleUpdatePassword()}
                        colorScheme="green"
                      >
                        Save
                      </Button>
                    </Flex>
                  </Stack>
                </Stack>
              </Box>
            </TabPanel>

            <TabPanel>
              <SettingTeamPage />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box
        w={"30%"}
        spacing={2}
        borderTopWidth={3}
        borderColor="green.500"
        py={4}
        px={2}
        borderRadius="md"
        shadow="md"
        bgColor={'white'}
      >
        <Heading mt={2} mb={4} align={"center"}>
          Profile
        </Heading>

        <Box align={"center"}>
          <Stack justifyContent={"center"} alignItems={"center"} my={5}>
            {/* <Avatar size="lg" name={userData?.name} src={user.photoURL} /> */}
            {isUploading ? (
              <Spinner />
            ) : (
              <Avatar
                size="lg"
                name={user.email}
                src={user?.photoURL ? user.photoURL : ""}
              />
            )}

            {user?.photoURL !== null ? (
              <Button size="xs" colorScheme="red" onClick={handleDeletePhoto}>
                Delete
              </Button>
            ) : (
              <Input
                my={3}
                // as={Text}
                size={"sm"}
                type="file"
                variant={"unstyled"}
                onChange={(e) => handleUploadThumbnail(e.target.files[0])}
              />
            )}
          </Stack>

          <Box my={5} px={4}>
            <Heading size={"md"}>{user?.displayName}</Heading>

            <Stack my={3} spacing={4}>
              <HStack>
                <Icon as={MdOutlineEmail} />
                <Text>{user?.email}</Text>
              </HStack>
              <HStack>
                <Icon as={MdPhone} />
                <Text>{user?.phoneNumber}</Text>
              </HStack>
              <HStack>
                <Icon as={MdDateRange} />
                <Text>
                  {new Date(userData?.lastUpdated?.toDate()).toLocaleString()}
                </Text>
              </HStack>
              <HStack>
                <Icon  />
                <Text>
                  {new Date(userData?.lastUpdated?.toDate()).toLocaleString()}
                </Text>
              </HStack>
              <HStack>
                <Icon as={FaCoins} />
                <Text>{tokens} token used</Text>
              </HStack>
              {globalState?.companies?.length === 0 && (
                <Button size={"sm"} onClick={() => handleNew()}>
                  New Account
                </Button>
              )}
            </Stack>
          </Box>
        </Box>

        <Modal
          isOpen={modalSecret}
          onClose={() => setModalSecret(false)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Admin Key</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Stack>
                  <Text fontSize={"sm"}>
                    Key <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Input
                    size={"sm"}
                    placeholder="Secret Key"
                    type={"password"}
                    onChange={handleAddNew}
                    name="secret_key"
                  />
                </Stack>

                <Stack>
                  <Text fontSize={"sm"}>
                    Company <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Input
                    size={"sm"}
                    placeholder="Company Name"
                    onChange={handleAddNew}
                    name="company_name"
                  />
                </Stack>

                <Stack>
                  <Text fontSize={"sm"}>
                    Project <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Input
                    size={"sm"}
                    placeholder="Project Name"
                    onChange={handleAddNew}
                    name="project_name"
                  />
                </Stack>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Flex gap={5}>
                <Button
                  leftIcon={<AddIcon boxSize={3} />}
                  colorScheme="green"
                  onClick={() => handleSubmitNew()}
                >
                  Add Account
                </Button>
                <Button
                  leftIcon={<CloseIcon boxSize={3} />}
                  colorScheme="red"
                  onClick={() => {
                    setModalSecret(false);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};
