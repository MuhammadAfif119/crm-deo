import {
  Avatar,
  Box,
  Container,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  ModalBody,
  ModalContent,
  Select,
  ModalFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../Config/firebase";
import { capitalize } from "../../Utils/capitalizeUtil";
import useUserStore from "../../Hooks/Zustand/Store";
// import BreadCrumbComponent from "../../Components/BreadCrumbs"
// import IconCardComponent from "../../Components/Cards/IconCardComponent";

function SettingsPage() {
  const toast = useToast();
  const globalState = useUserStore();
  const [userData, setUserData] = useState();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [allUser, setAllUser] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [singleUser, setSingleUser] = useState();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "123456",
    phone: "",
    role: "member",
  });

  const currentUser = auth.currentUser

  const getDataUser = async () => {
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists) {
        const docData = docSnapshot.data();
        setUserData(docData);
        // Lakukan manipulasi data atau operasi lain jika diperlukan
      } else {
        console.log("Dokumen tidak ditemukan!");
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const getAllUsers = async () => {
    try {
      let collectionRef = collection(db, "users");

      const querySnapshot = await getDocs(collectionRef);
      const collectionData = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        // Lakukan manipulasi data atau operasi lain jika diperlukan
        collectionData.push(docData);
        console.log(collectionData);
        setAllUser(collectionData);
      });
      return collectionData; // Outputkan data koleksi ke konsol (bisa diganti sesuai kebutuhan)
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const addUserToProject = async (user) => {
    //update projects
    try {
      const docRef = doc(db, "projects", selectedProject?.id);
      await updateDoc(docRef, {
        users: arrayUnion(user?.uid_user),
      });

      if (data.role === "member" || data.role === "user") {
        const docRefSub = doc(
          db,
          "projects",
          selectedProject.id,
          "users",
          user?.uid_user
        );
        await setDoc(docRefSub, {
          name: user?.name,
          role: user?.role,
        });
      } else {
        const docRefSub = doc(
          db,
          "projects",
          selectedProject.id,
          "managers",
          user?.uid_user
        );
        await setDoc(docRefSub, {
          name: user.name,
          role: user.role,
        });
      }

      //update user
      try {
        const docRef = doc(db, "users", user?.uid_user);
        await updateDoc(docRef, {
          ayrshare_account: arrayUnion(selectedProject?.data?.ayrshare_account),
        });

        toast({
          status: "success",
          title: "Deoapp",
          description: "Team Added",
        });

        //filterAddedUser
        const filteredUser = allUser.filter(
          (x) => x.uid_user === user.uid_user
        );
        console.log(filteredUser);
        onClose();
      } catch (error) {}
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const handleAddTeam = (x) => {
    console.log(x);
    onOpen();
    setSelectedProject(x);
    getAllUsers();
  };

  console.log(selectedProject?.data?.ayrshare_account);
  //   console.log();

  useEffect(() => {
    getDataUser();

    return () => {};
  }, [currentUser]);

  return (
    <>
      <Heading>Setting</Heading>
      <Stack my={5}>
        <HStack bg={"white"} p={5}>
          <Box>
            <Text fontWeight={"semibold"}>Your Account</Text>
            <Image
              boxSize="200px"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
            />
          </Box>
          <Box>
            <Text>Name: {userData?.name}</Text>
            <Text>Email: {userData?.email}</Text>
            <Text>Role: {userData?.role}</Text>
            <Text>Join Date: {userData?.enrollmentDate}</Text>
            <Text>Phone Number: {userData?.nohp}</Text>
            <Text>
              Subscription Status: {capitalize(userData?.subscription)}
            </Text>
            <Box>
              <Text>Social Accounts Project</Text>
              <SimpleGrid columns={[2, null, 3]} spacing={3}>
                {userData?.social_accounts?.map((x) => (
                  <Box
                    border={"1px"}
                    boxShadow={"sm"}
                    borderRadius={"sm"}
                    p={2}
                  >
                    <Text>{x.title}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </HStack>

        <Box>
          <Text mb={2}>User Accounts</Text>
          <Box borderRadius={"md"}>
            <SimpleGrid spacing={4} columns={(2, null, 3)} borderRadius={"md"}>
              {globalState.projects?.map((project, i) => (
                <Box borderRadius={"md"} bg={"white"} p={5} boxShadow={"md"}>
                  <Center>
                    <Avatar
                      align={"center"}
                      size="lg"
                      name={project.data?.ayrshare_account?.title}
                      src="#"
                    />
                  </Center>
                  <Box align={"center"} mt={3}>
                    <Text size={"xs"} fontWeight={"semibold"}>
                      {capitalize(project.data?.ayrshare_account?.title)}
                    </Text>
                    <Text fontSize={"xs"} mt={2}>
                      Profile Key:
                    </Text>
                    <Text fontSize={"xs"}>
                      {project.data?.ayrshare_account?.profileKey}
                    </Text>
                  </Box>
                  <Box align={"center"} mt={4}>
                    <Button
                      colorScheme="telegram"
                      size={"sm"}
                      w={100}
                      onClick={() => handleAddTeam(project)}
                    >
                      Add Team
                    </Button>
                    <Box>
                      <Text>Teams</Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Stack>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <Text>Add Team to this project</Text>
            </ModalHeader>
            <ModalBody>
              <Tabs>
                <TabList>
                  <Tab>New User</Tab>
                  <Tab>Already Assigned User</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <FormControl>
                      <Stack>
                        <Box>
                          <FormLabel>Name</FormLabel>
                          <Input
                            placeholder="Your team member name"
                            onChange={(e) =>
                              setData({ ...data, name: e.target.value })
                            }
                          />
                        </Box>
                        <Box>
                          <FormLabel>Email</FormLabel>
                          <Input
                            placeholder="Your team member name"
                            onChange={(e) =>
                              setData({ ...data, email: e.target.value })
                            }
                          />
                        </Box>
                        <Box>
                          <FormLabel>Password</FormLabel>
                          <Input
                            defaultValue={"123456"}
                            onChange={(e) =>
                              setData({ ...data, password: e.target.value })
                            }
                          />
                        </Box>
                        <Box>
                          <FormLabel>Phone Number</FormLabel>
                          <Input
                            type="number"
                            placeholder="Your team member name"
                            onChange={(e) =>
                              setData({ ...data, phone: e.target.value })
                            }
                          />
                        </Box>
                        <Box>
                          <FormLabel>Role</FormLabel>
                          <Select
                            defaultValue={"member"}
                            onChange={(e) =>
                              setData({ ...data, role: e.target.value })
                            }
                          >
                            <option value={"member"}>Member</option>
                            <option value={"manager"}>Manager</option>
                          </Select>
                        </Box>
                      </Stack>
                    </FormControl>
                    <HStack my={2}>
                      <Button size={"sm"} onClick={() => console.log(data)}>
                        Submit
                      </Button>
                      <Button size={"sm"} onClick={onClose}>
                        Close
                      </Button>
                    </HStack>
                  </TabPanel>
                  <TabPanel>
                    {/* <Select placeholder="Select User" onChange={(e) => setSelectedUser(e.target.value)}>
                      {allUser.map((select) => (
                        <option value={select.id}>{select.name}</option>
                      ))}
                    </Select> */}
                    <Stack spacing={3}>
                      {allUser?.map((x) => (
                        <>
                          <HStack
                            p={2}
                            _hover={{ bg: "gray.100" }}
                            cursor={"pointer"}
                            onClick={() => setSingleUser(x)}
                          >
                            <Avatar
                              size="sm"
                              name={x.name}
                              src="https://bit.ly/dan-abramov"
                            />
                            <Box fontSize={"sm"}>
                              <Text>{capitalize(x?.name)}</Text>
                              <Text>{capitalize(x?.role)}</Text>
                            </Box>
                            <Spacer />
                            <Button
                              colorScheme="green"
                              size={"sm"}
                              onClick={() => addUserToProject(x)}
                            >
                              Add Team
                            </Button>
                          </HStack>
                        </>
                      ))}
                    </Stack>
                    <HStack my={2}>
                      <Button size={"sm"} onClick={onClose}>
                        Close
                      </Button>
                    </HStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}

export default SettingsPage;
