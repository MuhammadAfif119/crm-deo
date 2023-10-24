/* eslint-disable jsx-a11y/iframe-has-title */
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
} from "../Home/HomeSubmenu";
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
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import { IoBrushOutline } from "react-icons/io5";
import RMSThemeSettingForm from "../../Components/Form/RMSThemeSettingForm";
import BackButtons from "../../Components/Buttons/BackButtons";

function RMSPageview() {
  const globalState = useUserStore();
  const [projectData, setProjectData] = useState();
  const user = auth?.currentUser;
  const params = useParams();

  const [linkList, setLinkList] = useState([]);

  const { onOpen, onClose, isOpen } = useDisclosure();

  const [pageData, setPageData] = useState();
  const [newFeature, setNewFeature] = useState();
  const [bannerList, setBannerList] = useState([]);
  const [progress, setProgress] = useState(0);

  const [bannerInput, setBannerInput] = useState([]);
  const [imageLogoDark, setImageLogoDark] = useState();
  const [imageLogoLight, setImageLogoLight] = useState();
  const [imageFavicon, setImageFavicon] = useState();


  const [isLoading, setIsLoading] = useState(false);

  const [uploadingOnIndex, setUploadingOnIndex] = useState(null);

  const [color, setColor] = useState("");

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    image: "",
  });


  const getDataProject = () => {
    const searchProject = globalState?.projects?.find(
      (x) => x.id === globalState?.currentProject
    );

    setProjectData(searchProject);
  };

  const getDataPage = async () => {
    const docData = await getSingleDocumentFirebase(
      "rms",
      globalState.currentProject
      // params?.id
    );
    setPageData(docData);

  };


  // console.log(pageData, "oooooo");

  // console.log(`https://rms.deoapp.com/orders/${params.id}/1`);
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

        let updateData;
        if (bannerList.length === 0) {
          updateData = {
            companyId: globalState.currentCompany,
            ...pageData,
          };
        } else {
          if (pageData?.image_dashboard?.length > 0) {
            updateData = {
              ...pageData,
              image_dashboard: [...pageData.image_dashboard, ...bannerList],
            };
          } else {
            updateData = {
              ...pageData,
              image_dashboard: bannerList,
              companyId: globalState.currentCompany,
              projectId: globalState.currentProject,
            };
          }
        }

        console.log(updateData);

        if (pageData !== undefined) {
          setDocumentFirebase(
            "rms",
            // "yuVG8dOWY1vkGuSrqhZP",
            globalState.currentProject,
            updateData
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
      color_view: color,
    });

    onClose();
  };

  const handleAddFeature = async () => {
    const existingFeatures = Array.isArray(pageData.stations)
      ? pageData.stations
      : [];

    const newFeatureList = [...existingFeatures, newFeature];
    setPageData({ ...pageData, stations: newFeatureList });
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

      // console.log(bannerInput);

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


  const handleInputBanner = (value, index) => {
    console.log(value, "ini value");
    console.log(index, "ini index");
    const newBannerList = [...bannerList];
    newBannerList[index].data = value;
    setBannerList([...newBannerList]);
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...pageData.stations];
    updatedFeatures.splice(index, 1);
    setPageData({ ...pageData, stations: updatedFeatures });
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


  const handleDeleteCurrentBanner = async (i) => {
    let newArr = pageData.image_dashboard;

    if (newArr.length > 0) {
      newArr.splice(i, 1);

      console.log(newArr);
      setPageData({ ...pageData, image_dashboard: newArr });
    }
  };




  useEffect(() => {
    // getDataOutlet();
    getDataPage();
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
                <AccordionItem my={3} borderRadius={"md"} shadow={"md"}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left" py={2}>
                        <HStack color={"gray.800"}>
                          <Icon boxSize={5} as={IoBrushOutline} />
                          <Text fontWeight={500}>Theme Layout</Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <RMSThemeSettingForm
                      onOpen={onOpen}
                      onClose={onClose}
                      isOpen={isOpen}
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
                      handleNewFeature={(e) => setNewFeature(e.target.value)}
                      handleRemoveFeature={handleRemoveFeature}
                      handleAddFeature={handleAddFeature}
                      handleInputBanner={handleInputBanner}
                      handleUploadBanner={handleUploadBanner}
                      bannerList={bannerList}
                      logoInputDark={imageLogoDark}
                      logoInputLight={imageLogoLight}
                      logoInputFavicon={imageFavicon}
                      bannerInput={bannerInput}
                      handleDeleteCurrentBanner={handleDeleteCurrentBanner}
                    // handleChangeBrandColor={handleOpenModal}
                    />
                  </AccordionPanel>
                </AccordionItem>
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
                    flex={1}
                    width={400}
                    height={800}
                    src={
                      `https://rms.deoapp.com/orders//${params.id}/1`
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

export default RMSPageview;
