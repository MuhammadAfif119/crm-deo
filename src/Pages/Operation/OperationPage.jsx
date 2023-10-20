import {
  Box,
  Heading,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { data } from "../../Components/Sidebar/DataMenu";
import { useNavigate } from "react-router-dom";
import BackButtons from "../../Components/Buttons/BackButtons";

const OperationPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (value) => {
    if (!value.submenu || value?.submenu?.length === 0) {
      navigate(`${value.link}`);
    } else {
    }
  };

  return (
    <Box p={5}>
      <BackButtons />
      <Stack align={"center"} spacing={3}>
        <Heading>Operation</Heading>
        <Text w={"80%"} align={"center"} color={"gray.500"}>
          Customize your view, filter data, and gain clarity on every aspect of
          your business with intuitive Pageview Menu, you're in control of your
          data-driven journey, ensuring smarter choices and strategic growth.
        </Text>
      </Stack>

      <Box bg={"white"} my={7} p={4} shadow={"md"}>
        <Text color={"gray.500"} fontWeight={500} mb={5}>
          Operation Menu
        </Text>
        <SimpleGrid columns={4} spacing={5}>
          {data
            .find((menu) => menu.name === "Operation")
            ?.submenu?.map((x, i) => (
              <>
                <Popover
                  key={i}
                  trigger="hover"
                  placement="bottom"
                  isLazy
                  // isOpen={x.submenu?.length > 0}
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
                      // onClick={() => window.open(`${x.link}`, "_blank")}
                      onClick={() => handleNavigate(x)}
                      // onClick={() => handleCollapse(x)}
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
                                // align={"center"}
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

export default OperationPage;
