import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BackButtons from "../../Components/Buttons/BackButtons";
import { MdOutlinePermMedia } from "react-icons/md";
import { formatFrice } from "../../Utils/numberUtil";
import {
  addDocumentFirebase,
  arrayRemoveFirebase,
  arrayUnionFirebase,
  getSingleDocumentFirebase,
  updateDocumentFirebase,
  uploadFile,
} from "../../Api/firebaseApi";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Config/firebase";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useUserStore from "../../Hooks/Zustand/Store";

const LocationComponent = ({ type, data, setData, isError }) => {
  if (type === "offline") {
    return (
      <Box
        border={"1px"}
        borderColor={"gray.300"}
        borderRadius={"md"}
        p={3}
        my={2}
        shadow={"sm"}
      >
        <FormControl isRequired isInvalid={isError.includes("address")}>
          <FormLabel>Address</FormLabel>
          <Input
            type="text"
            id="address"
            name="address"
            onChange={(e) => setData({ ...data, address: e.target.value })}
            value={data?.address}
          />
        </FormControl>
        <FormControl mt={3} isRequired isInvalid={isError.includes("location")}>
          <FormLabel>Link Google Maps</FormLabel>
          <Input
            onChange={(e) => setData({ ...data, location: e.target.value })}
            value={data?.location}
          />
        </FormControl>
      </Box>
    );
  } else {
    return (
      <Box
        border={"1px"}
        borderColor={"gray.300"}
        borderRadius={"md"}
        p={3}
        my={2}
        shadow={"sm"}
      >
        <FormControl isRequired isInvalid={isError.includes("zoomId")}>
          <FormLabel>Zoom ID</FormLabel>
          <Input
            onChange={(e) => setData({ ...data, zoomId: e.target.value })}
            value={data?.zoomId}
          />
        </FormControl>
      </Box>
    );
  }
};

// const TicketComponent = ({
//   isError,
//   handleDeleteTicket,
//   categoryIndex,
//   ticketIndex,
//   handleTicketChange,
//   category,
//   keyuniq,
// }) => {
//   return (
//     <Flex
//       border={"1px solid black"}
//       p="5"
//       rounded={5}
//       gap={5}
//       mt="5"
//       key={keyuniq}
//     >
//       <Stack paddingBottom="5">
//         <FormControl
//           isRequired
//           isInvalid={isError.includes(
//             `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].title`
//           )}
//         >
//           <FormLabel>Title</FormLabel>
//           <Input
//             onChange={(e) =>
//               handleTicketChange(
//                 categoryIndex,
//                 ticketIndex,
//                 "title",
//                 e.target.value
//               )
//             }
//             value={category?.tickets[ticketIndex]?.title}
//           />
//         </FormControl>
//         <HStack>
//           <FormControl
//             py="5"
//             isRequired
//             w="33.3%"
//             isInvalid={isError.includes(
//               `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].price`
//             )}
//           >
//             <FormLabel>Price</FormLabel>
//             <Input
//               type="number"
//               onChange={(e) =>
//                 handleTicketChange(
//                   categoryIndex,
//                   ticketIndex,
//                   "price",
//                   e.target.value
//                 )
//               }
//               value={category?.tickets[ticketIndex]?.price}
//             />
//           </FormControl>
//           <FormControl
//             py="5"
//             isRequired
//             w="fit-content"
//             isInvalid={isError.includes(
//               `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].endTicket`
//             )}
//           >
//             <FormLabel>End Sales Ticket</FormLabel>
//             <Input
//               type="date"
//               onChange={(e) =>
//                 handleTicketChange(
//                   categoryIndex,
//                   ticketIndex,
//                   "endTicket",
//                   e.target.value
//                 )
//               }
//               value={category?.tickets[ticketIndex]?.endTicket}
//             />
//           </FormControl>
//           <Spacer />
//           <FormControl
//             w="25%"
//             id="price"
//             isRequired
//             isInvalid={isError.includes(
//               `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].totalAudience`
//             )}
//           >
//             <FormLabel>Total Audience</FormLabel>
//             <Input
//               type="number"
//               onChange={(e) =>
//                 handleTicketChange(
//                   categoryIndex,
//                   ticketIndex,
//                   "totalAudience",
//                   e.target.value
//                 )
//               }
//               value={category?.tickets[ticketIndex]?.totalAudience}
//             />
//           </FormControl>
//         </HStack>
//         <FormControl
//           isRequired
//           isInvalid={isError.includes(
//             `categoryDetails[${categoryIndex}].tickets[${ticketIndex}].notes`
//           )}
//         >
//           <FormLabel>Notes</FormLabel>
//           <Textarea
//             onChange={(e) =>
//               handleTicketChange(
//                 categoryIndex,
//                 ticketIndex,
//                 "notes",
//                 e.target.value
//               )
//             }
//             value={category?.tickets[ticketIndex]?.notes}
//           />
//         </FormControl>
//       </Stack>
//       {ticketIndex !== 0 && (
//         <Flex
//           w="10%"
//           alignItems={"center"}
//           justifyContent={"center"}
//           flexDir={"column"}
//         >
//           <Button
//             leftIcon={<DeleteIcon />}
//             colorScheme="red"
//             variant={"outline"}
//             transform={"rotate(90deg)"}
//             onClick={() => handleDeleteTicket(categoryIndex, ticketIndex)}
//           >
//             Delete Ticket
//           </Button>
//         </Flex>
//       )}
//       {/* <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box>
//                     <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px' my='10'></Box>
//                     <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box> */}
//     </Flex>
//   );
// };

