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
    useToast, // Tambahkan import untuk Checkbox
} from "@chakra-ui/react";
import { MdDelete, MdOutlinePermMedia } from "react-icons/md";
import ViewPageListing from "./ViewPageListing";
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
    setDocumentFirebase,
    uploadFile,
} from "../../Api/firebaseApi";
import useUserStore from "../../Routes/Store";
import BackButtons from "../../Components/Buttons/BackButtons";

function FormPageListing() {
    const [projectList, setProjectList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("");
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");
    const [category, setCategory] = useState([]);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [files, setFiles] = useState([]);
    const [filesImage, setFilesImage] = useState([]);
    const [details, setDetails] = useState([]);
    const [contactPerson, setContactPerson] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [modules, setModules] = useState([]); // Tambahkan state untuk checkbox modules

    const [categoryInput, setCategoryInput] = useState("");

    const { userDisplay } = useUserStore();
    const toast = useToast()



    const companyId = userDisplay.currentCompany;


    // const projectIdDummy = "LWqxaSw9jytN9MPWi1m8"

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

    useEffect(() => {
        getData();
    }, [userDisplay.currentCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const newListing = {
            title: title.toLowerCase(),
            description: description.toLowerCase(),
            category: category.map((categories) => categories.toLowerCase()),
            price: price.toLowerCase(),
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
            const resImage = await uploadFile(title, "listings", filesImage[0]);
            newListing.image = resImage;
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
                    const subValues = category;

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
                    }
                    finally{
                        setLoading(false)
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
            setProjectId("");
            setProjectName("");
            setFiles([]);
            setFilesImage([]);
            setDetails([]);
            setContactPerson("");
            setIsActive(true);
            setModules([]);
        } catch (error) {
            console.log("Terjadi kesalahan:", error);
        }
    };

    const handleProjectChange = (value) => {
        const projectFind = projectList.find((x) => x.id === value);
        setProjectId(projectFind.id);
        setProjectName(projectFind.name);
    };

    const handleCategoryChange = (e) => {
        setCategoryInput(e.target.value);
    };

    const handleCategoryAdd = () => {
        if (categoryInput.trim() !== "" && !category.includes(categoryInput)) {
            setCategory((prevCategories) => [...prevCategories, categoryInput]);
            setCategoryInput("");
        }
    };

    const handleCategoryDelete = (categories) => {
        setCategory((prevCategories) =>
            prevCategories.filter((cat) => cat !== categories)
        );
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
            setFilesImage(newFiles); // Mengubah state filesImage menjadi array baru dari selectedFiles
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

    return (
        <Stack>
            <Stack>
                <BackButtons />
            </Stack>
            <Grid
                templateColumns={{ base: "1fr", md: "1fr 2fr" }}
                gap={5}
                p={3}
                mt={5}
            >
                <VStack spacing={4} align="start">
                    <FormControl id="title" isRequired>
                        <FormLabel>Title:</FormLabel>
                        <Input
                            type="text"
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
                    <FormControl id="category">
                        <FormLabel>Kategori</FormLabel>
                        <HStack spacing={2}>
                            <Input
                                type="text"
                                value={categoryInput}
                                onChange={handleCategoryChange}
                            />
                            <Button colorScheme="teal" onClick={handleCategoryAdd}>
                                Tambah
                            </Button>
                        </HStack>
                        <Stack direction="row" spacing={2} mt={2}>
                            {category.map((category) => (
                                <Box
                                    key={category}
                                    display="flex"
                                    alignItems="center"
                                    bg="teal.100"
                                    borderRadius="md"
                                    px={2}
                                    py={1}
                                >
                                    <Text fontSize="sm">{category}</Text>
                                    <IconButton
                                        icon={<MdDelete />}
                                        variant="ghost"
                                        colorScheme="teal"
                                        size="xs"
                                        onClick={() => handleCategoryDelete(category)}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </FormControl>

                    <FormControl id="Project" isRequired>
                        <FormLabel>Project:</FormLabel>
                        <Select
                            borderRadius="lg"
                            placeholder="Project"
                            onChange={(e) => handleProjectChange(e.target.value)}
                        >
                            {projectList?.length > 0 &&
                                projectList?.map((x, index) => (
                                    <option value={x.id} key={index}>
                                        <Text textTransform={"capitalize"}>{x.name}</Text>
                                    </option>
                                ))}
                        </Select>
                    </FormControl>

                    <FormControl id="price" isRequired>
                        <FormLabel>Price:</FormLabel>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="image" isRequired>
                        <HStack>
                            {files.length > 0 && (
                                <Stack>
                                    <Image
                                        src={files[0].file}
                                        boxSize="100%"
                                        maxWidth={300}
                                        borderRadius="xl"
                                        alt={files[0].name}
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
                                <HStack cursor={"pointer"}>
                                    <Stack>
                                        <MdOutlinePermMedia />
                                    </Stack>
                                    <Text fontSize={"sm"} color="blue.600" fontStyle={"italic"}>
                                        Add Image
                                    </Text>
                                </HStack>
                            </label>
                        </Stack>
                    </FormControl>
                    {details.map((detail, index) => (
                        <HStack key={index}>
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
                            <IconButton
                                icon={<MdDelete />}
                                aria-label="Remove Detail"
                                onClick={() => handleRemoveDetail(index)}
                            />
                        </HStack>
                    ))}
                    <Button colorScheme="teal" onClick={handleAddDetail}>
                        Add Detail
                    </Button>
                    <FormControl id="contactPerson" isRequired>
                        <FormLabel>Contact Person:</FormLabel>
                        <Input
                            type="text"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                        />
                    </FormControl>
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
                        <Checkbox value="rms" onChange={handleModulesChange}>
                            RMS
                        </Checkbox>
                        <Checkbox value="listing" onChange={handleModulesChange}>
                            Listing
                        </Checkbox>
                        <Checkbox value="lms" onChange={handleModulesChange}>
                            LMS
                        </Checkbox>
                    </FormControl>
                    {!loading ? (
                        <Button colorScheme="teal" onClick={handleSubmit}>
                        Add Listing
                    </Button>
                    ) : (
                        <Button isLoading colorScheme="teal" isDisabled>
                        Add Listing
                    </Button>
                    )}
                    
                    <Divider my={4} />
                </VStack>
            </Grid>
        </Stack>
    );
}

export default FormPageListing;
