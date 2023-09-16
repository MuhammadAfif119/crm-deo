import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDocumentFirebase,
  getCollectionFirebase,
  setDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import DatePicker from "../../Components/DatePicker/DatePicker";

const ContactsPage = () => {
  const globalState = useUserStore();
  const itemsPerPage = 10; // Jumlah data per halaman

  const [modalContact, setModalContact] = useState(false);
  const [dataNew, setDataNew] = useState();
  const [dataSearchContact, setDataSearchContact] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const modalFilterDate = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedDateRange, setSelectedDateRange] = useState();
  const [contactList, setContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const getData = async () => {

  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const conditions = [
  //     { field: 'companyId', operator: '==', value: globalState.currentCompany },
  //     { field: 'projectId', operator: '==', value: globalState.currentProject },
  //   ];

  //   const sortBy = { field: 'createdAt', direction: 'desc' };

  //   try {
  //     const res = await getCollectionFirebase('forms', conditions, sortBy);

  //     if (res.length > 0) {
  //       const tokens = res.map((form) => form.token);
  //       const contactsConditions = [{ field: 'formId', operator: 'in', value: tokens }];

  //       const sortBy = { field: 'createdAt', direction: 'desc' };
  //       const limitValue = startIndex + itemsPerPage;

  //       const contacts = await getCollectionFirebase('contacts', contactsConditions, sortBy, limitValue);
  //       setContactList(contacts);

  //       // Menghitung total halaman berdasarkan jumlah data dan data per halaman
  //       const totalContacts = await getCollectionFirebase('contacts', contactsConditions);
  //       setTotalPages(Math.ceil(totalContacts.length / itemsPerPage));
  //     }
  //   } catch (error) {
  //     console.log(error, 'ini error');
  //   }
  // };

  const getData = async () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const conditions = [
      { field: "companyId", operator: "==", value: globalState.currentCompany },
      { field: "projectId", operator: "==", value: globalState.currentProject },
    ];

    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = startIndex + itemsPerPage;

    try {
      const contacts = await getCollectionFirebase(
        "contacts",
        conditions,
        sortBy,
        limitValue
      );
      setContactList(contacts);

      const totalContacts = await getCollectionFirebase("contacts", conditions);
      setTotalPages(Math.ceil(totalContacts.length / itemsPerPage));
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const getFilteredData = async () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const conditions = [
      { field: "companyId", operator: "==", value: globalState.currentCompany },
      { field: "projectId", operator: "==", value: globalState.currentProject },
      {
        field: "createdAt",
        operator: ">=",
        value: selectedDateRange.startDate,
      },
      { field: "createdAt", operator: "<=", value: selectedDateRange.endDate },
    ];

    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = startIndex + itemsPerPage;

    try {
      const contacts = await getCollectionFirebase(
        "contacts",
        conditions,
        sortBy,
        limitValue
      );
      setContactList(contacts);

      const totalContacts = await getCollectionFirebase("contacts", conditions);
      setTotalPages(Math.ceil(totalContacts.length / itemsPerPage));
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1); // Pindahkan ke halaman berikutnya saat tombol "Load More" diklik
  };

  // useEffect(() => {
  //   getData();
  // }, [globalState.currentProject, currentPage]);

  useEffect(() => {
    if (!selectedDateRange) {
      getData();
    } else {
      getFilteredData();
    }
  }, [globalState.currentProject, currentPage, selectedDateRange]);

  const handleDetail = (contact) => {
    navigate(`/contacts/detail/${contact.id}`, { state: contact });
  };

  const handleModalOpen = () => {
    setModalContact(true);
  };

  const handleModalClose = () => {
    setModalContact(false);
    setDataNew();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataNew((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const handleSaveContact = async () => {
    const collectionName = "contacts";
    const docName = `${dataNew.phoneNumber}-${globalState?.currentProject}`;
    let data = {
      ...dataNew,
      projectId: globalState?.currentProject,
      createdAt: new Date(),
      lastUpdated: new Date(),
      companyId: globalState?.currentCompany,
    };
    try {
      const result = await setDocumentFirebase(
        collectionName,
        docName,
        data,
        globalState?.currentCompany
      );
      console.log(result); // Pesan toast yang berhasil
      toast({
        title: "Success",
        description: `Success add new contact. `,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      handleModalClose();
      getData();
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = contactList.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataSearchContact(newData);
      setInputSearch(text);
    } else {
      setDataSearchContact(contactList);
      setInputSearch(text);
    }
  };

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  return (
    <Stack p={[1, 1, 5]}>
      <Stack spacing={4}>
        <HStack>
          <Heading size={"md"} fontWeight="bold">
            Contacts
          </Heading>
          <Spacer />
          <HStack>
            <Button
              size="sm"
              onClick={modalFilterDate.onOpen}
              colorScheme="green"
            >
              Filter date
            </Button>
            <Button size="sm" onClick={handleModalOpen} colorScheme="green">
              + Add Contact
            </Button>
          </HStack>
        </HStack>

        <Input
          mb={3}
          mt={5}
          type="text"
          placeholder="Search Contact"
          bgColor="white"
          color="black"
          sx={inputStyles}
          fontSize="sm"
          onChange={(e) => searchFilterFunction(e.target.value)}
        />

        <Stack
          bgColor="white"
          spacing={1}
          borderRadius="xl"
          p={3}
          m={[1, 1, 5]}
          shadow="md"
        >
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th fontSize="sm">Name</Th>
                <Th fontSize="sm">Phone</Th>
                <Th fontSize="sm">Email</Th>
                <Th fontSize="sm">Created</Th>
                <Th fontSize="sm">Last Activity</Th>
                <Th fontSize="sm">Tags</Th>
                <Th fontSize="sm">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inputSearch === "" ? (
                <>
                  {contactList?.length > 0 &&
                    contactList?.map((x, index) => (
                      <Tr key={index}>
                        <Td fontSize="sm" textTransform={"capitalize"}>
                          {x?.name}
                        </Td>
                        <Td fontSize="sm">{x?.phoneNumber}</Td>
                        <Td fontSize="sm">{x?.email}</Td>
                        <Td fontSize="sm">
                          {moment(x?.createdAt.seconds * 1000).format("LLL")}
                        </Td>
                        <Td fontSize="sm">
                          {moment(x?.lastUpdated.seconds * 1000).format("LLL")}
                        </Td>
                        <Td fontSize="sm">{x?.tags}</Td>
                        <Td fontSize="sm">
                          <Button
                            colorScheme={"yellow"}
                            fontSize="sm"
                            onClick={() => handleDetail(x)}
                          >
                            Detail
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                </>
              ) : (
                <>
                  {dataSearchContact?.length > 0 &&
                    dataSearchContact?.map((x, index) => (
                      <Tr key={index}>
                        <Td fontSize="sm" textTransform={"capitalize"}>
                          {x?.name}
                        </Td>
                        <Td fontSize="sm">{x?.phoneNumber}</Td>
                        <Td fontSize="sm">{x?.email}</Td>
                        <Td fontSize="sm">
                          {moment(x?.createdAt.seconds * 1000).format("LLL")}
                        </Td>
                        <Td fontSize="sm">
                          {moment(x?.lastUpdated.seconds * 1000).format("LLL")}
                        </Td>
                        <Td fontSize="sm">{x?.tags}</Td>
                        <Td fontSize="sm">
                          <Button
                            colorScheme={"yellow"}
                            fontSize="sm"
                            onClick={() => handleDetail(x)}
                          >
                            Detail
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                </>
              )}
            </Tbody>
          </Table>
          {currentPage < totalPages && (
            <Button colorScheme={"blue"} fontSize="sm" onClick={handleLoadMore}>
              Load More
            </Button>
          )}
        </Stack>
      </Stack>

      <Modal size={"xl"} isOpen={modalContact} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Grid templateColumns={{ base: "1fr", md: "1fr" }}>
                {/* <Stack py={2}>
                        <Text fontWeight={500}>Opportunity Details</Text>
                    </Stack> */}
                <Stack overflowY="scroll">
                  <Stack py={2}>
                    <Text fontWeight={500}>Contact</Text>
                  </Stack>

                  <Divider />
                  <Stack>
                    <Text>Name</Text>
                    <Input
                      name="name"
                      onChange={handleChange}
                      placeholder="name"
                    />
                  </Stack>

                  <Stack>
                    <Text>Email</Text>
                    <Input
                      name="email"
                      onChange={handleChange}
                      placeholder="email"
                    />
                  </Stack>

                  <Stack>
                    <Text>Phone</Text>
                    <Input
                      name="phoneNumber"
                      onChange={handleChange}
                      placeholder="Phone Number"
                    />
                  </Stack>

                  <Stack>
                    <Text>Contact Type</Text>
                    <Select
                      onChange={handleChange}
                      name="contactType"
                      variant="outline"
                      placeholder="Content type"
                      fontWeight="normal"
                    >
                      <option value={"leads"}>Lead</option>
                      <option value={"costumer"}>Costumer</option>
                    </Select>
                  </Stack>

                  {/* <Stack>
              <Text>Tags</Text>
              <CreatableSelect
                isClearable={true}
                value={selectedTagsRef.current}
                options={data?.category?.map((category) => ({ label: category, value: category })) || []}
                isMulti
                onChange={handleTagChange}
              />
            </Stack> */}
                </Stack>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              variant={"outline"}
              size="sm"
              mr={3}
              onClick={handleSaveContact}
            >
              Save
            </Button>
            <Button
              colorScheme="red"
              variant={"outline"}
              size="sm"
              mr={3}
              onClick={handleModalClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalFilterDate.isOpen}
        onClose={modalFilterDate.onClose}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Filter Date</ModalHeader>
          <ModalBody>
            <Center>
              <DatePicker onDateChange={handleDateRangeChange} />
            </Center>

            <HStack>
              <Stack>
                <Text>
                  Start Date:{" "}
                  {moment(selectedDateRange?.startDate).format("LLL")}
                </Text>
                <Text>
                  End Date: {moment(selectedDateRange?.endDate).format("LLL")}
                </Text>
              </Stack>
              <Button
                size={"sm"}
                colorScheme="blue"
                onClick={() => setSelectedDateRange()}
              >
                Clear
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default ContactsPage;
