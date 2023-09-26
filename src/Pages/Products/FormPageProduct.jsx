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
  Heading,
  Spacer,
  Center, // Tambahkan import untuk Checkbox
} from "@chakra-ui/react";
import { MdDelete, MdOutlinePermMedia } from "react-icons/md";
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
  arrayRemoveFirebase,
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
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Shipping from "../../Components/Shipment/Shipping";

function FormPageProduct() {
  let [searchParams, setSearchParams] = useSearchParams();

  const idProject = searchParams.get("id");

  const [isShipping, setIsShipping] = useState(true);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");
  const [files, setFiles] = useState([]); // Initialize with an empty array
  const [filesImage, setFilesImage] = useState([]);
  const [details, setDetails] = useState([]);
  const [formId, setFormId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [modules, setModules] = useState([]); // Tambahkan state untuk checkbox modules
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [filesImageLogo, setFilesImageLogo] = useState([]);
  const [filesLogo, setFilesLogo] = useState([]);

  const [categoryData, setCategoryData] = useState([]);
  const [checkPrice, setCheckPrice] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [formPage, setFormPage] = useState(false);
  const [queries, setQueries] = useState("");
  const [currentForm, setCurrentForm] = useState();
  const [lastFormId, setLastFormId] = useState("");
  const [priceEnd, setPriceEnd] = useState("");
  const [detailProduct, setDetailProduct] = useState(false);
  const [stock, setStock] = useState();
  const [volume, setVolume] = useState();
  const [dataForm, setDataForm] = useState();
  const globalState = useUserStore();
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const [dataProduct, setDataProduct] = useState({});
  const companyId = globalState.currentCompany;

  const projectIdDummy = "LWqxaSw9jytN9MPWi1m8";

  console.log(isShipping, "ini shipping");
  const getProject = () => {
    const res = globalState?.projects?.find(
      (e) => e.id === globalState?.currentProject
    );
    setProjectId(res?.id);
    setProjectName(res?.name);
  };

  const getListing = async () => {
    const res = await getSingleDocumentFirebase("listings_product", idProject);
    setTitle(res.title);
    setStock(res.stock);
    setWeight(res.weight);
    setVolume(res.volume);
    setDescription(res.description);
    setPrice(res.price);
    setFiles(res?.image || []);
    setFilesLogo(res?.logo || []);
    setModules(res.modules);
    setIsActive(res.is_active);
    setProjectName(res.projectName);
    setPriceEnd(res.priceEnd);
    setProjectId(res.projectId);
    setFormId(res.formId);
    setLastFormId(res.formId);

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

    //get form
    const conditions = [
      { field: "product_used", operator: "array-contains", value: idProject },
    ];
    const productForm = await getCollectionFirebase("forms", conditions);
    console.log(productForm, "product form");
    setCurrentForm(productForm);
  };

  const getDataForms = async () => {
    try {
      const q = query(
        collection(db, "forms"),
        where("projectId", "==", globalState.currentProject)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          if (
            (!docData.ticket_used || docData.ticket_used.length === 0) &&
            (!docData.product_used || docData.product_used.length === 0) &&
            (!docData.membership_used || docData.membership_used.length === 0)
          ) {
            data.push({ id: doc.id, ...docData });
          }
        });

        setDataForm(data);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
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
    getDataForms();
    if (idProject) {
      getListing();
    }
  }, [globalState.currentCompany, categories?.data?.length]);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    setLoading(true);

    const newListing = {
      title: title,
      description: description,
      type: "product",
      category: selectedCategory?.map((categories) =>
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
      stock: stock,
      weight: weight,
      volume: volume,
      is_active: isActive,
      is_shipping: isShipping,
      formId: formId,
      modules: modules.map((module) => module.toLowerCase()),
    };

    console.log(formId);

    if (filesImage[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}`,
        "listings_product",
        filesImage[0]
      );
      newListing.image = resImage;
    }
    if (filesImageLogo[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}-logo`,
        "listings_product",
        filesImageLogo[0]
      );
      newListing.logo = resImage;
    }
    const collectionName = "listings_poduct";
    const data = newListing;

    try {
      const docID = await addDocumentFirebase(
        "listings_product",
        newListing,
        companyId
      );
      console.log("ID Dokumen Baru:", docID);

      if (docID) {
        const docName = projectId;
        const categoryField = "data";
        const categoryValues = modules;

        try {
          await arrayUnionFirebase(
            "categories",
            docName,
            categoryField,
            categoryValues
          );
        } catch (error) {
          // Jika dokumen belum ada, tambahkan dokumen baru dengan nilai awal
          if (error.message.includes("No document to update")) {
            await setDocumentFirebase(
              "categories",
              docName,
              { [categoryField]: categoryValues },
              companyId
            );
          } else {
            console.log("Terjadi kesalahan:", error);
          }
        }

        for (const module of modules) {
          const subCollectionName = `categories/${docName}/${module}`;
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

      if (newListing?.formId) {
        const collectionName = "forms";
        const docName = dataProduct.formId;
        const field = "product_used";
        const values = [docID];

        try {
          const result = await arrayUnionFirebase(
            "forms",
            formId,
            field,
            values
          );
          console.log(result); // Pesan toast yang berhasil
          toast({
            title: "Deoapp.com",
            description: `success add new product with document id ${docID}`,
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          navigate("/products");
        } catch (error) {
          console.log("Terjadi kesalahan:", error);
        }
      } else {
        toast({
          title: "Deoapp.com",
          description: `success add new product with document id ${idProject}`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        navigate("/products");
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
      setStock("");
      setWeight(1000);
      setVolume(10);
      setIsActive(true);
      setSelectedCategory([]);
      setModules([]);
      setPriceEnd("");
      setFormId("");
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;

    if (newFiles.length) {
      const newFileArray = [...files];
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
        };
      }
      setFilesImageLogo(newFiles);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      stock: stock,
      weight: weight,
      is_active: isActive,
      is_shipping: isShipping,
      formId: formId || "",
      modules: modules.map((module) => module.toLowerCase()),
    };

    if (filesImage[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}`,
        "listings_product",
        filesImage[0]
      );
      newListing.image = resImage;
    }
    if (filesImageLogo[0]) {
      const resImage = await uploadFile(
        `${title}-${moment(new Date()).valueOf()}-logo`,
        "listings_product",
        filesImageLogo[0]
      );
      newListing.logo = resImage;
    }
    const collectionName = "listings_product";
    // const data = newListing;

    try {
      const docID = await updateDocumentFirebase(
        "listings_product",
        idProject,
        newListing
      );
      console.log("ID Dokumen Baru:", docID);

      if (formId !== "") {
        const getForm = await getSingleDocumentFirebase("forms", formId);

        if (!getForm.product_used || getForm.product_used?.length === 0) {
          await updateDocumentFirebase("forms", formId, {
            product_used: [idProject],
          });
        }
      }

      // if (!formId) {
      //   const newArr = await arrayUnionFirebase(
      //     "forms",
      //     formId,
      //     "product_used",
      //     [idProject]
      //   );
      // }

      if (docID && formId !== lastFormId) {
        try {
          const result = await arrayRemoveFirebase(
            "forms",
            lastFormId,
            "product_used",
            [idProject]
          );

          const newArr = await arrayUnionFirebase(
            "forms",
            formId,
            "product_used",
            [idProject]
          );

          console.log(newArr);
        } catch (error) {
          console.log(error);
        }
      }

      if (docID) {
        const categoryCollectionName = "categories";
        const docName = projectId;
        const categoryField = "data";
        const categoryValues = modules;

        try {
          await arrayUnionFirebase(
            "categories",
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

      {detailProduct === false && formPage === false ? (
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
          <VStack spacing={4} align={"left"} w="100%">
            <Flex
              justify={"space-between"}
              w="full"
              gap={5}
              justifyItems={"center"}
              alignContent={"center"}
            >
              <FormControl id="image" isRequired>
                <HStack>
                  {files?.length > 0 ? (
                    <Stack alignItems={"center"}>
                      <Image
                        src={idProject ? files : files[0].file}
                        boxSize="100%"
                        maxWidth={300}
                        borderRadius="xl"
                        alt={idProject ? title : files[0].name}
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
                  )}
                </HStack>
              </FormControl>

              <FormControl id="logo" isRequired>
                <HStack>
                  {filesLogo?.length > 0 ? (
                    <Stack alignItems={"center"}>
                      <Image
                        src={idProject ? filesLogo : filesLogo[0].file}
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
                          <Text
                            fontSize="sm"
                            color="blue.600"
                            fontStyle="italic"
                          >
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
                          <Text
                            fontSize="sm"
                            color="blue.600"
                            fontStyle="italic"
                          >
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description:</FormLabel>
              <Textarea
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
            <HStack w="100%" gap="5">
              <FormControl w="40%" id="price" isRequired>
                <FormLabel>Price Start</FormLabel>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormControl>
              <Checkbox
                isChecked={checkPrice}
                onChange={(e) => setCheckPrice(e.target.checked)}
              >
                Add Range Price
              </Checkbox>
              {checkPrice && (
                <FormControl w="40%" id="price" isRequired>
                  <FormLabel>Price End</FormLabel>
                  <Input
                    type="number"
                    value={priceEnd}
                    onChange={(e) => setPriceEnd(e.target.value)}
                  />
                </FormControl>
              )}
            </HStack>

            <HStack>
              <FormControl id="weight" isRequired>
                <FormLabel>
                  Product Weight {"("}gram{")"}
                </FormLabel>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </FormControl>
              <FormControl id="weight" isRequired>
                <FormLabel>
                  Product Volume {"("}in meter{")"}
                </FormLabel>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </FormControl>
            </HStack>

            <FormControl id="stock" isRequired>
              <FormLabel>Stock Product</FormLabel>
              <Input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </FormControl>
            {details.map((detail, index) => (
              <HStack key={index} align={"center"} justify={"center"}>
                <FormControl id={`detail-key-${index}`}>
                  <FormLabel>Key:</FormLabel>
                  <Input
                    type="text"
                    value={detail.key}
                    onChange={(e) =>
                      handleDetailChange(index, e.target.value, detail.value)
                    }
                  />
                </FormControl>
                <FormControl id={`detail-value-${index}`}>
                  <FormLabel>Value:</FormLabel>
                  <Input
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

            <FormControl id="isShipping">
              <FormLabel>Use Shipping:</FormLabel>
              <Select
                value={isShipping}
                onChange={(e) => setIsShipping(e.target.value === "true")}
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

              <Checkbox
                value="product"
                onChange={handleModulesChange}
                isChecked={modules.includes("product")}
                mx="5"
              >
                Product
              </Checkbox>

              <Checkbox
                value="CRM"
                onChange={handleModulesChange}
                isChecked={modules.includes("crm")}
              >
                CRM
              </Checkbox>
            </FormControl>

            {params.type === "edit" ? (
              <Box>
                <Text fontWeight={"semibold"} my={2}>
                  Current Form Plugged in this product
                </Text>
                {currentForm?.length > 0 ? (
                  <SimpleGrid>
                    {currentForm.map((x, i) => (
                      <Stack
                        key={i}
                        w={300}
                        borderWidth="1px"
                        p={3}
                        cursor="pointer"
                        rounded={5}
                        borderColor={"black"}
                      >
                        <Text fontWeight={"semibold"}>{x.title}</Text>
                        <HStack>
                          {x.category?.length > 0 &&
                            x.category.map((y, i) => {
                              return <Text key={i}>{y}</Text>;
                            })}
                        </HStack>
                      </Stack>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>Product is not assigned to any form</Text>
                )}
              </Box>
            ) : null}

            <Stack>
              <Box>
                <Text fontWeight={"semibold"}>
                  Choose form to display this product
                </Text>
              </Box>

              {dataForm?.length > 0 ? (
                <SimpleGrid columns={3} spacing={2}>
                  {dataForm?.map((form, i) => (
                    <Stack
                      _hover={{ transform: "scale(1.02)", transition: "0.3s" }}
                      shadow={"sm"}
                      key={i}
                      borderWidth="1px"
                      p={3}
                      cursor="pointer"
                      onClick={() => setFormId(form.id)}
                      rounded={5}
                      borderColor={formId === form.id && "black"}
                    >
                      <Text>{form.title}</Text>
                      {form.category.length > 0 &&
                        form.category.map((y, i) => {
                          return <Text key={i}>{y}</Text>;
                        })}
                    </Stack>
                  ))}
                </SimpleGrid>
              ) : (
                <Center>
                  <Stack spacing={1} align={"center"} py={2}>
                    <Text>No Form Data</Text>
                    <Text fontSize={"xs"}>
                      Either you have used all your form or you have not build
                      any form
                    </Text>
                    <Button
                      size={"xs"}
                      variant={"outline"}
                      colorScheme="blue"
                      onClick={() => navigate("/form-builder")}
                    >
                      Create Form
                    </Button>
                  </Stack>
                </Center>
              )}
            </Stack>

            {!idProject ? (
              !loading ? (
                <Flex align={"right"} justify={"right"}>
                  <Button
                    variant={"outline"}
                    colorScheme="blue"
                    onClick={handleSubmit}
                  >
                    Add Product
                  </Button>
                </Flex>
              ) : (
                <Flex align={"right"} justify={"right"}>
                  <Button
                    isLoading
                    variant={"outline"}
                    colorScheme="blue"
                    isDisabled
                  >
                    Add Product
                  </Button>
                </Flex>
              )
            ) : // <Button
            //   rightIcon={<FiChevronRight />}
            //   variant={"outline"}
            //   colorScheme="blue"
            //   onClick={() => handleNext()}
            // >
            //   Next
            // </Button>
            !loading ? (
              <Button
                variant={"outline"}
                colorScheme="blue"
                onClick={handleEditSubmit}
              >
                Edit Listing Product
              </Button>
            ) : (
              <Button
                isLoading
                variant={"outline"}
                colorScheme="blue"
                isDisabled
              >
                Edit Listing Product
              </Button>
            )}
          </VStack>
        </Container>
      ) : null}
    </>
  );
}

export default FormPageProduct;
