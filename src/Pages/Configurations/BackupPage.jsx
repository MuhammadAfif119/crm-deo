import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import {
  exportCollection,
  exportSubcollection,
  importCollection,
} from "../../Api/imporApi";
import moment from "moment";

const collectionData = [
  "addresses",
  "applications",
  "assessment",
  "carts",
  "categories",
  "companies",
  "contacts",
  "courses",
  "domain_lists",
  "domain",
  "files",
  "flowcharts",
  "folders",
  "forms",
  "kanban",
  "leads",
  "listings",
  "listings_product",
  "logs",
  "menus",
  "messages",
  "orders",
  "payments",
  "pipelines",
  "projects",
  "refunds",
  "reports",
  "tickets",
  "transactions",
  "users",
  "warehouse",
  "wastes",
  "testing_backup",
];

const BackupPage = () => {
  const toast = useToast();

  const [isImport, setIsImport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [choosedCollection, setChoosedCollection] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [subcollectionName, setSubcollectionName] = useState("");
  const [subcollectionData, setSubcollectionData] = useState([]);

  const [date, setDate] = useState();

  const collectionImport = async () => {
    setIsLoading(true);

    const newDateFormat = moment(date).format("DD-MM-YYYY");

    const dataImport = {
      collection: collectionName,
      date: newDateFormat,
    };

    try {
      const res = await importCollection(dataImport);

      toast({
        status: "success",
        title: "Deoapp CRM",
        description: "Collection Imported",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Deoapp CRM",
        description: "Failed to import",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const collectionExport = async () => {
    setIsLoadingExport(true);

    console.log(choosedCollection);

    const dataExport = {
      collection: choosedCollection,
    };

    try {
      const result = await exportCollection(dataExport);
      console.log(result);
      toast({
        status: "success",
        title: "Deoapp CRM",
        description: "Collection Export Success",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Deoapp CRM",
        description: "Failed to import",
        duration: 3000,
      });
    } finally {
      setIsLoadingExport(false);
    }
  };

  const subcollectionExport = async () => {
    setIsLoadingExport(true);

    const data = {
      collection: `${collectionName}`,
      subCollection: subcollectionData,
    };

    try {
      const result = await exportSubcollection(data);
      console.log(result);

      toast({
        status: "success",
        title: "Deoapp CRM",
        description: "Collection Imported",
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Deoapp CRM",
        description: "Failed to import",
        duration: 3000,
      });
    } finally {
      setIsLoadingExport(false);
    }
  };

  const handleSelectCollection = (selected) => {
    if (choosedCollection.includes(selected)) {
      setChoosedCollection(
        choosedCollection?.filter((item) => item !== selected)
      );
    } else {
      setChoosedCollection([...choosedCollection, selected]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setChoosedCollection([]);
    } else {
      setChoosedCollection([...collectionData]);
    }

    setSelectAll(!selectAll);
  };

  const handleSubmitSubcolection = () => {
    console.log(subcollectionName, "ini nama subcol");
    setSubcollectionData([...subcollectionData, subcollectionName]);

    setSubcollectionName("");
  };

  const handleDeleteSubcollectionData = (value) => {
    const updatedData = subcollectionData.filter((item) => item !== value);
    setSubcollectionData(updatedData);

    console.log(subcollectionData, "ini subcol");
  };

  return (
    <>
      <HStack w={"100%"} spacing={4}>
        <Center
          onClick={() => setIsImport(true)}
          _hover={{
            bg: "gray.300",
            transform: "scale(1.03)",
            transition: "0.2s",
          }}
          border={"1px"}
          borderColor={"gray.300"}
          w={"50%"}
          cursor={"pointer"}
          bg={!isImport ? "white" : "blue.100"}
          borderRadius={"md"}
          shadow={"md"}
          h={200}
        >
          <Heading size={"md"}>Import</Heading>
        </Center>
        <Center
          onClick={() => setIsImport(false)}
          border={"1px"}
          _hover={{
            bg: "gray.300",
            transform: "scale(1.03)",
            transition: "0.2s",
          }}
          borderColor={"gray.300"}
          cursor={"pointer"}
          w={"50%"}
          bg={isImport ? "white" : "blue.100"}
          borderRadius={"md"}
          shadow={"md"}
          h={200}
        >
          <Heading size={"md"}>Export</Heading>
        </Center>
      </HStack>

      <Box my={5}>
        {isImport === false ? (
          <>
            <Heading size={"md"}>Export Collection Data</Heading>
            <Box
              my={5}
              bg={"white"}
              border={"1px"}
              borderColor={"gray.300"}
              borderRadius={"md"}
              shadow={"sm"}
              p={4}
            >
              <Text align={"center"} fontWeight={"semibold"}>
                Select Collection To Be Backup
              </Text>
              <Flex
                p={3}
                gap={3}
                my={2}
                h={200}
                flexDir={"column"}
                flexWrap={"wrap"}
              >
                <Checkbox onChange={handleSelectAll} isChecked={selectAll}>
                  Select All
                </Checkbox>
                {collectionData.map((collection) => (
                  <Stack textTransform={"capitalize"}>
                    <Checkbox
                      value={collection}
                      isChecked={choosedCollection.includes(collection)}
                      onChange={() => handleSelectCollection(collection)}
                    >
                      {collection}
                    </Checkbox>
                  </Stack>
                ))}
              </Flex>

              <Box align={"center"}>
                {isLoadingExport ? (
                  <Button
                    isLoading
                    colorScheme="green"
                    size={"sm"}
                    onClick={() => collectionExport()}
                  >
                    Export Collection
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    size={"sm"}
                    onClick={() => collectionExport()}
                  >
                    Export Collection
                  </Button>
                )}
              </Box>
            </Box>

            <Heading size={"md"} my={3}>
              Export Subcollection Data
            </Heading>

            <Box
              w={600}
              bg={"white"}
              border={"1px"}
              borderRadius={"md"}
              borderColor={"gray.300"}
              shadow={"sm"}
              p={5}
            >
              <FormControl mb={3}>
                <FormLabel>Collection Name</FormLabel>
                <Input
                  placeholder="collection name"
                  onChange={(e) => setCollectionName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Subcollection Name</FormLabel>
                <InputGroup size="md">
                  <Input
                    value={subcollectionName}
                    onChange={(e) => setSubcollectionName(e.target.value)}
                    placeholder="Enter subcollection name"
                  />
                  <InputRightElement width={"fit-content"}>
                    <Button
                      onClick={handleSubmitSubcolection}
                      colorScheme="green"
                      h="1.75rem"
                      size="sm"
                    >
                      Add Subcollection
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Box my={2}>
                <HStack>
                  {subcollectionData?.length > 0 ? (
                    <>
                      {subcollectionData?.map((x, i) => (
                        <HStack
                          key={i}
                          bg={"gray.100"}
                          w={"fit-content"}
                          px={3}
                          borderRadius={"md"}
                        >
                          <Text textTransform={"capitalize"} fontSize={13}>
                            {x}
                          </Text>

                          <Button
                            onClick={() => handleDeleteSubcollectionData(x)}
                            variant={"unstyled"}
                            size={"xs"}
                          >
                            x
                          </Button>
                        </HStack>
                      ))}
                    </>
                  ) : null}
                </HStack>

                {isLoadingExport ? (
                  <Button
                    isLoading
                    colorScheme="green"
                    onClick={() => subcollectionExport()}
                  >
                    Export Subcollection
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    onClick={() => subcollectionExport()}
                  >
                    Export Subcollection
                  </Button>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <Box>
            <Heading>Import Data</Heading>
            <Box
              w={500}
              my={5}
              bg={"white"}
              p={4}
              border={"1px"}
              borderRadius={"md"}
              shadow={"sm"}
              borderColor={"gray.300"}
            >
              <FormControl>
                <FormLabel>Collection Name</FormLabel>
                <Input
                  placeholder="Enter collection name"
                  onChange={(e) => setCollectionName(e.target.value)}
                />
              </FormControl>

              <FormControl my={4}>
                <FormLabel>Date</FormLabel>

                <Input
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  placeholder="Enter date"
                />
              </FormControl>
              {isLoading ? (
                <Button
                  isLoading
                  colorScheme="green"
                  onClick={collectionImport}
                >
                  Import Collection
                </Button>
              ) : (
                <Button colorScheme="green" onClick={collectionImport}>
                  Import Collection
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default BackupPage;
