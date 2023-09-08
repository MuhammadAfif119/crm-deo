import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  SimpleGrid,
  Badge,
  Text,
  Center,
  Stack,
  HStack,
  Heading,
  Spacer,
  Button,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getCollectionFirebase } from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { formatFrice } from "../../Utils/numberUtil";
import moment from "moment";
import DatePicker from "../../Components/DatePicker/DatePicker";

const OrderPage = () => {
  const [dataOrders, setDataOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailOrder, setDetailOrder] = useState({});

  const [selectedDateRange, setSelectedDateRange] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const modalFilterDate = useDisclosure();

  const orderDetail = useDisclosure();

  const globalState = useUserStore();

  const itemsPerPage = 10; // Jumlah data per halaman

  const getDataOrders = async () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const conditions = [
      { field: "module", operator: "==", value: "crm" },
      { field: "projectId", operator: "==", value: globalState.currentProject },
    ];
    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = startIndex + itemsPerPage;

    try {
      const orders = await getCollectionFirebase(
        "orders",
        conditions,
        sortBy,
        limitValue
      );
      setDataOrders(orders);

      const totalOrders = await getCollectionFirebase("orders", conditions);
      setTotalPages(Math.ceil(totalOrders.length / itemsPerPage));
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const handleOpenModal = (detail) => {
    orderDetail.onOpen();
    setDetailOrder(detail);
    console.log(detailOrder);
    console.log(detail);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1); // Pindahkan ke halaman berikutnya saat tombol "Load More" diklik
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  console.log(selectedDateRange);

  const getDataFilter = async () => {
    const conditions = [
      {
        field: "createdAt",
        operator: ">=",
        value: selectedDateRange?.startDate,
      },
      {
        field: "createdAt",
        operator: "<=",
        value: selectedDateRange?.endDate,
      },
      {
        field: "projectId",
        operator: "==",
        value: globalState?.currentProject,
      },
    ];

    try {
      const filteredOrders = await getCollectionFirebase("orders", conditions);

      console.log(filteredOrders);
      setFilteredData(filteredOrders);

      // const totalOrders = await getCollectionFirebase("orders", conditions);
      // setTotalPages(Math.ceil(totalOrders.length / itemsPerPage));
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  useEffect(() => {
    if (!selectedDateRange) {
      getDataOrders();
    } else {
      getDataFilter();
    }
  }, [globalState.currentProject, currentPage, selectedDateRange]);

  return (
    <Box>
      <Stack my={4}>
        <HStack>
          <Heading size={"md"} fontWeight="bold" mb={3}>
            Data Orders
          </Heading>
          <Spacer />
          {/* <Button size='sm' onClick={handleModalOpen} colorScheme='green'>+</Button> */}
          {/* <DatePicker /> */}
          <Button
            size={"sm"}
            colorScheme="green"
            onClick={modalFilterDate.onOpen}
          >
            Filter By Date
          </Button>
        </HStack>
        <Stack
          bgColor="white"
          spacing={1}
          borderRadius="xl"
          p={3}
          m={[1, 1, 5]}
          shadow="md"
        >
          <Table variant="striped" colorScheme="gray">
            <Thead bg={"white"}>
              <Tr align={"center"}>
                <Th w={"14.29%"}>Name</Th>
                <Th w={"14.29%"}>Product Name</Th>
                <Th w={"14.29%"}>Category</Th>
                <Th w={"14.29%"}>Amount</Th>
                <Th w={"14.29%"}>Phone Number</Th>
                <Th w={"14.29%"}>Date</Th>
                <Th w={"14.29%"}>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedDateRange &&
              Object.keys(selectedDateRange).length === 0 ? (
                <>
                  {dataOrders?.length > 0 ? (
                    <>
                      {dataOrders.map((order, i) => (
                        <Tr fontSize={13} key={i}>
                          <Td textTransform={"capitalize"}>{order.name}</Td>
                          <Td textTransform={"capitalize"}>
                            {order.orders[0].name}
                          </Td>
                          <Td textTransform={"capitalize"}>{order.category}</Td>
                          <Td textTransform={"capitalize"}>
                            Rp. {formatFrice(order.amount)}
                          </Td>
                          <Td textTransform={"capitalize"}>
                            {order.phoneNumber}
                          </Td>
                          <Td>
                            {moment(order?.createdAt.seconds * 1000).format(
                              "LLL"
                            )}
                          </Td>
                          <Td textTransform={"capitalize"}>
                            <HStack>
                              <Badge
                                colorScheme={
                                  order.orderStatus === "onProcess"
                                    ? "yellow"
                                    : "green"
                                }
                              >
                                {order.orderStatus}
                              </Badge>
                              <Spacer />
                              <Button
                                colorScheme="blue"
                                size={"sm"}
                                onClick={() => handleOpenModal(order)}
                              >
                                Detail
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </>
                  ) : (
                    <Center>
                      <Text>No Data</Text>
                    </Center>
                  )}
                </>
              ) : (
                <>
                  {filteredData?.length > 0 ? (
                    <>
                      {filteredData.map((order, i) => (
                        <Tr fontSize={13} key={i}>
                          <Td textTransform={"capitalize"}>{order.name}</Td>
                          <Td textTransform={"capitalize"}>
                            {order.orders[0].name}
                          </Td>
                          <Td textTransform={"capitalize"}>{order.category}</Td>
                          <Td textTransform={"capitalize"}>
                            Rp. {formatFrice(order.amount)}
                          </Td>
                          <Td textTransform={"capitalize"}>
                            {order.phoneNumber}
                          </Td>
                          <Td>
                            {moment(order?.createdAt.seconds * 1000).format(
                              "LLL"
                            )}
                          </Td>
                          <Td textTransform={"capitalize"}>
                            <HStack>
                              <Badge
                                colorScheme={
                                  order.orderStatus === "onProcess"
                                    ? "yellow"
                                    : "green"
                                }
                              >
                                {order.orderStatus}
                              </Badge>
                              <Spacer />
                              <Button
                                colorScheme="blue"
                                size={"sm"}
                                onClick={() => handleOpenModal(order)}
                              >
                                Detail
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </>
                  ) : (
                    <Center>
                      <Text>No Data</Text>
                    </Center>
                  )}
                </>
              )}
            </Tbody>
          </Table>

          {(!selectedDateRange ||
            Object.keys(selectedDateRange).length === 0) &&
            (dataOrders?.length > 0 ? (
              <Button
                colorScheme={"blue"}
                fontSize="sm"
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            ) : null)}

          {selectedDateRange &&
            Object.keys(selectedDateRange).length !== 0 &&
            (filteredData?.length > 0 ? (
              <Button
                colorScheme={"blue"}
                fontSize="sm"
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            ) : null)}
        </Stack>
      </Stack>

      <Modal isOpen={orderDetail.isOpen} onClose={orderDetail.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detail Order</ModalHeader>
          <ModalBody fontSize={"14"}>
            {detailOrder.orders ? (
              <Heading size={"md"} textTransform={"capitalize"}>
                {detailOrder.category} - {detailOrder?.orders[0]?.name}
              </Heading>
            ) : null}
            <Stack my={5}>
              <Text fontWeight={"semibold"}>User Profile</Text>
              <Text size={"md"} textTransform={"capitalize"}>
                Name: {detailOrder.name}
              </Text>
              <Text size={"md"} textTransform={"capitalize"}>
                Email: {detailOrder.email}
              </Text>
              <HStack>
                <Text size={"md"} textTransform={"capitalize"}>
                  Payment Method: {detailOrder.paymentMethod}
                </Text>
              </HStack>
              <HStack>
                <Text>Amount: Rp {formatFrice(detailOrder.amount)}</Text>
                <Badge
                  colorScheme={
                    detailOrder.paymentStatus === "PAID" ? "green" : "yellow"
                  }
                >
                  {detailOrder.paymentStatus}
                </Badge>
              </HStack>
              <Text>User Id: {detailOrder.userId}</Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={orderDetail.onClose} colorScheme="red" size={"sm"}>
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
                onClick={() => setSelectedDateRange({})}
              >
                Clear
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderPage;
