import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Config/firebase";
import useUserStore from "../../Hooks/Zustand/Store";
import { useNavigate } from "react-router-dom";

const DataCompanyPage = () => {
  const [data, setData] = useState([]);
  const globalState = useUserStore();
  const navigate = useNavigate();

  function convertUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const days = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const second = String(date.getSeconds()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${hour}:${minute}:${second}, ${days} ${formattedDay}-${formattedMonth}-${year}`;
  }

  function convertISOToDDMMYY(isoDateString) {
    const date = new Date(isoDateString);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const days = dayNames[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    const second = String(date.getSeconds()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedYear = year < 10 ? `0${year}` : year;

    const formattedDate = `${hour}:${minute}:${second}, ${days} ${formattedDay}-${formattedMonth}-${formattedYear} `;

    return formattedDate;
  }

  // const getCompany = async () => {
  //   try {
  //     const docRef = query(collection(db, "companies"));
  //     const querySnapshot = await getDocs(docRef);
  //     const totalData = querySnapshot.docs.map((doc) => doc.data());
  //     setData(totalData);
  //   } catch (error) {
  //     console.error("Error fetching category:", error);
  //   }
  // };

  const getCompany = async () => {
    try {
      const db = getFirestore();
      const companiesRef = collection(db, "companies");
      const querySnapshot = await getDocs(companiesRef);

      const totalData = [];
      querySnapshot.forEach((companyDoc) => {
        const companyData = companyDoc.data();
        companyData.documentId = companyDoc.id;
        totalData.push(companyData);
      });

      setData(totalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOpen = async (stats) => {
    try {
      globalState.setDataCompanyId(stats)
      navigate(`/administration/data-company/${stats}`)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // console.log(balance,"balance");
  // console.log(description, "description");
  // console.log(bank, "bank");
  // console.log(payments, "payments");
  // console.log(modules, "modules");
  // console.log(role, "role");

  useEffect(() => {
    getCompany();
  }, []);

  console.log(data, "222222222");
  return (
    <>
      <SimpleGrid columns={2}>
        {data?.map((value, index) => (
          <Box
            marginTop={"2%"}
            key={index}
            border="1px solid #ccc"
            mx={{
              lg: 8,
            }}
            display={{
              lg: "flex",
            }}
            maxW={{
              lg: "5xl",
            }}
            rounded={{
              lg: "lg",
            }}
          >
            <Box
              py={6}
              px={6}
              maxW={{
                base: "xl",
                lg: "5xl",
              }}
              w={{
                lg: "100%",
              }}
            >
              <Flex w={"100%"}>
                <chakra.h2
                  w={"80%"}
                  fontSize={{
                    base: "2xl",
                    md: "3xl",
                  }}
                  color="gray.800"
                  _dark={{
                    color: "white",
                  }}
                  fontWeight="bold"
                >
                  Company Data
                </chakra.h2>
                <Button
                  w={"20%"}
                  borderRadius={"10px"}
                  color={"white"}
                  bg={"black"}
                  border={"1px solid black"}
                  _hover={{ bg: "white", color: "black" }}
                  _active={{ bg: "white", color: "black" }}
                  onClick={() => 
                    handleOpen(value.documentId)
                  }
                >
                  View Detail
                </Button>
              </Flex>
              <Box
                border="none"
                padding="4"
                borderRadius="md"
                display="grid"
                gridTemplateColumns="max-content max-content 1fr"
                gridGap="2"
              >
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  Company Name
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  :
                </chakra.p>
                <chakra.p fontSize="lg" fontFamily={"Sans-serif"}>
                  {value.name}
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  Coupon Code
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  :
                </chakra.p>
                <chakra.p fontSize="lg" fontFamily={"Sans-serif"}>
                  {value.coupon}
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  Price
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  :
                </chakra.p>
                <chakra.p fontSize="lg" fontFamily={"Sans-serif"}>
                  {value.price ? `Rp. ${value.price.toLocaleString()}` : null}
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  Expire At
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  :
                </chakra.p>
                <chakra.p fontSize="lg" fontFamily={"Sans-serif"}>
                  {value?.expired_at?.seconds
                    ? convertUnixTimestamp(value?.expired_at?.seconds)
                    : value?.expired_at !== undefined &&
                      value?.expired_at !== null
                    ? convertISOToDDMMYY(value?.expired_at)
                    : " "}
                </chakra.p>

                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  Number of Owner
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  :
                </chakra.p>
                <chakra.p fontSize="lg" fontFamily={"Sans-serif"}>
                  {value?.owner?.length}
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  Number of Users
                </chakra.p>
                <chakra.p fontSize="md" fontFamily={"Sans-serif"}>
                  :
                </chakra.p>
                <chakra.p fontSize="lg" fontFamily={"Sans-serif"}>
                  {value?.users?.length}
                </chakra.p>
              </Box>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
};

export default DataCompanyPage;
