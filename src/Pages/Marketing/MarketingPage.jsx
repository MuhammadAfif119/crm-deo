import { Box, Heading, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { data } from "../../Components/Sidebar/DataMenu";
import { useNavigate } from "react-router-dom";

const MarketingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (value) => {
    if (value.link.includes("http")) {
      window.open(`${value.link}`, "_blank");
    } else {
      navigate(`${value.link}`);
    }
  };
  return (
    <Box p={5}>
      <Stack align={"center"} spacing={3}>
        <Heading>Marketing</Heading>
        <Text w={"80%"} align={"center"} color={"gray.500"}>
          Elevate your HR operations with a powerful HRIS solution that
          streamlines data management, recruitment, performance, and compliance,
          ensuring efficient, error-free processes while empowering your
          employees. Stay ahead of the competition, make informed decisions, and
          enhance the employee experience.
        </Text>
      </Stack>

      <Box bg={"white"} my={7} p={4} shadow={"md"}>
        <Text color={"gray.500"} fontWeight={500} mb={5}>
          Marketing Menu
        </Text>
        <SimpleGrid columns={4} spacing={5}>
          {data
            .find((menu) => menu.name === "Marketing")
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
                onClick={() => handleNavigate(x)}
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

export default MarketingPage;
