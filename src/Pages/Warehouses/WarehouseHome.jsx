import { Box, Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { data } from "../../Components/Sidebar/DataMenu";
import { useNavigate } from "react-router-dom";
import BackButtons from "../../Components/Buttons/BackButtons";

const WarehouseHome = () => {
  const navigate = useNavigate();
  return (
    <Box p={5}>
      <BackButtons />
      <Stack align={"center"} spacing={3}>
        <Heading>Warehouse</Heading>
        <Text w={"80%"} align={"center"} color={"gray.500"}>
          Customize your view, filter data, and gain clarity on every aspect of
          your business with intuitive Pageview Menu, you're in control of your
          data-driven journey, ensuring smarter choices and strategic growth.
        </Text>
      </Stack>

      <Box bg={"white"} my={7} p={4} shadow={"md"}>
        <Text color={"gray.500"} fontWeight={500} mb={5}>
          Warehouse Menu
        </Text>
        <SimpleGrid columns={4} spacing={5}>
          {data
            .find((menu) => menu.name === "Warehouse")
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

export default WarehouseHome;
