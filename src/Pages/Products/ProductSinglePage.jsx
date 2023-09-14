import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleDocumentFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { formatFrice } from "../../Utils/Helper";
import BackButtons from "../../Components/Buttons/BackButtons";
import ReactQuill from "react-quill";
import RichTextEditor from "../../Components/Quill/RichTextEditor";

const ProductSinglePage = () => {
  const params = useParams();
  const toast = useToast();

  const [data, setData] = useState();
  const [value, setValue] = useState();

  const getDataProduct = async () => {
    try {
      const res = await getSingleDocumentFirebase(
        "listings_product",
        params.id
      );
      console.log(res);
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    const data = { articleContent: value };

    try {
      const res = await updateDocumentFirebase("listings_product", data);

      toast({
        duration: 3000,
        status: "success",
        title: "DeoApp CRM",
        description: "Data update",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleContentChange = (value) => {
    setValue(value);
  };

  console.log(value);

  useEffect(() => {
    getDataProduct();

    return () => {};
  }, []);

  return (
    <Box my={5}>
      <Box
        bg={"white"}
        borderRadius={"md"}
        w={"100%"}
        p={5}
        gap={4}
        shadow={"base"}
      >
        <Stack my={5} alignItems={"center"}>
          <Box>
            <Heading align={"center"}>Product</Heading>
            <Heading align={"center"} mt={1}>
              {data?.title}
            </Heading>
            <HStack my={2} justifyContent={"center"}>
              {data?.category?.map((x, i) => (
                <Text
                  fontSize={10}
                  key={i}
                  py={1}
                  px={2}
                  borderRadius={"md"}
                  bg={"#ffd600"}
                  color={"black"}
                  w={"fit-content"}
                  textTransform={"capitalize"}
                >
                  {x}
                </Text>
              ))}
            </HStack>
          </Box>
          <Box py={3}>
            <Image src={data?.image} boxSize="300px" objectFit="cover" />
          </Box>

          <Divider />
          <Center w={700}>
            {data?.articleContent ? (
              <div
                dangerouslySetInnerHTML={{ __html: data?.articleContent }}
                style={{ fontSize: "13px", width: "100%", overflow: "hidden" }}
              />
            ) : (
              <></>
            )}
          </Center>
        </Stack>

        {/* <Flex bg={"white"} borderRadius={"md"} w={"100%"} p={5} gap={4}>
        <Stack w={"30%"}>
          <Image src={data?.image} boxSize="300px" objectFit="cover" />
        </Stack>
        <Box w={"70%"}>
          <Heading size={"lg"}>Product - {data?.title}</Heading>
          <HStack my={2}>
            {data?.category?.map((x, i) => (
              <Text
                fontSize={10}
                key={i}
                py={1}
                px={2}
                borderRadius={"md"}
                bg={"#ffd600"}
                color={"black"}
                w={"fit-content"}
                textTransform={"capitalize"}
              >
                {x}
              </Text>
            ))}
          </HStack>
          <Stack my={5}>
            <Text fontWeight={"semibold"}>Description</Text>
            <Text textTransform={"capitalize"}>{data?.description}</Text>
          </Stack>

          <Stack my={3}>
            <Text fontWeight={"semibold"}>Detail Product</Text>
            <Divider />
            {data?.details?.map((x, i) => (
              <HStack key={i}>
                <Text
                  w={200}
                  fontWeight={"semibold"}
                  textTransform={"capitalize"}
                >
                  {x?.key}
                </Text>
                <Text textTransform={"capitalize"}>{x?.value}</Text>
              </HStack>
            ))}
          </Stack>
        </Box>
      </Flex> */}
        {/* <Stack>
          <RichTextEditor value={value} onChange={handleContentChange} />
        </Stack> */}
        {/* <Button onClick={() => console.log(value)} colorScheme="blue">
          Save Content
        </Button> */}
      </Box>
    </Box>
  );
};

export default ProductSinglePage;
