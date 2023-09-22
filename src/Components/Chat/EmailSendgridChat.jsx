import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  addDocumentFirebase,
  deleteDocumentFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import DropboxUploader from "../DropBox/DropboxUploader";
import RichTextEditor from "../Quill/RichTextEditor";
import { DeleteIcon } from "@chakra-ui/icons";

function EmailSendgridChat({
  dataContact,
  templateEmail,
  dataPipeline,
  price,
}) {
  const toast = useToast();
  const globalState = useUserStore();
  const modalTemplate = useDisclosure();
  const modalDelete = useDisclosure();

  const [cc, setCc] = useState("");
  const [value, setValue] = useState("");
  const [ccList, setCcList] = useState([]);
  const [dataSend, setDataSend] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSaveTemplate, setLoadingSaveTemplate] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [contentTemplate, setContentTemplate] = useState("");
  const [dataDeletion, setDataDeletion] = useState();
  const [dataTemplate, setDataTemplate] = useState({
    title: "",
    description: "",
    messages: "",
    category: "email",
    type: "contact",
  });

  const emailRef = useRef(dataContact?.email);
  const nameRef = useRef(dataContact?.name);
  const phoneRef = useRef(dataContact?.phoneNumber);

  const addCc = (email) => {
    setCcList((prevCcList) => [...prevCcList, email]);
  };

  const removeCc = (index) => {
    const updatedCcList = [...ccList];
    updatedCcList.splice(index, 1);
    setCcList(updatedCcList);
  };

  const handleContentChange = (value) => {
    setValue(value);
  };

  const handleContentTemplateChange = (value) => {
    setContentTemplate(value);
    setDataTemplate({ ...dataTemplate, messages: value });
  };

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

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
      // if (contentTemplate === "") {
      //   setValue((prevContent) => prevContent + ` ${htmlContent}`);
      // } else {
      //   setContentTemplate((prevContent) => prevContent + ` ${htmlContent}`);
      // }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataSend((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // console.log(dataContact, 'xxx')

    setLoading(true);
    const updateData = {
      title: dataSend.title,
      emailTo: emailRef.current.value,
      nameTo: nameRef.current.value,
      message: value,
      subject: dataSend.subject || "",
      nameFrom: globalState.name,
      emailFrom: globalState.email,
      projectId: globalState.currentProject,
      companyId: globalState.currentCompany,
      type: "email",
      status: "success",
    };

    const dataEmail = {
      platform_name: updateData.title.toUpperCase(),
      sender_email: updateData.emailFrom,
      recipient_email: updateData.emailTo,
      recipient_name: updateData.nameTo,
      cc: ccList,
      subject: updateData.subject || "",
      title: dataPipeline?.name || "Contact",
      message: updateData.message,
    };

    try {
      const res = await axios.post(
        "https://new-third-party.importir.com/api/email/send-message",
        dataEmail
      );
      if (res?.data?.status === true) {
        if (!value) return;
        addDocumentFirebase(
          `contacts/${dataContact.phoneNumber}-${globalState.currentProject}/messages`,
          updateData,
          updateData.companyId
        ).then(() => handleSuccess());
      } else {
        toast({
          title: "Deoapp.com",
          description: res.data.message,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error, " ini error ");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailTemplate = async () => {
    setLoadingSaveTemplate(true);
    try {
      const result = await addDocumentFirebase(
        "templates",
        dataTemplate,
        globalState.currentCompany
      );

      console.log(result);

      // toast({
      //   title: "Deoapp CRM",
      //   description: "Template Saved",
      //   duration: 3000,
      //   status: 3000,
      // });

      modalTemplate.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSaveTemplate(false);
    }
  };

  const handleSuccess = () => {
    setValue("");

    toast({
      title: "Deoapp.com",
      description: "success send email",
      status: "success",
      position: "top-right",
      isClosable: true,
    });
  };

  const handleSelectTemplateEmail = (template) => {
    const data = {
      NAME: nameRef.current.value,
      EMAIL: emailRef.current.value,
      PHONE: dataContact?.phoneNumber,
      TITLE: dataPipeline?.name,
      DESCRIPTION: dataPipeline?.description || "",
      TOTAL: price,
    };
    const replacedTemplate = template?.messages.replace(
      /\{\{(\w+)\}\}/g,
      (match, key) => {
        return `${data[key]}<br/>` || ""; // Mengganti dengan data yang sesuai, atau string kosong jika tidak ada data
      }
    );
    setValue(replacedTemplate);
  };

  const handleModalDelete = (value) => {
    modalDelete.onOpen();
    setDataDeletion(value);
  };

  const handleDeleteTemplate = async () => {
    setLoadingSaveTemplate(true);
    try {
      const result = await deleteDocumentFirebase("templates", dataDeletion.id);

      toast({
        title: "Deoapp CRM",
        description: "Template Deleted",
        status: "success",
        duration: 3000,
      });

      modalDelete.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSaveTemplate(false);
    }
  };

  const searchCompanyName = globalState?.companies?.find(
    (x) => x.id === globalState?.currentCompany
  );

  const searchProjectName = globalState?.projects?.find(
    (x) => x.id === globalState?.currentProject
  );

  const companyName = searchCompanyName?.name;
  const projectName = searchProjectName?.name;
  const projectEmail = searchProjectName?.email;

  return (
    <Stack w={"full"} spacing={3}>
      <SimpleGrid columns={[2]} gap={3}>
        <HStack>
          <Text fontSize={"sm"}>From: </Text>
          <Input
            size={"sm"}
            placeholder="Name from"
            name="nameFrom"
            value={projectName}
            onChange={handleChange}
          />
        </HStack>

        <HStack>
          <Text fontSize={"sm"}>Email: </Text>
          <Input
            size={"sm"}
            placeholder="Email from"
            name="emailFrom"
            value={projectEmail}
            onChange={handleChange}
          />
        </HStack>
      </SimpleGrid>

      <SimpleGrid columns={[2]} gap={3}>
        <HStack>
          <Text fontSize={"sm"}>To Name: </Text>
          <Input
            size={"sm"}
            placeholder="Email to"
            name="emailTo"
            defaultValue={dataContact?.name}
            ref={nameRef}
          />
        </HStack>

        <HStack>
          <Text fontSize={"sm"}>To Email: </Text>
          <Input
            size={"sm"}
            placeholder="Email to"
            name="emailTo"
            defaultValue={dataContact?.email}
            ref={emailRef}
          />
        </HStack>
      </SimpleGrid>

      <HStack>
        <Text fontSize={"sm"}>Title: </Text>
        <Input
          size={"sm"}
          placeholder="Title "
          name="title"
          onChange={handleChange}
        />
      </HStack>

      <HStack>
        <Text fontSize={"sm"}>CC: </Text>
        <Input
          size={"sm"}
          placeholder="Email CC"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
        />
        <Button colorScheme="green" size="sm" onClick={() => addCc(cc)}>
          Tambah
        </Button>
      </HStack>

      {ccList.length > 0 && (
        <Stack spacing={1}>
          {ccList.map((email, index) => (
            <HStack key={index}>
              <Text fontSize={"sm"}>{email}</Text>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => removeCc(index)}
              >
                Hapus
              </Button>
            </HStack>
          ))}
        </Stack>
      )}

      <HStack>
        <Text fontSize={"sm"}>Subject: </Text>
        <Input
          size={"sm"}
          placeholder="Subject "
          name="subject"
          onChange={handleChange}
        />
      </HStack>
      <Stack>
        <RichTextEditor value={value} onChange={handleContentChange} />
      </Stack>

      <HStack>
        <Button
          alignSelf="start"
          colorScheme="green"
          isLoading={loading}
          onClick={() => handleSave()}
        >
          Send
        </Button>
        <Button onClick={openModal} colorScheme={"green"} variant="outline">
          Upload
        </Button>
      </HStack>

      <Stack py={3}>
        <HStack pb={3}>
          <Heading size="sm">Template Message</Heading>
          <Spacer />
          <Button
            colorScheme={"green"}
            size={"sm"}
            onClick={modalTemplate.onOpen}
          >
            + Template
          </Button>
        </HStack>
        <SimpleGrid columns={3} spacing={2}>
          {templateEmail?.map((template, index) => (
            <Stack
              border={"1px"}
              borderColor={"gray.300"}
              _hover={{
                transform: "scale(1.02)",
                transition: "0.2s ease-in-out",
              }}
              rounded={5}
              key={index}
              boxShadow={"sm"}
              p={5}
              cursor={"pointer"}
            >
              <Stack onClick={() => handleSelectTemplateEmail(template)}>
                <Heading size={"xs"}>{template?.title}</Heading>
                <Text fontSize={12}>{template?.description}</Text>
              </Stack>
              <Spacer />
              <DeleteIcon
                onClick={() => handleModalDelete(template)}
                boxSize={3}
              />
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>

      <DropboxUploader
        isActive={isModalOpen}
        onClose={closeModal}
        parentPath={`/${companyName}/message/${dataContact?.id}`}
        shareLink={shareLink}
        setShareLink={handleShareLinkChange}
      />

      <Modal
        size={"xl"}
        isOpen={modalTemplate.isOpen}
        onClose={modalTemplate.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Your Template</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Template Title</FormLabel>
              <Input
                onChange={(e) =>
                  setDataTemplate({ ...dataTemplate, title: e.target.value })
                }
                placeholder="Enter template title ..."
              />
            </FormControl>
            <FormControl my={3}>
              <FormLabel>Template Description</FormLabel>
              <Input
                onChange={(e) =>
                  setDataTemplate({
                    ...dataTemplate,
                    description: e.target.value,
                  })
                }
                placeholder="Enter template description ..."
              />
            </FormControl>
            <FormLabel>Template Message</FormLabel>
            <RichTextEditor
              value={contentTemplate}
              onChange={handleContentTemplateChange}
            />
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                isLoading={loadingSaveTemplate}
                size={"sm"}
                colorScheme="green"
                // onClick={() => console.log(dataTemplate, "xxx")}
                onClick={handleSaveEmailTemplate}
              >
                Save Template
              </Button>
              <Button
                size={"sm"}
                colorScheme="red"
                onClick={modalTemplate.onClose}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        size={"xl"}
        isOpen={modalDelete.isOpen}
        onClose={modalDelete.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Template</ModalHeader>
          <ModalBody>
            <Text>Are you sure want to delete this template?</Text>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                isLoading={loadingSaveTemplate}
                size={"sm"}
                colorScheme="green"
                onClick={handleDeleteTemplate}
              >
                Yes
              </Button>
              <Button
                size={"sm"}
                colorScheme="red"
                onClick={modalDelete.onClose}
              >
                No
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default EmailSendgridChat;
