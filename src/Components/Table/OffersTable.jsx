import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Button,
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoArrowDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  deleteDocumentFirebase,
  deleteFileFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";

export const NewsTableComponent = (props) => {
  const [deleteActive, setDeleteActive] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const globalState = useUserStore();
  const handleDelete = (x) => {
    setDeleteActive(x);
    onOpen(x);
  };

  const splitArr =
    deleteActive?.thumbnail && deleteActive?.thumbnail[0]?.split("?");
  const secondSplit = splitArr && splitArr[0]?.split("%2F");
  console.log(splitArr, "secondsplit");

  const confirmDelete = async () => {
    setLoading(true);
    deleteDocumentFirebase("news", deleteActive?.id)
      .then(() => {
        const splitArr =
          deleteActive?.thumbnail && deleteActive?.thumbnail[0]?.split("?");
        const secondSplit = splitArr && splitArr[0]?.split("%2F");
        deleteFileFirebase();
        setLoading(false);

        toast({
          title: "Success",
          description: "Successfully deleted the news",
          status: "success",
          isClosable: true,
          duration: 9000,
        });
        props.getNews();
        onClose();
      })
      .catch((error) => {
        console.log(error.message);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: 9000,
        });
      });
  };

  const handleEdit = (x) => {
    navigate(`/news/edit?id=${x.id}`);
  };

  return (
    <>
      <Table {...props} bgColor={"white"}>
        <Thead>
          <Tr>
            <Th>
              <HStack spacing="3">
                <Checkbox />
              </HStack>
            </Th>
            <Th>Title</Th>
            <Th>Created at</Th>
            <Th>Created By</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.data?.map((news, index) => (
            <Tr key={index}>
              <Td>
                <HStack spacing="3">
                  <Checkbox />
                  <Image
                    w={{ base: "100%", lg: "50%" }}
                    src={news?.thumbnail}
                  />
                </HStack>
              </Td>
              <Td>{news.title}</Td>
              <Td>
                <Text color="gray.600" fontSize={10}>
                  {moment.unix(news.createdAt?.seconds).format()}
                </Text>
              </Td>
              <Td>
                <Text color="muted" fontSize={10}>
                  {news.createdBy}
                </Text>
              </Td>
              <Td w={{ base: "10%", lg: "15%" }}>
                <Badge
                  colorScheme={news.status === "published" ? "green" : "gray"}
                >
                  {news.status}
                </Badge>
              </Td>
              <Td>
                <HStack spacing="1">
                  <IconButton
                    icon={<FiTrash2 fontSize="1.25rem" />}
                    variant="ghost"
                    aria-label="Delete news"
                    onClick={() => handleDelete(news)}
                  />
                  <IconButton
                    icon={<FiEdit2 fontSize="1.25rem" />}
                    variant="ghost"
                    aria-label="Edit news"
                    onClick={() => handleEdit(news)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {deleteActive?.title}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => confirmDelete()}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
