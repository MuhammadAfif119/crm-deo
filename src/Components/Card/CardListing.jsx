import { ArrowRightIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  color,
  Flex,
  Heading,
  HStack,
  Image,
  Spacer,
  Stack,
  Text,
  Button,
  Divider,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { convertMilisecond } from "../../Utils/timeUtil";

function CardListing(props) {

  let data = {};
  if (props.data) data = props.data;
  else
    data = {
      image: "https://bit.ly/dan-abramov",
      title: "ini title",
      subTitle: [],
      createdAt: { seconds: 124124124 },
      linkTo: "",
      editLink: data.id,
      deleteLink: "",
    };

  return (
    <Box
      minH="40px"
      borderRadius="md"
      shadow="xl"
      p={3}
      border="1px"
      borderColor="#F05A28"
      width="full"
      alignItems={"flex-start"}
      justifyContent="flex-start"
    >
      <Flex direction={["column", "column", 'row']} align="center" gap={5}>
        <Image
          width="150px"
          borderRadius="lg"
          src={data?.image_url ? data.image_url : "https://bit.ly/dan-abramov"}
          alt={data.title}
        />

        <Stack spacing={1} fontSize="sm">
          <HStack>
            <Heading fontSize="md">{data.title}</Heading>

            <HStack>
              {data?.subTitle ? (
                data.subTitle.map((x) => <Text fontWeight={500}>{x}</Text>)
              ) : (
                <></>
              )}
              <Text fontWeight={500}>
                {convertMilisecond(data.createdAt.seconds)}
              </Text>
            </HStack>
          </HStack>

          <HStack>
            <Text>Category :</Text>
            <Text fontWeight={500}> {data.category}</Text>
          </HStack>

          <HStack>
            <Text>Stock :</Text>
            <Text fontWeight={500}> {data.stock}</Text>
          </HStack>

          <HStack alignItems={"flex-start"} justifyContent="flex-start">
            <Text>Stations : </Text>
            <Text fontSize={"sm"} fontWeight={500}>
              {data?.stations?.length > 0 &&
                data?.stations.map((x) => x).join(", ")}
            </Text>

            {/* <Stack spacing={0}>
              {data?.stations?.length > 0 &&
                data?.stations.map((x, index) => (
                  <Text key={index} fontSize={"sm"} fontWeight={500}>
                    - {x}
                  </Text>
                ))}
            </Stack> */}
          </HStack>

          <HStack alignItems={"flex-start"} justifyContent="flex-start">
            <Text>Outlets : </Text>
            <Stack spacing={0}>

            </Stack>
          </HStack>
        </Stack>
      </Flex>

      <Divider mt={5} />

      <Flex direction="row" justifyContent="space-evenly" mt={5}>
        <Button
          w={150}
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          onClick={() => {
            props.setModalDelete(true);
            props.setMenuID(data.id);
          }}
        >
          Delete Menu
        </Button>

        <Link to={`${data.id}/edit`}>
          <Button w={150} colorScheme="gray" leftIcon={<EditIcon />}>
            Edit Menu
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}

export default CardListing;
