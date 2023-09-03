import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { formatFrice } from "../../Utils/Helper";

function ProductCard({ item }) {
  const monthNames = moment.monthsShort();

  return (
    <Box pos={"relative"}>
      <VStack
        spacing={3}
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
        <Box p={2} align={"center"}>
          <Image w={'full'} src={item?.image} />
        </Box>
        <Flex justify={"space-between"} align={"center"}>
          <Heading size={"sm"} textTransform="capitalize">
            {item?.title} - {item?.projectName}
          </Heading>
          <Button
            variant={"unstyled"}
            onClick={() => console.log("delete", item)}
          >
            <DeleteIcon />
          </Button>
        </Flex>
        <Box>
          <Flex align={"center"} gap="2">
            <Text size={"sm"}>Stock:</Text>
            <Text size="sm">{item?.stock}</Text>
          </Flex>
          <Flex align={"center"} gap={2}>
            <Text size={"sm"}>Description: </Text>
            <Text size={"sm"}>{item?.description}</Text>
          </Flex>
        </Box>
        <Stack>
          <Heading size={"md"} color="green.500">
            Rp. {formatFrice(item.price)}
          </Heading>
        </Stack>
      </VStack>
    </Box>
  );
}

export default ProductCard;
