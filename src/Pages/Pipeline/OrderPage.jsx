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
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getCollectionFirebase,
  getSingleDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { formatFrice } from "../../Utils/numberUtil";
import moment from "moment";
import DatePicker from "../../Components/DatePicker/DatePicker";
import { FaRegCalendar } from "react-icons/fa";
import { decryptToken } from "../../Utils/encrypToken";

const OrderPage = () => {
  const [dataOrders, setDataOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailOrder, setDetailOrder] = useState({});

  const [income, setIncome] = useState();

  const [dataSearchOrder, setDataSearchOrder] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const [selectedDateRange, setSelectedDateRange] = useState();
  const [filteredData, setFilteredData] = useState([]);

  const [originData, setOriginData] = useState([]);

  const [pipeline, setPipeline] = useState([]);
  const [pipelineId, setPipelineId] = useState("");

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

    //for paid user
    const conditionsPaid = [
      { field: "module", operator: "==", value: "crm" },
      { field: "projectId", operator: "==", value: globalState.currentProject },
      { field: "paymentStatus", operator: "==", value: "PAID" },
    ];

    try {
      const orders = await getCollectionFirebase(
        "orders",
        conditions,
        sortBy,
        limitValue
      );
      setDataOrders(orders);
      setOriginData(orders);

      const totalOrders = await getCollectionFirebase("orders", conditions);
      setTotalPages(Math.ceil(totalOrders.length / itemsPerPage));

      const paidOrders = await getCollectionFirebase("orders", conditionsPaid);

      const totalIncome = paidOrders.reduce((a, b) => a + b.amount, 0);

      setIncome(totalIncome);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const getDataPipeline = async () => {
    const conditions = [
      { field: "projectId", operator: "==", value: globalState.currentProject },
    ];

    const result = await getCollectionFirebase("pipelines", conditions);
    setPipeline(result);
  };

  const handleFilterPipeline = async (value) => {
    // let newFilter;
    if (value !== "") {
      const conditions = [
        {
          field: "projectId",
          operator: "==",
          value: globalState.currentProject,
        },
      ];

      const dataLeads = await getCollectionFirebase("leads", conditions);
      const result = await getSingleDocumentFirebase("pipelines", value);

      setPipelineId(decryptToken(result.formId[0]));

      const newFilter = dataLeads.filter((item) => {
        const itemData = item.id;
        const textData = decryptToken(result.formId[0]);
        return itemData.indexOf(textData) > -1;

        // const resultFilter = itemData.indexOf(textData) > -1;

        // console.log(resultFilter, "ini result");
      });
      setDataOrders(newFilter);
    } else {
      setPipelineId("");
      setDataOrders(originData);
    }
  };

  const handleOpenModal = (detail) => {
    orderDetail.onOpen();
    setDetailOrder(detail);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1); // Pindahkan ke halaman berikutnya saat tombol "Load More" diklik
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

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
      setPipelineId("");
      const filteredOrders = await getCollectionFirebase("orders", conditions);
      setDataOrders(filteredOrders);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = dataOrders.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataOrders(newData);
      // setInputSearch(text);
    } else {
      setDataOrders(originData);
      // setInputSearch(text);
    }
  };

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  useEffect(() => {
    getDataPipeline();

    return () => {};
  }, [globalState.currentProject]);

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
          <Stack>
            <Heading size={"md"} fontWeight="bold" mb={3}>
              Data Orders
            </Heading>
            <Stack
              py={3}
              spacing={1}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text>Total Income Paid Orders In Project</Text>
              <Heading>Rp {formatFrice(income)},-</Heading>
            </Stack>
          </Stack>
          <Spacer />
        </HStack>

        <HStack spacing={3} alignItems={"center"}>
          <Input
            w={"80%"}
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

          <Button
            w={"10%"}
            size="sm"
            onClick={modalFilterDate.onOpen}
            colorScheme="blue"
            // variant={"outline"}
            leftIcon={<FaRegCalendar />}
          >
            Filter date
          </Button>
          <Select
            w={"10%"}
            placeholder="Filter by Pipeline"
            bg={"blue.500"}
            size={"sm"}
            onChange={(e) => handleFilterPipeline(e.target.value)}
          >
            {pipeline.map((x, i) => (
              <option key={i} value={x.id}>
                {x.name}
              </option>
            ))}
          </Select>
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
              {dataOrders?.length > 0 ? (
                <>
                  {dataOrders.map((order, i) => (
                    <Tr fontSize={13} key={i}>
                      <Td textTransform={"capitalize"}>{order.name}</Td>
                      <Td textTransform={"capitalize"}>
                        {pipelineId !== "" ? order.name : order.orders[0]?.name}
                      </Td>
                      <Td textTransform={"capitalize"}>{order.category}</Td>
                      <Td textTransform={"capitalize"}>
                        Rp.{" "}
                        {pipelineId !== ""
                          ? formatFrice(order.opportunity_value)
                          : formatFrice(order.amount)}
                      </Td>
                      <Td textTransform={"capitalize"}>{order.phoneNumber}</Td>
                      <Td>
                        {moment(order?.createdAt.seconds * 1000).format("LLL")}
                      </Td>
                      <Td textTransform={"capitalize"}>
                        <HStack>
                          <Badge
                            colorScheme={
                              pipelineId !== ""
                                ? order.status === "open"
                                  ? "yellow"
                                  : "green"
                                : order.orderStatus === "onProcess"
                                ? "yellow"
                                : "green"
                            }
                          >
                            {pipelineId !== ""
                              ? order.status === "open"
                                ? "onProcess"
                                : "Success"
                              : order.orderStatus}
                          </Badge>
                          <Spacer />
                          <Button
                            colorScheme="yellow"
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
            </Tbody>
            {/* <Tbody>
              {inputSearch === "" ? (
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
                                colorScheme="yellow"
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
                  {dataSearchOrder?.length > 0 ? (
                    <>
                      {dataSearchOrder.map((order, i) => (
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
                                colorScheme="yellow"
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
            </Tbody> */}
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
                <Text>
                  Amount: Rp{" "}
                  {pipelineId !== ""
                    ? formatFrice(detailOrder.opportunity_value)
                    : formatFrice(detailOrder.amount)}
                </Text>
                <Badge
                  colorScheme={
                    pipelineId !== ""
                      ? detailOrder.status === "won"
                        ? "green"
                        : "yellow"
                      : detailOrder.paymentStatus === "PAID"
                      ? "green"
                      : "yellow"
                  }
                >
                  {pipelineId !== ""
                    ? detailOrder.status === "won"
                      ? "Paid"
                      : "OnProcess"
                    : detailOrder.paymentStatus}
                </Badge>
              </HStack>
              <Text>
                User Id:{" "}
                {pipelineId !== "" ? detailOrder.id : detailOrder.userId}
              </Text>
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
              <HStack spacing={4}>
                <Stack fontSize={12} spacing={1}>
                  <Text fontWeight={"semibold"}>Start Date: </Text>
                  <Text>
                    {moment(selectedDateRange?.startDate).format("LLL")}
                  </Text>
                </Stack>
                <Stack fontSize={12} spacing={1}>
                  <Text fontWeight={"semibold"}>End Date:</Text>
                  <Text>
                    {moment(selectedDateRange?.endDate).format("LLL")}
                  </Text>
                </Stack>
              </HStack>
              <Spacer />
              <Button
                size={"xs"}
                colorScheme="blue"
                onClick={() => setSelectedDateRange()}
              >
                Clear Filter
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderPage;
