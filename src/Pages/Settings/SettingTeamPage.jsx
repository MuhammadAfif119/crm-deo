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

function SettingTeamPage() {
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [companyActive, setCompanyActive] = useState("");
  const [modalCompanyUser, setModalCompanyUser] = useState(false);
  const [modalCompanyUserTeam, setModalCompanyUserTeam] = useState(false);

  const [projectData, setProjectData] = useState([]);
  const [projectActive, setProjectActive] = useState("");
  const [selectedUserProjectIds, setSelectedUserProjectIds] = useState([]);

  const [modalProjectUser, setModalProjectUser] = useState(false);
  const [modalProjectUserTeam, setModalProjectUserTeam] = useState(false);

  const [modalNewProject, setModalNewProject] = useState(false);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const [searchResult, setSearchResult] = useState("");

  const [files, setFiles] = useState([]);
  const [filesImage, setFilesImage] = useState([]);
  const [data, setData] = useState({});
  const [loadingNewProject, setLoadingNewProject] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const globalState = useUserStore();

  const toast = useToast({ position: "top", align: "center" });

  const navigate = useNavigate();

  //   const getDataCompany = async () => {
  //     setCompanyData(globalState.companies);
  //   };

  const getDataCompany = async () => {
    const q = query(
      collection(db, "companies"),
      where("users", "array-contains", globalState.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promises = snapshot.docs.map(async (doc) => {
        const companyData = { id: doc.id, ...doc.data() };

        if (companyData) {
          const userSnapshot = await getDocs(collection(db, "users"));

          const userData = userSnapshot.docs
            .filter((userDoc) => companyData.users.includes(userDoc.id)) // Filter users based on company's user array
            .map((userDoc) => {
              const userData = userDoc.data();
              return {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
              };
            });

          companyData.usersCompanyData = userData;

          console.log(companyData.usersCompanyData);
          return companyData;
        }

        return null;
      });

      Promise.all(promises).then((resolvedCompanies) => {
        const companyData = resolvedCompanies.filter(
          (company) => company !== null
        );
        setCompanyData(companyData);
      });
    });

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  };

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

  const handleAddUser = async () => {
    if (globalState.roleCompany !== "owner") {
      return toast({
        title: "Alert!",
        description: "You dont have access to create new project.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }

    const conditions = [{ field: "email", operator: "==", value: email }];

    try {
      setLoading(true);
      const res = await getCollectionFirebase("users", conditions);
      if (res.length > 0) {
        const collectionName = "companies";
        const docName = companyActive.id;
        const field = "users";
        const values = [res[0].id];

        try {
          const result = await arrayUnionFirebase(
            collectionName,
            docName,
            field,
            values
          );
          console.log(result);
          // Pesan toast yang berhasil
          toast({
            status: "success",
            description: "Add new Team success",
            duration: 2000,
          });
          setModalCompanyUser(false);
          setLoading(false);
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        }

        setLoading(false);
      } else {
        setLoading(true);
        const baseURL =
          "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net";
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.REACT_APP_FUNCTIONS_KEY,
          },
        };
        const data = { email: email, name: name, companyId: companyActive.id };

        try {
          const newUrl = `${baseURL}/createUser`;
          const res = await axios.post(newUrl, data, options);
          if (res.status === true) {
            toast({
              status: "success",
              description: "Add new Team success",
              duration: 2000,
            });
            setModalCompanyUser(false);
            setLoading(false);
          }

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error, "ini error");
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "ini error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (value) => {
    if (globalState.roleCompany !== "owner") {
      return toast({
        title: "Alert!",
        description: "You dont have access to delete user",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "pFa08EJkVRoT7GDiqk1",
        },
      };

      const data = {
        uid: userDetails.id,
      };

      try {
        const res = await axios.post(
          "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/accountDelete",
          data,
          config
        );

        console.log(res, "ini ress");

        if (res.status === 200) {
          //delete from all firestore

          try {
            //delete from company
            const dataConditions = [
              {
                field: "users",
                operator: "array-contains",
                value: userDetails.id,
              },
            ];
            const deleteUserFromCompany = await getCollectionFirebase(
              "companies",
              dataConditions
            );

            console.log(deleteUserFromCompany);

            const updateCompanyPromises = deleteUserFromCompany.map(
              async (company) => {
                const updatedOwners = await arrayRemoveFirebase(
                  "companies",
                  company?.id,
                  "owner",
                  [userDetails?.id]
                );
                const updatedUsers = await arrayRemoveFirebase(
                  "companies",
                  company?.id,
                  "users",
                  [userDetails?.id]
                );

                console.log(updatedOwners, updatedUsers);
              }
            );

            //wait for all update
            await Promise.all(updateCompanyPromises);

            //deleteFromProject
            const conditions = [
              { field: "companyId", operator: "==", value: companyActive.id },
              {
                field: "users",
                operator: "array-contains",
                value: userDetails.id,
              },
            ];
            const CompanyProject = await getCollectionFirebase(
              "projects",
              conditions
            );

            const updateProjectPromises = CompanyProject.map(
              async (project) => {
                const updatedOwners = await arrayRemoveFirebase(
                  "projects",
                  project?.id,
                  "owner",
                  [userDetails?.id]
                );
                const updatedUsers = await arrayRemoveFirebase(
                  "projects",
                  project?.id,
                  "users",
                  [userDetails?.id]
                );

                //deleteFromSubcolProjects
                const getSubcol = await getCollectionFirebase(
                  `projects/${project.Id}/users`
                );

                console.log(getSubcol);

                if (getSubcol && getSubcol.length > 0) {
                  const getProjectSubcollection = await deleteDocumentFirebase(
                    `projects/${project.id}/users`,
                    userDetails.id
                  );
                }
              }
            );

            console.log(CompanyProject);

            //wait for all update
            await Promise.all(updateProjectPromises);

            //delete from user collection
            await deleteDocumentFirebase("users", userDetails.id);
          } catch (error) {
            console.log(error, "ini error");
          }
        }

        setLoading(false);
        setModalConfirmDelete(false);
        setModalCompanyUserTeam(false);

        toast({
          title: "Deoapp AI",
          status: "success",
          description: "Account deleted",
          duration: 3000,
        });
      } catch (error) {
        console.log(error, "ini error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalConfirmDelete = (value) => {
    console.log(value);
    setModalConfirmDelete(true);
    setUserDetails(value);
  };

  const handleOpenModalCompanyTeam = (value) => {
    setModalCompanyUserTeam(true);
    setCompanyActive(value);
  };

  const handleOpenModalCompany = (value) => {
    setModalCompanyUser(true);
    setCompanyActive(value);
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
    getDataCompany();
    getDataProjects();

    return () => {};
  }, [globalState.currentCompany]);

  return (
    <Stack>
      <CompanyCard
        companyData={companyData}
        navigate={navigate}
        handleOpenModalCompany={handleOpenModalCompany}
        handleOpenModalCompanyTeam={handleOpenModalCompanyTeam}
      />

      <Divider />

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
        isOpen={modalCompanyUser}
        onClose={() => setModalCompanyUser(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Company Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={1} py={3}>
              <Stack m="1">
                <Input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <Button
                leftIcon={<AddIcon boxSize={3} />}
                colorScheme="green"
                onClick={() => handleAddUser()}
              >
                Add Team
              </Button>
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalCompanyUser(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

      <Modal
        isOpen={modalConfirmDelete}
        onClose={() => setModalConfirmDelete(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>User will be delete permanently. Are you sure?</Text>
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              {loading === true ? (
                <Button
                  isLoading
                  colorScheme="green"
                  onClick={handleDeleteUser}
                >
                  Yes
                </Button>
              ) : (
                <Button colorScheme="green" onClick={handleDeleteUser}>
                  Yes
                </Button>
              )}
              <Button
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalConfirmDelete(false);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalCompanyUserTeam}
        onClose={() => setModalCompanyUserTeam(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User In This Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody h={200}>
            <Stack spacing={1} py={3}>
              {companyActive?.usersCompanyData?.length > 0 &&
                companyActive?.usersCompanyData?.map((x, index) => {
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
                        <Button
                          size={"sm"}
                          onClick={() => handleModalConfirmDelete(x)}
                        >
                          <Text fontSize={"2xs"}>
                            Delete Account Permanently
                          </Text>
                        </Button>
                      </Stack>
                    </HStack>
                  );
                })}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex gap={5}>
              <Button
                size={"sm"}
                leftIcon={<CloseIcon boxSize={3} />}
                colorScheme="red"
                onClick={() => {
                  setModalCompanyUserTeam(false);
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

export default SettingTeamPage;
