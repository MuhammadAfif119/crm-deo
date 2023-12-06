import React, { useEffect, useState } from "react";
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import useUserStore from "../../Hooks/Zustand/Store";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { db } from "../../Config/firebase";
import BackButtons from "../../Components/Buttons/BackButtons";

const DataCompanyDetailPage = () => {
  const globalState = useUserStore();
  const [bank, setBank] = useState([]);
  const [description, setDescription] = useState([]);
  const [modules, setModules] = useState([]);
  const [payments, setPayments] = useState([]);
  const [roles, setRoles] = useState([]);

  //   const getData = async () => {
  //     try {
  //       const q = query(collection(db, `companies/${globalState.dataCompanyId}/banks`));
  //       const q1 = query(collection(db, `companies/${globalState.dataCompanyId}/description`));
  //       const q2 = query(collection(db, `companies/${globalState.dataCompanyId}/modules`));
  //       const q3 = query(collection(db, `companies/${globalState.dataCompanyId}/payments`));
  //       const q4 = query(collection(db, `companies/${globalState.dataCompanyId}/roles`));

  //       const [bankSnapshot, descriptionSnapshot, modulesSnapshot, paymentsSnapshot, rolesSnapshot] = await Promise.all([
  //         getDocs(q),
  //         getDocs(q1),
  //         getDocs(q2),
  //         getDocs(q3),
  //       ]);

  //       const bankData = bankSnapshot?.docs.map((doc) => doc.data());
  //       const descriptionData = descriptionSnapshot?.docs.map((doc) => doc.data());
  //       const modulesData = modulesSnapshot?.docs.map((doc) => doc.data());
  //       const paymentsData = paymentsSnapshot?.docs.map((doc) => doc.data());
  //       const rolesData = rolesSnapshot?.docs.map((doc) => doc.data());

  //       setBank(bankData);
  //       setDescription(descriptionData);
  //       setModules(modulesData);
  //       setPayments(paymentsData);
  //       setRoles(rolesData);

  //     } catch (error) {
  //       console.error("Error fetching data:", error.message);
  //     }
  //   };

  const getBank = async () => {
    try {
      const db = getFirestore();
      const companiesRef = collection(
        db,
        `companies/${globalState.dataCompanyId}/banks`
      );
      const querySnapshot = await getDocs(companiesRef);

      const totalData = [];
      querySnapshot.forEach((companyDoc) => {
        const companyData = companyDoc.data();
        companyData.documentId = companyDoc.id;
        totalData.push(companyData);
      });

      setBank(totalData);
    } catch (error) {}
  };

  const getDescription = async () => {
    try {
      const db = getFirestore();
      const companiesRef = collection(
        db,
        `companies/${globalState.dataCompanyId}/description`
      );
      const querySnapshot = await getDocs(companiesRef);

      const totalData = [];
      querySnapshot.forEach((companyDoc) => {
        const companyData = companyDoc.data();
        companyData.documentId = companyDoc.id;
        totalData.push(companyData);
      });

      setDescription(totalData);
    } catch (error) {}
  };

  const getModules = async () => {
    try {
      const db = getFirestore();
      const companiesRef = collection(
        db,
        `companies/${globalState.dataCompanyId}/modules`
      );
      const querySnapshot = await getDocs(companiesRef);

      const totalData = [];
      querySnapshot.forEach((companyDoc) => {
        const companyData = companyDoc.data();
        companyData.documentId = companyDoc.id;
        totalData.push(companyData);
      });

      setModules(totalData);
    } catch (error) {}
  };

  const getPayments = async () => {
    try {
      const db = getFirestore();
      const companiesRef = collection(
        db,
        `companies/${globalState.dataCompanyId}/payments`
      );
      const querySnapshot = await getDocs(companiesRef);

      const totalData = [];
      querySnapshot.forEach((companyDoc) => {
        const companyData = companyDoc.data();
        companyData.documentId = companyDoc.id;
        totalData.push(companyData);
      });

      setPayments(totalData);
    } catch (error) {}
  };

  const getRole = async () => {
    try {
      const db = getFirestore();
      const companiesRef = collection(
        db,
        `companies/${globalState.dataCompanyId}/roles`
      );
      const querySnapshot = await getDocs(companiesRef);

      const totalData = [];
      querySnapshot.forEach((companyDoc) => {
        const companyData = companyDoc.data();
        companyData.documentId = companyDoc.id;
        totalData.push(companyData);
      });

      setRoles(totalData);
    } catch (error) {}
  };

  useEffect(() => {
    getBank();
    getDescription();
    getModules();
    getPayments();
    getRole();
  }, []);

  console.log(bank, "bank");
  console.log(description, "description");
  console.log(modules, "modules");
  console.log(payments, "payments");
  console.log(roles, "roles");
  console.log(globalState.dataCompanyId);
  return (
    <>
      <Container maxW={"7xl"}>
        <BackButtons />
        {description.map((data, index) => (
          <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 4, md: 10 }}
          py={{ base: 6, md: 12 }}
          key={index}
        >
            <Flex>
              <Image
                rounded={"md"}
                alt={"product image"}
                src={data.image}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={{ base: "100%", sm: "400px", lg: "500px" }}
              />
            </Flex>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Box as={"header"}>
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                >
                  Company Profile
                </Heading>
              </Box>

              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={"column"}
                divider={
                  <StackDivider
                    // borderColor={useColorModeValue("gray.200", "gray.600")}
                  />
                }
              >
                <Box>
                  <SimpleGrid columns={2} spacing={"25%"}>
                    <Box>
                      <Text
                        fontSize={["14px","18px,18px"]}
                        // color={useColorModeValue("yellow.500", "yellow.300")}
                        fontWeight={"500"}
                        textTransform={"uppercase"}
                        mb={"4"}
                      >
                        Modules
                      </Text>
                      {modules?.map((x, index) => (
                        <Flex display={"row"}>
                          <Checkbox
                            key={index}
                            value={x?.status}
                            isChecked={x?.status}
                          >
                            {x?.documentId}
                          </Checkbox>
                        </Flex>
                      ))}
                    </Box>
                    <Box>
                      <Text
                      fontSize={["14px","18px,18px"]}
                        // color={useColorModeValue("yellow.500", "yellow.300")}
                        fontWeight={"500"}
                        textTransform={"uppercase"}
                        mb={"4"}
                      >
                        Payments
                      </Text>
                      {payments?.map((y, index) => (
                        <Flex flexDirection="column" key={index}>
                          <Checkbox isChecked={y?.cash}>Cash</Checkbox>
                          <Checkbox isChecked={y?.creditCard}>
                            Credit Card
                          </Checkbox>
                          <Checkbox isChecked={y?.qrCode}>QR Code</Checkbox>
                          <Checkbox isChecked={y?.virtualAccount}>
                            Virtual Account
                          </Checkbox>
                        </Flex>
                      ))}
                    </Box>
                  </SimpleGrid>
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: "16px", lg: "18px" }}
                    // color={useColorModeValue("yellow.500", "yellow.300")}
                    fontWeight={"500"}
                    textTransform={"uppercase"}
                    mb={"4"}
                  >
                    Company Description
                  </Text>

                  <List spacing={2}>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Company Name:
                      </Text>{" "}
                      {data.name}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Company Address:
                      </Text>{" "}
                      {data.address}, {data.domicile}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Company Email:
                      </Text>{" "}
                      {data.email}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Company Phone:
                      </Text>{" "}
                      {data.phone}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Company Industry:
                      </Text>{" "}
                      {data.industry}
                    </ListItem>
                    <ListItem>
                      <Text as={"span"} fontWeight={"bold"}>
                        Company Description:
                      </Text>{" "}
                      {data.description}
                    </ListItem>
                  </List>
                </Box>
              </Stack>
            </Stack>
          </SimpleGrid>
        ))}
        <Box>
          <Text
            fontSize={{ base: "16px", lg: "18px" }}
            // color={useColorModeValue("yellow.500", "yellow.300")}
            fontWeight={"500"}
            textTransform={"uppercase"}
            mb={"4"}
          >
            Roles
          </Text>
          <SimpleGrid columns={[1,4,4]} w={"full"}>
            {roles?.map((m, index) => (
              <Box
                border="1px solid #ccc"
                p={"2%"}
                key={index}
                borderRadius={"12px"}
                margin={"10px"}
              >
                <List spacing={2} p={"5%"}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Roles Name:
                    </Text>{" "}
                    {m.title}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Number of Roles:
                    </Text>{" "}
                    {m.users.length}
                  </ListItem>
                </List>
              </Box>
            ))}
          </SimpleGrid>
          <Divider />
        </Box>
        <Box>
          <Text
            fontSize={{ base: "16px", lg: "18px" }}
            // color={useColorModeValue("yellow.500", "yellow.300")}
            fontWeight={"500"}
            textTransform={"uppercase"}
            mb={"4"}
          >
            Bank
          </Text>
          <SimpleGrid columns={[1,4,4]} w={"full"}>
            {bank?.map((r, index) => (
              <Box
                border="1px solid #ccc"
                p={"2%"}
                key={index}
                borderRadius={"12px"}
                margin={"10px"}
              >
                <List spacing={2} p={"5%"}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Bank Name:
                    </Text>{" "}
                    {r.bank.toUpperCase()}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Bank Account Number:
                    </Text>{" "}
                    {r.accountNumber}
                  </ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Bank Account Name:
                    </Text>{" "}
                    {r.name}
                  </ListItem>
                </List>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
};

export default DataCompanyDetailPage;
