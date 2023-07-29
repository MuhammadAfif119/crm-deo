import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Config/firebase";
import useUserStore from "../../Routes/Store";
import { capitalize } from "../../Utils/capitalizeUtil";
import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
import { getCollectionFirebase } from "../../Api/firebaseApi";
import { Link } from "react-router-dom";

const PipelinePage = () => {
  const { userDisplay } = useUserStore();

  const [dataProject, setDataProject] = useState();

  const getDataProject = async () => {

	getCollectionFirebase('pipelines')
		.then((x)=>setDataProject(x))
		.catch((err)=>console.log(err.message))
  };


  useEffect(() => {
	getDataProject()
  
	return () => {
		setDataProject()
	}
  }, [])
  

  return (
    <Box>
      <HStack>
        <Text fontWeight={"semibold"}>PIPELINE</Text>
        <Spacer />
        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" mb={2} />
            </InputLeftElement>
            <Input placeholder="Search" size={"sm"} bg={"white"} />
          </InputGroup>

          <Button size={"sm"} colorScheme="telegram" borderRadius={"sm"}>
            + Add
          </Button>
        </HStack>
      </HStack>

      <Box bg={"white"} my={4} p={3} boxShadow={"sm"}>
        <SimpleGrid columns={[2, null, 4]} spacing={3}>
          {dataProject?.map((x, i) => (
            <Box
              key={i}
              border={"1px"}
              borderColor={"gray.200"}
              p={2}
              my={3}
              bg={"white"}
              boxShadow={"sm"}
              borderRadius={"sm"}
              cursor={"pointer"}
              _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
            //   onClick={() => console.log(project)}
            >
			<Link to={`view/${x.id}`}>
              <Box my={3}>
                <Text fontWeight={"semibold"}>
                  {
				//   capitalize(project?.data.ayrshare_account?.name)
				x.title
				  }
                </Text>
                <Text fontSize={"xs"}>
                  {x.title}
                </Text>
              </Box>
			  </Link>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default PipelinePage;
