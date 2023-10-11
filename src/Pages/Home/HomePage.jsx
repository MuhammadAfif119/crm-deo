import {
  Box,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { data, dataApps } from "../../Components/Sidebar/DataMenu";
import { Navigate, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (menu) => {
    if (menu.status) {
    } else {
      if (menu?.link?.includes("https")) {
        window.open(menu?.link, "_blank");
      } else {
        navigate(menu.link);
      }
    }
  };
  return (
    <Box p={5}>
      <Stack align={"center"}>
        <Heading>Welcome to Deoapp Business</Heading>
        <Text fontSize={"sm"}>
          Unlock the Power of Business Management and Transform Your Business
        </Text>
      </Stack>

      <Box bg={"white"} p={5} my={5}>
        <SimpleGrid columns={3} spacing={4}>
          {data.map((menu, i) => (
            <Flex
              cursor={"pointer"}
              _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
              onClick={() => handleNavigate(menu)}
              flexDir={"column"}
              p={4}
              key={i}
              border={"1px"}
              borderColor={"gray.300"}
              shadow={"base"}
              borderRadius={"md"}
              align={"center"}
              pos={"relative"}
              // alignItems={"center"}
              // justifyContent={"center"}
            >
              <Stack align={"center"}>
                <Icon as={menu.icon} boxSize={12} />
                <Text
                  fontWeight={500}
                  textTransform={"uppercase"}
                  color={"gray.800"}
                >
                  {menu.name}
                </Text>
                <Spacer />
                <Text
                  align={"center"}
                  color={"gray.500"}
                  fontSize={"sm"}
                  my={3}
                >
                  {menu.description}
                </Text>
              </Stack>

              {menu.status ? (
                <Box pos={"absolute"} top={3} right={3}>
                  <Tag size={"sm"} colorScheme="red">
                    <TagLabel>{menu?.status}</TagLabel>
                  </Tag>
                </Box>
              ) : null}
            </Flex>
          ))}
        </SimpleGrid>
      </Box>
      {/* 
      <Box align={"center"}>
        <Heading size={"lg"} mb={5}>
          Discover Our App
        </Heading>
        <SimpleGrid columns={4} spacing={4} justifyContent={"space-between"}>
          {dataApps.map((app, i) => (
            <Stack
              key={i}
              cursor={"pointer"}
              _hover={{ transform: "scale(1.03)", transition: "0.3s" }}
              p={3}
              align={"center"}
              border={"1px"}
              bg={"white"}
              borderColor={"gray.300"}
              borderRadius={"md"}
              shadow={"base"}
            >
              <a target="_blank" href={app.link}>
                <Icon as={app.icon} boxSize={12} />
                <Text fontWeight={500}>{app.name}</Text>
              </a>
            </Stack>
          ))}
        </SimpleGrid>
      </Box> */}
    </Box>
  );
}

export default HomePage;