// const DetailTicketComponent = ({
//   handleNext,
//   isError,
//   setFormPage,
//   setCheckboxPrice,
//   checkboxPrice,
//   handleDeleteCategory,
//   handleDeleteTicket,
//   handleSubmit,
//   categoryDetails,
//   handleCategoryChange,
//   handleTicketChange,
//   handleAddTicket,
//   handleIncrement,
//   setDetailTicket,
//   ticketCounts,
// }) => {
//   return (
//     <>
//       <Stack
//         align={"left"}
//         w="full"
//         bg={"white"}
//         bgColor={"white"}
//         p={[1, 1, 5]}
//         spacing={5}
//         borderRadius="md"
//         shadow={"md"}
//         my={5}
//       >
//         <HStack gap={5}>
//           {/* <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}
//                               variant={'outline'} colorScheme="blue"
//                               w='fit-content'
//                          >Back to Event Form</Button> */}
//           <Heading size="md">
//             Input your category and ticket for your event
//           </Heading>
//         </HStack>

//         {categoryDetails.map((category, categoryIndex) => {
//           return (
//             <SimpleGrid columns={2} key={`category-${categoryIndex}`} gap={5}>
//               <Stack>
//                 <Flex justify={"space-between"} align={"center"} gap="5">
//                   <Heading size="md">Category {categoryIndex + 1}</Heading>
//                   <Spacer />
//                   {categoryIndex !== 0 && (
//                     <Button
//                       leftIcon={<DeleteIcon />}
//                       colorScheme="red"
//                       variant={"outline"}
//                       onClick={() => handleDeleteCategory(categoryIndex)}
//                     >
//                       Delete Category
//                     </Button>
//                   )}
//                   <Button
//                     leftIcon={<AddIcon />}
//                     onClick={() => handleIncrement()}
//                     variant={"outline"}
//                     colorScheme="blue"
//                   >
//                     Add Category
//                   </Button>
//                 </Flex>

//                 <FormControl
//                   isRequired
//                   isInvalid={isError.includes(
//                     `categoryDetails[${categoryIndex}].title`
//                   )}
//                 >
//                   <FormLabel>Title</FormLabel>
//                   <Input
//                     onChange={(e) =>
//                       handleCategoryChange(
//                         categoryIndex,
//                         "title",
//                         e.target.value
//                       )
//                     }
//                     value={category?.title}
//                   />
//                 </FormControl>
//                 <HStack w="100%" gap="5">
//                   <FormControl w="25%" id="price">
//                     <FormLabel>Price Start</FormLabel>
//                     <Input
//                       type="number"
//                       value={category?.price}
//                       onChange={(e) =>
//                         handleCategoryChange(
//                           categoryIndex,
//                           "price",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </FormControl>
//                   <Checkbox
//                     isChecked={checkboxPrice}
//                     onChange={(e) => setCheckboxPrice(e.target.checked)}
//                   >
//                     Add Range Price
//                   </Checkbox>
//                   {checkboxPrice && (
//                     <FormControl w="25%" id="price">
//                       <FormLabel>Price End</FormLabel>
//                       <Input
//                         value={category?.priceEnd}
//                         type="number"
//                         onChange={(e) =>
//                           handleCategoryChange(
//                             categoryIndex,
//                             "priceEnd",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </FormControl>
//                   )}
//                 </HStack>
//                 <FormControl>
//                   <FormLabel>Details</FormLabel>
//                   <Textarea
//                     value={category.details}
//                     onChange={(e) =>
//                       handleCategoryChange(
//                         categoryIndex,
//                         "details",
//                         e.target.value
//                       )
//                     }
//                   />
//                 </FormControl>
//               </Stack>
//               <Box>
//                 <Flex justify={"space-between"} align={"center"}>
//                   <Heading size={"md"}>
//                     Ticket Category {categoryIndex + 1}
//                   </Heading>
//                   <Button
//                     leftIcon={<AddIcon />}
//                     onClick={() => handleAddTicket(categoryIndex)}
//                     variant={"outline"}
//                     colorScheme="blue"
//                   >
//                     Add Ticket
//                   </Button>
//                 </Flex>
//                 {Array.from({ length: ticketCounts[categoryIndex] }).map(
//                   (_, ticketIndex) => {
//                     return (
//                       <TicketComponent
//                         keyuniq={`ticket-${categoryIndex}-${ticketIndex}`}
//                         categoryIndex={categoryIndex}
//                         category={category}
//                         ticketIndex={ticketIndex}
//                         handleTicketChange={handleTicketChange}
//                         handleDeleteTicket={handleDeleteTicket}
//                         isError={isError}
//                       />
//                     );
//                   }
//                 )}
//               </Box>
//             </SimpleGrid>
//           );
//         })}
//         <Flex align="end" justify={"space-between"} mt="5">
//           <Button
//             leftIcon={<FiChevronLeft />}
//             onClick={() => setDetailTicket(false)}
//             variant={"outline"}
//             colorScheme="blue"
//           >
//             Back to Event Form
//           </Button>
//           <Button
//             rightIcon={<FiChevronRight />}
//             onClick={() => handleNext()}
//             variant={"outline"}
//             colorScheme="blue"
//           >
//             Next
//           </Button>
//         </Flex>
//       </Stack>
//       {/* <Flex justify={'space-between'} mt='5'>
//                     <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}>Back</Button>
//                     {idProject ?
//                          <Button onClick={() => handleSubmit('edit')}>Edit</Button>
//                          :
//                          <Button onClick={() => handleSubmit('create')}>Submit</Button>
//                     }

