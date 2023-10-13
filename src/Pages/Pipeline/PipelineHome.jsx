import { Box, Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BackButtons from "../../Components/Buttons/BackButtons";
import { dataMenuCRM } from "../../Components/Sidebar/DataMenu";

const PipelineHome = () => {
  const navigate = useNavigate();
  return (
    <Box p={5}>
      <BackButtons />
      <Stack align={"center"} spacing={3}>
        <Heading>Pipelines</Heading>
        <Text w={"80%"} align={"center"} color={"gray.500"}>
          Take control of your sales and project management like a pro with our
          Pipeline Feature. Visualize and manage your entire workflow in one
          place, from leads to deals to successful projects. Stay on top of
          every stage, set priorities, and watch your business thrive. With our
          intuitive Pipeline Feature, you'll always know where your
          opportunities stand, making growth and success a breeze.
        </Text>
      </Stack>

      <Box bg={"white"} my={7} p={4} shadow={"md"}>
        <Text color={"gray.500"} fontWeight={500} mb={5}>
          Pipeline Menu
        </Text>
        <SimpleGrid columns={5} spacing={5}>
          {dataMenuCRM
            .find((menu, i) => menu.name === "Pipeline")
            ?.submenu?.map((x, i) => (
              <Stack
                key={i}
                p={3}
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

export default PipelineHome;
