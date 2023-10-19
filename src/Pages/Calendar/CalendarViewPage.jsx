import {
  Box,
  ButtonGroup,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { BsBoxArrowUpRight, BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

function CalendarViewPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const header = ["name", "created", "actions"];
  const data = [
    {
      name: "Daggy",
      created: "7 days ago",
    },
    {
      name: "Anubra",
      created: "23 hours ago",
    },
    {
      name: "Josef",
      created: "A few seconds ago",
    },
    {
      name: "Sage",
      created: "A few hours ago",
    },
  ];
  const color1 = useColorModeValue("gray.400", "gray.400");
  const color2 = useColorModeValue("gray.400", "gray.400");
  return (
    <>
      <Box as={"header"}>
        <Heading
          m={"3%"}
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "2xl", lg: "3xl" }}
        >
          Your Agenda
        </Heading>
      </Box>
      <Flex
        w="full"
        // bg="#edf3f8" 
        _dark={{
          bg: "#3e3e3e",
        }}
        p={50}
        alignItems="center"
        justifyContent="center"
      >
        <Table
          w="full"
          bg="white"
          _dark={{
            bg: "gray.800",
          }}
          display={{
            base: "block",
            md: "table",
          }}
          sx={{
            "@media print": {
              display: "table",
            },
          }}
        >
          <Thead
            display={{
              base: "none",
              md: "table-header-group",
            }}
            sx={{
              "@media print": {
                display: "table-header-group",
              },
            }}
          >
            <Tr>
              {header.map((x) => (
                <Th key={x}>{x}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody
            display={{
              base: "block",
              lg: "table-row-group",
            }}
            sx={{
              "@media print": {
                display: "table-row-group",
              },
            }}
          >
            {data.map((token, tid) => {
              return (
                <Tr
                  key={tid}
                  display={{
                    base: "grid",
                    md: "table-row",
                  }}
                  sx={{
                    "@media print": {
                      display: "table-row",
                    },
                    gridTemplateColumns: "minmax(0px, 35%) minmax(0px, 65%)",
                    gridGap: "10px",
                  }}
                >
                  {Object.keys(token).map((x) => {
                    return (
                      <React.Fragment key={`${tid}${x}`}>
                        <Td
                          display={{
                            base: "table-cell",
                            md: "none",
                          }}
                          sx={{
                            "@media print": {
                              display: "none",
                            },
                            textTransform: "uppercase",
                            color: color1,
                            fontSize: "xs",
                            fontWeight: "bold",
                            letterSpacing: "wider",
                            fontFamily: "heading",
                          }}
                        >
                          {x}
                        </Td>
                        <Td
                          color={"gray.500"}
                          fontSize="md"
                          fontWeight="hairline"
                        >
                          {token[x]}
                        </Td>
                      </React.Fragment>
                    );
                  })}
                  <Td
                    display={{
                      base: "table-cell",
                      md: "none",
                    }}
                    sx={{
                      "@media print": {
                        display: "none",
                      },
                      textTransform: "uppercase",
                      color: color2,
                      fontSize: "xs",
                      fontWeight: "bold",
                      letterSpacing: "wider",
                      fontFamily: "heading",
                    }}
                  >
                    Actions
                  </Td>
                  <Td>
                    <ButtonGroup variant="solid" size="sm" spacing={3}>
                      <IconButton
                      onClick={onOpen}
                        colorScheme="green"
                        icon={<AiFillEdit />}
                        aria-label="Edit"
                      />
                      <IconButton
                        colorScheme="red"
                        variant="outline"
                        icon={<BsFillTrashFill />}
                        aria-label="Delete"
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CalendarViewPage;
