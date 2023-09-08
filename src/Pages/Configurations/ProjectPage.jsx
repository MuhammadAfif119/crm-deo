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
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCollectionFirebase } from "../../Api/firebaseApi";
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
    <>
      <Box>
        <HStack>
          <Heading>Projects</Heading>
          <Spacer />
          <Button colorScheme="green" onClick={() => navigate("new")}>
            Add
          </Button>
        </HStack>
        <SimpleGrid columns={{ base: 3, lg: 4 }} p="2" spacing={4} my={5}>
          {data ? (
            data.map((x, i) => (
              <Box
                key={i}
                p="5"
                shadow="base"
                minH="100px"
                bg={"white"}
                borderRadius={"md"}
              >
                <Link to={`${x.id}`}>
                  <ImageComponent image={x.image} name={x.name} />
                  <Text fontWeight="bold">{x.name}</Text>
                  <SimpleGrid columns={{ base: 2, lg: 3 }} textAlign="center">
                    <Box shadow="base" borderRadius="md" m="1" p="1">
                      <Text fontSize="xs">Manager</Text>
                      <Text>{x?.manager?.length ? x.manager.length : 0}</Text>
                    </Box>
                    <Box shadow="base" borderRadius="md" m="1" p="1">
                      <Text fontSize="xs">Users</Text>
                      <Text>{x?.users?.length ? x.users.length : 0}</Text>
                    </Box>
                    <Box shadow="base" borderRadius="md" m="1" p="1">
                      <Text fontSize="xs">Modules</Text>
                      <Text>{x?.modules?.length ? x.modules.length : 0}</Text>
                    </Box>
                  </SimpleGrid>
                  <Flex overflowY="auto">
                    {x.modules?.map((z) => (
                      <Badge colorScheme="yellow" m="0.5">
                        {z}
                      </Badge>
                    ))}
                  </Flex>
                  {/* <Text fontSize='2xs'>Last updated: {moment.unix(x.lastUpdated.seconds).fromNow() }</Text> */}
                  <Text fontSize="2xs">ID: {x.id}</Text>
                </Link>
              </Box>
            ))
          ) : (
            <></>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
}

export default ProjectsPage;
