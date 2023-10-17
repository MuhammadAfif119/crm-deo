import { ArrowRightIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { convertMilisecond } from "../../Utils/timeUtil";
import { FiCalendar } from "react-icons/fi";
import Modals from "../Modals/Modals";
import { BiPencil } from "react-icons/bi";

function BasicCardComponent(props) {
  let data;
  let { update, setUpdate, getData, navigation } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState(null);

  if (props.data) {
    data = props.data;
  } else {
    data = {
      image: "https://bit.ly/dan-abramov",
      title: "ini title",
      subTitle: [],
      time: 124124124,
      linkTo: "",
      editLink: "",
      deleteLink: "",
    };
  }

  const handleDelete = () => {
    onOpen();
    setType("deleteCourse");
  };

  return (
    <HStack
      maxH="32"
      borderRadius="md"
      p="5"
      my="3"
      width="full"
      bg="white"
      shadow="md"
      _hover={{
        transform: "scale(1.04)",
        transition: "60ms linear",
      }}
      cursor={"pointer"}
      onClick={navigation}
    >
      <Image
        width="100px"
        height="50px"
        objectFit="cover"
        src={data?.thumbnail}
        alt={data?.title}
      />
      <Box>
        <HStack>
          <Heading fontSize="md">{data?.title}</Heading>
          <Badge fontSize={8} colorScheme="blue">
            {data?.courseType}
          </Badge>
        </HStack>
        <HStack divider={<StackDivider />}>
          <Text>{data?.sections?.length} Sections</Text>
          <Text>{data?.lessons?.length} Lessons</Text>
          <HStack>
            <FiCalendar />
            {/* <Text>{convertMilisecond(data?.createdAt)}</Text> */}
          </HStack>
        </HStack>
      </Box>
      <Spacer />

      <Link to={`/courses/${data.id}`} state={data}>
        <EditIcon />
      </Link>
      <Box onClick={() => handleDelete()} cursor="pointer">
        <DeleteIcon />
      </Box>

      <Modals
        datas={data}
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        update={update}
        setUpdate={setUpdate}
        getData={getData}
      />
    </HStack>
  );
}

export default BasicCardComponent;
