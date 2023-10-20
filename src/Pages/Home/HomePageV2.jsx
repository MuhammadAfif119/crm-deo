/* eslint-disable no-restricted-globals */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  ContactInput,
  dataToInput,
  FeedInput,
  LinkInput,
  ProfileSettingInput,
  ThemeInput,
} from "./HomeSubmenu";
import ProfileSettingForm from "../../Components/Form/ProfileSettingForm";
import { DeleteIcon } from "@chakra-ui/icons";
import ThemeSettingForm from "../../Components/Form/ThemeSettingForm";
import {
  addDocumentFirebase,
  deleteFileFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
  updateDocumentFirebase,
  updateProfileFirebase,
  UploadBlob,
  uploadFile,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { auth } from "../../Config/firebase";
import { uploadImage } from "../../Api/firebaseFunction";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import BackButtons from "../../Components/Buttons/BackButtons";

function HomePageV2() {
  const globalState = useUserStore();
  const [projectData, setProjectData] = useState();
  const user = auth?.currentUser;

  const [linkList, setLinkList] = useState([]);

  const { onOpen, onClose, isOpen } = useDisclosure();

  const [pageData, setPageData] = useState();
  const [newFeature, setNewFeature] = useState();
  const [bannerList, setBannerList] = useState([]);
  const [progress, setProgress] = useState(0);

  const modalSaveButton = useDisclosure();

  const [bannerInput, setBannerInput] = useState([]);
  const [imageLogoDark, setImageLogoDark] = useState();
  const [imageLogoLight, setImageLogoLight] = useState();
  const [imageFavicon, setImageFavicon] = useState();

  const [contactForm, setContactForm] = useState({
    whatsappContact: "",
    email: "",
    businessAddress: "",
  });
  const [domainPage, setDomainPage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [checkBanner, setCheckBanner] = useState(false);

  const [emailCheck, setEmailCheck] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [whatsappCheck, setWhatsappCheck] = useState(false);
  const [businessCheck, setBusinessCheck] = useState(false);
  const [uploadingOnIndex, setUploadingOnIndex] = useState(null);

  const modalAddFeatures = useDisclosure();
  const [color, setColor] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    image: "",
  });

  const [listingUsed, setListingUsed] = useState();
  const [productUsed, setProductUsed] = useState();
  // pageData?.features?.includes("product")
  const [ticketUsed, setTicketUsed] = useState();
  // pageData?.features?.includes("ticket")
  const [courseUsed, setCourseUsed] = useState();
  // pageData?.features?.includes("course")

  const getDataProject = () => {
    const searchProject = globalState?.projects?.find(
      (x) => x.id === globalState?.currentProject
    );

    setProjectData(searchProject);
  };

  const getDataPage = async () => {
    const docData = await getSingleDocumentFirebase(
      "pages",
      globalState.currentProject
    );
    setPageData(docData);
  };

  // console.log(ticketUsed);
  // console.log(productUsed);
  // console.log(courseUsed);

  const getDataDomain = async () => {
    const res = await getSingleDocumentFirebase(
      "domains",
      globalState.currentProject
    );
    setDomainPage(res);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updateProjectData = await updateDocumentFirebase(
        "projects",
        globalState.currentProject,
        {
          ...formData,
          links: linkList,
          contactDetails: {
            ...contactForm,
            whatsappActive:
              projectData?.contactDetails?.whatsappActive || false,
            emailActive: projectData?.contactDetails?.emailActive || false,
            businessAddressActive:
              projectData?.contactDetails?.businessAddressActive || false,
          },
        }
      );
      // console.log(updateProjectData, "updated");

      let updateData;
      if (bannerList.length === 0) {
        updateData = {
          companiesId: globalState.currentCompany,
          ...pageData,
        };
      } else {
        if (pageData?.banner?.length > 0) {
          updateData = {
            ...pageData,
            banner: [...pageData.banner, ...bannerList],
          };
        } else {
          updateData = {
            ...pageData,
            banner: bannerList,
            companiesId: globalState.currentCompany,
            projectsId: globalState.currentProject,
            projectId: globalState.currentProject,
          };
        }
      }

      if (pageData !== undefined) {
        setDocumentFirebase(
          "pages",
          globalState.currentProject,
          updateData
          //   globalState.currentProject
        )
          .then((response) => {
            if (response) {
              setIsLoading(false);
              modalSaveButton.onClose();
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      }

      location.reload();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormDataChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const res = (await uploadImage(e.target.files[0])).data;
    alert(res.message);
    if (res.status) {
      setFormData({ ...formData, image: res.data });
    }
  };

  const handleSaveModal = (active) => {
    setPageData({
      ...pageData,
      brand: {
        ...pageData?.brand,
        [active]: color,
      },
    });

    onClose();
  };

  const handleAddFeature = async () => {
    const existingFeatures = Array.isArray(pageData.features)
      ? pageData.features
      : [];

    const newFeatureList = [...existingFeatures, newFeature];
    setPageData({ ...pageData, features: newFeatureList });
  };

  const handleInputLinkButton = (value, index) => {
    const newLinkList = [...linkList];
    newLinkList[index].buttonText = value;
    setLinkList([...newLinkList]);
  };

  const handleInputLinkUrl = (value, index) => {
    const newLinkList = [...linkList];
    newLinkList[index].url = value;
    setLinkList([...newLinkList]);
  };

  const handleDeleteLink = (i) => {
    let arr = [];
    arr = linkList;
    if (arr?.length > 1) {
      arr?.splice(i, 1);
      setLinkList([...arr]);
    } else {
      arr = [];
      setLinkList([...arr]);
    }
  };

  const handleDeletePhoto = async () => {
    const splitArr = user?.photoURL.split("?");
    const splitSecond = splitArr[0].split("%2F");
    setIsUploading(true);
    deleteFileFirebase(user?.uid, "profile", splitSecond[2]).then(() => {
      updateProfileFirebase({ photoURL: "" }).then(() => {
        setIsUploading(false);
      });
    });

    const resultUpdate = await addDocumentFirebase(
      "logs",
      {
        activity: `delete user photo`,
        uid: globalState.uid,
        projectId: globalState.currentProject,
      },
      globalState.currentCompany
    );
    console.log(resultUpdate, "logs updated");
  };

  const handleUploadLogoLight = async (event) => {
    const { files: newFiles } = event.target;

    if (event.target.files[0]) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          // setFiles(newFileArray);
          setImageLogoLight(newFileArray);
          console.log(reader.result, "ini reader result");
          console.log(newFileArray, "ini new files");
        };
      }

      const result = await UploadBlob(
        event.target.files[0],
        "pages",
        globalState.uid || "xx",
        event.target.files[0].name,
        setProgress
      );

      const updatePageData = {
        ...pageData,
        logoLight: result.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
      };

      setPageData(updatePageData);
    }
  };

  const handleUploadLogoDark = async (event) => {
    const { files: newFiles } = event.target;

    if (event.target.files[0]) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          // setFiles(newFileArray);
          setImageLogoDark(newFileArray);
          console.log(reader.result, "ini reader result");
          console.log(newFileArray, "ini new files");
        };
      }

      const result = await UploadBlob(
        event.target.files[0],
        "pages",
        globalState.uid || "xx",
        event.target.files[0].name,
        setProgress
      );

      const updatePageData = {
        ...pageData,
        logoDark: result.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
      };

      setPageData(updatePageData);
    }
  };

  const handleUploadFavicon = async (event) => {
    const { files: newFiles } = event.target;

    if (event.target.files[0]) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          // setFiles(newFileArray);
          setImageFavicon(newFileArray);
          console.log(reader.result, "ini reader result");
          console.log(newFileArray, "ini new files");
        };
      }

      const result = await UploadBlob(
        event.target.files[0],
        "pages",
        globalState.uid || "xx",
        event.target.files[0].name,
        setProgress
      );

      const updatePageData = {
        ...pageData,
        favicon: result.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
      };

      setPageData(updatePageData);
    }
  };

  const handleUploadBanner = async (file, index) => {
    console.log("uploading for banner", index);
    const { files: newFiles } = file;
    setUploadingOnIndex(index);

    if (file) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          // setFiles(newFileArray);
          if (bannerInput.length === 0) {
            setBannerInput(newFileArray);
          } else {
            setBannerInput([...bannerInput, ...newFileArray]);
          }
          // console.log(reader.result, "ini reader result");
          // console.log(newFileArray, "ini new files");
        };
      }

      const result = await UploadBlob(
        file.files[0],
        "pages",
        globalState.uid || "xx",
        `banner_${file.files[0].name}`,
        setProgress
      );
      const newBannerList = [...bannerList];
      newBannerList[index].image = result.url.replace(
        /(\.[^.\/\\]+)$/i,
        "_800x800$1"
      );
      console.log(newBannerList);
      if (result) setUploadingOnIndex(null);
    }
  };

  // const handleInputBanner = (value, index) => {
  //   const newBannerList = [...bannerList];
  //   newBannerList[index].link = value;
  //   setBannerList([...newBannerList]);
  //   setPageData({ ...pageData, banner: bannerList });
  // };

  const handleInputBanner = (value, index) => {
    const newBannerList = [...bannerList];

    value = value?.replace(/^\/+/, "");

    newBannerList[index].link = "/" + value;

    setBannerList([...newBannerList]);

    if (value === "" || value === undefined) {
      setCheckBanner(true);
    } else {
      setCheckBanner(false);
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...pageData.features];
    updatedFeatures.splice(index, 1);
    setPageData({ ...pageData, features: updatedFeatures });
  };

  const handleDeleteBanner = (i) => {
    let arr = [];
    arr = bannerList;
    if (arr?.length > 1) {
      arr?.splice(i, 1);
      setBannerList([...arr]);
    } else {
      arr = [];
      setBannerList([...arr]);
    }
  };

  const handleCheckSwitch = (value) => {
    if (!pageData.features) {
      // If pageData.features is undefined or null, initialize it as an empty array
      setPageData({ ...pageData, features: [] });
    }

    if (pageData.features.includes(value)) {
      setPageData({
        ...pageData,
        features: pageData.features.filter((item) => item !== value),
      });
    } else {
      setPageData({
        ...pageData,
        features: [...pageData.features, value],
      });
    }
  };

  const handleDeleteCurrentBanner = async (i) => {
    let newArr = pageData.banner;

    if (newArr.length > 0) {
      newArr.splice(i, 1);

      console.log(newArr);
      setPageData({ ...pageData, banner: newArr });
    }
  };

  const handleFormChange = (value, name) => {
    if (name === "whatsapp") {
      setWhatsappCheck((prev) => !prev);
      setProjectData({
        ...projectData,
        contactDetails: {
          ...projectData.contactDetails,
          whatsappActive: value,
        },
      });
    }

    if (name === "email") {
      setEmailCheck((prev) => !prev);
      setProjectData({
        ...projectData,
        contactDetails: {
          ...projectData.contactDetails,
          emailActive: value,
        },
      });
    }

    if (name === "businessAddress") {
      setBusinessCheck((prev) => !prev);
      setProjectData({
        ...projectData,
        contactDetails: {
          ...projectData.contactDetails,
          businessAddressActive: value,
        },
      });
    }
  };

  useEffect(() => {
    getDataPage()
      .then((data) => setPageData(data))
      .catch((error) => console.error(error));
  }, [globalState.currentProject]);

  useEffect(() => {
    getDataPage();
    getDataDomain();
    getDataProject();

    return () => { };
  }, [globalState.currentProject]);

  return (
    <Stack p={[1, 1, 5]}>

      <Stack spacing={4}>

        <HStack>
        <BackButtons />
          <Heading size={"md"} fontWeight="bold">
            Home
          </Heading>
          <Spacer />
          <HStack></HStack>
        </HStack>

        <Stack
          bgColor="white"
          spacing={1}
          borderRadius="xl"
          p={3}
          m={[1, 1, 5]}
          shadow="md"
        >
          <Flex w={"100%"}>
            <Box
              w={"50%"}
              border={"1px"}
              borderRadius={"md"}
              borderColor={"gray.100"}
              shadow={"base"}
              p={5}
            >
              <Accordion allowToggle>
                {dataToInput.map((submenu, i) => {
                  return (
                    <AccordionItem
                      my={3}
                      key={i}
                      borderRadius={"md"}
                      shadow={"md"}
                    >
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left" py={2}>
                            <HStack color={"gray.800"}>
                              <Icon boxSize={5} as={submenu.icon} />
                              <Text fontWeight={500}>{submenu.name}</Text>
                            </HStack>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        {submenu.name === "Profile Settings" ? (
                          <ProfileSettingForm
                            handleUploadImage={handleUploadImage}
                            handleDeletePhoto={handleDeletePhoto}
                            setData={handleFormDataChange}
                            data={projectData}
                          />
                        ) : submenu.name === "Contacts" ? (
                          <Stack>
                            {/* <Stack
                              border={"1px"}
                              borderRadius={"md"}
                              borderColor={"gray.200"}
                              p={2}
                            >
                              <Text fontSize={"sm"}>Contact Me Button</Text>
                              <Input
                                borderRadius={"md"}
                                size={"sm"}
                                bg={"gray.50"}
                              />
                            </Stack> */}

                            <Stack
                              border={"1px"}
                              borderRadius={"md"}
                              borderColor={"gray.200"}
                              p={2}
                            >
                              <HStack>
                                <Switch
                                  name="whatsapp"
                                  isChecked={
                                    projectData?.contactDetails?.whatsappActive
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      e.target.checked,
                                      e.target.name
                                    )
                                  }
                                  size={"sm"}
                                />
                                <Text fontSize={"sm"}>Contact WhatsApp</Text>
                              </HStack>

                              {projectData?.contactDetails?.whatsappActive ===
                                true ? (
                                <Stack>
                                  <Input
                                    size={"sm"}
                                    borderRadius={"md"}
                                    placeholder={"Whatsapp Button Text"}
                                    defaultValue={
                                      projectData?.contactDetails
                                        ?.whatsappButtonText
                                    }
                                    onChange={(e) =>
                                      setContactForm({
                                        ...contactForm,
                                        whatsappButtonText: e.target.value,
                                      })
                                    }
                                  />
                                  <Input
                                    size={"sm"}
                                    borderRadius={"md"}
                                    placeholder={"08xxxxxx"}
                                    defaultValue={
                                      projectData?.contactDetails
                                        ?.whatsappContact
                                    }
                                    onChange={(e) =>
                                      setContactForm({
                                        ...contactForm,
                                        whatsappContact: e.target.value,
                                      })
                                    }
                                  />
                                </Stack>
                              ) : null}
                            </Stack>

                            <Stack
                              border={"1px"}
                              borderRadius={"md"}
                              borderColor={"gray.200"}
                              p={2}
                            >
                              <HStack>
                                <Switch
                                  name={"email"}
                                  isChecked={
                                    projectData?.contactDetails?.emailActive
                                  }
                                  onChange={(e) => {
                                    handleFormChange(
                                      e.target.checked,
                                      e.target.name
                                    );
                                  }}
                                  size={"sm"}
                                />
                                <Text fontSize={"sm"}>Contact Email</Text>
                              </HStack>

                              {projectData?.contactDetails?.emailActive ===
                                true ? (
                                <Stack>
                                  <Input
                                    size={"sm"}
                                    borderRadius={"md"}
                                    placeholder={"Email Button Text"}
                                    onChange={(e) =>
                                      setContactForm({
                                        ...contactForm,
                                        emailButtonText: e.target.value,
                                      })
                                    }
                                  />
                                  <Input
                                    size={"sm"}
                                    borderRadius={"md"}
                                    placeholder={"Enter your email"}
                                    defaultValue={projectData?.email}
                                    onChange={(e) =>
                                      setContactForm({
                                        ...contactForm,
                                        email: e.target.value,
                                      })
                                    }
                                  />
                                </Stack>
                              ) : null}
                            </Stack>

                            <Stack
                              border={"1px"}
                              borderRadius={"md"}
                              borderColor={"gray.200"}
                              p={2}
                            >
                              <HStack>
                                <Switch
                                  name="businessAddress"
                                  isChecked={
                                    projectData?.contactDetails
                                      ?.businessAddressActive
                                  }
                                  onChange={(e) =>
                                    handleFormChange(
                                      e.target.checked,
                                      e.target.name
                                    )
                                  }
                                  size={"sm"}
                                />
                                <Text fontSize={"sm"}>Business Address</Text>
                              </HStack>

                              {projectData?.contactDetails
                                ?.businessAddressActive === true && (
                                  <Textarea
                                    onChange={(e) =>
                                      setContactForm({
                                        ...contactForm,
                                        businessAddress: e.target.value,
                                      })
                                    }
                                    placeholder="Business Address"
                                  />
                                )}
                            </Stack>
                          </Stack>
                        ) : submenu.name === "Links" ? (
                          <Stack>
                            {linkList?.map((x, i) => (
                              <Stack
                                border={"1px"}
                                borderRadius={"md"}
                                borderColor={"gray.200"}
                                p={2}
                              >
                                <HStack>
                                  <Input
                                    borderRadius={"md"}
                                    size={"sm"}
                                    w={"fit-content"}
                                    bg={"gray.50"}
                                    placeholder={"Input Button Text"}
                                    value={linkList[i].buttonText}
                                    onChange={(e) =>
                                      handleInputLinkButton(e.target.value, i)
                                    }
                                  />
                                  <Spacer />
                                  <DeleteIcon
                                    cursor={"pointer"}
                                    onClick={() => handleDeleteLink(i)}
                                    boxSize={4}
                                    color={"gray.500"}
                                  />
                                </HStack>
                                <Input
                                  borderRadius={"md"}
                                  size={"sm"}
                                  bg={"gray.50"}
                                  value={linkList[i].url}
                                  defaultValue={
                                    "Input Link (ex: instagram.com/username)"
                                  }
                                  onChange={(e) =>
                                    handleInputLinkUrl(e.target.value, i)
                                  }
                                />
                              </Stack>
                            ))}
                            <Button
                              colorScheme="blue"
                              onClick={() => setLinkList([...linkList, {}])}
                            >
                              + New Link
                            </Button>
                          </Stack>
                        ) : submenu.name === "Feed" ? (
                          <Box>
                            <HStack spacing={4} justify={"center"} mb={3}>
                              <Switch
                                size={"sm"}
                                value={"product"}
                                isChecked={pageData?.features?.includes(
                                  "product"
                                )}
                                onChange={(e) =>
                                  handleCheckSwitch(e.target.value)
                                }
                              >
                                Product
                              </Switch>
                              <Switch
                                size={"sm"}
                                value={"course"}
                                isChecked={pageData?.features?.includes(
                                  "course"
                                )}
                                onChange={(e) =>
                                  handleCheckSwitch(e.target.value)
                                }
                              >
                                Course
                              </Switch>
                              <Switch
                                size={"sm"}
                                value={"ticket"}
                                // defaultChecked={ticketUsed}
                                isChecked={pageData?.features?.includes(
                                  "ticket"
                                )}
                                onChange={(e) =>
                                  handleCheckSwitch(e.target.value)
                                }
                              >
                                Ticket
                              </Switch>
                              <Switch
                                size={"sm"}
                                value={"listing"}
                                isChecked={pageData?.features?.includes(
                                  "listing"
                                )}
                                onChange={(e) =>
                                  handleCheckSwitch(e.target.value)
                                }
                              >
                                Listing
                              </Switch>
                            </HStack>
                            <Center py={5}>
                              <Text color={"gray.300"}>
                                Deactivate it in theme, edit the features and
                                delete one or some
                              </Text>
                            </Center>
                          </Box>
                        ) : submenu.name === "Theme Layout" ? (
                          <ThemeSettingForm
                            onOpen={onOpen}
                            onClose={onClose}
                            color={color}
                            data={pageData}
                            isOpen={isOpen}
                            bannerList={bannerList}
                            bannerInput={bannerInput}
                            checkBanner={checkBanner}
                            logoInputDark={imageLogoDark}
                            logoInputLight={imageLogoLight}
                            logoInputFavicon={imageFavicon}
                            setData={setPageData}
                            setBannerList={setBannerList}
                            setColor={setColor}
                            handleSaveColor={handleSaveModal}
                            handleUpload={handleUploadImage}
                            handleUploadLogoLight={handleUploadLogoLight}
                            handleUploadLogoDark={handleUploadLogoDark}
                            handleDeleteBanner={handleDeleteBanner}
                            handleUploadFavicon={handleUploadFavicon}
                            handleNewFeature={(e) =>
                              setNewFeature(e.target.value)
                            }
                            handleRemoveFeature={handleRemoveFeature}
                            handleAddFeature={handleAddFeature}
                            handleInputBanner={handleInputBanner}
                            handleUploadBanner={handleUploadBanner}
                            handleDeleteCurrentBanner={
                              handleDeleteCurrentBanner
                            }
                          // handleChangeBrandColor={handleOpenModal}
                          />
                        ) : null}
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              <Button
                isLoading={isLoading}
                colorScheme="blue"
                w={"full"}
                onClick={modalSaveButton.onOpen}
              >
                Save
              </Button>
            </Box>

            <Box w={"50%"} align={"center"}>
              <DeviceFrameset device="iPhone X">
                <Box>
                  <iframe
                    width={375}
                    height={815}
                    src={
                      domainPage?.domain
                        ? `https://${domainPage?.domain[0]}`
                        : ""
                    }
                  />
                </Box>
              </DeviceFrameset>
            </Box>
          </Flex>
        </Stack>
      </Stack>

      <Modal isOpen={modalSaveButton.isOpen} onClose={modalSaveButton.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save Changes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Finish changes and save?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              // variant={"outline"}
              size="sm"
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
            >
              Yes
            </Button>
            <Button
              // variant={"outline"}
              size="sm"
              colorScheme="red"
              mr={3}
              onClick={modalSaveButton.onClose}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default HomePageV2;
