import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { getAuth, getUserByEmail } from "firebase/auth";
import { auth, db } from "../../Config/firebase";
import { getCollectionFirebase } from "../../Api/firebaseApi";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";

function UserList() {
  const [userList, setUserList] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;

  // const getUser = async () => {
  //   try {
  //     const docRef = query(collection(db, "users"));
  //     const querySnapshot = await getDocs(docRef);
  //     const categoryData = querySnapshot.docs.map((doc) => doc.data());
  //     setUserList(categoryData);
  //   } catch (error) {
  //     console.error("Error fetching category:", error);
  //   }
  // };
  const getUser = async () => {
    try {
      const docRef = query(collection(db, "users"));
      const querySnapshot = await getDocs(docRef);
      const totalData = querySnapshot.docs.map((doc) => doc.data());
      // const startIndex = (currentPage - 1) * itemsPerPage;
      // const endIndex = startIndex + itemsPerPage;
      // const paginatedData = totalData.slice(startIndex, endIndex);
      setUserList(totalData);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };
  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handleNextPage = async () => {
  //   const totalData = userList.length;
  //   const maxPage = Math.ceil(totalData / itemsPerPage);
  //   if (currentPage < maxPage) {
  //     setCurrentPage(currentPage + 1);
  //     getUser();
  //   }
  // };

  useEffect(() => {
    getUser();
  }, []);
  // console.log(currentPage, "mmmmmm");
  return (
    <>
      <Box p={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          User List
        </Text>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Avatar</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userList.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Avatar src={user.image} alt={user.name} size="md" />
                </Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* <Box mt={4}>
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            size={"lg"}
          >
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            size={"lg"}
            marginLeft={"90%"}
            // disabled={currentPage === Math.ceil(userList.length / itemsPerPage)}
          >
            Next
          </Button>
        </Box> */}
      </Box>
    </>
  );
}

export default UserList;
