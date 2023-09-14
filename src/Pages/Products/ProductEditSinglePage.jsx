import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSingleDocumentFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import {
  Box,
  Button,
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

const ProductEditSinglePage = () => {
  const params = useParams();
  const toast = useToast();

  const [data, setData] = useState();
  const [value, setValue] = useState(data?.articleContent);

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

    console.log(data, "ini data");

    try {
      const res = await updateDocumentFirebase(
        "listings_product",
        params.id,
        data
      );

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

  useEffect(() => {
    getDataProduct();

    return () => {};
  }, []);

  return (
    <Box my={5}>
      <BackButtons />
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
          {/* {data?.articleContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: data?.articleContent }}
              style={{ fontSize: "13px", width: "100%", overflow: "hidden" }}
            />
          ) : (
            <></>
          )} */}
        </Stack>

        <Stack>
          <RichTextEditor
            value={data?.articleContent ? data?.articleContent : value}
            onChange={handleContentChange}
          />
        </Stack>
        <Button onClick={() => handleSave()} colorScheme="blue">
          Save Content
        </Button>
      </Box>
    </Box>
  );
};

export default ProductEditSinglePage;