//                </Flex> */}
//     </>
//   );
// };

// const FormPage = ({
//   data,
//   setData,
//   handleSubmit,
//   idProject,
//   setFormPage,
//   setDetailTicket,
//   dataForm,
// }) => {
//   return (
//     <Stack
//       bg={"white"}
//       bgColor={"white"}
//       p={[1, 1, 5]}
//       spacing={5}
//       borderRadius="md"
//       shadow={"md"}
//       my="5"
//     >
//       <HStack align={"center"} gap={5}>
//         {/* <Button leftIcon={<FiChevronLeft />} onClick={() => { setDetailTicket(true); setFormPage(false) }} variant={'outline'} colorScheme='blue' w='fit-content'>Back to Ticket Form</Button> */}
//         <Heading size="md">Pick form builder for this tickets</Heading>
//       </HStack>

//       <Stack my="5">
//         <SimpleGrid columns={[1, 2, 3]} gap={3}>
//           {dataForm.length > 0 &&
//             dataForm.map((x, index) => {
//               return (
//                 <Stack
//                   key={index}
//                   borderWidth="1px"
//                   p={3}
//                   cursor="pointer"
//                   onClick={() => setData({ ...data, formId: x.id })}
//                   rounded={5}
//                   borderColor={data?.formId === x.id && "black"}
//                 >
//                   <Text>{x.title}</Text>
//                   {x.category.length > 0 &&
//                     x.category.map((y, index) => {
//                       return <Text key={index}>{y}</Text>;
//                     })}
//                 </Stack>
//               );
//             })}
//         </SimpleGrid>
//       </Stack>

//       <Flex justify={"space-between"} mt="5">
//         <Button
//           leftIcon={<FiChevronLeft />}
//           onClick={() => {
//             setDetailTicket(true);
//             setFormPage(false);
//           }}
//           variant={"outline"}
//           colorScheme="blue"
//         >
//           Back to Ticket Form
//         </Button>
//         {idProject ? (
//           <Button
//             onClick={() => handleSubmit("edit")}
//             variant={"outline"}
//             colorScheme="blue"
//           >
//             Edit
//           </Button>
//         ) : (
//           <Button
//             onClick={() => handleSubmit("create")}
//             variant={"outline"}
//             colorScheme="blue"
//           >
//             {" "}
//             Submit
//           </Button>
//         )}
//       </Flex>
//     </Stack>
//   );
// };

