import { AddIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
  Stack,
  Grid,
  Divider,
  Flex,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  addDocumentFirebase,
  arrayRemoveFirebase,
  arrayUnionFirebase,
  deleteDocumentFirebase,
  getCollectionFirebase,
} from "../../Api/firebaseApi";
import { createUserFunctions } from "../../Api/firebaseFunction";
import { clientTypessense } from "../../Api/Typesense";
import useUserStore from "../../Hooks/Zustand/Store";
import CompanyCard from "../../Components/Card/CompanyCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import BackButtons from "../../Components/Buttons/BackButtons";

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [userDetails, setUserDetails] = useState();
  const [companyActive, setCompanyActive] = useState("");
  const [modalCompanyUser, setModalCompanyUser] = useState(false);
  const [modalCompanyUserTeam, setModalCompanyUserTeam] = useState(false);

  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

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
    const sortBy = null;
    const limitValue = 1;

    setLoading(true);

    try {
      const existingUser = await getCollectionFirebase(
        "users",
        conditions,
        sortBy,
        limitValue
      );

      if (existingUser.length > 0) {
        const collectionName = "companies";
        const docName = companyActive.id;
        const field = "users";
        const values = [existingUser[0].id];

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
          if (res.status === 200) {
            toast({
              status: "success",
              description: "Add new Team success",
              duration: 2000,
            });
            setModalCompanyUser(false);
          }
        } catch (error) {
          setLoading(false);
          console.log(error, "ini error");
        } finally {
          setLoading(false);
        }
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

  useEffect(() => {
    getDataCompany();

    return () => {};
  }, [globalState.currentCompany]);

  return (
    <Stack>
      <HStack px={[1, 1, 5]} pt={[1, 1, 5]}>
        <BackButtons />
        <Spacer />
        <Heading textAlign="end" size="md">
          User Configuration
        </Heading>
      </HStack>
      <CompanyCard
        companyData={companyData}
        navigate={navigate}
        handleOpenModalCompany={handleOpenModalCompany}
        handleOpenModalCompanyTeam={handleOpenModalCompanyTeam}
      />

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
                isLoading={loading}
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

export default UsersPage;
