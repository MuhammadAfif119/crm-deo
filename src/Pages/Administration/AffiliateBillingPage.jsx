import {
  ButtonGroup,
  Box,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  Text,
  AccordionPanel,
  Card,
  Image,
  CardBody,
  Heading,
  Tag,
  TagLabel,
  SimpleGrid,
  AccordionIcon,
} from "@chakra-ui/react";
import { Firestore, collection, getDocs, query } from "firebase/firestore";
import React, { Fragment, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsBoxArrowUpRight, BsFillTrashFill } from "react-icons/bs";
import { db } from "../../Config/firebase";
import matchers from "@testing-library/jest-dom/matchers";

const AffiliateBillingPage = () => {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [nilai1, setNilai1] = useState([]);
  const [value, setValue] = useState([]);
  const header = ["Coupon Code", "Company Id", "Discount"];

  const getUser = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const attribute = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(attribute);
    } catch (error) {
      console.error(error, "error");
    }
  };

  const getHistory = async () => {
    try {
      const docRef = query(collection(db, "companies"));
      const querySnapshot = await getDocs(docRef);

      if (!querySnapshot.empty) {
        const mappedData = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const category = data.coupon;

          if (category != null && category !== undefined) {
            if (!mappedData[category]) {
              mappedData[category] = [];
            }

            mappedData[category].push({ id: doc.id, ...data });
          }
        });

        setHistory(mappedData);
      } else {
        console.log("Koleksi kosong.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // console.log(history,"jjjjjjjjjjjjjjjjjjj");
  // console.log(data,"hyhhhhhhhhhhhhhh")

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUser();
        await getHistory();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Menggabungkan data setelah menerima kedua data
    const mergedData = Object.keys(history).reduce((result, key) => {
      history[key].forEach((item1) => {
        const matchingData2 = data.find(
          (item2) =>
            item2.title === item1.coupon && item2.title === item1.coupon
        );
        if (matchingData2) {
          result.push({
            ...item1,
            ...matchingData2,
          });
        }
      });
      return result;
    }, []);

    const mappedData = {};
    mergedData.forEach((result) => {
      const category = result.coupon;

      if (category != null && category !== undefined) {
        if (!mappedData[category]) {
          mappedData[category] = [];
        }

        mappedData[category].push(result);
      }
    });

    setNilai(mappedData);
    console.log(mergedData, "result");
    console.log(mappedData, "mappedData");
    setValue(mergedData);
  }, [data, history]);

  const color1 = useColorModeValue("gray.400", "gray.400");
  const color2 = useColorModeValue("gray.400", "gray.400");
  return (
    // <Box p={4}>
    //   <Table variant="striped">
    //     <Thead>
    //       <Tr>
    //         <Th>Coupon Code</Th>
    //         <Th>Created By</Th>
    //         <Th>Discount (%)</Th>
    //         <Th>Used By</Th>
    //       </Tr>
    //     </Thead>
    //     <Tbody>

    //       {value?.map((user) => (
    //         <Tr key={user.id}>
    //           <Td>{user.title}</Td>
    //           <Td>{user.companyId}</Td>
    //           <Td>{user.discountRate}</Td>
    //           <Td>{user.name}</Td>
    //         </Tr>
    //       ))}
    //     </Tbody>
    //   </Table>
    // </Box>
    <Stack>
       <Box fontSize="2xl" fontWeight="bold" mb={4}>
         Affiliate Billing
       </Box>
      <Accordion allowMultiple>
        {nilai &&
          Object.keys(nilai)?.map((data, index) => (
            <AccordionItem key={index}>
              <AccordionButton
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontWeight="bold" fontSize="20px" p="3%">
                  Coupon Code: {data}
                </Text>
                <AccordionIcon />
              </AccordionButton>

              {nilai[data]?.map((x, subIndex) => (
                <Fragment key={subIndex}>
                  <AccordionPanel pb={4}>
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      overflow="hidden"
                      variant="outline"
                      key={subIndex}
                    >

                      <Stack w={"80%"}>
                        <CardBody>
                          <SimpleGrid columns={[1]}>
                            <Box
                              border="none"
                              padding="4"
                              borderRadius="md"
                              display="grid"
                              gridTemplateColumns="max-content max-content 1fr"
                              gridGap="2"
                            >
                              <Text fontSize="lg" fontFamily={"Sans-serif"}>
                                Company Name
                              </Text>
                              <Text fontSize="lg" fontFamily={"Sans-serif"}>
                                :
                              </Text>
                              <Text fontSize="lg" fontFamily={"Sans-serif"}>
                                {x.name}
                              </Text>
                              <Text fontSize="lg" fontFamily={"Sans-serif"}>
                                Discount Rate 
                              </Text>
                              <Text fontSize="lg" fontFamily={"Sans-serif"}>
                                :
                              </Text>
                              <Text fontSize="lg" fontFamily={"Sans-serif"}>
                                {x.discount.discountRate}%
                              </Text>
                            </Box>
                          </SimpleGrid>
                        </CardBody>
                      </Stack>
                    </Card>
                  </AccordionPanel>
                </Fragment>
              ))}
            </AccordionItem>
          ))}
      </Accordion>
    </Stack>
  );
};

export default AffiliateBillingPage;