const FormTicketPage = () => {
  const globalState = useUserStore();
  const companyId = globalState?.currentCompany;
  const toast = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  let [searchParams, setSearchParams] = useSearchParams();
  const idProject = searchParams.get("id");

  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");

  const [detailTicket, setDetailTicket] = useState(false);

  const [categoryCount, setCategoryCount] = useState(1);
  const [ticketCounts, setTicketCounts] = useState([1]);
  const [files, setFiles] = useState([]);

  const [lastFormId, setLastFormId] = useState();
  const [formId, setFormId] = useState();
  const [currentForm, setCurrentForm] = useState({});
  const [dateCorrection, setDateCorrection] = useState(false);

  const [filesImage, setFilesImage] = useState("");
  const [logo, setLogo] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [filesLogo, setFilesLogo] = useState("");
  const [checkboxDate, setCheckboxDate] = useState(false);
  const [data, setData] = useState({
    isActive: true,
    title: "",
    description: "",
    price: "",
    gtmId: "",
    dateStart: "",
    time: "",
    timeEnd: "",
    tnc: "",
  });

  const [categoryDetails, setCategoryDetails] = useState({});
  const [categoryDetailsTicket, setCategoryDetailsTicket] = useState({});

  const [eventType, setEventType] = useState([]);
  const [formPage, setFormPage] = useState(false);
  const [dataForm, setDataForm] = useState({});
  const [isError, setIsError] = useState([]);

  const getProject = () => {
    const res = globalState?.projects?.find(
      (e) => e.id === globalState?.currentProject
    );
    setProjectId(res?.id);
    setProjectName(res?.name);
  };

  const getTickets = async () => {
    const res = await getSingleDocumentFirebase("tickets", idProject);
    if (res) {
      let newData = {
        title: res.title,
        description: res.description,
        dateStart: res.dateStart,
        time: res.time,
        timeEnd: res.timeEnd,
        tnc: res.tnc,
        isActive: res.isActive,
        price: res.price,
        gtmId: res.gtmId,
      };
      if (res.formId) {
        newData = {
          ...newData,
          formId: res.formId,
        };
      }
      if (res.dateEnd) {
        setCheckboxDate(true);
        newData = {
          ...newData,
          dataEnd: res.dateEnd,
        };
      }
      if (res.location) {
        newData = {
          ...newData,
          location: res.location,
        };
      }
      if (res.address) {
        newData = {
          ...newData,
          address: res.address,
        };
      }
      if (res.zoomId) {
        newData = {
          ...newData,
          zoomId: res.zoomId,
        };
      }
      if (res.eventType) {
        setEventType(res.eventType);
      }
      setData(newData);
      setProjectId(res.projectId);
      setProjectName(res.projectName);
      setLogo(res?.logo);
      setFiles(res.thumbnail);
      setImageUrl(res?.thumbnail);
      setLogoUrl(res?.logo);
      setCategoryDetails(res.category[0]);
      setCategoryDetailsTicket(res.category[0]?.tickets[0]);
      setTicketCounts([res.category[0]?.tickets?.length]);
      setLastFormId(res.formId);
    }

    console.log(res.category, "xxx");

    //get data form
    const ticketForm = await getSingleDocumentFirebase("forms", res.formId);
    // console.log(ticketForm, "ini current form");
    setCurrentForm(ticketForm);
  };

  // const handleNext = () => {
  //   if (!detailTicket) {
  //     const hasEmptyValues = Object.values(data).some((value) => value === "");
  //     const isEventTypeOffline = eventType.includes("offline");
  //     const isEventTypeOnline = eventType.includes("online");

  //     const isZoomIdLocationAddressEmpty = isEventTypeOffline
  //       ? !data.location || !data.address
  //       : !data.zoomId;

  //     if (hasEmptyValues || isZoomIdLocationAddressEmpty) {
  //       const errorKeysSet = new Set(
  //         Object.keys(data).filter((key) => data[key] === "")
  //       );

  //       if (isEventTypeOffline && (!data.location || !data.address)) {
  //         errorKeysSet.add("location");
  //         errorKeysSet.add("address");
  //       }

  //       if (isEventTypeOnline && !data.zoomId) {
  //         errorKeysSet.add("zoomId");
  //       }
  //       const errorKeys = [...errorKeysSet];
  //       setIsError(errorKeys);
  //     } else {
  //       // Reset error jika data valid
  //       setIsError([]);
  //       setDetailTicket(true);
  //     }
  //   } else if (detailTicket && !formPage) {
  //     const hasEmptyValues = categoryDetails.some((detail) => {
  //       return Object.values(detail).some((value) => value === "");
  //     });

  //     if (hasEmptyValues) {
  //       const errorKeysSet = new Set();

  //       categoryDetails.forEach((detail, index) => {
  //         Object.keys(detail).forEach((key) => {
  //           if (detail[key] === "") {
  //             errorKeysSet.add(`categoryDetails[${index}].${key}`);
  //           }
  //         });

  //         detail.tickets.forEach((ticket, ticketIndex) => {
  //           Object.keys(ticket).forEach((ticketKey) => {
  //             if (ticket[ticketKey] === "") {
  //               errorKeysSet.add(
  //                 `categoryDetails[${index}].tickets[${ticketIndex}].${ticketKey}`
  //               );
  //             }
  //           });
  //         });
  //       });
  //       const errorKeys = [...errorKeysSet];
  //       if (errorKeys.length > 3) {
  //         setIsError(errorKeys);
  //       } else {
  //         setIsError([]);
  //         setDetailTicket(false);
  //         setFormPage(true);
  //       }
  //     } else {
  //       setIsError([]);
  //       setDetailTicket(false);
  //       setFormPage(true);
  //     }
  //   }
  // };

  console.log(categoryDetails, "xxx");
  useEffect(() => {
    getDataForms();
    getProject();
    if (idProject) {
      getTickets();
    }
  }, [globalState.currentProject]);

  const handleEventTypeChange = (value) => {
    if (eventType?.includes(value)) {
      setEventType((prevEventType) =>
        prevEventType?.filter((item) => item !== value)
      );
    } else {
      setEventType((prevEventType) => [...prevEventType, value]);
    }
  };

  const handleSubmit = async (type) => {
    if (checkboxDate && data.dateStart >= data.dateEnd) {
      setDateCorrection(true);
      // Menampilkan pesan kesalahan atau melakukan tindakan lain sesuai kebutuhan
      return toast({
        title: "Deoapp.com",
        description: "Date End must be greater than Date Start.",
        status: "warning",
        position: "top-right",
        isClosable: true,
      });
    }

    try {
      setIsLoading(true);
      setDateCorrection(false);
      if (type === "create") {
        const newDatas = {
          ...data,
          category: [
            {
              details: categoryDetails.details,
              price: categoryDetails.price,
              title: categoryDetails.title,
              tickets: [categoryDetailsTicket],
            },
          ],
          projectId: projectId,
          projectName: projectName,
        };
        if (filesImage[0]) {
          const resImage = await uploadFile(
            data?.title,
            "tickets",
            filesImage[0]
          );
          newDatas.thumbnail = resImage;
        }
        if (filesLogo[0]) {
          const resImage = await uploadFile(
            `${data?.title}-logo`,
            "tickets",
            filesLogo[0]
          );
          newDatas.logo = resImage;
        }
        if (eventType) {
          newDatas.eventType = eventType;
        }

        console.log(newDatas, "ini new data");

        const res = await addDocumentFirebase("tickets", newDatas, companyId);
        toast({
          title: "Deoapp.com",
          description: res,
          status: "success",
          position: "top-right",
          isClosable: true,
        });

        if (newDatas.formId && newDatas.formId !== "") {
          const result = await updateDocumentFirebase(
            "forms",
            newDatas?.formId,
            { ticket_used: [res] }
          );
        }

        navigate("/ticket");
      } else {
        let newData = {
          ...data,
          category: [
            {
              details: categoryDetails.details,
              price: categoryDetails.price,
              title: categoryDetails.title,
              tickets: [categoryDetailsTicket],
            },
          ],
          projectId: projectId,
          projectName: projectName,
        };

        if (filesImage[0]) {
          const resImage = await uploadFile(
            data?.title,
            "tickets",
            filesImage[0]
          );
          newData.thumbnail = resImage;
        }
        if (filesLogo[0]) {
          const resImage = await uploadFile(
            `${data?.title}-logo`,
            "tickets",
            filesLogo[0]
          );
          newData.logo = resImage;
        }

        if (eventType) {
          newData.eventType = eventType;
        }

        console.log(newData, "xxx");

        const resUpdate = await updateDocumentFirebase(
          "tickets",
          idProject,
          newData
        );

        const getForm = await getSingleDocumentFirebase("forms", formId);

        if (!data.formId) {
          await updateDocumentFirebase("tickets", idProject, {
            formId: formId,
          });

          if (!getForm.ticket_used) {
            await updateDocumentFirebase("forms", formId, {
              ticket_used: [idProject],
            });
          }
        }

        if (resUpdate && data.formId) {
          const collectionName = "forms";
          const docName = data.formId;
          const field = "ticket_used";
          const values = [idProject];

          try {
            if (lastFormId !== undefined && data.formId !== lastFormId) {
              const result = await arrayRemoveFirebase(
                "forms",
                lastFormId,
                "ticket_used",
                [idProject]
              );
            }

            const result = await arrayUnionFirebase(
              collectionName,
              docName,
              field,
              values
            );
            console.log(result); // Pesan toast yang berhasil
            toast({
              title: "Deoapp.com",
              description: `success edit new ticket`,
              status: "success",
              position: "top-right",
              isClosable: true,
            });
            navigate("/ticket");
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
      }
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkDateRange = (date) => {
    if (data.dateEnd !== undefined || !data?.dateEnd) {
      if (data.dateStart >= date) {
        setDateCorrection(true);
      } else {
        setDateCorrection(false);
      }
    }
  };

  const handleDeleteCategory = (categoryIndex) => {
    setCategoryDetails((prevCategoryDetails) => {
      const updatedCategoryDetails = [...prevCategoryDetails];
      updatedCategoryDetails.splice(categoryIndex, 1);
      return updatedCategoryDetails;
    });

    setTicketCounts((prevTicketCounts) => {
      const updatedTicketCounts = [...prevTicketCounts];
      updatedTicketCounts.splice(categoryIndex, 1);
      return updatedTicketCounts;
    });

    setCategoryCount((prevCategoryCount) => prevCategoryCount - 1);
  };

  const handleDeleteTicket = (categoryIndex, ticketIndex) => {
    setCategoryDetails((prevCategoryDetails) => {
      const updatedCategoryDetails = [...prevCategoryDetails];
      updatedCategoryDetails[categoryIndex].tickets.splice(ticketIndex, 1);
      return updatedCategoryDetails;
    });
    setTicketCounts((prevTicketCounts) => {
      const updatedTicketCounts = [...prevTicketCounts];
      updatedTicketCounts[categoryIndex] =
        updatedTicketCounts[categoryIndex] - 1;
      return updatedTicketCounts;
    });
  };

  console.log(categoryDetailsTicket, "pppp");

  const getDataForms = async () => {
    try {
      const q = query(
        collection(db, "forms"),
        where("projectId", "==", globalState.currentProject)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = [];
        const currentForm = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();

          if (
            (!docData.ticket_used ||
              docData.ticket_used.length === 0 ||
              docData.ticket_used[0] === null) &&
            (!docData.product_used ||
              docData.product_used.length === 0 ||
              docData.product_used[0] === null) &&
            (!docData.membership_used ||
              docData.membership_used.length === 0 ||
              docData.membership_used[0] === null)
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
          setLogo(newFileArray);

          if (i === 0) {
            setLogoUrl(reader.result);
          }
        };
      }
      setFilesLogo(newFiles);
    }
  };
  // useEffect(() => {}, [categoryDetails.length !== 0]);
  return (
    <>
      <Stack>
        <BackButtons />
      </Stack>

      {/* {detailTicket === false && formPage === false ? ( */}
      <Container
        justifyContent={"center"}
        alignItems={"center"}
        gap={5}
        mt={0}
        maxW={"container.lg"}
        bg={"white"}
        bgColor={"white"}
        p={[1, 1, 5]}
        spacing={5}
        borderRadius="md"
        shadow={"md"}
        my={[1, 1, 5]}
      >
        <Stack>
          <Heading size="md">Event</Heading>

          <FormControl isRequired isInvalid={isError.includes("title")}>
            <FormLabel>Event Name</FormLabel>
            <Input
              placeholder="Event name ex: [Event] Seminar Entreprenerus 24/10/2023"
              onChange={(e) => {
                setData({ ...data, title: e.target.value });
                setCategoryDetails({
                  ...categoryDetails,
                  title: e.target.value,
                });
                setCategoryDetailsTicket({
                  ...categoryDetailsTicket,
                  title: e.target.value,
                });
              }}
              value={data?.title}
            />
          </FormControl>
          <FormControl isRequired isInvalid={isError.includes("description")}>
            <FormLabel>Description of Event</FormLabel>
            <Textarea
              placeholder="Describe your event"
              onChange={(e) => {
                setData({ ...data, description: e.target.value });
                setCategoryDetails({
                  ...categoryDetails,
                  details: e.target.value,
                });
              }}
              value={data?.description}
            />
          </FormControl>

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
                      alt={idProject ? data?.title : files[0]?.name}
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
                          Add Banner Event
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
                      alt={
                        idProject ? `${data?.title}-logo` : filesLogo[0].name
                      }
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

          <FormControl
            id="price"
            isRequired
            isInvalid={isError.includes("price")}
          >
            <FormLabel>Price</FormLabel>
            <HStack>
              <Text>Rp.</Text>
              <Input
                w={"auto"}
                type="number"
                value={data?.price}
                onChange={(e) => {
                  setData({ ...data, price: e.target.value });
                  setCategoryDetails({
                    ...categoryDetails,
                    price: e.target.value,
                  });
                  setCategoryDetailsTicket({
                    ...categoryDetailsTicket,
                    price: e.target.value,
                  });
                }}
              />
              <Spacer />
              <Text fontWeight={500}>
                Rp.{formatFrice(parseFloat(data.price || 0))}
              </Text>
            </HStack>
          </FormControl>

          {/* <FormControl id="gtmId" isRequired>
            <FormLabel>GTM-ID</FormLabel>
            <Input
              type="text"
              value={data?.gtmId}
              onChange={(e) => setData({ ...data, gtmId: e.target.value })}
            />
          </FormControl> */}

          <Stack>
            <Text fontWeight={500}>Date List</Text>
            <Checkbox
              isChecked={checkboxDate}
              onChange={(e) => setCheckboxDate(e.target.checked)}
            >
              Add Range Date
            </Checkbox>
          </Stack>

          <SimpleGrid columns={[1, 1, 2]} align={"center"} spacing="5">
            <FormControl isRequired isInvalid={isError.includes("dateStart")}>
              <FormLabel>Date Start</FormLabel>
              <Input
                type="date"
                onChange={(e) => {
                  setData({ ...data, dateStart: e.target.value });
                }}
                value={data?.dateStart}
              />
            </FormControl>

            {checkboxDate && (
              <>
                <FormControl isRequired>
                  <FormLabel>Date End</FormLabel>
                  <Input
                    borderColor={dateCorrection ? "red" : null}
                    type="date"
                    onChange={(e) => {
                      setData({ ...data, dateEnd: e.target.value });
                      checkDateRange(e.target.value);
                      setCategoryDetailsTicket({
                        ...categoryDetailsTicket,
                        endTicket: e.target.value,
                      });
                    }}
                    value={data?.dateEnd || categoryDetailsTicket?.endTicket}
                  />
                  {dateCorrection ? (
                    <Text color={"red"} fontSize={12}>
                      Date End should not be before or equal to the date start
                    </Text>
                  ) : null}
                </FormControl>
              </>
            )}
          </SimpleGrid>
          <SimpleGrid columns={[1, 1, 2]} spacing={5}>
            <FormControl isRequired isInvalid={isError.includes("time")}>
              <FormLabel>Time Start</FormLabel>
              <Input
                type="time"
                onChange={(e) => setData({ ...data, time: e.target.value })}
                value={data?.time}
              />
            </FormControl>
            <FormControl isRequired isInvalid={isError.includes("timeEnd")}>
              <FormLabel>Time End</FormLabel>
              <Input
                type="time"
                onChange={(e) => {
                  setData({ ...data, timeEnd: e.target.value });
                }}
                value={data?.timeEnd}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl id="Project" isRequired>
            <FormLabel>Project</FormLabel>
            <Input value={projectName} variant={"unstyled"} disabled />
          </FormControl>
          <FormControl isRequired isInvalid={eventType.length === 0}>
            <FormLabel>Event type</FormLabel>
            <Checkbox
              isChecked={eventType?.includes("offline")}
              onChange={() => handleEventTypeChange("offline")}
              mr={5}
            >
              Offline
            </Checkbox>
            <Checkbox
              isChecked={eventType?.includes("online")}
              onChange={() => handleEventTypeChange("online")}
            >
              Online
            </Checkbox>
          </FormControl>

          {eventType?.includes("offline") && eventType?.includes("online") ? (
            <Flex w="100% " justify={"space-between"} gap={5} py={3}>
              <Box w="100%">
                <Heading size="md">Offline Location</Heading>
                <LocationComponent
                  type={"offline"}
                  data={data}
                  isError={isError}
                  setData={setData}
                />
              </Box>
              <Box w="100%">
                <Heading size="md">Online Location</Heading>
                <LocationComponent
                  type={"online"}
                  data={data}
                  isError={isError}
                  setData={setData}
                />
              </Box>
            </Flex>
          ) : eventType?.includes("online") ? (
            <LocationComponent
              type={eventType[0]}
              data={data}
              isError={isError}
              setData={setData}
            />
          ) : eventType?.includes("offline") ? (
            <LocationComponent
              type={eventType[0]}
              data={data}
              isError={isError}
              setData={setData}
            />
          ) : (
            <></>
          )}

          <FormControl isRequired isInvalid={isError.includes("tnc")}>
            <FormLabel>Terms & Conditions</FormLabel>
            <Textarea
              onChange={(e) => setData({ ...data, tnc: e.target.value })}
              value={data?.tnc}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Activate this Event</FormLabel>
            <Flex align={"center"} gap={2}>
              <Text>No</Text>
              <Switch
                id="isChecked"
                isChecked={data?.isActive}
                onChange={() => setData({ ...data, isActive: !data?.isActive })}
              />
              <Text>Yes</Text>
            </Flex>
          </FormControl>

          {params.type === "edit" ? (
            <Box>
              <Text fontWeight={"semibold"} my={2}>
                Current Form Plugged in this ticket
              </Text>
              {currentForm ? (
                <Stack
                  shadow={"sm"}
                  w={300}
                  borderWidth="1px"
                  p={3}
                  cursor="pointer"
                  rounded={5}
                  borderColor={"black"}
                >
                  <Text fontWeight={"semibold"}>{currentForm.title}</Text>
                  <HStack>
                    {currentForm.category?.length > 0 &&
                      currentForm.category.map((y, i) => {
                        return <Text key={i}>{y}</Text>;
                      })}
                  </HStack>
                </Stack>
              ) : (
                <Stack>
                  <Text>This ticket is not assigned to any form</Text>
                </Stack>
              )}
            </Box>
          ) : null}

          <Box>
            <FormControl mt={2}>
              <FormLabel>Notes for the event</FormLabel>
              <Textarea
                placeholder="Enter Notes..."
                value={categoryDetailsTicket?.notes}
                onChange={(e) =>
                  setCategoryDetailsTicket({
                    ...categoryDetailsTicket,
                    notes: e.target.value,
                  })
                }
              />
            </FormControl>
          </Box>

          <Box my={2}>
            <Text fontWeight={"semibold"} my={2}>
              Choose Form
            </Text>
            {dataForm?.length > 0 ? (
              <SimpleGrid columns={[1, 1, 3]} spacing={3}>
                {dataForm?.map((form, i) => (
                  <Stack
                    _hover={{
                      transform: "scale(1.02)",
                      transition: "0.3s",
                      bgColor: "blue.200",
                    }}
                    shadow={"sm"}
                    key={i}
                    borderWidth="1px"
                    p={3}
                    cursor="pointer"
                    onClick={() => setData({ ...data, formId: form.id })}
                    rounded={5}
                    borderColor={data.formId === form.id && "blue.500"}
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
              <Center py={3}>
                <Stack alignItems={"center"}>
                  <Text>No Form Data</Text>
                  <Button
                    size={"xs"}
                    colorScheme="blue"
                    onClick={() => navigate("/form-builder")}
                  >
                    Create Form
                  </Button>
                </Stack>
              </Center>
            )}
          </Box>

          <Divider py={3} />

          {/* <SimpleGrid columns={[1, 1, 2]} py={[1, 1, 5]} spacing={5}>
            <Box>
              <Text fontWeight={"semibold"}>
                Data Details To Be Displayed in PageView
              </Text>
              <FormControl mt={2} isRequired>
                <FormLabel>Ticket Name/Title</FormLabel>
                <Input
                  placeholder="Enter title..."
                  value={categoryDetails[0]?.title}
                  onChange={(e) =>
                    setCategoryDetails({
                      ...categoryDetails,
                      title: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl my={2} isRequired>
                <FormLabel>Ticket Price</FormLabel>
                <HStack>
                  <Text>Rp.</Text>
                  <Input
                    placeholder="Enter price..."
                    value={categoryDetails[0]?.price}
                    onChange={(e) =>
                      setCategoryDetails({
                        ...categoryDetails,
                        price: e.target.value,
                      })
                    }
                  />
                  <Spacer />
                  <Text fontWeight={500}
                  >Rp.{formatFrice(parseFloat(categoryDetails?.price || 0))}</Text>
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Ticket Detail</FormLabel>
                <Input
                  placeholder="Enter Detail..."
                  value={categoryDetails[0]?.details}
                  onChange={(e) =>
                    setCategoryDetails({
                      ...categoryDetails,
                      details: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Box>

            <Box>
              <Text fontWeight={"semibold"}>
                Ticket Information Based On The Event Ticket
              </Text>
              <FormControl mt={2} isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Enter title..."
                  value={categoryDetails[0]?.tickets[0]?.title}
                  onChange={(e) =>
                    setCategoryDetails((prevCategory) => ({
                      ...prevCategory,
                      tickets: prevCategory.tickets.map((ticket) => ({
                        ...ticket,
                        title: e.target.value,
                      })),
                    }))
                  }
                />
              </FormControl>

              <FormControl my={2} isRequired>
                <FormLabel>Price</FormLabel>
                <HStack>
                  <Text>Rp.</Text>

                  <Input
                    placeholder="Enter price..."
                    value={categoryDetails[0]?.tickets[0]?.price}
                    onChange={(e) =>
                      setCategoryDetails((prevCategory) => ({
                        ...prevCategory,
                        tickets: prevCategory.tickets.map((ticket) => ({
                          ...ticket,
                          price: e.target.value,
                        })),
                      }))
                    }
                  />
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  placeholder="Enter Detail..."
                  value={categoryDetails[0]?.tickets[0]?.endTicket}
                  onChange={(e) =>
                    setCategoryDetails((prevCategory) => ({
                      ...prevCategory,
                      tickets: prevCategory.tickets.map((ticket) => ({
                        ...ticket,
                        endTicket: e.target.value,
                      })),
                    }))
                  }
                />
              </FormControl>

              <FormControl mt={2} isRequired>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  placeholder="Enter Notes..."
                  value={categoryDetails[0]?.tickets[0]?.notes}
                  onChange={(e) =>
                    setCategoryDetails((prevCategory) => ({
                      ...prevCategory,
                      tickets: prevCategory.tickets.map((ticket) => ({
                        ...ticket,
                        notes: e.target.value,
                      })),
                    }))
                  }
                />
              </FormControl>
            </Box>
          </SimpleGrid> */}

          {params.type === "create" ? (
            <Flex align="end" justify={"end"}>
              <Button
                isLoading={isLoading}
                colorScheme="blue"
                onClick={() => handleSubmit("create")}
                // onClick={() => console.log("clicked")}
              >
                Create
              </Button>
            </Flex>
          ) : (
            <Flex align="end" justify={"end"}>
              <Button
                isLoading={isLoading}
                // rightIcon={<FiChevronRight />}
                variant={"outline"}
                colorScheme="blue"
                onClick={() => handleSubmit("edit")}
                // onClick={() => console.log("clicked")}
              >
                Save Changes
              </Button>
            </Flex>
          )}
        </Stack>
      </Container>
      {/* )} */}
    </>
  );
};

export default FormTicketPage;
