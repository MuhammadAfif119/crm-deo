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
    <Box my={[null, null, 5]}>
      <Box
        bg={"white"}
        borderRadius={"md"}
        w={"100%"}
        p={5}
        gap={4}
        shadow={"base"}
      >
        <Stack my={[null, null, 5]} alignItems={[null, "center"]}>
          <Box>
            <Heading align={"center"}>Product</Heading>
            <Heading align={"center"} mt={1}>
              {data?.title}
            </Heading>
            <HStack my={2} justifyContent={"center"}>
              {data?.tags?.map((x, i) => (
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
          <Box py={3} align={"center"}>
            <Image src={data?.thumbnailURL} boxSize="300px" objectFit="cover" />
          </Box>

          <Divider />
          <Box w={["100", null, 700]}>
            {data?.content ? (
              <div
                dangerouslySetInnerHTML={{ __html: data?.content }}
                style={{ fontSize: "13px", width: "100%", overflow: "hidden" }}
              />
            ) : (
              <></>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductSinglePage;
