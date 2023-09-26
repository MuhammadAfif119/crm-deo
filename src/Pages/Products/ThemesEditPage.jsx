import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  VStack,
  HStack,
  Spinner,
  Select,
  Checkbox,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
// import { UploadBlob } from '../../Utils/Upload';
import { HexColorPicker } from "react-colorful";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/firebase";
import useUserStore from "../../Hooks/Zustand/Store";
import {
  getSingleDocumentFirebase,
  setDocumentFirebase,
} from "../../Api/firebaseApi";
import { MdCancel, MdOutlineCancel } from "react-icons/md";

const ThemesEditPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalAddFeatures = useDisclosure();
  const [data, setData] = useState({});
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState("");
  const [uploadingActive, setUploadingActive] = useState("");
  const [activeBrand, setActiveBrand] = useState(0);
  const [bannerList, setBannerList] = useState([]);
  const [uploadingOnIndex, setUploadingOnIndex] = useState(null);
  const [newFeature, setNewFeature] = useState();

  const globalState = useUserStore();
  const { currentCompany, currentProject } = globalState;
  const navigate = useNavigate();

  const colorSchemes = [
    "blackAlpha",
    "blue",
    "cyan",
    "facebook",
    "gray",
    "green",
    "linkedin",
    "messenger",
    "orange",
    "pink",
    "purple",
    "red",
    "teal",
    "telegram",
    "twitter",
    "whatsapp",
    "whiteAlpha",
  ];

  console.log(globalState.currentProject.id);
  console.log(data, "xxx");

  const handleSave = async () => {
    if (progress) {
    }
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const updateData =
          bannerList.length === 0
            ? { companiesId: globalState.currentCompany?.id, ...data }
            : {
                ...data,
                banner: bannerList,
                companiesId: globalState.currentCompany?.id,
              };
        console.log(auth.currentUser.uid);

        setDocumentFirebase(
          "pages",
          globalState.currentProject,
          updateData
          //   globalState.currentProject
        )
          .then((response) => {
            if (response) {
              Swal.fire("Saved!", "", "success").then(() => {
                navigate("/themes");
              });
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleUpload = async (file, title, index) => {
    // if (index === undefined) {
    // 	// console.log("uploading for logo", index)
    // 	setUploadingActive(title)
    // 	const result = await UploadBlob(file, "pages", globalState.uid || "xx", file.name, setProgress)
    // 	if (title === "logo_light") {
    // 		setData({
    // 			...data,
    // 			logoLight: result.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1')
    // 		});
    // 		setUploadingActive("")
    // 	} else if (title === 'favicon') {
    // 		setData({
    // 			...data,
    // 			favicon: result.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1')
    // 		});
    // 		setUploadingActive("")
    // 	}
    // 	else {
    // 		setData({
    // 			...data,
    // 			logoDark: result.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1')
    // 		});
    // 		setUploadingActive("")
    // 	};
    // } else {
    // 	console.log('uploading for banner', index)
    // 	setUploadingOnIndex(index)
    // 	const result = await UploadBlob(file, "pages", globalState.uid || "xx", `banner_${file.name}`, setProgress)
    // 	const newBannerList = [...bannerList];
    // 	newBannerList[index].image = result.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1');
    // 	if (result) setUploadingOnIndex(null);
    // }
  };

  const handleAddFeature = async () => {
    const newFeatureList = [...data.features, newFeature];
    setData({ ...data, features: newFeatureList });

    modalAddFeatures.onClose();
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...data.features];
    updatedFeatures.splice(index, 1);
    setData({ ...data, features: updatedFeatures });
  };

  const handleModal = (type) => {
    setActiveBrand(type);
    onOpen();
  };

  const handleSaveModal = () => {
    setData({
      ...data,
      brand: {
        ...data.brand,
        [activeBrand]: color,
      },
    });
    onClose();
  };

  const handleDeleteBanner = (i) => {
    let arr = [];
    arr = bannerList;
    if (arr.length > 1) {
      arr.splice(i, 1);
      setBannerList([...arr]);
    } else {
      arr = [];
      setBannerList([...arr]);
    }
  };

  const handleInputBanner = (value, index) => {
    const newBannerList = [...bannerList];
    newBannerList[index].link = value;
    setBannerList([...newBannerList]);
  };

  const UploadingComponent = () => (
    <HStack>
      <Spinner color="teal" size="xs" />
      <Text color="teal">Uploading...</Text>
    </HStack>
  );

  const getData = async () => {
    const docData = await getSingleDocumentFirebase("pages", currentProject);
    setData(docData);
  };

  useEffect(() => {
    getData();

    // if (data) {
    //   setFeatureSelection(data.features);
    // } else {
    //   setFeatureSelection([]);
    // }
  }, [currentProject]);

  return (
    <>
      <Heading size="md">Theme</Heading>

      <Stack my={5}>
        <Heading size="sm">Logo & Branding</Heading>
        <Text size="sm">
          Add a custom logo and/or favicon, and adjust your school thumbnail
        </Text>
        <Box my={10}>
          <SimpleGrid columns={3} spacing={3} maxW="5xl">
            <Box shadow="md" bg="white" padding={3}>
              <Text fontWeight="bold">Logo Light</Text>
              <Input
                type="file"
                onChange={(e) => handleUpload(e.target.files[0], "logo_light")}
              />
              <VStack>
                <Text>Preview:</Text>
                {uploadingActive === "logo_light" ? (
                  <UploadingComponent />
                ) : null}
              </VStack>
              <Flex h={200} alignItems={"center"} justifyContent={"center"}>
                <Image w={200} src={data.logoLight} />
              </Flex>
            </Box>

            <Box shadow="md" bg="white" padding={3}>
              <Text fontWeight="bold">Logo Dark</Text>
              <Input
                type="file"
                onChange={(e) => handleUpload(e.target.files[0], "logo_dark")}
              />

              <VStack>
                <Text>Preview:</Text>
                {uploadingActive === "logo_dark" ? (
                  <UploadingComponent />
                ) : null}
              </VStack>
              <Flex h={200} alignItems={"center"} justifyContent={"center"}>
                <Image w={200} src={data.logoDark} />
              </Flex>
            </Box>
            <Box shadow="md" bg="white" padding={3}>
              <Text fontWeight="bold">Favicon</Text>
              <Input
                type="file"
                onChange={(e) => handleUpload(e.target.files[0], "favicon")}
              />
              <VStack>
                <Text>Preview:</Text>
                {uploadingActive === "favicon" ? <UploadingComponent /> : null}
              </VStack>
              <Flex h={200} alignItems={"center"} justifyContent={"center"}>
                <Image w={200} src={data.favicon} />
              </Flex>
            </Box>

            <Box shadow="md" bg="white" padding={3}>
              <Text fontWeight="bold">Website Name</Text>
              <Flex h={100} alignItems={"center"} justifyContent={"center"}>
                <Input
                  placeholder="Enter your website name ..."
                  type="text"
                  onChange={(e) =>
                    setData({ ...data, webName: e.target.value })
                  }
                />
              </Flex>
            </Box>

            <Box shadow="md" bg="white" padding={3}>
              <Text fontWeight="bold">Features</Text>
              <HStack
                spacing={3}
                my={2}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {data.features?.length > 0 ? (
                  <>
                    {data.features?.map((x, i) => (
                      <Box
                        key={i}
                        py={1}
                        px={2}
                        border={"1px"}
                        borderRadius={"sm"}
                        shadow={"base"}
                        pos={"relative"}
                        borderColor={"gray.300"}
                      >
                        <HStack>
                          <Text>{x}</Text>
                          <Icon
                            onClick={() => handleRemoveFeature(i)}
                            pos={"absolute"}
                            color={"red.300"}
                            top={-1}
                            right={-1}
                            as={MdCancel}
                            boxSize={3}
                          />
                        </HStack>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Text>No Features data</Text>
                )}
              </HStack>

              <Box align={"center"} py={3}>
                <Button
                  size={"sm"}
                  colorScheme="green"
                  onClick={modalAddFeatures.onOpen}
                >
                  Add New Feature
                </Button>
              </Box>
              {/* <Stack>
                <HStack>
                  {featureSelection.map((x, i) => (
                    <Checkbox
                      value={x}
                      isChecked={selectedFeature.includes(x)}
                      onChange={() => handleSelectFeature(x)}
                    >
                      {x}
                    </Checkbox>
                  ))}
                </HStack>
                
              </Stack> */}
            </Box>
          </SimpleGrid>
        </Box>
      </Stack>

      <Stack
        my={10}
        border={"1px"}
        borderRadius={"sm"}
        borderColor={"gray.200"}
        shadow={"md"}
        bg={"white"}
        p={3}
      >
        <Heading size="sm">Color Presets</Heading>
        <Text fontSize="sm">Choose Color palette for your brand</Text>
        <Box my={10}>
          <SimpleGrid columns={3} spacing={3} maxW="5xl">
            <Flex gap={10} shadow="md" bg="white" padding={2}>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w="10"
                bg={data?.brand ? data?.brand[1] : ""}
              ></Box>

              <Text>Brand 1 : {data?.brand ? data?.brand[1] : ""}</Text>
              <Button size="xs" onClick={() => handleModal(1)}>
                Change
              </Button>
            </Flex>
            <Flex gap={10} shadow="md" bg="white" padding={2}>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w="10"
                bg={data?.brand ? data?.brand[2] : ""}
              ></Box>
              <Text>Brand 2 : {data?.brand ? data?.brand[2] : ""}</Text>
              <Button size="xs" onClick={() => handleModal(2)}>
                Change
              </Button>
            </Flex>
            <Flex gap={10} shadow="md" bg="white" padding={2}>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w="10"
                bg={data?.brand ? data?.brand[3] : ""}
              ></Box>
              <Text>Brand 3 : {data?.brand ? data?.brand[3] : ""}</Text>
              <Button size="xs" onClick={() => handleModal(3)}>
                Change
              </Button>
            </Flex>
          </SimpleGrid>

          <Box my={5} maxW="md">
            <Heading size="sm">ColorScheme : </Heading>
            <Flex alignItems="center" gap={10} mt={3}>
              <Select
                bg="white"
                onChange={(e) =>
                  setData({
                    ...data,
                    colorScheme: e.target.value,
                  })
                }
              >
                {colorSchemes.map((x, i) => (
                  <option value={x} key={i}>
                    {x}
                  </option>
                ))}
              </Select>
              <Button
                p={5}
                colorScheme={data.colorScheme || "blackAlpha"}
                borderWidth={2}
                borderColor="gray.600"
              >
                {data.colorScheme || ""}
              </Button>
            </Flex>
          </Box>
        </Box>
      </Stack>

      {/* Domains */}
      {/* <Stack my={10}>
				<Heading size="sm">Domains</Heading>
				<Text size="sm">Choose Color palette for your brand</Text>
				<Box my={10}>
					<SimpleGrid columns={3} spacing={3} maxW="5xl">
						<Flex justifyContent='space-between' shadow='md' bg='white' padding={2}>
							<Heading size='sm'>rifqy.deoapp</Heading>
							<Button colorScheme='' variant='ghost'><RxCross2 /></Button>
						</Flex>
						<Flex justifyContent='space-between' shadow='md' bg='white' padding={2}>
							<Heading size='sm'>speedreading.id</Heading>
							<Button colorScheme='teal' variant='ghost'><RxCross2 /></Button>
						</Flex>
						<Button size='sm' onClick={onOpen}>Add New Domains</Button>
					</SimpleGrid>
				</Box>
			</Stack> */}

      <Stack my={10}>
        <Heading size="sm">Banners</Heading>
        <Text size="sm">Setup banner for your pages</Text>
        <Box my={10}>
          <SimpleGrid columns={3} spacing={3} maxW="5xl">
            {bannerList.map((item, i) => (
              <Stack key={i} shadow="md" bg="white" p={4}>
                {/* <Image alt={i} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/201211130529126a0.jpg/480px-201211130529126a0.jpg" /> */}
                <Flex justifyContent="space-between" padding={2}>
                  <Stack>
                    <Heading size="sm">Link :</Heading>
                    <Input
                      onChange={(e) => handleInputBanner(e.target.value, i)}
                      value={bannerList[i].link}
                    />
                    <Heading size="sm">Image :</Heading>
                    <Input
                      type="file"
                      onChange={(e) =>
                        handleUpload(e.target.files[0], "banner", i)
                      }
                    />
                    {i === uploadingOnIndex ? <UploadingComponent /> : null}
                    {bannerList[i].image ? (
                      <Image src={bannerList[i].image} alt="No Preview" />
                    ) : null}
                  </Stack>
                  <Button
                    colorScheme="teal"
                    variant="ghost"
                    onClick={() => handleDeleteBanner(i)}
                  >
                    <RxCross2 />
                  </Button>
                </Flex>
              </Stack>
            ))}
            {/* <Flex justifyContent='space-between' shadow='md' bg='white' padding={2}> */}
            <Button
              colorScheme="green"
              size="sm"
              onClick={() => setBannerList([...bannerList, {}])}
            >
              Add New Banner
            </Button>
            {/* </Flex> */}
          </SimpleGrid>
        </Box>
      </Stack>

      <Flex justifyContent="flex-end" p={3}>
        <Button colorScheme="green" onClick={handleSave}>
          Save
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Brand {activeBrand}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justifyContent="space-between">
              <HexColorPicker color={color} onChange={setColor} />
              <Box>
                <Box aspectRatio={1} w="10" bg={color}></Box>
                <Text>{color}</Text>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleSaveModal}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalAddFeatures.isOpen}
        onClose={modalAddFeatures.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Feature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={"Enter one new features ..."}
              onChange={(e) => setNewFeature(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleAddFeature}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ThemesEditPage;
