import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Divider,
  Text,
  IconButton,
  Select,
  Stack,
  Grid,
  SimpleGrid,
  Checkbox,
  Image,
  useToast,
  Container,
  Flex,
  Spacer,
  Center, // Tambahkan import untuk Checkbox
} from "@chakra-ui/react";
import { MdDelete, MdOutlinePermMedia } from "react-icons/md";
import ViewPageListing from "./ViewPageListing";
import CreatableSelece from "react-select/creatable";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";
import {
  addDocumentFirebase,
  arrayUnionFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  setDocumentFirebase,
  updateDocumentFirebase,
  uploadFile,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import BackButtons from "../../Components/Buttons/BackButtons";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import moment from "moment";
import { formatFrice } from "../../Utils/numberUtil";

function FormPageListing() {
  const toast = useToast();
  const navigate = useNavigate();
  const globalState = useUserStore();

  let [searchParams, setSearchParams] = useSearchParams();

  const [logoUrl, setLogoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [queries, setQueries] = useState("");
  const [priceEnd, setPriceEnd] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  const [files, setFiles] = useState([]); // Initialize with an empty array
  const [modules, setModules] = useState([]); // Tambahkan state untuk checkbox modules
  const [details, setDetails] = useState([]);
  const [category, setCategory] = useState([]);
  const [filesLogo, setFilesLogo] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filesImage, setFilesImage] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [filesImageLogo, setFilesImageLogo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [checkPrice, setCheckPrice] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);

  const idProject = searchParams.get("id");
  const companyId = globalState.currentCompany;

  const getProject = () => {
    const res = globalState?.projects?.find(
      (e) => e.id === globalState?.currentProject
    );
    setProjectId(res?.id);
    setProjectName(res?.name);
  };

  const getListing = async () => {
    const res = await getSingleDocumentFirebase("listings", idProject);
    setTitle(res.title);
    setContactPerson(res.contactPerson);
    setDescription(res.description);
    setPrice(res.price);
    setFiles(res?.image || []);
    setImageUrl(res?.image);
    setFilesLogo(res?.logo || []);
    setLogoUrl(res?.logo);
    setModules(res.modules);
    setIsActive(res.is_active);
    setProjectName(res.projectName);
    setPriceEnd(res.priceEnd);
    setProjectId(res.projectId);
    let cat = res.category;
    let arr = [];
    cat.map((c) => {
      arr.push({ value: c, label: c });
    });
    setSelectedCategory(arr);
    setDetails(res.details);
    if (res.priceEnd) {
      setCheckPrice(true);
    }
  };

  const getData = async () => {
    try {
      const q = query(
        collection(db, "projects"),
        where("companyId", "==", companyId),
        limit(25)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({ id: doc.id, ...docData });
        });
        setProjectList(data);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const getCategory = async () => {
    try {
      const unsubscribe = await onSnapshot(
        doc(db, "categories", globalState?.currentProject),
        (docCat) => {
          setCategories({ id: docCat.id, ...docCat.data() });
        }
      );
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  const getCategoryList = async () => {
    try {
      let arr = [];
      await Promise.all(
        categories?.data?.map(async (x) => {
          const result = await getSingleDocumentFirebase(
            `categories/${globalState?.currentProject}/${x}`,
            "data"
          );
          arr.push(...result?.category);
        })
      );
      const uniqueValues = Array.from(new Set(arr)); // Filter unique values
      setCategoryList(uniqueValues);
    } catch (error) {
      console.log(error);
    }
  };

  const getSelectedCategory = (value) => {
    setSelectedCategory(value);
  };

  const handleDBInputChange = (newValue) => {
    setQueries(newValue);
  };

  useEffect(() => {
    getData();
    getCategory();
    getCategoryList();
    getProject();
    if (idProject) {
      getListing();
    }
  }, [globalState.currentCompany, categories?.data?.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (checkPrice && priceEnd <= price) {
      setLoading(false);
      // Menampilkan pesan kesalahan atau melakukan tindakan lain sesuai kebutuhan
      return toast({
        title: "Deoapp.com",
        description: "Price Start must be lower than Price End.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
    }

    const newListing = {
      title: title,
      description: description,
      category: selectedCategory.map((categories) =>
        categories?.value.toLowerCase()
      ),
      price: price.toLowerCase(),
      priceEnd: priceEnd.toLowerCase(),
      projectId: projectId,
      projectName: projectName.toLowerCase(),
      details: details.map((detail) => ({
        key: detail.key.toLowerCase(),
        value: detail.value.toLowerCase(),
      })),
      contactPerson: contactPerson.toLowerCase(),
      is_active: isActive,
      modules: modules.map((module) => module.toLowerCase()),
    };

    if (filesImage[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}`,
        "listings",
        filesImage[0]
      );
      newListing.image = resImage;
    }
    if (filesImageLogo[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}-logo`,
        "listings",
        filesImageLogo[0]
      );
      newListing.logo = resImage;
    }

    const collectionName = "listings";
    const data = newListing;

    try {
      const docID = await addDocumentFirebase(collectionName, data, companyId);
      console.log("ID Dokumen Baru:", docID);

      if (docID) {
        const categoryCollectionName = "categories";
        const docName = projectId;
        const categoryField = "data";
        const categoryValues = modules;

        try {
          await arrayUnionFirebase(
            categoryCollectionName,
            docName,
            categoryField,
            categoryValues
          );
        } catch (error) {
          // Jika dokumen belum ada, tambahkan dokumen baru dengan nilai awal
          if (error.message.includes("No document to update")) {
            await setDocumentFirebase(
              categoryCollectionName,
              docName,
              { [categoryField]: categoryValues },
              companyId
            );
          } else {
            console.log("Terjadi kesalahan:", error);
          }
        }

        for (const module of modules) {
          const subCollectionName = `${categoryCollectionName}/${docName}/${module}`;
          const subDocName = "data";
          const subField = "category";
          const subValues = selectedCategory.map((categories) =>
            categories?.value.toLowerCase()
          );

          try {
            await arrayUnionFirebase(
              subCollectionName,
              subDocName,
              subField,
              subValues
            );
          } catch (error) {
            // Jika dokumen belum ada, tambahkan dokumen baru dengan nilai awal
            if (error.message.includes("No document to update")) {
              await setDocumentFirebase(
                subCollectionName,
                subDocName,
                { [subField]: subValues },
                companyId
              );
            } else {
              console.log("Terjadi kesalahan:", error);
            }
          } finally {
            setLoading(false);
            navigate(-1);
            toast({
              title: "Deoapp.com",
              description: "success add new listing",
              status: "success",
              position: "top-right",
              isClosable: true,
            });
          }
        }
      }

      console.log("berhasil");

      // Reset nilai input setelah submit
      setTitle("");
      setDescription("");
      setCategory([]);
      setPrice("");
      setFilesImageLogo([]);
      setFiles([]);
      setFilesImage([]);
      setFilesLogo([]);
      setDetails([]);
      setContactPerson("");
      setIsActive(true);
      setSelectedCategory([]);
      setModules([]);
      setPriceEnd("");
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;

    if (newFiles.length) {
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
          setFiles(newFileArray);

          if (i === 0) {
            setImageUrl(reader.result);
          }
        };
      }
      setFilesImage(newFiles);
    }
  };

  const handleFileLogoInputChange = (event) => {
    const { files: newFiles } = event.target;
    if (newFiles?.length) {
      const newFileArray = [...filesLogo];
      for (let i = 0; i < newFiles?.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          setFilesLogo(newFileArray);

          if (i === 0) {
            setLogoUrl(reader.result);
          }
        };
      }
      setFilesImageLogo(newFiles);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (checkPrice && priceEnd <= price) {
      setLoading(false);
      // Menampilkan pesan kesalahan atau melakukan tindakan lain sesuai kebutuhan
      return toast({
        title: "Deoapp.com",
        description: "Price Start must be lower than Price End.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
    }

    const newListing = {
      title: title,
      description: description,
      category: selectedCategory.map((categories) =>
        categories?.value.toLowerCase()
      ),
      price: price.toLowerCase(),
      priceEnd: priceEnd.toLowerCase(),
      projectId: projectId,
      projectName: projectName.toLowerCase(),
      details: details.map((detail) => ({
        key: detail.key.toLowerCase(),
        value: detail.value.toLowerCase(),
      })),
      contactPerson: contactPerson.toLowerCase(),
      is_active: isActive,
      modules: modules.map((module) => module.toLowerCase()),
    };

    if (filesImage[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}`,
        "listings",
        filesImage[0]
      );
      newListing.image = resImage;
    }
    if (filesImageLogo[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}-logo`,
        "listings",
        filesImageLogo[0]
      );
      newListing.logo = resImage;
    }
    const collectionName = "listings";
    const data = newListing;

    try {
      const docID = await updateDocumentFirebase(
        collectionName,
        idProject,
        data
      );
      console.log("ID Dokumen Baru:", docID);

      if (docID) {
        const categoryCollectionName = "categories";
        const docName = projectId;
        const categoryField = "data";
        const categoryValues = modules;

        try {
          await arrayUnionFirebase(
            categoryCollectionName,
            docName,
            categoryField,
            categoryValues
          );
        } catch (error) {
          // Jika dokumen belum ada, tambahkan dokumen baru dengan nilai awal
          if (error.message.includes("No document to update")) {
            await setDocumentFirebase(
              categoryCollectionName,
              docName,
              { [categoryField]: categoryValues },
              companyId
            );
          } else {
            console.log("Terjadi kesalahan:", error);
          }
        }

        for (const module of modules) {
          const subCollectionName = `${categoryCollectionName}/${docName}/${module}`;
          const subDocName = "data";
          const subField = "category";
          const subValues = selectedCategory.map((categories) =>
            categories?.value.toLowerCase()
          );

          try {
            await arrayUnionFirebase(
              subCollectionName,
              subDocName,
              subField,
              subValues
            );
          } catch (error) {
            // Jika dokumen belum ada, tambahkan dokumen baru dengan nilai awal
            if (error.message.includes("No document to update")) {
              await setDocumentFirebase(
                subCollectionName,
                subDocName,
                { [subField]: subValues },
                companyId
              );
            } else {
              console.log("Terjadi kesalahan:", error);
            }
          } finally {
            setLoading(false);
            navigate(-1);
            toast({
              title: "Deoapp.com",
              description: "success edit listing",
              status: "success",
              position: "top-right",
              isClosable: true,
            });
          }
        }
      }
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const handlePriceInput = (value) => {
    console.log(price, priceEnd);

    if (parseInt(value) < parseInt(price)) {
      setPriceWarning(true);
    } else {
      setPriceWarning(false);
    }

    setPriceEnd(value);
  };

  const handleAddDetail = () => {
    setDetails([...details, { key: "", value: "" }]);
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = [...details];
    updatedDetails.splice(index, 1);
    setDetails(updatedDetails);
  };

  const handleDetailChange = (index, key, value) => {
    const updatedDetails = [...details];
    updatedDetails[index] = { key, value };
    setDetails(updatedDetails);
  };

  const handleModulesChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setModules([...modules, value]);
    } else {
      const updatedModules = modules.filter((module) => module !== value);
      setModules(updatedModules);
    }
  };

  const loadOptionsDB = (category) => {
    let arr = [];
    category.map((item) => {
      arr.push({ value: item, label: item });
    });
    setCategoryData(arr);
  };

  useEffect(() => {
    loadOptionsDB(categoryList);
  }, [categoryList.length, selectedCategory.length]);

  return (
    <>
      <Stack>
        <BackButtons />
      </Stack>
      <Container
        gap={5}
        mt={0}
        maxW={"container.lg"}
        bg={"white"}
        minH={"500px"}
        bgColor={"white"}
        p={[1, 1, 5]}
        spacing={5}
        borderRadius="md"
        shadow={"md"}
        mb={2}
      >
        <Stack spacing={6} align={"left"} w="100%">
          <Flex
            justify={"space-between"}
            w="full"
            gap={5}
            justifyItems={"center"}
            alignContent={"center"}
          >
            <FormControl id="image" isRequired>
              <HStack>
                {/* {files?.length > 0 ? ( */}
                {imageUrl ? (
                  <Stack alignItems={"center"}>
                    <Image
                      src={imageUrl}
                      boxSize="100%"
                      maxWidth={300}
                      borderRadius="xl"
                      alt={idProject ? title : files[0]?.name}
                      shadow="sm"
                    />
                    <Flex>
                      <Input
                        type="file"
                        onChange={handleFileInputChange}
                        display="none"
                        id="fileInput"
                      />

                      <label htmlFor="fileInput">
                        <HStack cursor="pointer">
                          <Stack>
                            <MdOutlinePermMedia />
                          </Stack>
                          <Text
                            fontSize="sm"
                            color="blue.600"
                            fontStyle="italic"
                          >
                            Add Image thumbnail
                          </Text>
                        </HStack>
                      </label>
                    </Flex>
                  </Stack>
                ) : (
                  <Flex
                    border={"2px"}
                    borderRadius={"md"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                    h={250}
                    w={300}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Input
                      type="file"
                      onChange={handleFileInputChange}
                      display="none"
                      id="fileInput"
                    />

                    <label htmlFor="fileInput">
                      <HStack cursor="pointer">
                        <Stack>
                          <MdOutlinePermMedia />
                        </Stack>
                        <Text fontSize="sm" color="blue.600" fontStyle="italic">
                          Add Image thumbnail
                        </Text>
                      </HStack>
                    </label>
                  </Flex>
                )}
              </HStack>
            </FormControl>

            <FormControl id="logo" isRequired>
              <HStack>
                {/* {filesLogo?.length > 0 ? ( */}
                {logoUrl ? (
                  <Stack alignItems={"center"}>
                    <Image
                      src={logoUrl}
                      boxSize="100%"
                      maxWidth={300}
                      borderRadius="xl"
                      alt={idProject ? `${title}-logo` : filesLogo[0].name}
                      shadow="sm"
                    />
                    <Input
                      type="file"
                      onChange={handleFileLogoInputChange}
                      display="none"
                      id="fileInputLogo"
                    />

                    <label htmlFor="fileInputLogo">
                      <HStack cursor="pointer">
                        <Stack>
                          <MdOutlinePermMedia />
                        </Stack>
                        <Text fontSize="sm" color="blue.600" fontStyle="italic">
                          Add Image logo
                        </Text>
                      </HStack>
                    </label>
                  </Stack>
                ) : (
                  <Flex
                    border={"2px"}
                    borderRadius={"md"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                    h={250}
                    w={300}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Input
                      type="file"
                      onChange={handleFileLogoInputChange}
                      display="none"
                      id="fileInputLogo"
                    />

                    <label htmlFor="fileInputLogo">
                      <HStack cursor="pointer">
                        <Stack>
                          <MdOutlinePermMedia />
                        </Stack>
                        <Text fontSize="sm" color="blue.600" fontStyle="italic">
                          Add Image logo
                        </Text>
                      </HStack>
                    </label>
                  </Flex>
                )}
              </HStack>
            </FormControl>
          </Flex>

          <FormControl id="title" isRequired>
            <FormLabel>Title:</FormLabel>
            <Input
              type="text"
              w="100%"
              placeholder="Your title listing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel>Description:</FormLabel>
            <Textarea
              placeholder="Describe your listing"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl id="category" isRequired>
            <FormLabel>Category</FormLabel>
            <Box width={"full"}>
              <CreatableSelece
                isClearable={false}
                value={selectedCategory.filter((option) => option.value)}
                isMulti
                placeholder="Select or Create new ..."
                name="db-react-select"
                options={categoryData}
                className="react-select"
                classNamePrefix="select"
                onChange={getSelectedCategory}
                onInputChange={handleDBInputChange}
              />
            </Box>
          </FormControl>

          <FormControl mt="5" id="Project" isRequired>
            <FormLabel>Project</FormLabel>
            <Input value={projectName} variant={"unstyled"} disabled />
          </FormControl>

          <Stack>
            <Text fontWeight={500}>Price List</Text>
            <Checkbox
              isChecked={checkPrice}
              onChange={(e) => setCheckPrice(e.target.checked)}
            >
              Add Range Price
            </Checkbox>
          </Stack>

          <HStack w="100%" gap="2">
            <FormControl id="price" isRequired>
              <FormLabel>Price Start</FormLabel>
              <HStack alignItems={"center"} justifyContent="center">
                <Text>Rp.</Text>
                <Input
                  w={"auto"}
                  type="number"
                  size={"sm"}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Spacer />
                <Text fontWeight={500}>
                  Rp.{formatFrice(parseFloat(price || 0))}
                </Text>
              </HStack>
            </FormControl>

            <Center height="50px">
              <Divider
                orientation="vertical"
                fontWeight={"bold"}
                color="black"
              />
            </Center>

            {checkPrice && (
              <FormControl id="price" isRequired>
                <FormLabel>Price End</FormLabel>
                <HStack>
                  <Text>Rp.</Text>
                  <Stack>
                    <Input
                      borderColor={priceWarning ? "red" : null}
                      size={"sm"}
                      w={"auto"}
                      type="number"
                      value={priceEnd}
                      onChange={(e) => handlePriceInput(e.target.value)}
                    />
                    {priceWarning ? (
                      <Text color={"red"} fontSize={10}>
                        Price end should be greater that price start
                      </Text>
                    ) : null}
                  </Stack>
                  <Spacer />
                  <Text fontWeight={500}>
                    Rp.{formatFrice(parseFloat(priceEnd || 0))}
                  </Text>
                </HStack>
              </FormControl>
            )}
          </HStack>

          <FormControl id="contactPerson" isRequired>
            <FormLabel>Contact Person:</FormLabel>
            <Input
              type="number"
              placeholder="Phone number that the customer will contact, ex: 6287887123456"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </FormControl>

          <Grid gap={3} templateColumns={{ base: "1fr", md: "1fr 4fr" }}>
            <Stack w={"100%"}>
              <Text fontWeight={500}>Decribe your Detail Product :</Text>
            </Stack>
            <Stack>
              {details.map((detail, index) => (
                <HStack key={index} align={"center"} justify={"center"}>
                  <FormControl id={`detail-key-${index}`}>
                    <FormLabel>Key:</FormLabel>
                    <Input
                      type="text"
                      placeholder="Title detail, ex: location"
                      value={detail.key}
                      onChange={(e) =>
                        handleDetailChange(index, e.target.value, detail.value)
                      }
                    />
                  </FormControl>
                  <FormControl id={`detail-value-${index}`}>
                    <FormLabel>Value:</FormLabel>
                    <Input
                      placeholder="Value detail, ex: Jakarta selatan"
                      type="text"
                      value={detail.value}
                      onChange={(e) =>
                        handleDetailChange(index, detail.key, e.target.value)
                      }
                    />
                  </FormControl>
                  <Box pt="7">
                    <IconButton
                      icon={<MdDelete />}
                      aria-label="Remove Detail"
                      onClick={() => handleRemoveDetail(index)}
                    />
                  </Box>
                </HStack>
              ))}
            </Stack>
          </Grid>

          <Button
            variant={"outline"}
            colorScheme="blue"
            onClick={handleAddDetail}
          >
            Add Detail
          </Button>

          <FormControl id="isActive">
            <FormLabel>Is Active:</FormLabel>
            <Select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          </FormControl>

          <FormControl id="modules">
            <FormLabel>Modules:</FormLabel>
            <Checkbox
              value="rms"
              onChange={handleModulesChange}
              isChecked={modules.includes("rms")}
            >
              RMS
            </Checkbox>
            <Checkbox
              value="listing"
              onChange={handleModulesChange}
              isChecked={modules.includes("listing")}
              mx="5"
            >
              Listing
            </Checkbox>
            <Checkbox
              value="lms"
              onChange={handleModulesChange}
              isChecked={modules.includes("lms")}
            >
              LMS
            </Checkbox>
          </FormControl>

          {!idProject ? (
            !loading ? (
              <Flex align={"right"} justify={"right"}>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Add Listing
                </Button>
              </Flex>
            ) : (
              <Flex align={"right"} justify={"right"}>
                <Button isLoading colorScheme="blue" isDisabled>
                  Add Listing
                </Button>
              </Flex>
            )
          ) : !loading ? (
            <Button colorScheme="blue" onClick={handleEditSubmit}>
              Edit Listing
            </Button>
          ) : (
            <Button isLoading colorScheme="blue" isDisabled>
              Edit Listing
            </Button>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default FormPageListing;
