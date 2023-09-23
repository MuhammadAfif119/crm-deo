import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Image,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSingleDocumentFirebase } from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import kotakhitam from "../../assets/kotakhitam.png";

const CurrentThemes = () => {
  const [data, setData] = useState({});
  const globalStore = useUserStore();
  const { currentProject } = globalStore;
  const navigate = useNavigate();

  const getData = async () => {
    const docData = await getSingleDocumentFirebase("pages", currentProject);
    setData(docData);
  };

  useEffect(() => {
    getData();
  }, [currentProject]);

  const projectName = globalStore?.projects?.find(
    (x) => x?.id === currentProject
  )?.name;

  return (
    <>
      {currentProject?.length === 0 ? (
        <>
          <Stack
            h="100vh"
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              bg="white"
              p={20}
              display="flex"
              flexDir="column"
              justifyContent="center"
              alignItems="center"
              gap={5}
            >
              <Image w={"60%"} src={kotakhitam} />
              <Text fontWeight={400} color="blackAlpha.800">
                You haven't got any project
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => navigate("/projects/create-project")}
              >
                {" "}
                Create Project{" "}
              </Button>
            </Box>
          </Stack>
        </>
      ) : (
        <>
          <Flex
            justifyContent="space-between"
            bg="white"
            shadow="sm"
            p={2}
            borderRadius="md"
          >
            <Stack>
              <Heading size="md">Theme</Heading>
              <Text fontSize={13} color="blackAlpha.700">
                Project : {projectName}
              </Text>
              <Text fontSize={11} color="blackAlpha.700">
                ID : {currentProject}
              </Text>
            </Stack>
            <Button
              colorScheme="green"
              onClick={() => navigate("/themes/edit")}
            >
              Edit
            </Button>
          </Flex>

          <Stack my={5}>
            <Heading size="sm">Logo & Branding</Heading>
            <Text size="sm">
              Add a custom logo and/or favicon, and adjust your school thumbnail
            </Text>
            <Box my={10}>
              <SimpleGrid columns={3} spacing={3} maxW="5xl">
                <Box shadow="md" bg="white" padding={2}>
                  <Text fontWeight="bold">Logo Light</Text>
                  <VStack>
                    <Text>Preview:</Text>
                  </VStack>
                  <Image src={data?.logoLight ? data?.logoLight : ""} />
                </Box>

                <Box shadow="md" bg="white" padding={2}>
                  <Text fontWeight="bold">Logo Dark</Text>
                  <VStack>
                    <Text>Preview:</Text>
                  </VStack>
                  <Image src={data?.logoDark ? data?.logoDark : ""} />
                </Box>
                <Box shadow="md" bg="white" padding={2}>
                  <Text fontWeight="bold">Favicon</Text>
                  <VStack>
                    <Text>Preview:</Text>
                  </VStack>
                  <Image src={data?.favicon ? data?.favicon : ""} />
                </Box>
                <Box shadow="md" bg="white" padding={2}>
                  <Text fontWeight="bold">Website Name</Text>
                  <Text>{data?.webName}</Text>
                </Box>
                <Box shadow="md" bg="white" padding={2}>
                  <Text fontWeight="bold">Features</Text>
                  <HStack spacing={3} my={2}>
                    {data.features?.length > 0 ? (
                      <>
                        {data.features?.map((x, i) => (
                          <Box
                            key={i}
                            py={1}
                            px={2}
                            border={"1px"}
                            borderRadius={"sm"}
                            shadow={"base"}
                            pos={"relative"}
                            borderColor={"gray.300"}
                          >
                            <HStack>
                              <Text>{x}</Text>
                            </HStack>
                          </Box>
                        ))}
                      </>
                    ) : (
                      <Text>No Features data</Text>
                    )}
                  </HStack>

                  {/* <Stack>
                <HStack>
                  {featureSelection.map((x, i) => (
                    <Checkbox
                      value={x}
                      isChecked={selectedFeature.includes(x)}
                      onChange={() => handleSelectFeature(x)}
                    >
                      {x}
                    </Checkbox>
                  ))}
                </HStack>
                
              </Stack> */}
                </Box>
              </SimpleGrid>
            </Box>
          </Stack>

          <Stack my={10}>
            <Heading size="sm">Color Presets</Heading>
            <Text size="sm">Choose Color palette for your brand</Text>
            <Box my={10}>
              <SimpleGrid columns={3} spacing={3} maxW="5xl">
                <Flex gap={10} shadow="md" bg="white" padding={2}>
                  <Box
                    borderWidth={1}
                    aspectRatio={1}
                    w="10"
                    bg={data?.brand ? data?.brand[1] : ""}
                  ></Box>

                  <Text>Brand 1 : {data?.brand ? data?.brand[1] : ""}</Text>
                </Flex>
                <Flex gap={10} shadow="md" bg="white" padding={2}>
                  <Box
                    borderWidth={1}
                    aspectRatio={1}
                    w="10"
                    bg={data?.brand ? data?.brand[2] : ""}
                  ></Box>
                  <Text>Brand 2 : {data?.brand ? data?.brand[2] : ""}</Text>
                </Flex>
                <Flex gap={10} shadow="md" bg="white" padding={2}>
                  <Box
                    borderWidth={1}
                    aspectRatio={1}
                    w="10"
                    bg={data?.brand ? data?.brand[3] : ""}
                  ></Box>
                  <Text>Brand 3 : {data?.brand ? data?.brand[3] : ""}</Text>
                </Flex>
              </SimpleGrid>
              <Box my={5} maxW="md">
                <Heading size="sm">ColorScheme : </Heading>
                <Flex alignItems="center" gap={10}>
                  <Button
                    p={5}
                    colorScheme={data?.colorScheme ? data?.colorScheme : ""}
                    borderWidth={2}
                    borderColor="gray.600"
                  >
                    {data?.colorScheme ? data?.colorScheme : ""}
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Stack>

          <Stack my={10}>
            <Heading size="sm">Banners</Heading>
            <Box my={10}>
              <SimpleGrid columns={3} spacing={3} maxW="5xl">
                {data?.banner?.map((item, i) => (
                  <Stack key={i} shadow="md" bg="white" p={4}>
                    {/* <Image alt={i} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/201211130529126a0.jpg/480px-201211130529126a0.jpg" /> */}
                    <Flex justifyContent="space-between" padding={2}>
                      <Stack>
                        <Heading size="sm">Link :</Heading>
                        <Text>{item.link}</Text>
                        <Heading size="sm">Image :</Heading>
                        {item?.image ? (
                          <Image src={item.image} alt="No Preview" />
                        ) : null}
                      </Stack>
                    </Flex>
                  </Stack>
                ))}
                {/* <Flex justifyContent='space-between' shadow='md' bg='white' padding={2}> */}
                {/* </Flex> */}
              </SimpleGrid>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
};

export default CurrentThemes;
