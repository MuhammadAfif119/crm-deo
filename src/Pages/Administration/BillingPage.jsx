import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Tag,
  TagLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  Card,
  CardHeader,
  Heading,
  CardBody,
  StackDivider,
  List,
  ListItem,
  ListIcon,
  Divider,
  Flex,
  SimpleGrid,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebase";
import { CheckCircleIcon } from "@chakra-ui/icons";

const BillingPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getBilling = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "billing"));
        const attribute = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(attribute);
      } catch (error) {
        console.log(error, "error");
      }
    };

    getBilling();
  }, []);

  return (
    <Box>
      {data.map((item) => (
        <Card
        key={item.id}
        margin="2%"
        boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.19)"
        borderRadius="8px"
        overflow="hidden"
        transition="transform 0.2s"
        _hover={{ transform: "scale(1.02)" }}
      >
          <Stack>
            <CardHeader>
              <Flex justifyContent={"space-between"}>
                <List fontWeight={"bold"}>
                  <ListItem>
                    <Flex>
                      <ListIcon
                        as={CheckCircleIcon}
                        color="green.500"
                        mt={"3px"}
                      />
                      <Text fontSize={"2xl"} fontFamily={"Sans-serif"}>
                        {item.companyName}
                      </Text>
                    </Flex>
                  </ListItem>
                </List>
                <Button
                cursor="default"
                colorScheme="green"
                borderRadius="15px"
                fontFamily="Sans-serif"
                display={{ base: "none", md: "block" }}
              >
                {item.action}
              </Button>
              
              </Flex>
            </CardHeader>
            <Divider />
            <SimpleGrid columns={[1,2,2]} spacing={4} padding="10px" templateColumns={["1fr", "40% 58%", "40% 58%"]}>
            <Box
            border="none"
            padding={["0", "2", "4"]}
            borderRadius="md"
            display="grid"
            gridTemplateColumns="max-content max-content 1fr"
            gridGap="2"
          >
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"}>
              Name
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"}>
              :
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"} whiteSpace="pre-wrap">
              {item.name}
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"}>
              No. HP
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"}>
              :
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"} whiteSpace="pre-wrap">
              {item.phone_number}
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"}>
              Email
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"}>
              :
            </Text>
            <Text fontSize={["sm", "lg", "lg"]} fontFamily={"Sans-serif"} whiteSpace="pre-wrap">
              {item.email}
            </Text>
          </Box>
          

              <Box>
                <Stack spacing="4">
                  <Card variant="outline" >
                    <CardHeader>
                      <Heading
                        size="md"
                        fontFamily={"Sans-serif"}
                        fontSize={"2xl"}
                      >
                        {" "}
                        Package
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={[1, 5, 5]} alignItems="center">
                        <Box textAlign="center" mx={3} marginTop={["15px", "0", "0"]}>
                          <Tooltip
                            label="number of accounts available"
                            aria-label="A tooltip"
                          >
                            <Text fontSize={["sm","lg","lg"]} fontFamily={"Sans-serif"}>
                              HR
                            </Text>
                          </Tooltip>
                          <Text fontSize={["sm","lg","lg"]} mt={1} fontFamily={"Sans-serif"}>
                            {item.package.hr.toLocaleString()}
                          </Text>
                        </Box>
                        <Box textAlign="center" mx={3} marginTop={["15px", "0", "0"]}>
                          <Tooltip
                            label="number of accounts available"
                            aria-label="A tooltip"
                          >
                            <Text fontSize={["sm","lg","lg"]} fontFamily={"Sans-serif"}>
                              Customer
                            </Text>
                          </Tooltip>
                          <Text fontSize={["sm","lg","lg"]} mt={1} fontFamily={"Sans-serif"}>
                            {item.package.customers.toLocaleString()}
                          </Text>
                        </Box>
                        <Box textAlign="center" mx={3} marginTop={["15px", "0", "0"]}>
                          <Tooltip
                            label="number of outlets available"
                            aria-label="A tooltip"
                          >
                            <Text fontSize={["sm","lg","lg"]} fontFamily={"Sans-serif"}>
                              Outlet
                            </Text>
                          </Tooltip>
                          <Text fontSize={["sm","lg","lg"]} mt={1} fontFamily={"Sans-serif"}>
                            {item.package.outlet.toLocaleString()}
                          </Text>
                        </Box>
                        <Box textAlign="center" mx={3} marginTop={["15px", "0", "0"]}>
                          <Tooltip
                            label="number of accounts available"
                            aria-label="A tooltip"
                          >
                            <Text fontSize={["sm","lg","lg"]} fontFamily={"Sans-serif"}>
                              Sales
                            </Text>
                          </Tooltip>
                          <Text fontSize={["sm","lg","lg"]} mt={1} fontFamily={"Sans-serif"}>
                            {item.package.sales.toLocaleString()}
                          </Text>
                        </Box>
                        <Box textAlign="center" mx={3} marginTop={["15px", "0", "0"]}>
                          <Tooltip
                            label="number of warehouse available"
                            aria-label="A tooltip"
                          >
                            <Text fontSize={["sm","lg","lg"]} fontFamily={"Sans-serif"}>
                              Warehouse
                            </Text>
                          </Tooltip>
                          <Text fontSize={["sm","lg","lg"]} mt={1} fontFamily={"Sans-serif"}>
                            {item.package.warehouse.toLocaleString()}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </Stack>
              </Box>
              {/* <Box>
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <Tbody>
                      <Tr>
                        <Td>HR</Td>
                        <Td>{item.package.hr}</Td>
                      </Tr>
                      <Tr>
                        <Td>Customer</Td>
                        <Td>{item.package.customers}</Td>
                      </Tr>
                      <Tr>
                        <Td>Outlet</Td>
                        <Td>{item.package.outlet}</Td>
                      </Tr>
                      <Tr>
                        <Td>Sales</Td>
                        <Td>{item.package.sales}</Td>
                      </Tr>
                      <Tr>
                        <Td>Warehouse</Td>
                        <Td>{item.package.warehouse}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box> */}
            </SimpleGrid>

            {/* <Accordion allowToggle>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            Package
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    HR: {item.package.hr}
                                </AccordionPanel>
                                <AccordionPanel pb={4}>
                                    Customer: {item.package.customers}
                                </AccordionPanel>
                                <AccordionPanel pb={4}>
                                    Outlet: {item.package.outlet}
                                </AccordionPanel>
                                <AccordionPanel pb={4}>
                                    Price: {item.package.price}
                                </AccordionPanel>
                                <AccordionPanel pb={4}>
                                    Sales: {item.package.sales}
                                </AccordionPanel>
                                <AccordionPanel pb={4}>
                                    Warehouse: {item.package.warehouse}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion> */}
          </Stack>
        </Card>
      ))}
    </Box>
  );
};

export default BillingPage;
