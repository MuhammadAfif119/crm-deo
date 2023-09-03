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
  Spacer, // Tambahkan import untuk Checkbox
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

const DetailProductComponent = ({
  handleNext,
  isError,
  setFormPage,
  setCheckboxPrice,
  checkboxPrice,
  handleDeleteCategory,
  handleDeleteTicket,
  handleSubmit,
  categoryDetails,
  handleCategoryChange,
  handleTicketChange,
  handleAddTicket,
  handleIncrement,
  setDetailTicket,
  ticketCounts,
}) => {
  return (
    <>
      <Stack
        align={"left"}
        w="full"
        bg={"white"}
        bgColor={"white"}
        p={[1, 1, 5]}
        spacing={5}
        borderRadius="md"
        shadow={"md"}
        my={5}
      >
        <HStack gap={5}>
          {/* <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}
                           variant={'outline'} colorScheme="blue"
                           w='fit-content'
                      >Back to Event Form</Button> */}
          <Heading size="md">
            Input your category and ticket for your event
          </Heading>
        </HStack>

        {categoryDetails.map((category, categoryIndex) => {
          return (
            <SimpleGrid columns={2} key={`category-${categoryIndex}`} gap={5}>
              <Stack>
                <Flex justify={"space-between"} align={"center"} gap="5">
                  <Heading size="md">Category {categoryIndex + 1}</Heading>
                  <Spacer />
                  {categoryIndex !== 0 && (
                    <Button
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      variant={"outline"}
                      onClick={() => handleDeleteCategory(categoryIndex)}
                    >
                      Delete Category
                    </Button>
                  )}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() => handleIncrement()}
                    variant={"outline"}
                    colorScheme="blue"
                  >
                    Add Category
                  </Button>
                </Flex>

                <FormControl
                  isRequired
                  isInvalid={isError.includes(
                    `categoryDetails[${categoryIndex}].title`
                  )}
                >
                  <FormLabel>Title</FormLabel>
                  <Input
                    onChange={(e) =>
                      handleCategoryChange(
                        categoryIndex,
                        "title",
                        e.target.value
                      )
                    }
                    value={category?.title}
                  />
                </FormControl>
                <HStack w="100%" gap="5">
                  <FormControl w="25%" id="price">
                    <FormLabel>Price Start</FormLabel>
                    <Input
                      type="number"
                      value={category?.price}
                      onChange={(e) =>
                        handleCategoryChange(
                          categoryIndex,
                          "price",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <Checkbox
                    isChecked={checkboxPrice}
                    onChange={(e) => setCheckboxPrice(e.target.checked)}
                  >
                    Add Range Price
                  </Checkbox>
                  {checkboxPrice && (
                    <FormControl w="25%" id="price">
                      <FormLabel>Price End</FormLabel>
                      <Input
                        value={category?.priceEnd}
                        type="number"
                        onChange={(e) =>
                          handleCategoryChange(
                            categoryIndex,
                            "priceEnd",
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                  )}
                </HStack>
                <FormControl>
                  <FormLabel>Details</FormLabel>
                  <Textarea
                    value={category.details}
                    onChange={(e) =>
                      handleCategoryChange(
                        categoryIndex,
                        "details",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
              </Stack>
              <Box>
                <Flex justify={"space-between"} align={"center"}>
                  <Heading size={"md"}>
                    Ticket Category {categoryIndex + 1}
                  </Heading>
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() => handleAddTicket(categoryIndex)}
                    variant={"outline"}
                    colorScheme="blue"
                  >
                    Add Ticket
                  </Button>
                </Flex>
                {Array.from({ length: ticketCounts[categoryIndex] }).map(
                  (_, ticketIndex) => {
                    return (
                      <ProductComponent
                        keyuniq={`ticket-${categoryIndex}-${ticketIndex}`}
                        categoryIndex={categoryIndex}
                        category={category}
                        ticketIndex={ticketIndex}
                        handleTicketChange={handleTicketChange}
                        handleDeleteTicket={handleDeleteTicket}
                        isError={isError}
                      />
                    );
                  }
                )}
              </Box>
            </SimpleGrid>
          );
        })}
        <Flex align="end" justify={"space-between"} mt="5">
          <Button
            leftIcon={<FiChevronLeft />}
            onClick={() => setDetailTicket(false)}
            variant={"outline"}
            colorScheme="blue"
          >
            Back to Event Form
          </Button>
          <Button
            rightIcon={<FiChevronRight />}
            onClick={() => handleNext()}
            variant={"outline"}
            colorScheme="blue"
          >
            Next
          </Button>
        </Flex>
      </Stack>
      {/* <Flex justify={'space-between'} mt='5'>
                 <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}>Back</Button>
                 {idProject ?
                      <Button onClick={() => handleSubmit('edit')}>Edit</Button>
                      :
                      <Button onClick={() => handleSubmit('create')}>Submit</Button>
                 }

            </Flex> */}
    </>
  );
};

const ProductComponent = ({
  isError,
  handleDeleteTicket,
  categoryIndex,
  ticketIndex,
  handleTicketChange,
  category,
  keyuniq,
}) => {
  return (
    <Flex
      border={"1px solid black"}
      p="5"
      rounded={5}
      gap={5}
      mt="5"
      key={keyuniq}
    >
      <Stack paddingBottom="5">
        <FormControl
          isRequired
          isInvalid={isError.includes(
            `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].title`
          )}
        >
          <FormLabel>Title</FormLabel>
          <Input
            onChange={(e) =>
              handleTicketChange(
                categoryIndex,
                ticketIndex,
                "title",
                e.target.value
              )
            }
            value={category?.tickets[ticketIndex]?.title}
          />
        </FormControl>
        <HStack>
          <FormControl
            py="5"
            isRequired
            w="33.3%"
            isInvalid={isError.includes(
              `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].price`
            )}
          >
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              onChange={(e) =>
                handleTicketChange(
                  categoryIndex,
                  ticketIndex,
                  "price",
                  e.target.value
                )
              }
              value={category?.tickets[ticketIndex]?.price}
            />
          </FormControl>
          <FormControl
            py="5"
            isRequired
            w="fit-content"
            isInvalid={isError.includes(
              `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].endTicket`
            )}
          >
            <FormLabel>End Sales Ticket</FormLabel>
            <Input
              type="date"
              onChange={(e) =>
                handleTicketChange(
                  categoryIndex,
                  ticketIndex,
                  "endTicket",
                  e.target.value
                )
              }
              value={category?.tickets[ticketIndex]?.endTicket}
            />
          </FormControl>
          <Spacer />
          <FormControl
            w="25%"
            id="price"
            isRequired
            isInvalid={isError.includes(
              `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].totalAudience`
            )}
          >
            <FormLabel>Total Audience</FormLabel>
            <Input
              type="number"
              onChange={(e) =>
                handleTicketChange(
                  categoryIndex,
                  ticketIndex,
                  "totalAudience",
                  e.target.value
                )
              }
              value={category?.tickets[ticketIndex]?.totalAudience}
            />
          </FormControl>
        </HStack>
        <FormControl
          isRequired
          isInvalid={isError.includes(
            `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].notes`
          )}
        >
          <FormLabel>Notes</FormLabel>
          <Textarea
            onChange={(e) =>
              handleTicketChange(
                categoryIndex,
                ticketIndex,
                "notes",
                e.target.value
              )
            }
            value={category?.tickets[ticketIndex]?.notes}
          />
        </FormControl>
      </Stack>
      {ticketIndex !== 0 && (
        <Flex
          w="10%"
          alignItems={"center"}
          justifyContent={"center"}
          flexDir={"column"}
        >
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant={"outline"}
            transform={"rotate(90deg)"}
            onClick={() => handleDeleteTicket(categoryIndex, ticketIndex)}
          >
            Delete Ticket
          </Button>
        </Flex>
      )}
      {/* <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box>
                 <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px' my='10'></Box>
                 <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box> */}
    </Flex>
  );
};

const FormPage = ({
  data,
  setData,
  handleSubmit,
  idProject,
  setFormPage,
  setDetailTicket,
  dataForm,
}) => {
  return (
    <Stack
      bg={"white"}
      bgColor={"white"}
      p={[1, 1, 5]}
      spacing={5}
      borderRadius="md"
      shadow={"md"}
      my="5"
    >
      <HStack align={"center"} gap={5}>
        {/* <Button leftIcon={<FiChevronLeft />} onClick={() => { setDetailTicket(true); setFormPage(false) }} variant={'outline'} colorScheme='blue' w='fit-content'>Back to Ticket Form</Button> */}
        <Heading size="md">Pick form builder for this tickets</Heading>
      </HStack>

      <Stack my="5">
        <SimpleGrid columns={[1, 2, 3]} gap={3}>
          {dataForm?.length > 0 &&
            dataForm?.map((x, index) => {
              return (
                <Stack
                  key={index}
                  borderWidth="1px"
                  p={3}
                  cursor="pointer"
                  onClick={() => setData({ ...data, formId: x.id })}
                  rounded={5}
                  borderColor={data?.formId === x.id && "black"}
                >
                  <Text>{x.title}</Text>
                  {x.category.length > 0 &&
                    x.category.map((y, index) => {
                      return <Text key={index}>{y}</Text>;
                    })}
                </Stack>
              );
            })}
        </SimpleGrid>
      </Stack>

      <Flex justify={"space-between"} mt="5">
        <Button
          leftIcon={<FiChevronLeft />}
          onClick={() => {
            setDetailTicket(true);
            setFormPage(false);
          }}
          variant={"outline"}
          colorScheme="blue"
        >
          Back to Ticket Form
        </Button>
        {idProject ? (
          <Button
            onClick={() => handleSubmit("edit")}
            variant={"outline"}
            colorScheme="blue"
          >
            Edit
          </Button>
        ) : (
          <Button
            onClick={() => handleSubmit("create")}
            variant={"outline"}
            colorScheme="blue"
          >
            {" "}
            Submit
          </Button>
        )}
      </Flex>
    </Stack>
  );
};

function FormPageProduct() {
  let [searchParams, setSearchParams] = useSearchParams();

  const idProject = searchParams.get("id");

  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]); // Initialize with an empty array
  const [filesImage, setFilesImage] = useState([]);
  const [details, setDetails] = useState([]);
  const [image, setImage] = useState("");
  const [logo, setLogo] = useState();
  const [isActive, setIsActive] = useState(true);
  const [modules, setModules] = useState([]); // Tambahkan state untuk checkbox modules
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [filesImageLogo, setFilesImageLogo] = useState([]);
  const [filesLogo, setFilesLogo] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [checkPrice, setCheckPrice] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [formPage, setFormPage] = useState(false);
  const [queries, setQueries] = useState("");
  const [priceEnd, setPriceEnd] = useState("");
  const [detailProduct, setDetailProduct] = useState(false);
  const [stock, setStock] = useState();
  const [dataForm, setDataForm] = useState();
  const globalState = useUserStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [dataProduct, setDataProduct] = useState({});
  const companyId = globalState.currentCompany;

  const projectIdDummy = "LWqxaSw9jytN9MPWi1m8";

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
    setDescription(res.description);
    setPrice(res.price);
    setFiles(res?.image || []);
    setFilesLogo(res?.logo || []);
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
          if (!docData.ticket_used || docData.ticket_used.length === 0) {
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

  const handleNext = async () => {
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
      is_active: isActive,
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

    setDataProduct(newListing);
    console.log(newListing);
    console.log(dataProduct);
    setFormPage(true);
  };

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
      is_active: isActive,
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
    const collectionName = "listings_poduct";
    const data = newListing;

    try {
      const docID = await addDocumentFirebase(
        "listings_product",
        dataProduct,
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
              { [categoryField]: categoryValues, },
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

      if (dataProduct.formId) {
        const collectionName = "forms";
        const docName = dataProduct.formId;
        const field = "product_used";
        const values = [docID];

        try {
          const result = await arrayUnionFirebase(
            "forms",
            dataProduct.formId,
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
          description: `success add new ticket with document id ${idProject}`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        navigate("/ticket");
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
      is_active: isActive,
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
            <Flex justify={"space-between"} w="full" gap={5}>
              <FormControl id="image" isRequired>
                <HStack>
                  {files?.length > 0 && (
                    <Stack>
                      <Image
                        src={idProject ? files : files[0].file}
                        boxSize="100%"
                        maxWidth={300}
                        borderRadius="xl"
                        alt={idProject ? title : files[0].name}
                        shadow="sm"
                      />
                    </Stack>
                  )}
                </HStack>

                <Stack>
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
                </Stack>
              </FormControl>

              <FormControl id="logo" isRequired>
                <HStack>
                  {filesLogo?.length > 0 && (
                    <Stack>
                      <Image
                        src={idProject ? filesLogo : filesLogo[0].file}
                        boxSize="100%"
                        maxWidth={300}
                        borderRadius="xl"
                        alt={idProject ? `${title}-logo` : filesLogo[0].name}
                        shadow="sm"
                      />
                    </Stack>
                  )}
                </HStack>

                <Stack>
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
            <FormControl id="modules" >
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

            {!idProject ? (
              // !loading ? (
              //   <Flex align={"right"} justify={"right"}>
              //     <Button
              //       variant={"outline"}
              //       colorScheme="blue"
              //       onClick={handleSubmit}
              //     >
              //       Add Listing Product
              //     </Button>
              //   </Flex>
              // ) : (
              //   <Flex align={"right"} justify={"right"}>
              //     <Button
              //       isLoading
              //       variant={"outline"}
              //       colorScheme="blue"
              //       isDisabled
              //     >
              //       Add Listing Product
              //     </Button>
              //   </Flex>
              // )
              <Button
                rightIcon={<FiChevronRight />}
                variant={"outline"}
                colorScheme="blue"
                onClick={() => handleNext()}
              >
                Next
              </Button>
            ) : !loading ? (
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
      ) : formPage === false ? (
        <DetailProductComponent
          handleNext={handleNext}
        />
      ) : (
        <FormPage
          handleSubmit={handleSubmit}
          idProject={idProject}
          setFormPage={setFormPage}
          setDetailProduct={setDetailProduct}
          dataForm={dataForm}
          setData={setDataProduct}
          data={dataProduct}
        />
      )}
    </>
  );
}

export default FormPageProduct;
