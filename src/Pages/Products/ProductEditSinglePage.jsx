import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { formatFrice } from "../../Utils/Helper";
import BackButtons from "../../Components/Buttons/BackButtons";
import ReactQuill from "react-quill";
import RichTextEditor from "../../Components/Quill/RichTextEditor";
import DropboxUploader from "../../Components/DropBox/DropboxUploader";
import useUserStore from "../../Hooks/Zustand/Store";

const ProductEditSinglePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const toast = useToast();

  const globalState = useUserStore();
  const [data, setData] = useState();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [title, setTitle] = useState(data?.title);
  const [value, setValue] = useState(data?.content);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);

  const getDataProduct = async () => {
    setLoading(true);
    try {
      const res = await getSingleDocumentFirebase(
        "listings_product",
        params.id
      );
      console.log(res);
      setData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const dataInput = {
      title: title || data?.title,
      content: value || data?.content,
    };

    console.log(dataInput);

    try {
      const res = await updateDocumentFirebase(
        "listings_product",
        params.id,
        dataInput
      );

      toast({
        duration: 3000,
        status: "success",
        title: "DeoApp CRM",
        description: "Data update",
      });

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShareLinkChange = (x) => {
    if (x !== "") {
      setShareLink({ link: x.link, type: x.type });
      const { link, type } = x;
      let htmlContent = "";

      if (type === "image") {
        htmlContent = `<p><img src="${link}" alt="Image" width="500px" /></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p>`;
      } else if (type === "audio") {
        htmlContent = `<p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src=${link}></iframe></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p>`;
      } else if (type === "video") {
        htmlContent = `<p><iframe class="ql-audio" frameborder="0" allowfullscreen="true" src=${link}></iframe></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p>`;
      } else {
        htmlContent = `<p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(
          link
        )}</a></p><br/> `;
      }

      setValue((prevContent) => prevContent + ` ${htmlContent}`);
      console.log(value, "ini content");
    }
  };

  const handleContentChange = (value) => {
    setValue(value);
  };

  const openModal = () => {
    setModalUploadOpen(true);
  };

  function closeModal() {
    setModalUploadOpen(false);
  }

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
            <Input
              fontSize={40}
              fontWeight={"bold"}
              variant={"flushed"}
              defaultValue={data?.title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {/* <Heading align={"center"}>Product</Heading>
            <Heading align={"center"} mt={1}>
              {data?.title}
            </Heading> */}
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
            <Image src={data?.thumbnailURL} boxSize="300px" objectFit="cover" />
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
        <Box align={"right"} my={3}>
          <Button
            onClick={openModal}
            size="sm"
            colorScheme={"blue"}
            variant="outline"
          >
            Add File
          </Button>
        </Box>
        <Stack>
          <RichTextEditor
            value={data?.content ? data?.content : value}
            onChange={handleContentChange}
          />
        </Stack>
        <Button
          isLoading={loading}
          onClick={() => handleSave()}
          colorScheme="blue"
        >
          Save Change
        </Button>
      </Box>

      <DropboxUploader
        isActive={modalUploadOpen}
        onClose={closeModal}
        parentPath={`/${globalState.currentCompanies}/docs-file`}
        shareLink={shareLink}
        setShareLink={handleShareLinkChange}
      />
    </Box>
  );
};

export default ProductEditSinglePage;
