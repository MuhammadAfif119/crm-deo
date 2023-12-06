import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Avatar,
  SimpleGrid,
  // useColorModeValue,
  Button,
  FormLabel,
  Input,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { child, get, getDatabase, ref, remove } from "firebase/database";
import { app, database, db } from "../../Config/firebase";
import { SlTrash } from "react-icons/sl";
import { PhoneIcon, Search2Icon } from "@chakra-ui/icons";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { removeSymbols } from "../../Utils/Helper";

function UserLive() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [tes, setTes] = useState();
  const [visibleCount, setVisibleCount] = useState(15);
  const [visibleFilterCount, setVisibleFilterCount] = useState(15);
  const [search, setSearch] = useState();

  const getValue = async () => {
    const database = getDatabase(app);
    const rootReference = ref(database);
    const dbGet = await get(child(rootReference, "/onlineUsers"));
    const dbValue = dbGet.val();
    console.log("Data dari Firebase:", dbValue);
    const data = Object.values(dbValue || {});
    setActiveUsers(data);
  };

  const getArray = () => {
    activeUsers.forEach(async (user) => {
      try {
        const docRef = query(
          collection(db, "users"),
          where("email", "==", `${user.email}`)
        );
        const querySnapshot = await getDocs(docRef);
        const categoryData = querySnapshot.docs.map((doc) => doc.data());
        setUserList((prevData) => [...prevData, ...categoryData]);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    });
  };

  // const getSearchArray = () => {
  //   activeUsers.forEach(async (user) => {
  //     try {
  //       // console.log(user.email, search)
  //       const docRef = query(
  //         collection(db, "users"),
  //         where("name", "==", search),
  //         where("email", "==", `${user.email}`)
  //       );
  //       const querySnapshot = await getDocs(docRef);
  //       const categoryData = querySnapshot.docs.map((doc) => doc.data());
  //       setFilter(categoryData);
  //     } catch (error) {
  //       console.error("Error fetching category:", error);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   getSearchArray();
  // }, [search, activeUsers.length === 0]);

  // const filteredUsers = userList.filter((user) => user.name === search);

  const filteredUsers = userList.filter((item) => {
    return (
      item.name &&
      item.name.toLowerCase().includes(search && search.toLowerCase())
    );
  });

  const host = window.location.hostname;

  const handleLoadMore = () => {
    if (!search) {
      setVisibleCount((prevCount) => prevCount + 15);
    } else {
      setVisibleFilterCount((prevCount) => prevCount + 15);
    }
  };

  const visibleData = userList.slice(0, visibleCount);
  const fiterVisible = filteredUsers.slice(0, visibleFilterCount);

  const handleRemove = async (user) => {
    const path = `onlineUsers/${host}-business-${removeSymbols(user.email)}`;
    try {
      await remove(ref(database, path));
      const newData = userList.filter(item => item.email !== user.email);
      const visibleData = newData.slice(0, visibleCount);
      setUserList(newData);
      getValue();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  useEffect(() => {
    getValue();
  }, []);

  useEffect(() => {
    getArray();
    // getSearchArray();
  }, [activeUsers.length === 0]);

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        User Live
      </Text>
      <InputGroup marginTop={"2%"} marginBottom={["7%","5%","2%"]}>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          type="tel"
          placeholder="Filter User"
          w={["100%","100%","30%"]}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {search
          ? fiterVisible?.map((user, index) => (
              <Flex
                key={index}
                // bg={useColorModeValue("white", "gray.700")}
                p={4}
                borderRadius="md"
                boxShadow="md"
                w={"100%"}
              >
                <Avatar src={user?.avatar} alt={user?.name} size="md" w={"20%"} />
                <Box ml={3} w={"60%"}>
                  <Text fontWeight="bold" isTruncated maxW="150px">
                    {user.name}
                  </Text>
                  <Text fontWeight="bold" isTruncated maxW="150px">
                    {user.email}
                  </Text>
                  <Flex marginTop={"5%"}>
                    <Text color="gray.500">Active</Text>
                  </Flex>
                </Box>
                <Button
                  colorScheme="red"
                  size={"xs"}
                  onClick={() => handleRemove(user)}
                  w={"20%"}
                >
                  <SlTrash />
                </Button>
              </Flex>
            ))
          : visibleData?.map((user, index) => (
              <Flex
                key={index}
                // bg={useColorModeValue("white", "gray.700")}
                p={4}
                borderRadius="md"
                boxShadow="md"
                w={"100%"}
              >
                <Avatar src={user?.avatar} alt={user?.name} size="md" w={"20%"}/>
                <Box ml={3} w={"60%"}>
                  <Text fontWeight="bold" isTruncated maxW="150px">
                    {user.name}
                  </Text>
                  <Text fontWeight="bold" isTruncated maxW="150px">
                    {user.email}
                  </Text>
                  <Flex marginTop={"5%"}>
                    <Text color="gray.500">Active</Text>
                  </Flex>
                </Box>
                <Button
                  colorScheme="red"
                  size={"xs"}
                  onClick={() => handleRemove(user)}
                  w={"20%"}
                >
                  <SlTrash />
                </Button>
              </Flex>
            ))}
      </SimpleGrid>
      <Button mx={"45%"} mt={"5%"} size="lg" onClick={handleLoadMore}>
        Load More
      </Button>
    </Box>
  );
}

export default UserLive;
