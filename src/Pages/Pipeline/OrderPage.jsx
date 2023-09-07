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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getCollectionFirebase } from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { formatFrice } from "../../Utils/numberUtil";
import moment from "moment";

const OrderPage = () => {
  const [dataOrders, setDataOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1); // Pindahkan ke halaman berikutnya saat tombol "Load More" diklik
  };

  useEffect(() => {
    getDataOrders();
  }, [globalState.currentProject, currentPage]);

  return (
    <Box>
      <Stack my={4}>
        <HStack>
          <Heading size={"md"} fontWeight="bold" mb={3}>
            Data Orders
          </Heading>
          <Spacer />
          {/* <Button size='sm' onClick={handleModalOpen} colorScheme='green'>+</Button> */}
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
                    <Tr fontSize={13}>
                      <Td textTransform={"capitalize"}>{order.name}</Td>
                      <Td textTransform={"capitalize"}>
                        {order.orders[0].name}
                      </Td>
                      <Td textTransform={"capitalize"}>{order.category}</Td>
                      <Td textTransform={"capitalize"}>
                        Rp. {formatFrice(order.amount)}
                      </Td>
                      <Td textTransform={"capitalize"}>{order.phoneNumber}</Td>
                      <Td>
                        {moment(order?.createdAt.seconds * 1000).format("LLL")}
                      </Td>
                      <Td textTransform={"capitalize"}>
                        <Badge
                          colorScheme={
                            order.orderStatus === "onProcess"
                              ? "yellow"
                              : "green"
                          }
                        >
                          {order.orderStatus}
                        </Badge>
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
          </Table>
          {currentPage < totalPages && (
            <Button colorScheme={"blue"} fontSize="sm" onClick={handleLoadMore}>
              Load More
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default OrderPage;
