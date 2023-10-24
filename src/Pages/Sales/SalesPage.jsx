import {
  Box,
  Collapse,
  HStack,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { data } from "../../Components/Sidebar/DataMenu";
import { useNavigate } from "react-router-dom";

const SalesPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (value) => {
    if (!value.submenu || value?.submenu?.length === 0) {
      navigate(`${value.link}`);
    } else {
    }
  };

  return (
    <Box p={5}>
      <Stack align={"center"} spacing={3}>
        <Heading>Sales</Heading>
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
          Sales Menu
        </Text>
        <SimpleGrid columns={4} spacing={5}>
          {data
            .find((menu) => menu.name === "Sales")
            ?.submenu?.map((x, i) => (
              <>
                <Popover
                  trigger="hover"
                  placement="bottom"
                  isLazy
                  closeDelay={50}
                  openDelay={50}
                  arrowSize={0}
                >
                  <PopoverTrigger>
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
                  </PopoverTrigger>
                  {!x.submenu ? null : (
                    <Portal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <SimpleGrid
                            columns={x.submenu?.length > 4 ? 2 : 1}
                            spacing={3}
                          >
                            {x.submenu?.map((subitem, i) => (
                              <Box
                                p={3}
                                shadow={"base"}
                                borderRadius={"md"}
                                cursor={"pointer"}
                                onClick={() => navigate(`${subitem.link}`)}
                                key={i}
                                _hover={{
                                  transform: "scale(1.03)",
                                  transition: "0.3s",
                                }}
                              >
                                <Stack spacing="3" align={"center"}>
                                  <Icon as={subitem.icon} boxSize={6} />
                                  <Text
                                    pl={3}
                                    fontWeight={"500"}
                                    fontSize="sm"
                                    noOfLines={1}
                                  >
                                    {subitem.name}
                                  </Text>
                                </Stack>
                              </Box>
                            ))}
                          </SimpleGrid>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  )}
                </Popover>
              </>
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default SalesPage;
