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
import { HexColorInput, HexColorPicker } from "react-colorful";

const ThemeSettingForm = ({
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
  checkBanner,
  setBannerList,
  handleRemoveFeature,
  handleDeleteBanner,
  onOpen,
  isOpen,
  onClose,
  logoInputDark,
  logoInputLight,
  logoInputFavicon,
  bannerInput,
  handleDeleteCurrentBanner,
}) => {
  const user = auth.currentUser;

  const modalAddFeatures = useDisclosure();
  //   const [bannerList, setBannerList] = useState([]);
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
      <Stack>
        <Text>Logo and Branding</Text>
        <Flex w={"100%"} overflowX={"auto"} gap={2}>
          <Box
            shadow="md"
            borderRadius={"md"}
            border={"1px"}
            borderColor={"gray.300"}
            bg="white"
            padding={3}
          >
            <Text fontWeight="semibold" align={"center"} fontSize={14} mb={2}>
              Logo Light
            </Text>
            <Input
              size={"sm"}
              type="file"
              //   onChange={(e) => handleUpload(e.target.files[0], "logo_light")}
              onChange={handleUploadLogoLight}
            />
            <VStack>
              <Text fontSize={12}>Preview:</Text>
              {uploadingActive === "logo_light" ? <UploadingComponent /> : null}
            </VStack>
            <Flex h={150} alignItems={"center"} justifyContent={"center"}>
              <Image
                w={100}
                src={logoInputLight ? logoInputLight[0]?.file : data?.logoLight}
              />
            </Flex>
          </Box>

          <Box
            shadow="md"
            borderRadius={"md"}
            border={"1px"}
            borderColor={"gray.300"}
            bg="white"
            padding={3}
          >
            <Text fontWeight="semibold" align={"center"} fontSize={14} mb={2}>
              Logo Dark
            </Text>
            <Input
              size={"sm"}
              type="file"
              //   onChange={(e) => handleUpload(e.target.files[0], "logo_dark")}
              onChange={handleUploadLogoDark}
            />

            <VStack>
              <Text fontSize={12}>Preview:</Text>
              {uploadingActive === "logo_dark" ? <UploadingComponent /> : null}
            </VStack>
            <Flex h={150} alignItems={"center"} justifyContent={"center"}>
              <Image
                w={100}
                src={logoInputDark ? logoInputDark[0]?.file : data?.logoDark}
              />
            </Flex>
          </Box>
          <Box
            shadow="md"
            borderRadius={"md"}
            border={"1px"}
            borderColor={"gray.300"}
            bg="white"
            padding={3}
          >
            <Text fontWeight="semibold" align={"center"} fontSize={14} mb={2}>
              Favicon
            </Text>
            <Input
              size={"sm"}
              type="file"
              // onChange={(e) => handleUpload(e.target.files[0], "favicon")}
              onChange={handleUploadFavicon}
            />
            <VStack>
              <Text fontSize={12}>Preview:</Text>
              {uploadingActive === "favicon" ? <UploadingComponent /> : null}
            </VStack>
            <Flex h={150} alignItems={"center"} justifyContent={"center"}>
              <Image
                w={100}
                src={
                  logoInputFavicon ? logoInputFavicon[0]?.file : data?.favicon
                }
              />
            </Flex>
          </Box>
        </Flex>
      </Stack>

      <Box my={3} shadow="md" bg="white" padding={3}>
        <Text fontWeight="bold">Website Name</Text>
        <Flex h={100} alignItems={"center"} justifyContent={"center"}>
          <Input
            placeholder="Enter your website name ..."
            type="text"
            onChange={(e) => setData({ ...data, webName: e.target.value })}
          />
        </Flex>
      </Box>

      <Box shadow="md" bg="white" padding={3} mb={3}>
        <Text fontWeight="bold">Features</Text>
        <HStack
          spacing={3}
          my={2}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {data?.features?.length > 0 ? (
            <>
              {data?.features?.map((x, i) => (
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

      <Stack
        my={3}
        border={"1px"}
        borderRadius={"sm"}
        borderColor={"gray.200"}
        shadow={"md"}
        bg={"white"}
        p={3}
      >
        <Text size="sm" fontWeight={"bold"}>
          Color Presets
        </Text>
        <Text fontSize="sm">Choose Color palette for your brand</Text>
        <Box>
          <SimpleGrid columns={3} spacing={3}>
            <Stack align={"center"} shadow="md" bg="white" padding={2}>
              <Text align={"center"} fontSize={14} fontWeight={500}>
                Primary Color Themes
              </Text>
              <Text
                align={"center"}
                fontSize={12}
                fontWeight={400}
                color={"gray.500"}
              >
                Pageview main color, include navigation bar
              </Text>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w={10}
                h={10}
                bg={data?.brand ? data?.brand[1] : ""}
              ></Box>

              <Text align={"center"}>{data?.brand ? data?.brand[1] : ""}</Text>
              <Button size="xs" id={1} onClick={() => handleModal(1)}>
                Change
              </Button>
            </Stack>

            <Stack align={"center"} shadow="md" bg="white" padding={2}>
              <Text align={"center"} fontSize={14} fontWeight={500}>
                Secondary Color Themes
              </Text>
              <Text
                align={"center"}
                fontSize={12}
                fontWeight={400}
                color={"gray.500"}
              >
                Pageview secondary color, include background
              </Text>
              <Box
                borderWidth={1}
                aspectRatio={1}
                w={10}
                h={10}
                bg={data?.brand ? data?.brand[2] : ""}
              ></Box>
              <Text align={"center"}>{data?.brand ? data?.brand[2] : ""}</Text>
              <Button size="xs" id={2} onClick={() => handleModal(2)}>
                Change
              </Button>
            </Stack>

            <Stack align={"center"} shadow="md" bg="white" padding={2}>
              <Text align={"center"} fontSize={14} fontWeight={500}>
                Accent Color Themes
              </Text>
              <Text
                align={"center"}
                fontSize={12}
                fontWeight={400}
                color={"gray.500"}
              >
                Pageview accent color, include text and border icons
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
          </SimpleGrid>

          <Box my={5} maxW="md">
            <Text size="sm" align={"center"}>
              Button Color Scheme
            </Text>
            <Text
              size="sm"
              align={"center"}
              fontSize={12}
              fontWeight={400}
              color={"gray.500"}
            >
              Change all buttons color
            </Text>
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
                {colorSchemes?.map((x, i) => (
                  <option value={x} key={i}>
                    {x}
                  </option>
                ))}
              </Select>
              <Button
                p={5}
                colorScheme={data?.colorScheme || "blackAlpha"}
                borderWidth={2}
                borderColor="gray.600"
              >
                {data?.colorScheme || ""}
              </Button>
            </Flex>
          </Box>
        </Box>
      </Stack>

      <Stack
        border={"1px"}
        borderRadius={"sm"}
        borderColor={"gray.200"}
        shadow={"md"}
        bg={"white"}
        p={3}
      >
        <Heading size="sm">Banners</Heading>
        <Text size="sm">Setup banner for your pages</Text>
        <Box>
          <SimpleGrid columns={2} spacing={2} maxW="xl">
            {data?.banner?.length > 0 ? (
              <>
                {data?.banner?.map((item, i) => (
                  <Stack key={i} shadow="md" bg="white" p={4}>
                    <Flex justifyContent="space-between" padding={2}>
                      <Stack>
                        <Heading size="sm">Link :</Heading>
                        <Text>{item.link}</Text>
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
                    <HStack>
                      <Heading size="sm">Link : </Heading>
                      <Text as={"span"} fontSize={12}>
                        {"("}required{")"}
                      </Text>
                    </HStack>
                    <Input
                      borderColor={checkBanner ? "red" : null}
                      border={checkBanner ? "1px" : null}
                      size={"sm"}
                      onChange={(e) => handleInputBanner(e.target.value, i)}
                      value={bannerList[i]?.link}
                    />
                    {checkBanner ? (
                      <Text color={"red"} fontSize={12}>
                        Link cannot be empty
                      </Text>
                    ) : null}
                    <Heading size="sm">Image :</Heading>
                    <Input
                      isDisabled={checkBanner ? true : false}
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
              <HexColorInput
                className="color-input"
                placeholder={color}
                color={color}
                onChange={setColor}
              />
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

export default ThemeSettingForm;
