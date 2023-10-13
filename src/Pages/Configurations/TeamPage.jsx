import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { MdOutlinePermMedia } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import CompanyCard from "../../Components/Card/CompanyCard";
import useUserStore from "../../Hooks/Zustand/Store";
import {
  addDocumentFirebase,
  arrayRemoveFirebase,
  arrayUnionFirebase,
  deleteDocumentFirebase,
  getCollectionFirebase,
  setDocumentFirebase,
  uploadFile,
} from "../../Api/firebaseApi";
import ProjectCard from "../../Components/Card/ProjectCard.jsx";
import { clientTypessense } from "../../Api/Typesense";

function TeamPage() {
  const [companyActive, setCompanyActive] = useState("");

  const [projectData, setProjectData] = useState([]);
  const [projectActive, setProjectActive] = useState("");
  const [selectedUserProjectIds, setSelectedUserProjectIds] = useState([]);

  const [modalProjectUser, setModalProjectUser] = useState(false);
  const [modalProjectUserTeam, setModalProjectUserTeam] = useState(false);

  const [modalNewProject, setModalNewProject] = useState(false);

  const [searchResult, setSearchResult] = useState("");

  const [files, setFiles] = useState([]);
  const [filesImage, setFilesImage] = useState([]);
  const [data, setData] = useState({});
  const [loadingNewProject, setLoadingNewProject] = useState("");
  const globalState = useUserStore();

  const toast = useToast({ position: "top", align: "center" });

  console.log(companyActive, "ini company active");

  const navigate = useNavigate();

  //   const getDataCompany = async () => {
  //     setCompanyData(globalState.companies);
  //   };

  const getDataProjects = async () => {
    const q = query(
      collection(db, "projects"),
      where("companyId", "==", globalState.currentCompany),
      where("users", "array-contains", globalState.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promises = snapshot.docs.map(async (doc) => {
        const projectData = { id: doc.id, ...doc.data() };

        if (projectData) {
          const userSnapshot = await getDocs(
            collection(db, `projects/${doc.id}/users`)
          );
          const userData = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          projectData.usersProjectData = userData;
          return projectData;
        }

        return null;
      });

      Promise.all(promises).then((resolvedProjects) => {
        const projectData = resolvedProjects.filter(
          (project) => project !== null
        );
        setProjectData(projectData);
      });
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  };

  const handleOpenModalProject = (value) => {
    setModalProjectUser(true);
    setProjectActive(value);
  };

  const handleOpenModaProjectTeam = (value) => {
    setModalProjectUserTeam(true);
    setCompanyActive(value);
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

  const handleAddTeamProject = async () => {
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
    }

    setSelectedUserProjectIds([]);
    setProjectActive("");
    setSearchResult([]);
    getDataProjects();
  };

  const handleModalNewProject = () => {
    setModalNewProject(true);
  };

  const handleAddProject = async () => {
    if (!globalState.currentCompany) {
      return toast({
        title: "Alert!",
        description: "Please check your current company.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }

    if (globalState.roleCompany !== "owner") {
      return toast({
        title: "Alert!",
        description: "You dont have access to create new project.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }

    setLoadingNewProject(true);

    if (filesImage[0]) {
      const resImage = await uploadFile(data.title, "projects", filesImage[0]);
      data.image = resImage;
    }

    let dataUpdated = data;
    dataUpdated.modules = ["ai"];
    dataUpdated.owner = [globalState.uid];
    dataUpdated.users = [globalState.uid];

    const collectionName = "projects";
    const dataRes = dataUpdated;

    try {
      const docID = await addDocumentFirebase(
        collectionName,
        dataRes,
        globalState.currentCompany
      );
      console.log("ID Dokumen Baru:", docID);
      setModalNewProject(false);
      setData({});
      setFiles([]);
      setFilesImage([]);
      setLoadingNewProject(false);
      getDataProjects();

      toast({
        title: "Success",
        description: "Success add new project",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
      toast({
        title: "error",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setLoadingNewProject(false);
    } finally {
      setLoadingNewProject(false);
    }
  };

  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
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

  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;
    if (newFiles.length) {
      const newFileArray = [...files];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          setFiles(newFileArray);
        };
      }
      setFilesImage(newFiles); // Mengubah state filesImage menjadi array baru dari selectedFiles
    }
  };

  useEffect(() => {
    getDataProjects();

    return () => {};
  }, [globalState.currentCompany]);

  return (
    <Stack>
      <Stack alignItems={"flex-end"} justifyContent="flex-end">
        <Button
          onClick={() => handleModalNewProject()}
          shadow="md"
          variant="outline"
          borderColor="green.500"
          color="green.500"
        >
          <HStack>
            <FcPlus />
            <Text>New Project</Text>
          </HStack>
        </Button>

        {globalState?.projects?.length === 0 && (
          <Stack>
            <Text color={"green.500"}>Please, create your own project.</Text>
          </Stack>
        )}
      </Stack>

      <ProjectCard
        projectData={projectData}
        navigate={navigate}
        handleOpenModalProject={handleOpenModalProject}
        handleOpenModaProjectTeam={handleOpenModaProjectTeam}
      />

      <Divider />

      <Modal
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
            <Stack spacing={1} py={3}>
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

      <Modal
        isOpen={modalNewProject}
        onClose={() => setModalNewProject(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={1} py={3}>
              <Stack m="1">
                <Input
                  type="text"
                  placeholder="Project Name"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Description"
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />

                <HStack>
                  {files.length > 0 ? (
                    <Stack>
                      <Image
                        src={files[0].file}
                        boxSize="100%"
                        maxWidth={300}
                        borderRadius="xl"
                        alt={files[0].name}
                        shadow="sm"
                      />
                    </Stack>
                  ) : (
                    <Image
                      boxSize="100%"
                      src={
                        data?.image_url
                          ? data.image_url
                          : "https://bit.ly/dan-abramov"
                      }
                      alt="Dan Abramov"
                    />
                  )}
                </HStack>

                <Stack>
                  <Input
                    type="file"
                    onChange={handleFileInputChange}
                    display="none"
                    id="fileInput"
                  />

                  <label htmlFor="fileInput">
                    <HStack cursor={"pointer"}>
                      <Stack>
                        <MdOutlinePermMedia />
                      </Stack>
                      <Text
                        fontSize={"sm"}
                        color="blue.600"
                        fontStyle={"italic"}
                      >
                        Add Image
                      </Text>
                    </HStack>
                  </label>
                </Stack>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <Button
                isLoading={loadingNewProject ? true : false}
                leftIcon={<AddIcon boxSize={3} />}
                colorScheme="green"
                onClick={() => handleAddProject()}
              >
                Add Project
              </Button>
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalNewProject(false);
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

export default TeamPage;
