import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FcPlus } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { getCollectionFirebase } from "../../Api/firebaseApi";
import BackButtons from "../../Components/Buttons/BackButtons";
import ImageComponent from "../../Components/Image/ImageComponent";
import useUserStore from "../../Hooks/Zustand/Store";

function ProjectsPage() {
  const globalState = useUserStore();
  const [data, setData] = useState();
  const navigate = useNavigate();
  const getData = async () => {
    try {
      if (globalState?.currentCompany) {
        const conditions = [
          {
            field: "companyId",
            operator: "==",
            value: globalState.currentCompany,
          },
          {
            field: "users",
            operator: "array-contains",
            value: globalState?.uid,
          },
        ];
        const data = await getCollectionFirebase("projects", conditions);
        setData(data);
      }
    } catch (error) {
      console.log(`Err code IP-GD: ${error}`);
    }
  };

  useEffect(() => {
    getData();
    return () => {
      setData();
    };
  }, [globalState?.currentCompany]);

  return (
    <Stack p={[1, 1, 5]} spacing={5}>
      <HStack >
        <BackButtons />
        <Heading size={"md"}>Projects</Heading>
        <Spacer />
        <Button
          onClick={() => navigate("new")}
          bgColor={"white"}
          shadow="md"
          variant="outline"
          borderColor="#F05A28"
          color="#F05A28"
        >
          <HStack>
            <FcPlus />
            <Text>Project</Text>
          </HStack>
        </Button>
      </HStack>
      <SimpleGrid columns={{ base: 3, lg: 4 }} p="2" spacing={4} my={5}>
        {data?.length > 0 && (
          data.map((x, i) => (
            <Stack
              key={i}
              p="5"
              shadow="base"
              minH="100px"
              bg={"white"}
              borderRadius={"md"}
              onClick={() => navigate(`${x.id}`)}
              cursor='pointer'
            >
              <ImageComponent image={x.image} name={x.name} />
              <Spacer />

              <Stack>
                <Text fontWeight={"bold"}>{x.name}</Text>
                <Text fontSize="3xs">ID: {x.id}</Text>
              </Stack>

              <SimpleGrid columns={{ base: 2, lg: 3 }} textAlign="center">
                <Box shadow="base" borderRadius="md" m="1" p="1">
                  <Text fontSize="xs">Manager</Text>
                  <Text fontWeight={500}>{x?.managers?.length ? x.managers.length : 0}</Text>
                </Box>
                <Box shadow="base" borderRadius="md" m="1" p="1">
                  <Text fontSize="xs">Users</Text>
                  <Text fontWeight={500}>{x?.users?.length ? x.users.length : 0}</Text>
                </Box>
                <Box shadow="base" borderRadius="md" m="1" p="1">
                  <Text fontSize="xs">Modules</Text>
                  <Text fontWeight={500}>{x?.modules?.length ? x.modules.length : 0}</Text>
                </Box>
              </SimpleGrid>
              <Flex overflowY="auto">
                {x.modules?.map((z) => (
                  <Badge colorScheme="green" m="1"  borderRadius={'md'}>
                    {z}
                  </Badge>
                ))}
              </Flex>
              <Text fontSize='2xs' textAlign={'end'}>Created: {moment(x?.createdAt?.seconds * 1000).format('LLL') }</Text>
            </Stack>
          ))
        )}
      </SimpleGrid>
    </Stack>
  );
}

export default ProjectsPage;
