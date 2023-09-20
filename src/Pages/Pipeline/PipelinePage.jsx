import {
  Button,
  FormControl,
  HStack,
  Input,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  SimpleGrid,
  Spacer,
  InputGroup,
  InputLeftElement,
  Box,
  Link,
  useToast,
  Grid,
  Heading,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { FiCheck, FiFilter } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import useUserStore from "../../Hooks/Zustand/Store";

import {
  addDocumentFirebase,
  deleteDocumentFirebase,
  getCollectionFirebase,
  getCollectionWithSnapshotFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import moment from "moment";
import { decryptToken, encryptToken } from "../../Utils/encrypToken";

function PipelinePage() {
  const [pipelineModal, setPipelineModal] = useState(false);
  const [dataPipeline, setDataPipeline] = useState({
    name: "",
    stages: [],
  });

  const [dataSearchPipeline, setDataSearchPipeline] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const [selectedFormId, setSelectedFormId] = useState(null);
  const [dataDelete, setDataDelete] = useState("");

  const [formList, setFormList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();

  const deleteModal = useDisclosure();

  const [listPipeline, setListPipeline] = useState([]);

  const globalState = useUserStore();

  const handleAddNewStage = () => {
    setDataPipeline((prev) => ({
      ...prev,
      stages: [...prev.stages, { stageName: "", filter: true }],
    }));
  };

  const handleDeleteStage = (index) => {
    setDataPipeline((prev) => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index),
    }));
  };

  const handleFilterToggle = (index) => {
    setDataPipeline((prev) => {
      const newStages = prev.stages.map((stage, i) => {
        if (i === index) {
          return {
            ...stage,
            filter: !stage.filter,
          };
        } else if (
          i ===
          (index - 1 + prev.stages.length) % prev.stages.length
        ) {
          return {
            ...stage,
            filter: prev.stages[index].filter ? true : stage.filter,
          };
        } else {
          return stage;
        }
      });

      return { ...prev, stages: newStages };
    });
  };

  const handleStageNameChange = (index, value) => {
    setDataPipeline((prev) => {
      const newStages = [...prev.stages];
      newStages[index].stageName = value;
      return { ...prev, stages: newStages };
    });
  };

  const handleSubmitPipeline = async () => {
    if (!selectedFormId) {
      toast({
        title: "Error",
        description: "Please select a form to connect with the pipeline.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    let dataUpdate = dataPipeline;
    dataUpdate.projectId = globalState.currentProject;
    dataUpdate.formId = [selectedFormId];

    const collectionName = "pipelines";
    const data = dataPipeline;
    try {
      const docID = await addDocumentFirebase(
        collectionName,
        data,
        globalState?.currentCompany
      );
      console.log("ID Dokumen Baru:", docID);

      if (docID) {
        const updateForm = await updateDocumentFirebase(
          "forms",
          decryptToken(selectedFormId),
          {
            pipelineId: docID,
          }
        );
      }

      fetchData();
      handleCloseModal();

      toast({
        title: "Success",
        description: "Success add new pipeline!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const resetForm = () => {
    setDataPipeline({
      name: "",
      stages: [],
    });
  };

  const handleCloseModal = () => {
    resetForm();
    setPipelineModal(false);
  };

  const fetchData = async () => {
    const conditions = [
      { field: "companyId", operator: "==", value: globalState.currentCompany },
      { field: "projectId", operator: "==", value: globalState.currentProject },
    ];
    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = 10;
    try {
      const res = await getCollectionFirebase(
        "pipelines",
        conditions,
        sortBy,
        limitValue
      );

      const resForm = await getCollectionFirebase("forms", conditions, sortBy);

      const formFilter = resForm.filter(
        (x) =>
          // (!x.product_used || x.product_used?.length === 0) &&
          // (!x.ticket_used || x.ticket_used?.length === 0) &&
          // (!x.membership_used || x.membership_used?.length === 0)
          !x.pipelineId || x.pipelineId === ""
      );

      setListPipeline(res);
      // setFormList(resForm);
      setFormList(formFilter);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = listPipeline.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataSearchPipeline(newData);
      setInputSearch(text);
    } else {
      setDataSearchPipeline(listPipeline);
      setInputSearch(text);
    }
  };

  const handleDeleteModal = (value) => {
    deleteModal.onOpen();
    setDataDelete(value);
  };

  console.log(dataDelete);

  const handleDeletePipeline = async () => {
    console.log(dataDelete, "ini data delete");
    setIsLoading(true);
    try {
      const result = await deleteDocumentFirebase("pipelines", dataDelete.id);

      console.log(result);

      if (result === "Dokumen berhasil dihapus.") {
        const updateForm = await updateDocumentFirebase(
          "forms",
          decryptToken(dataDelete.formId[0]),
          { pipelineId: "" }
        );

        console.log(updateForm);
      }

      toast({
        status: "success",
        title: "Deoapp CRM",
        description: "Pipeline deleted",
        duration: 3000,
      });

      fetchData();

      deleteModal.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormToggle = (formId) => {
    setSelectedFormId((prev) => (prev === formId ? null : formId));
  };

  useEffect(() => {
    fetchData();

    return () => {};
  }, [globalState.currentCompany, globalState.currentProject]);

  return (
    <Stack p={[1, 1, 5]}>
      <Stack spacing={5}>
        <HStack>
          <Heading size={"md"} textTransform="capitalize">
            pipeline
          </Heading>
          <Spacer />
          <HStack>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" mb={2} />
              </InputLeftElement>
              <Input
                placeholder="Search"
                size={"sm"}
                bg={"white"}
                onChange={(e) => searchFilterFunction(e.target.value)}
              />
            </InputGroup>

            <Button
              size={"sm"}
              colorScheme="telegram"
              onClick={() => setPipelineModal(true)}
              borderRadius={"sm"}
            >
              + Add
            </Button>
          </HStack>
        </HStack>

        <Box
          borderRadius={"md"}
          bg={"white"}
          minHeight="700px"
          my={4}
          p={[1, 1, 5]}
          boxShadow={"sm"}
        >
          {inputSearch === "" ? (
            <SimpleGrid columns={[2, null, 4]} spacing={3}>
              {listPipeline?.map((x, i) => {
                return (
                  <Stack
                    key={i}
                    borderWidth="1px"
                    p={3}
                    bgColor="white"
                    shadow={"md"}
                    rounded={5}
                    cursor="pointer"
                    _hover={{
                      bg: "gray.100",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      mb={3}
                      onClick={() =>
                        navigate(`/pipeline/view/${x.id}`, { state: x })
                      }
                    >
                      <Heading textTransform={"capitalize"} size="sm">
                        {x.name}
                      </Heading>
                      <Text color={"gray.700"}>{x.project}</Text>
                    </Box>
                    <Spacer />

                    <HStack>
                      <Text fontSize={"xs"} color={"gray.500"}>
                        {moment(x.createdAt.seconds * 1000).fromNow()}
                      </Text>
                      <Spacer />
                      <DeleteIcon
                        onClick={() => handleDeleteModal(x)}
                        boxSize={3}
                      />
                    </HStack>
                  </Stack>
                );
              })}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={[2, null, 4]} spacing={3}>
              {dataSearchPipeline?.map((x, i) => {
                return (
                  <Stack
                    key={i}
                    borderWidth="1px"
                    p={3}
                    bgColor="white"
                    shadow={"md"}
                    rounded={5}
                    cursor="pointer"
                    _hover={{
                      bg: "gray.100",
                      transform: "scale(1.02)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    <Box
                      mb={3}
                      onClick={() =>
                        navigate(`/pipeline/view/${x.id}`, { state: x })
                      }
                    >
                      <Heading textTransform={"capitalize"} size="sm">
                        {x.name}
                      </Heading>
                      <Text color={"gray.700"}>{x.project}</Text>
                      <Spacer />
                    </Box>

                    <HStack>
                      <Text fontSize={"xs"} color={"gray.500"}>
                        {moment(x.createdAt.seconds * 1000).fromNow()}
                      </Text>
                      <Spacer />
                      <DeleteIcon
                        onClick={() => handleDeleteModal(x)}
                        boxSize={3}
                      />
                    </HStack>
                  </Stack>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      </Stack>

      <Modal isOpen={pipelineModal} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text fontSize={"md"}>Pipeline New</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Stack>
                <Text>Pipeline name</Text>
                <Input
                  size={"sm"}
                  placeholder="name"
                  onChange={(e) =>
                    setDataPipeline({ ...dataPipeline, name: e.target.value })
                  }
                />
              </Stack>

              <Stack spacing={2}>
                <Text>Form Active</Text>
                {formList?.length > 0 ? (
                  <>
                    {formList?.map((x, index) => (
                      <HStack
                        key={index}
                        p={2}
                        borderRadius="md"
                        borderWidth={1}
                        borderColor="blackAlpha.200"
                      >
                        <Text>{x.title}</Text>
                        <Spacer />
                        <IconButton
                          size="sm"
                          icon={<FiCheck size={20} />}
                          bgColor={
                            x.token === selectedFormId
                              ? "green.300"
                              : "gray.200"
                          }
                          onClick={() => handleFormToggle(x.token)}
                        />
                      </HStack>
                    ))}
                  </>
                ) : (
                  <Center>
                    <Box align={"center"} fontSize={12}>
                      <Text>No Form Data. All Forms are used</Text>
                      <Text>You can create your first form</Text>
                      <Button
                        my={2}
                        colorScheme="blue"
                        size={"xs"}
                        onClick={() => navigate("/form-builder")}
                      >
                        Here
                      </Button>
                    </Box>
                  </Center>
                )}
              </Stack>

              {dataPipeline?.stages?.map((stage, index) => (
                <Grid
                  gap={4}
                  templateColumns={{ base: "2fr 1fr", md: "2fr 1fr" }}
                  key={index}
                >
                  <Stack spacing={2}>
                    <Text>Stage Name</Text>
                    <Input
                      size={"sm"}
                      w="100%"
                      placeholder="name"
                      value={stage.stageName}
                      onChange={(e) =>
                        handleStageNameChange(
                          index,
                          e.target.value.toLowerCase()
                        )
                      }
                    />
                  </Stack>

                  <Stack>
                    <Text>Actions</Text>

                    <HStack>
                      <IconButton
                        size="sm"
                        icon={<FiFilter />}
                        color={stage.filter ? "blue" : "gray"}
                        onClick={() => handleFilterToggle(index)}
                      />
                      <Button
                        colorScheme={"red"}
                        size="sm"
                        onClick={() => handleDeleteStage(index)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Stack>
                </Grid>
              ))}
              <Button
                colorScheme={"blue"}
                variant="outline"
                size={"sm"}
                onClick={handleAddNewStage}
              >
                Add Stage
              </Button>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="blackAlpha"
              mr={3}
              onClick={() => setPipelineModal(false)}
            >
              Close
            </Button>
            <Button
              size={"sm"}
              colorScheme="twitter"
              mr={3}
              onClick={handleSubmitPipeline}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text fontSize={"md"}>Delete Pipeline</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure to delete {dataDelete.name} Pipeline?</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              colorScheme="blackAlpha"
              mr={3}
              onClick={deleteModal.onClose}
            >
              No
            </Button>
            <Button
              isLoading={isLoading}
              size={"sm"}
              colorScheme="twitter"
              mr={3}
              onClick={handleDeletePipeline}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default PipelinePage;
