import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  arrayRemoveFirebase,
  deleteDocumentFirebase,
  deleteFileFirebase,
  getCollectionFirebase,
  getCollectionWhereFirebase,
} from "../../Api/firebaseApi";
import moment from "moment";
import useUserStore from "../../Hooks/Zustand/Store";
import AddButtons from "../../Components/Buttons/AddButtons";

const TicketPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const today = moment();
  const monthNames = moment.monthsShort();
  const globalState = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [active, setActive] = useState(true);

  const [dataSearchTicket, setDataSearchTicket] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = data.filter((item) => {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataSearchTicket(newData);
      setInputSearch(text);
    } else {
      setDataSearchTicket(data);
      setInputSearch(text);
    }
  };

  const getData = async () => {
    const conditions = [
      { field: "projectId", operator: "==", value: globalState.currentProject },
    ];
    const sortBy = { field: "createdAt", direction: "desc" };
    const limitValue = startIndex + itemsPerPage;
    try {
      const res = await getCollectionFirebase(
        "tickets",
        conditions,
        sortBy,
        limitValue
      );
      console.log(res);
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = (type, item) => {
    onOpen();
    setSelectedData({ type: type, item: item });
  };

  const handleDelete = async (x) => {
    try {
      console.log(x);

      if (x.formId) {
        await arrayRemoveFirebase("forms", x.formId, "ticket_used", [x.id]);
      }

      deleteFileFirebase(`${x.title}_800x800`, `tickets`).then(() => {
        deleteFileFirebase(`${x.title}-logo_800x800`, `tickets`).then(() => {
          deleteDocumentFirebase("tickets", x?.id).then((res) => {
            toast({
              title: "Deoapp.com",
              description: res,
              status: "success",
              position: "top-right",
              isClosable: true,
            });
            getData();
            onClose();
          });
        });
      });
    } catch (error) {
      toast({
        title: "Deoapp.com",
        description: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const handleLoadMore = () => {
    setStartIndex((prev) => prev + itemsPerPage); // Tambahkan jumlah data per halaman saat tombol "Load More" diklik
  };

  useEffect(() => {
    getData();
  }, [globalState?.currentProject]);

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  return (
    <Box p={[1, 1, 5]}>
      <AddButtons type={"Tickets"} link={"/ticket/create"} />
      {/* <Flex textAlign={'center'} my={5} >
        <Box w='50%' onClick={() => setActive(true)} p='3' cursor={'pointer'} borderTopWidth={3} rounded={5} borderLeftWidth={3} borderColor={active === true ? 'green' : 'transparent'} shadow={active === false ? 'md' : 'none'}>
          <Heading size='sm'>
            Active
          </Heading>
        </Box>
        <Box w='50%' onClick={() => setActive(false)} p='3' cursor={'pointer'} borderTopWidth={3} rounded={5} shadow={active === true ? 'md' : 'none'} borderRightWidth={3} borderColor={active === false ? 'green' : 'transparent'}>
          <Heading size='sm'>
            In-Active
          </Heading>
        </Box>
      </Flex> */}

      <Input
        mb={3}
        mt={5}
        type="text"
        placeholder="Search Ticket ..."
        bgColor="white"
        color="black"
        sx={inputStyles}
        fontSize="sm"
        onChange={(e) => searchFilterFunction(e.target.value)}
      />

      {inputSearch !== "" ? (
        <SimpleGrid my={5} columns={data?.length !== 0 ? [2, 3] : 1} gap="5">
          {dataSearchTicket.length !== 0 ? (
            dataSearchTicket
              // ?.filter((item) =>
              //   active
              //     ? active === item?.isActive && today.isBefore(item?.dateStart)
              //     : active === item?.isActive ||
              //       today.isSameOrAfter(item?.dateStart)
              // )
              .map((item, index) => {
                return (
                  <>
                    <Box pos={"relative"} key={index}>
                      <VStack
                        rounded={5}
                        borderWidth="1px"
                        p={3}
                        bgColor="white"
                        shadow={"md"}
                        align={"left"}
                        justify={"space-between"}
                        cursor={"pointer"}
                        _hover={{
                          bg: "gray.100",
                          transform: "scale(1.02)",
                          transition: "0.3s",
                          cursor: "pointer",
                        }}
                      >
                        {item.isActive === true ? (
                          <Badge
                            fontSize={9}
                            w={"fit-content"}
                            variant="solid"
                            colorScheme="green"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            fontSize={9}
                            w={"fit-content"}
                            variant="solid"
                            colorScheme="red"
                          >
                            Inactive
                          </Badge>
                        )}
                        <Flex justify={"space-between"} align={"center"}>
                          <Heading
                            size={"sm"}
                            onClick={() => handleModal("read", item)}
                          >
                            {item?.title}
                          </Heading>
                          <Button
                            variant={"unstyled"}
                            onClick={() => handleModal("delete", item)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Flex>
                        <Box onClick={() => handleModal("read", item)}>
                          <Flex gap={2} align={"center"}>
                            <FiCalendar />
                            <Text size={"sm"}>
                              {moment(item?.dateStart).format("DD")}{" "}
                              {monthNames[moment(item?.dateStart).month()]}{" "}
                              {moment(item?.dateStart).format("YYYY")}
                            </Text>
                            {item?.dateEnd && (
                              <Text size={"sm"}>
                                - {moment(item?.dateEnd).format("DD")}{" "}
                                {monthNames[moment(item?.dateEnd).month()]}{" "}
                                {moment(item?.dateEnd).format("YYYY")}
                              </Text>
                            )}
                          </Flex>
                          <Flex align={"center"} gap="2">
                            <FiClock />
                            <Text size={"sm"}>{item?.time}</Text>
                            <Text size="sm"> - {item?.timeEnd}</Text>
                          </Flex>
                          <Flex align={"center"} gap={2}>
                            <FiMapPin />
                            <Text size={"sm"}>{item?.address || "Zoom"}</Text>
                          </Flex>
                          <Flex justify={"space-between"} align={"center"}>
                            {/* <PriceTag price={x.price} />
              {x.sold === true ? <Text textTransform={'uppercase'} fontWeight={'medium'}>fully booked</Text> :
                today.isAfter(x?.endTicket) ?
                  <Text color={'red'} textTransform={'uppercase'} fontWeight={'medium'}>sale ended</Text>

                  :
                  <Button size={'sm'} colorScheme={value?.webConfig?.colorScheme}>Buy Ticket</Button>
              } */}
                          </Flex>
                        </Box>
                      </VStack>
                    </Box>
                  </>
                );
              })
          ) : (
            <Heading my="5" size="sm" textAlign={"center"}>
              You don't have any ticket yet in this project.
            </Heading>
          )}
        </SimpleGrid>
      ) : (
        <>
          <SimpleGrid my={5} columns={data?.length !== 0 ? [2, 3] : 1} gap="5">
            {data?.length !== 0 ? (
              data
                // ?.filter((item) =>
                //   active
                //     ? active === item?.isActive && today.isBefore(item?.dateStart)
                //     : active === item?.isActive ||
                //       today.isSameOrAfter(item?.dateStart)
                // )
                ?.map((item, index) => {
                  return (
                    <>
                      <Box pos={"relative"} key={index}>
                        <VStack
                          rounded={5}
                          borderWidth="1px"
                          p={3}
                          bgColor="white"
                          shadow={"md"}
                          align={"left"}
                          justify={"space-between"}
                          cursor={"pointer"}
                          _hover={{
                            bg: "gray.100",
                            transform: "scale(1.02)",
                            transition: "0.3s",
                            cursor: "pointer",
                          }}
                        >
                          {item.isActive === true ? (
                            <Badge
                              fontSize={9}
                              w={"fit-content"}
                              variant="solid"
                              colorScheme="green"
                            >
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              fontSize={9}
                              w={"fit-content"}
                              variant="solid"
                              colorScheme="red"
                            >
                              Inactive
                            </Badge>
                          )}
                          <Flex justify={"space-between"} align={"center"}>
                            <Heading
                              size={"sm"}
                              onClick={() => handleModal("read", item)}
                            >
                              {item?.title}
                            </Heading>
                            <Button
                              variant={"unstyled"}
                              onClick={() => handleModal("delete", item)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Flex>
                          <Box onClick={() => handleModal("read", item)}>
                            <Flex gap={2} align={"center"}>
                              <FiCalendar />
                              <Text size={"sm"}>
                                {moment(item?.dateStart).format("DD")}{" "}
                                {monthNames[moment(item?.dateStart).month()]}{" "}
                                {moment(item?.dateStart).format("YYYY")}
                              </Text>
                              {item?.dateEnd && (
                                <Text size={"sm"}>
                                  - {moment(item?.dateEnd).format("DD")}{" "}
                                  {monthNames[moment(item?.dateEnd).month()]}{" "}
                                  {moment(item?.dateEnd).format("YYYY")}
                                </Text>
                              )}
                            </Flex>
                            <Flex align={"center"} gap="2">
                              <FiClock />
                              <Text size={"sm"}>{item?.time}</Text>
                              <Text size="sm"> - {item?.timeEnd}</Text>
                            </Flex>
                            <Flex align={"center"} gap={2}>
                              <FiMapPin />
                              <Text size={"sm"}>{item?.address || "Zoom"}</Text>
                            </Flex>
                            {/* <Flex justify={"space-between"} align={"center"}> */}
                            {/* <PriceTag price={x.price} />
              {x.sold === true ? <Text textTransform={'uppercase'} fontWeight={'medium'}>fully booked</Text> :
                today.isAfter(x?.endTicket) ?
                  <Text color={'red'} textTransform={'uppercase'} fontWeight={'medium'}>sale ended</Text>

                  :
                  <Button size={'sm'} colorScheme={value?.webConfig?.colorScheme}>Buy Ticket</Button>
              } */}
                            {/* </Flex> */}
                            <Text fontSize={9} mt={2}>
                              Created by: {item.createdBy}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                    </>
                  );
                })
            ) : (
              <Heading my="5" size="sm" textAlign={"center"}>
                You don't have any ticket yet in this project.
              </Heading>
            )}
          </SimpleGrid>
        </>
      )}

      {data?.length > itemsPerPage ||
      dataSearchTicket?.length > itemsPerPage ? (
        <Center>
          <Button
            variant={"outline"}
            colorScheme="blue"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </Center>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedData?.type === "read" ? "Event Details" : "Confirm Delete"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedData?.type === "read" ? (
              <>
                <Image
                  src={
                    selectedData?.item?.thumbnail ||
                    selectedData?.item?.thumbnaill
                  }
                  aspectRatio={16 / 9}
                  objectFit={"contain"}
                  maxH={"300px"}
                />
                <Text fontWeight={"bold"} fontSize="lg">
                  {selectedData?.item?.title}
                </Text>
                <Text>{selectedData?.item?.description}</Text>
                <Flex gap={2} align={"center"}>
                  <FiCalendar />
                  <Text size={"sm"}>
                    {moment(selectedData?.item?.dateStart).format("DD")}{" "}
                    {monthNames[moment(selectedData?.item?.dateStart).month()]}{" "}
                    {moment(selectedData?.item?.dateStart).format("YYYY")}
                  </Text>
                  {selectedData?.item?.dateEnd && (
                    <Text size={"sm"}>
                      - {moment(selectedData?.item?.dateEnd).format("DD")}{" "}
                      {monthNames[moment(selectedData?.item?.dateEnd).month()]}{" "}
                      {moment(selectedData?.item?.dateEnd).format("YYYY")}
                    </Text>
                  )}
                </Flex>
                <Flex align={"center"} gap="2">
                  <FiClock />
                  <Text size={"sm"}>{selectedData?.item?.time}</Text>
                  <Text size="sm"> - {selectedData?.item?.timeEnd}</Text>
                </Flex>
                <Flex align={"center"} gap={2}>
                  <FiMapPin />
                  <Text size={"sm"}>
                    {selectedData?.item?.address || "Zoom"}
                  </Text>
                </Flex>
              </>
            ) : (
              <Text>
                Are you sure want to delete ticket{" "}
                <b>{selectedData?.item?.title}</b>?
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            {selectedData?.type === "read" ? (
              <Button
                colorScheme="blue"
                mr={3}
                leftIcon={<EditIcon />}
                onClick={() =>
                  navigate(`/ticket/edit?id=${selectedData?.item?.id}`)
                }
              >
                Edit
              </Button>
            ) : (
              <Button
                colorScheme="red"
                mr={3}
                leftIcon={<DeleteIcon />}
                onClick={() => handleDelete(selectedData?.item)}
              >
                Delete
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TicketPage;
