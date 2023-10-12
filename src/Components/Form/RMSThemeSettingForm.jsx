import { useState } from "react";
import { auth } from "../../Config/firebase";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import { MdCancel } from "react-icons/md";
import { HexColorPicker } from "react-colorful";

const RMSThemeSettingForm = ({
  data,
  setData,
  handleUploadLogoLight,
  handleUploadLogoDark,
  handleUploadFavicon,
  handleSaveColor,
  handleNewFeature,
  handleAddFeature,
  color,
  setColor,
  handleUploadBanner,
  bannerList,
  handleInputBanner,
  out,
  handleRemoveFeature,
  handleDeleteBanner,
  onOpen,
  isOpen,
  onClose,
  logoInputDark,
  logoInputLight,
  logoInputFavicon,
  bannerInput,
  setBannerList,
  handleDeleteCurrentBanner,
}) => {
  const user = auth.currentUser;

  const modalAddFeatures = useDisclosure();
  // const [bannerList, setBannerList] = useState([]);
  const [activeBrand, setActiveBrand] = useState();
  const [isUploading, setIsUploading] = useState();
  // const { onOpen, onClose, isOpen } = useDisclosure();
  const [uploadingActive, setUploadingActive] = useState("");
  const [uploadingOnIndex, setUploadingOnIndex] = useState(null);
  //   const [color, setColor] = useState();

  const handleModal = (type) => {
    setActiveBrand(type);
    onOpen();
  };

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

  const UploadingComponent = () => (
    <HStack>
      <Spinner color="teal" size="xs" />
      <Text color="teal">Uploading...</Text>
    </HStack>
  );

  return (
    <Box>
      <Box my={3} shadow="md" bg="white" padding={3}>
        <Text fontWeight="bold">Outlet Name</Text>
        <Flex h={100} alignItems={"center"} justifyContent={"center"}>
          <Input
            placeholder="Enter your outlet name ..."
            type="text"
            onChange={(e) => setData({ ...data, outletName: e.target.value })}
          />
        </Flex>
      </Box>

      <Box shadow="md" bg="white" padding={3} mb={3}>
        <Text fontWeight="bold">Stations</Text>
        <HStack
          spacing={3}
          my={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {data?.stations?.length > 0 ? (
            <>
              {data?.stations?.map((x, i) => (
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
            <Text>No Stations data</Text>
          )}
        </HStack>

        <Box align={"center"} py={3}>
          <Button
            size={"sm"}
            colorScheme="green"
            onClick={modalAddFeatures.onOpen}
          >
            Add New Station
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

      <Stack
        my={3}
        border={"1px"}
        borderRadius={"sm"}
        borderColor={"gray.200"}
        shadow={"md"}
        bg={"white"}
        p={3}
      >
        <Box>
          {/* <SimpleGrid columns={3} spacing={3}>
            <Stack align={"center"} shadow="md" bg="white" padding={2}>
              <Text align={"center"} fontWeight={500}>
                Brand 1
              </Text>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w={10}
                h={10}
                bg={data?.brand ? data?.brand[1] : ""}
              ></Box>

              <Text align={"center"}>{data?.color_view ? data?.color_view[1] : ""}</Text>
              <Button size="xs" id={1} onClick={() => handleModal(1)}>
                Change
              </Button>
            </Stack>

            <Stack align={"center"} shadow="md" bg="white" padding={2}>
              <Text align={"center"} fontWeight={500}>
                Brand 2{" "}
              </Text>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w={10}
                h={10}
                bg={data?.brand ? data?.color_view[2] : ""}
              ></Box>
              <Text align={"center"}>{data?.brand ? data?.brand[2] : ""}</Text>
              <Button size="xs" id={2} onClick={() => handleModal(2)}>
                Change
              </Button>
            </Stack>

            <Stack align={"center"} shadow="md" bg="white" padding={2}>
              <Text align={"center"} fontWeight={500}>
                Brand 3
              </Text>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w={10}
                h={10}
                bg={data?.brand ? data?.brand[3] : ""}
              ></Box>
              <Text align={"center"}>{data?.brand ? data?.brand[3] : ""}</Text>
              <Button size="xs" id={3} onClick={() => handleModal(3)}>
                Change
              </Button>
            </Stack>
          </SimpleGrid> */}

          {/* <Box my={5} maxW="md">
            <Text size="sm">ColorScheme : </Text>
            <Flex alignItems="center" gap={10} mt={3}>
              <Select
                bg="white"
                onChange={(e) =>
                  setData({
                    ...data,
                    color_view: e.target.value,
                  })
                }
              >
                {colorSchemes?.map((x, i) => (
                  <option value={x} key={i}>
                    {x}
                  </option>
                ))}
              </Select>
              <Button
                p={5}
                colorScheme={data?.color_view || "blackAlpha"}
                borderWidth={2}
                borderColor="gray.600"
              >
                {data?.color_view || ""}
              </Button>
            </Flex>
          </Box> */}

          <Stack align={"center"} shadow="md" bg="white" padding={2}>
            <Text align={"center"} fontWeight={500}>
              Color View
            </Text>
            <Box
              borderWidth={1}
              aspectRatio={1}
              w={10}
              h={10}
              bg={data?.color_view ? data?.color_view : ""}
            ></Box>

            <Text align={"center"}>
              {data?.color_view ? data?.color_view : ""}
            </Text>
            <Button size="xs" id={1} onClick={() => handleModal()}>
              Change
            </Button>
          </Stack>
        </Box>
      </Stack>

      <Stack
        border={"1px"}
        borderRadius={"sm"}
        borderColor={"gray.200"}
        shadow={"md"}
        bg={"white"}
        p={3}
        align={"center"}
      >
        <Heading size="sm">Image Dashboard</Heading>
        <Text size="sm">Setup image dashboard for your pages</Text>
        <Box>
          <SimpleGrid columns={2} spacing={2} maxW="xl">
            {data?.image_dashboard?.length > 0 ? (
              <>
                {data?.image_dashboard?.map((item, i) => (
                  <Stack key={i} shadow="md" bg="white" p={4}>
                    <Flex justifyContent="space-between" padding={2}>
                      <Stack>
                        <Heading size="sm">Data :</Heading>
                        <Text>{item.data}</Text>
                        <Heading size="sm">Image :</Heading>
                        {item?.image ? (
                          <Image src={item.image} alt="No Preview" />
                        ) : null}
                      </Stack>
                      <Button
                        size={"xs"}
                        color={"red"}
                        variant="ghost"
                        onClick={() => handleDeleteCurrentBanner(i)}
                      >
                        <RxCross2 />
                      </Button>
                    </Flex>
                  </Stack>
                ))}
              </>
            ) : null}

            {bannerList?.map((item, i) => (
              <Stack key={i} shadow="md" bg="white" p={2}>
                {/* <Image alt={i} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/201211130529126a0.jpg/480px-201211130529126a0.jpg" /> */}
                <Flex justifyContent="space-between" padding={2}>
                  <Stack>
                    <Heading size="sm">Data :</Heading>
                    <Input
                      size={"sm"}
                      onChange={(e) => handleInputBanner(e.target.value, i)}
                      value={bannerList[i]?.data}
                    />
                    <Heading size="sm">Image :</Heading>
                    <Input
                      type="file"
                      size={"sm"}
                      //   onChange={(e) =>
                      // handleUpload(e.target.files[0], "banner", i)
                      //   }
                      onChange={(e) => handleUploadBanner(e.target, i)}
                    />
                    {i === uploadingOnIndex ? <UploadingComponent /> : null}
                    {bannerList[i]?.image ? (
                      <Image
                        src={
                          bannerInput
                            ? bannerInput[i]?.file
                            : bannerList[i]?.image
                        }
                        alt="No Preview"
                      />
                    ) : null}
                  </Stack>
                  <Button
                    size={"xs"}
                    color={"red"}
                    variant="ghost"
                    onClick={() => handleDeleteBanner(i)}
                  >
                    <RxCross2 />
                  </Button>
                </Flex>
              </Stack>
            ))}
            {/* <Flex justifyContent='space-between' shadow='md' bg='white' padding={2}> */}
            {/* </Flex> */}
          </SimpleGrid>
          <Box align={"center"}>
            <Button
              colorScheme="green"
              size="sm"
              onClick={() => setBannerList([...bannerList, {}])}
            >
              Add New Banner
            </Button>
          </Box>
        </Box>
      </Stack>

      <Modal
        isOpen={modalAddFeatures.isOpen}
        onClose={modalAddFeatures.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Stations</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={"Enter one new features ..."}
              onChange={handleNewFeature}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" onClick={handleAddFeature}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Brand {activeBrand}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack align={"center"}>
              <Box>
                <HexColorPicker color={color} onChange={setColor} />
              </Box>
              <Box>
                <Box aspectRatio={1} w="10" bg={color}></Box>
                <Text>{color}</Text>
              </Box>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => {
                handleSaveColor(activeBrand);
                onClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RMSThemeSettingForm;
