import { AddIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormHelperText,
  useDisclosure,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Spacer,
  Text,
  SimpleGrid,
  Checkbox,
  Tooltip,
  CheckboxGroup,
  Stack,
  Flex,
  useToast,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDocumentFirebase,
  arrayUnionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
} from "../../Api/firebaseApi";
import BackButtonComponent from "../../Components/Buttons/BackButtons";
import UserCardComponent from "../../Components/Card/UserCardComponent";
import ImageComponent from "../../Components/Image/ImageComponent";
import InputSearchUserComponent from "../../Components/Inputs/InputSearchComponent";
import { uploadImage } from "../../Api/firebaseFunction";
import useUserStore from "../../Hooks/Zustand/Store";
import ProjectCard from "../../Components/Card/ProjectCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase";
import { map } from "jquery";
import { clientTypessense } from "../../Api/Typesense";

function ProjectsViewPage() {
  const globalState = useUserStore();
  const [data, setData] = useState();
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState({});
  const [modules, setModules] = useState();
  const [manager, setManager] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUserProjectIds, setSelectedUserProjectIds] = useState([]);
  const [isAddingTeam, setIsAddingTeam] = useState(false);

  const [projectActive, setProjectActive] = useState("");
  const [companyActive, setCompanyActive] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [modalProjectUser, setModalProjectUser] = useState(false);
  const [modalProjectUserTeam, setModalProjectUserTeam] = useState(false);

  const params = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dataCheckBox = [
    {
      value: "rms",
      name: "RMS",
      description: "End to end restaurant management system",
    },
    {
      value: "lms",
      name: "LMS",
      description: "End to end Learning Management System",
    },
    {
      value: "eCommerce",
      name: "eCommerce",
      description: "End to end restaurant management system",
    },
    {
      value: "listing",
      name: "Listing",
      description: "End to end restaurant management system",
    },
    {
      value: "omniChannel",
      name: "Omni Channel",
      description: "End to end restaurant management system",
    },
    {
      value: "event",
      name: "Events",
      description: "Event management inside LMS",
    },
    {
      value: "crm",
      name: "CRM",
      description:
        "Customer Relationship Management from leads, web chat, marketplace, social media monitoring",
    },
  ];

  // const getData = () => {
  //   let projectArr = [];
  //   getSingleDocumentFirebase("projects", params.id)
  //     .then((x) => {
  //       setData(x);
  //       setManager(x?.managers ? x.managers : []);

  //       console.log(data, "ini data");

  //       if (data) {
  //         const userSnapshot = getDocs(
  //           collection(db, `projects/${data.id}/users`)
  //         );

  //         userSnapshot
  //           .then((snapshot) => {
  //             const usersData = snapshot.docs.map((doc) => ({
  //               id: doc.id,
  //               ...doc.data(),
  //             }));
  //             console.log(usersData, "ini data");
  //             setUsers(usersData ? usersData : []);
  //           })
  //           .catch((err) => console.log(err.message));
  //       }

  //       setModules(x?.modules ? x.modules : []);

  //       projectArr.push(x);
  //       setProjectData(projectArr);
  //     })
  //     .catch((err) => console.log(err.message));
  // };

  const getData = async () => {
    try {
      const dataRes = await getSingleDocumentFirebase("projects", params.id);
      setData(dataRes);

      if (dataRes) {
        const userSnapshot = getDocs(
          collection(db, `projects/${dataRes.id}/users`)
        );

        userSnapshot
          .then((snapshot) => {
            const usersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log(usersData, "ini data");
            setUsers(usersData ? usersData : []);
            setData({ ...dataRes, usersProjectData: usersData });
          })
          .catch((err) => console.log(err.message));

        setModules(dataRes?.modules ? dataRes.modules : []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTeamProject = async () => {
    setIsAddingTeam(true);
    selectedUserProjectIds.forEach(async (x) => {
      const collectionName = `projects/${projectActive.id}/users`;
      const docName = x.id;
      const data = x;

      try {
        const result = await setDocumentFirebase(collectionName, docName, data);
        console.log(result);

        // Pesan toast yang berhasil
      } catch (error) {
        console.log("Terjadi kesalahan:", error);
      }
    });

    const mapIdUser = selectedUserProjectIds.map((x) => x.id);
    const collectionName = "projects";
    const docName = `${projectActive.id}`;
    const field = "users";
    const values = mapIdUser;

    try {
      const result = await arrayUnionFirebase(
        collectionName,
        docName,
        field,
        values
      );
      console.log(result); // Pesan toast yang berhasil
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setIsAddingTeam(false);
    }

    toast({
      status: "success",
      title: "Deoapp Business",
      description: "Success adding team to the project",
      duration: 1000,
    });

    setModalProjectUser(false);
    setSelectedUserProjectIds([]);
    setProjectActive("");
    setSearchResult([]);
    getData();
  };

  // console.log(projectActive, "xxx");

  // console.log(projectData, "ini project data");
  // console.log(manager, "ini manager");

  const saveData = async () => {
    if (input.image === "") {
      alert("Please fill the image");
      return;
    }
    if (manager) input.manager = manager;

    if (modules) input.modules = modules;

    if (users) {
      users.push(globalState?.uid);
      input.users = users.filter(
        (value, index, array) => array.indexOf(value) === index
      );
    }

    setIsLoading(true);
    try {
      if (params.id === "new") {
        await addDocumentFirebase(
          "projects",
          input,
          globalState.currentCompany
        );
      } else {
        await setDocumentFirebase("projects", params.id, input, data.companyId);
      }

      navigate(-1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitImage = async (file) => {
    const res = (await uploadImage(file[0])).data;
    alert(res.message);
    if (res.status) {
      setInput({ ...input, image: res.data });
      setData({ ...data, image: res.data });
    }
  };

  const deleteImage = () => {
    const confirmDelete = window.confirm("Are you sure to change?");
    if (confirmDelete) {
      setInput({ ...input, image: "" });
      setData({ ...data, image: "" });
    }
  };

  const handleSearchUsers = (q) => {
    const companyUsers = globalState.companies.find(
      (x) => x.id === globalState.currentCompany
    );
    const userChunks = chunkArray(companyUsers?.users, 100);

    const searchPromises = userChunks.map((userChunk) => {
      const searchParameters = {
        q: q,
        query_by: "name,email",
        filter_by: `id: [${userChunk.join(",")}]`,
        sort_by: "_text_match:desc",
      };

      return clientTypessense
        .collections("users")
        .documents()
        .search(searchParameters);
    });

    Promise.all(searchPromises)
      .then((results) => {
        const combinedResults = results.flatMap((result) => result.hits);
        setSearchResult(combinedResults);
      })
      .catch((error) => {
        console.error("Error performing search:", error);
      });
  };

  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const handleUserProjectClick = (userId) => {
    setSelectedUserProjectIds((prevIds) => {
      if (prevIds.includes(userId)) {
        return prevIds.filter((id) => id !== userId);
      } else {
        return [...prevIds, userId];
      }
    });
  };

  const handleOpenModaProjectTeam = () => {
    setModalProjectUserTeam(true);
    setCompanyActive(data);
  };

  const handleOpenModalProject = () => {
    setModalProjectUser(true);
    setProjectActive(data);
  };

  console.log(companyActive, "ooooo");

  useEffect(() => {
    getData();
    // return () => {
    //   setData();
    // };
  }, []);

  return (
    <Stack p={[1, 1, 5]} spacing={5}>
      <HStack>
        <BackButtonComponent />
        <Spacer />
        <Box>
          <Heading size={"lg"}>Projects</Heading>
          <Text fontSize="3xs">ID: {params.id}</Text>
        </Box>
      </HStack>

      <Flex w={"100%"} gap={5}>
        <Box
          w={"50%"}
          bgColor={"white"}
          p={5}
          borderRadius="md"
          shadow={"base"}
        >
          <Stack spacing={3} align={"center"}>
            <ImageComponent
              image={data?.image}
              name={data?.name}
              width="200px"
            />
            {data?.image ? (
              <Button
                size={"sm"}
                colorScheme="red"
                onClick={() => deleteImage()}
              >
                Change Image
              </Button>
            ) : (
              <Box>
                <Input
                  type="file"
                  onChange={(e) => submitImage(e.target.files)}
                />
              </Box>
            )}
          </Stack>

          <FormControl mt="2">
            <FormLabel>Project Name</FormLabel>
            <Input
              type="text"
              placeholder="Project name"
              defaultValue={data?.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </FormControl>

          <FormControl mt="2">
            <FormLabel>Project Description</FormLabel>
            <Input
              type="text"
              defaultValue={data?.description}
              placeholder="Description"
              onChange={(e) =>
                setInput({ ...input, description: e.target.value })
              }
            />
          </FormControl>

          <FormControl mt="2">
            <FormLabel>Project Email</FormLabel>
            <Input
              isDisabled={
                params.id !== "new" && globalState.roleCompany !== "owner"
                  ? true
                  : false
              }
              type="text"
              defaultValue={data?.email}
              placeholder="Email"
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
          </FormControl>

          <FormControl mt="2">
            <FormLabel>Project Phone Number</FormLabel>
            <Input
              isDisabled={
                params.id !== "new" && globalState.roleCompany !== "owner"
                  ? true
                  : false
              }
              type="text"
              defaultValue={data?.phone}
              placeholder="Phone Number"
              onChange={(e) => setInput({ ...input, phone: e.target.value })}
            />
          </FormControl>

          <FormControl mt="2" borderRadius="md" shadow="base" p="5">
            <FormLabel>Project Modules</FormLabel>
            <SimpleGrid columns="3" gap={3}>
              {modules ? (
                dataCheckBox?.map((x, i) => (
                  <Checkbox
                    key={i}
                    onChange={(e) => {
                      if (e.target.checked) setModules([...modules, x.value]);
                      else
                        setModules([...modules?.filter((z) => z !== x.value)]);
                    }}
                    defaultChecked={
                      modules?.find((z) => z === x.value) ? true : false
                    }
                  >
                    <HStack>
                      <Text>{x.name}</Text>
                      <Tooltip label={x.description} aria-label="A tooltip">
                        <InfoIcon color="blue" />
                      </Tooltip>
                    </HStack>
                  </Checkbox>
                ))
              ) : (
                <></>
              )}
            </SimpleGrid>
          </FormControl>

          <Button
            isLoading={isLoading}
            mt="5"
            colorScheme="green"
            w="full"
            onClick={() => saveData()}
          >
            Save
          </Button>
        </Box>

        <Box p={5} w={"50%"} bg={params?.id !== "new" ? "white" : null}>
          {params.id !== "new" ? (
            <Stack>
              <Heading size={"md"} align={"center"}>
                {data?.name}
              </Heading>

              <Text py={5} align={"center"}>
                Managers
              </Text>

              <SimpleGrid columns={3} spacing={3}>
                {data?.managers?.length > 0 &&
                  data?.managers?.map((y, i) => {
                    const user = data?.usersProjectData?.find(
                      (userData) => userData.id === y
                    );
                    return (
                      <Stack
                        key={i}
                        p={3}
                        borderRadius={"md"}
                        shadow={"base"}
                        align={"center"}
                      >
                        <Avatar
                          size={"sm"}
                          name={user?.name}
                          src={user?.image ? user?.image : user?.email}
                        />
                        <Text fontSize={12} fontWeight={500}>
                          {user?.email}
                        </Text>
                      </Stack>
                    );
                  })}
              </SimpleGrid>
              <Text
                align={"center"}
                onClick={() => handleOpenModaProjectTeam()}
                color={"blue.400"}
                fontSize={12}
                cursor={"pointer"}
              >
                See All Managers Here
              </Text>

              <Box py={5}>
                <Divider />
              </Box>

              <Text align={"center"}>Users in this project</Text>

              <SimpleGrid columns={3} spacing={3}>
                {users?.slice(0, 9)?.map((x, i) => (
                  <Stack
                    key={i}
                    p={3}
                    borderRadius={"md"}
                    border={"1px"}
                    borderColor={"gray.50"}
                    shadow={"base"}
                    align={"center"}
                  >
                    <Avatar
                      size={"sm"}
                      name={x.email}
                      src={x.image ? x.image : x.email}
                    />
                    <Text fontSize={12} fontWeight={500}>
                      {x.email}
                    </Text>
                  </Stack>
                ))}
              </SimpleGrid>
              <Text
                align={"center"}
                onClick={handleOpenModaProjectTeam}
                color={"blue.400"}
                fontSize={12}
                cursor={"pointer"}
              >
                See All Users Here
              </Text>

              <HStack justify={"center"} py={3}>
                <Button
                  onClick={handleOpenModalProject}
                  size={"sm"}
                  colorScheme="green"
                >
                  Add Users
                </Button>
                <Button
                  onClick={handleOpenModaProjectTeam}
                  size={"sm"}
                  colorScheme="green"
                >
                  Edit Role
                </Button>
              </HStack>
            </Stack>
          ) : // <ProjectCard
          //   projectData={projectData}
          //   navigate={navigate}
          //   handleOpenModalProject={handleOpenModalProject}
          //   handleOpenModaProjectTeam={handleOpenModaProjectTeam}
          // />
          null}
        </Box>
      </Flex>

      <Modal
        size={"md"}
        isOpen={modalProjectUser}
        onClose={() => setModalProjectUser(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Project Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={1} py={3}>
              <HStack m="1">
                <Input
                  type="text"
                  placeholder="Search users"
                  onChange={(e) => handleSearchUsers(e.target.value)}
                />
              </HStack>

              <Stack>
                <Stack
                  h={300}
                  overflowY={"auto"}
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
                  {searchResult.length > 0 ? (
                    searchResult.map((x, index) => {
                      return (
                        <HStack key={index} p="2" borderBottom="1px">
                          <Avatar
                            name={x.document.name}
                            src={x.document.image ? x.document.image : ""}
                          />
                          <Box>
                            <Text>{x.document.name}</Text>
                            <Text>{x.document.email}</Text>
                          </Box>
                          <Spacer />
                          <Button
                            colorScheme="green"
                            onClick={() => handleUserProjectClick(x.document)}
                          >
                            +
                          </Button>
                        </HStack>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <AvatarGroup size="sm" gap="1" max={4}>
                {selectedUserProjectIds.length > 0 &&
                  selectedUserProjectIds.map((x, i) => (
                    <Avatar key={i} name={x?.name} />
                  ))}
              </AvatarGroup>
              <Spacer />
              <Button
                isLoading={isAddingTeam}
                leftIcon={<AddIcon boxSize={3} />}
                colorScheme="green"
                onClick={() => handleAddTeamProject()}
              >
                Add Team
              </Button>
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalProjectUser(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalProjectUserTeam}
        onClose={() => setModalProjectUserTeam(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              spacing={1}
              py={3}
              h={300}
              overflowY={"auto"}
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
              {companyActive?.usersProjectData?.length > 0 &&
                companyActive?.usersProjectData?.map((x, index) => {
                  let roleUser = "";
                  if (companyActive?.owners?.includes(x.id)) {
                    roleUser = "owner";
                  } else if (companyActive?.managers?.includes(x.id)) {
                    roleUser = "manager";
                  } else if (companyActive?.users?.includes(x.id)) {
                    roleUser = "user";
                  } else if (companyActive?.admin?.includes(x.id)) {
                    roleUser = "admin";
                  }

                  const handleChangeRoleProject = async (event) => {
                    // Mengubah role pengguna
                    const selectedRole = event.target.value;

                    if (
                      globalState.roleCompany === "owner" ||
                      globalState.roleProject === "manager"
                    ) {
                      const collectionName = "projects";
                      const docName = companyActive.id;
                      const field =
                        selectedRole === "manager"
                          ? "managers"
                          : selectedRole === "user"
                          ? "users"
                          : "admin";
                      const values = [x.id];

                      try {
                        await arrayUnionFirebase(
                          collectionName,
                          docName,
                          field,
                          values
                        );

                        toast({
                          title: "Berhasil",
                          description: "berhasil mengupdate role team",
                          status: "success",
                          duration: 9000,
                          isClosable: true,
                        });
                      } catch (error) {
                        console.log("Terjadi kesalahan:", error);
                      }
                    } else {
                      toast({
                        title: "Warning",
                        description: "You dont have any access to set role.",
                        status: "warning",
                        duration: 9000,
                        isClosable: true,
                      });
                    }

                    // Implementasikan logika untuk mengubah role pengguna sesuai dengan kebutuhan Anda
                  };

                  return (
                    <HStack
                      cursor={"pointer"}
                      spacing={2}
                      key={index}
                      p={2}
                      borderRadius="lg"
                    >
                      <Stack>
                        <Avatar size={"sm"} name={x?.name} />
                      </Stack>
                      <Stack spacing={0}>
                        <Text
                          fontSize={"sm"}
                          fontWeight={500}
                          textTransform="capitalize"
                        >
                          {x?.name}
                        </Text>
                        <Text fontSize={"xs"}>{x?.email}</Text>
                      </Stack>
                      <Spacer />
                      <Stack>
                        <Select
                          size="xs"
                          defaultValue={roleUser}
                          onChange={handleChangeRoleProject}
                          variant="outline"
                          fontWeight="normal"
                        >
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </Select>
                      </Stack>
                    </HStack>
                  );
                })}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalProjectUserTeam(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default ProjectsViewPage;
