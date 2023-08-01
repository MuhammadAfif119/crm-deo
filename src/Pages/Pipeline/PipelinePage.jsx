import { Button, FormControl, HStack, Input, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, SimpleGrid, Spacer, InputGroup, InputLeftElement, Box, Link, useToast } from '@chakra-ui/react'
import { FiFilter } from 'react-icons/fi';
import React, { useEffect, useState } from 'react'
import useUserStore from "../../Hooks/Zustand/Store";

import { addDocumentFirebase, getCollectionFirebase, getCollectionWithSnapshotFirebase } from '../../Api/firebaseApi';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';



function PipelinePage() {

  const [pipelineModal, setPipelineModal] = useState(false);
  const [dataPipeline, setDataPipeline] = useState({
    name: "",
    stages: [],
  });

  const toast = useToast()

  const navigate = useNavigate()

  const [listPipeline, setListPipeline] = useState([])

  const globalState = useUserStore()

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
        } else if (i === (index - 1 + prev.stages.length) % prev.stages.length) {
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
    let dataUpdate = dataPipeline
    dataUpdate.projectId = globalState.currentProject


    const collectionName = 'pipelines';
    const data = dataPipeline
    try {
      const docID = await addDocumentFirebase(collectionName, data, globalState?.currentCompany);
      console.log('ID Dokumen Baru:', docID);

      toast({
        title: "Success",
        description: "Success add new pipeline!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

    } catch (error) {
      console.log('Terjadi kesalahan:', error);
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
    try {
      const res = await getCollectionFirebase(
        "pipelines",
        conditions,
        sortBy
      );
      setListPipeline(res);
    } catch (error) {
      console.log(error, "ini error");
    }
  }

  useEffect(() => {
    fetchData()

    return () => {
    }
  }, [globalState.currentCompany, globalState.currentProject])


  return (
    <Stack p={[1, 1, 5]}>
      <Stack>
        <HStack>
          <Text fontWeight={"semibold"}>PIPELINE</Text>
          <Spacer />
          <HStack>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" mb={2} />
              </InputLeftElement>
              <Input placeholder="Search" size={"sm"} bg={"white"} />
            </InputGroup>

            <Button size={"sm"} colorScheme="telegram" onClick={() => setPipelineModal(true)} borderRadius={"sm"}>
              + Add
            </Button>
          </HStack>
        </HStack>

        <Box bg={"white"} my={4} p={3} boxShadow={"sm"}>
          <SimpleGrid columns={[2, null, 4]} spacing={3}>
            {listPipeline?.map((x, i) => (
              <Box
                key={i}
                border={"1px"}
                borderColor={"gray.200"}
                p={2}
                my={3}
                bg={"white"}
                boxShadow={"sm"}
                borderRadius={"sm"}
                cursor={"pointer"}
                _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
                onClick={() => navigate(`/pipeline/view/${x.id}`, { state: x })}
              >
                <Box my={3}>
                  <Text fontWeight={"semibold"}>
                    {
                      //   capitalize(project?.data.ayrshare_account?.name)
                      x.name
                    }
                  </Text>
                  <Text fontSize={"xs"}>
                    {x.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Stack>

      <Modal
        isOpen={pipelineModal}
        onClose={handleCloseModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Text fontSize={"md"}>Pipeline New</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>Pipeline name</Text>
              <Input
                size={"sm"}
                placeholder="name"
                onChange={(e) => setDataPipeline({ ...dataPipeline, name: e.target.value })}
              />
            </Stack>
            {dataPipeline.stages.map((stage, index) => (
              <HStack key={index}>
                <Stack>
                  <Text>Stage Name</Text>
                  <Input
                    size={"sm"}
                    placeholder="name"
                    value={stage.stageName}
                    onChange={(e) => handleStageNameChange(index, (e.target.value).toLowerCase())}
                  />
                </Stack>

                <Stack>
                  <Text>Actions</Text>

                  <IconButton
                    size="sm"
                    icon={<FiFilter />}
                    color={stage.filter ? "blue" : "gray"}
                    onClick={() => handleFilterToggle(index)}
                  />
                </Stack>

                <Stack>
                  <Button onClick={() => handleDeleteStage(index)}>Delete</Button>
                </Stack>
              </HStack>
            ))}
            <Button onClick={handleAddNewStage}>Add Stage</Button>
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
    </Stack>
  );
}

export default PipelinePage;
