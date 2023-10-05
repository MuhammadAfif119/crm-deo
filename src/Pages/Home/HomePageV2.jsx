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
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { auth } from "../../Config/firebase";
import { uploadImage } from "../../Api/firebaseFunction";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

function HomePageV2() {
  const globalState = useUserStore();
  const [projectData, setProjectData] = useState();
  const user = auth?.currentUser;

  const [linkList, setLinkList] = useState([]);

  const [pageData, setPageData] = useState();
  const [uploadingOnIndex, setUploadingOnIndex] = useState(null);
  const [newFeature, setNewFeature] = useState();
  const [bannerList, setBannerList] = useState([]);
  const [progress, setProgress] = useState(0);

  const [contactForm, setContactForm] = useState({
    whatsappContact: "",
    email: "",
    businessAddress: "",
  });
  const [domainPage, setDomainPage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [emailCheck, setEmailCheck] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [whatsappCheck, setWhatsappCheck] = useState(false);
  const [businessCheck, setBusinessCheck] = useState(false);
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

  console.log(globalState.currentProject);

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
    console.log(res, "ini domain");
    setDomainPage(res);
  };

  const handleSave = () => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        setIsLoading(true);
        const updateProjectData = await updateDocumentFirebase(
          "projects",
          globalState.currentProject,
          {
            ...formData,
            links: linkList,
            contactDetails: {
              ...contactForm,
              whatsappActive: whatsappCheck,
              emailActive: emailCheck,
              businessAddressActive: businessCheck,
            },
          }
        );
        console.log(updateProjectData, "updated");

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
                Swal.fire("Saved!", "", "success");
              }
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
        setIsLoading(false);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
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

  // console.log(pageData, "xxxx");
  // console.log(bannerList, "ini baner list");

  const handleSaveModal = (active) => {
    setPageData({
      ...pageData,
      brand: {
        ...pageData?.brand,
        [active]: color,
      },
    });
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

  // console.log(formData, "xx");
  console.log(contactForm, "xxx");

  const handleUploadLogoLight = async (e) => {
    console.log(e.target.files[0]);
    const result = await UploadBlob(
      e.target.files[0],
      "pages",
      globalState.uid || "xx",
      e.target.files[0].name,
      setProgress
    );

    setPageData({
      ...pageData,
      logoLight: result.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
    });
  };

  const handleUploadLogoDark = async (e) => {
    console.log(e.target.files[0]);
    const result = await UploadBlob(
      e.target.files[0],
      "pages",
      globalState.uid || "xx",
      e.target.files[0].name,
      setProgress
    );

    setPageData({
      ...pageData,
      logoDark: result.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
    });
  };

  const handleUploadFavicon = async (e) => {
    console.log(e.target.files[0]);
    const result = await UploadBlob(
      e.target.files[0],
      "pages",
      globalState.uid || "xx",
      e.target.files[0].name,
      setProgress
    );

    setPageData({
      ...pageData,
      favicon: result.url.replace(/(\.[^.\/\\]+)$/i, "_800x800$1"),
    });
  };

  const handleUploadBanner = async (file, index) => {
    console.log("uploading for banner", index);
    setUploadingOnIndex(index);
    const result = await UploadBlob(
      file,
      "pages",
      globalState.uid || "xx",
      `banner_${file.name}`,
      setProgress
    );
    const newBannerList = [...bannerList];
    newBannerList[index].image = result.url.replace(
      /(\.[^.\/\\]+)$/i,
      "_800x800$1"
    );
    if (result) setUploadingOnIndex(null);
  };

  // const handleInputBanner = (value, index) => {
  //   const newBannerList = [...bannerList];
  //   newBannerList[index].link = value;
  //   setBannerList([...newBannerList]);
  //   setPageData({ ...pageData, banner: bannerList });
  // };

  const handleInputBanner = (value, index) => {
    const newBannerList = [...bannerList];
    newBannerList[index].link = value;
    setBannerList([...newBannerList]);
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

  useEffect(() => {
    getDataPage()
      .then((data) => setPageData(data))
      .catch((error) => console.error(error));
  }, [globalState.currentProject]);

  useEffect(() => {
    getDataPage();
    getDataDomain();
    getDataProject();

    if (pageData) {
      setTicketUsed(pageData?.features?.includes("ticket"));
      setCourseUsed(pageData?.features?.includes("course"));
      setProductUsed(pageData?.features?.includes("product"));
      setListingUsed(pageData?.features?.includes("listing"));
    }

    return () => {};
  }, [globalState.currentProject]);

  return (
    <Stack p={[1, 1, 5]}>
      <Stack spacing={4}>
        <HStack>
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
                                  defaultChecked={
                                    projectData?.contactDetails &&
                                    projectData?.contactDetails
                                      ?.whatsappActive === true
                                      ? true
                                      : false
                                  }
                                  // isChecked={whatsappCheck}
                                  onChange={() =>
                                    setWhatsappCheck((prev) => !prev)
                                  }
                                  size={"sm"}
                                />
                                <Text fontSize={"sm"}>Contact WhatsApp</Text>
                              </HStack>

                              {whatsappCheck === true ? (
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
                                    placeholder={"628xxxxxxx"}
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
                                  <Text fontSize={10}>
                                    Use country code for phone
                                  </Text>
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
                                  defaultChecked={
                                    projectData?.contactDetails?.emailActive ===
                                    true
                                      ? true
                                      : false
                                  }
                                  isChecked={emailCheck}
                                  onChange={() => {
                                    setEmailCheck((prev) => !prev);
                                  }}
                                  size={"sm"}
                                />
                                <Text fontSize={"sm"}>Contact Email</Text>
                              </HStack>

                              {emailCheck === true ? (
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
                                  defaultChecked={
                                    projectData?.contactDetails
                                      ?.businessAddressActive === true
                                      ? true
                                      : false
                                  }
                                  isChecked={businessCheck}
                                  onChange={() =>
                                    setBusinessCheck((prev) => !prev)
                                  }
                                  size={"sm"}
                                />
                                <Text fontSize={"sm"}>Business Address</Text>
                              </HStack>

                              {businessCheck === true && (
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
                                // defaultChecked={productUsed}
                                isChecked={productUsed}
                                onChange={() => setProductUsed((prev) => !prev)}
                              >
                                Product
                              </Switch>
                              <Switch
                                size={"sm"}
                                // defaultChecked={courseUsed}
                                isChecked={courseUsed}
                                onChange={() => setCourseUsed((prev) => !prev)}
                              >
                                Course
                              </Switch>
                              <Switch
                                size={"sm"}
                                // defaultChecked={ticketUsed}
                                isChecked={ticketUsed}
                                onChange={() => setTicketUsed((prev) => !prev)}
                              >
                                Ticket
                              </Switch>
                              <Switch
                                size={"sm"}
                                // defaultChecked={listingUsed}
                                isChecked={listingUsed}
                                onChange={() => setTicketUsed((prev) => !prev)}
                              >
                                Listing
                              </Switch>
                            </HStack>
                            {/* <Center shadow={"md"} py={5}>
                              <Stack align={"center"}>
                                <Text>Sell your product</Text>
                                <Button
                                  size={"xs"}
                                  colorScheme="blue"
                                  onClick={() => navigate("/products")}
                                >
                                  Create product
                                </Button>
                                <Button
                                  size={"xs"}
                                  colorScheme="blue"
                                  onClick={() => navigate("/ticket")}
                                >
                                  Create Ticket
                                </Button>
                              </Stack>
                            </Center> */}
                          </Box>
                        ) : submenu.name === "Theme Layout" ? (
                          <ThemeSettingForm
                            data={pageData}
                            setData={setPageData}
                            color={color}
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
                            bannerList={bannerList}
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
                onClick={handleSave}
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
    </Stack>
  );
}

export default HomePageV2;
