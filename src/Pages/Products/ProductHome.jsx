import { Box, Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { data, dataMenuCRM } from "../../Components/Sidebar/DataMenu";
import { useNavigate } from "react-router-dom";
import BackButtons from "../../Components/Buttons/BackButtons";

const ProductHome = () => {
  const navigate = useNavigate();
  return (
    <Box p={5}>
      <BackButtons />
      <Stack align={"center"} spacing={3}>
        <Heading>Products</Heading>
        <Text w={"80%"} align={"center"} color={"gray.500"}>
          Explore, organize, and track your offerings effortlessly in one
          convenient location. Whether you're launching new products or
          fine-tuning your existing lineup, our intuitive Product Menu
          simplifies the process. Streamline your product management and take
          control of your business's growth journey.
        </Text>
      </Stack>

      <Box bg={"white"} my={7} p={4} shadow={"md"}>
        <Text color={"gray.500"} fontWeight={500} mb={5}>
          Product Menu
        </Text>
        <SimpleGrid columns={4} spacing={5}>
          {dataMenuCRM
            .find((menu) => menu.name === "Products")
            ?.submenu?.map((x, i) => (
              <Stack
                p={3}
                key={i}
                border={"1px"}
                shadow={"base"}
                align={"center"}
                cursor={"pointer"}
                borderRadius={"md"}
                borderColor={"gray.300"}
                onClick={() => navigate(`${x.link}`)}
                _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
              >
                <Icon as={x.icon} boxSize={12} />
                <Text fontWeight={500}>{x.name}</Text>
              </Stack>
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default ProductHome;
