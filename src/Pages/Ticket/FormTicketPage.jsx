import { Box, Button, Checkbox, Container, Flex, FormControl, FormLabel, HStack, Heading, Image, Input, SimpleGrid, Spacer, Stack, Switch, Text, Textarea, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import BackButtons from '../../Components/Buttons/BackButtons'
import { MdOutlinePermMedia } from 'react-icons/md'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { addDocumentFirebase, arrayUnionFirebase, getSingleDocumentFirebase, updateDocumentFirebase, uploadFile } from '../../Api/firebaseApi'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useUserStore from '../../Hooks/Zustand/Store'

const LocationComponent = ({ type, data, setData }) => {
     if (type === 'offline') {
          return (
               <>
                    <FormControl py='5' isRequired>
                         <FormLabel>Address</FormLabel>
                         <Input type='text' id='address' name='address' onChange={(e) => setData({ ...data, address: e.target.value })} value={data?.address} />
                    </FormControl>
                    <FormControl isRequired>
                         <FormLabel>Link Google Maps</FormLabel>
                         <Input onChange={(e) => setData({ ...data, location: e.target.value })} value={data?.location} />
                    </FormControl>
               </>
          )
     } else {
          return (
               <FormControl py='5' isRequired>
                    <FormLabel>Zoom ID</FormLabel>
                    <Input onChange={(e) => setData({ ...data, zoomId: e.target.value })} value={data?.zoomId} />
               </FormControl>
          )
     }
}
const TicketComponent = ({ handleDeleteTicket, categoryIndex, ticketIndex, handleTicketChange, category, key }) => {

     return (
          <Flex border={'1px solid black'} p='5' rounded={5} gap={5} mt='5' key={key}>
               <Stack paddingBottom='5'>
                    <FormControl isRequired>
                         <FormLabel>Title</FormLabel>
                         <Input onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'title', e.target.value)}
                              value={category?.tickets[ticketIndex]?.title}
                         />
                    </FormControl>
                    <HStack>
                         <FormControl py='5' isRequired w='33.3%'>
                              <FormLabel>Price</FormLabel>
                              <Input type='number' onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'price', e.target.value)}
                                   value={category?.tickets[ticketIndex]?.price}

                              />
                         </FormControl>
                         <FormControl py='5' isRequired w='fit-content'>
                              <FormLabel>End Sales Ticket</FormLabel>
                              <Input type='date'
                                   onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'endTicket', e.target.value)}
                                   value={category?.tickets[ticketIndex]?.endTicket}
                              />
                         </FormControl>
                         <Spacer />
                         <FormControl
                              w='25%'
                              id="price" isRequired>
                              <FormLabel>Total Audience</FormLabel>
                              <Input
                                   type="number"
                                   onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'totalAudience', e.target.value)}
                                   value={category?.tickets[ticketIndex]?.totalAudience}

                              />
                         </FormControl>
                    </HStack>
                    <FormControl isRequired>
                         <FormLabel>Notes</FormLabel>
                         <Textarea
                              onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'notes', e.target.value)}
                              value={category?.tickets[ticketIndex]?.notes}
                         />
                    </FormControl>
               </Stack>
               {
                    ticketIndex !== 0 &&
                    <Flex w='10%' alignItems={'center'} justifyContent={'center'} flexDir={'column'}>
                         <Button leftIcon={<DeleteIcon />} colorScheme='red' variant={'outline'} transform={'rotate(90deg)'} onClick={() => handleDeleteTicket(categoryIndex, ticketIndex)}>
                              Delete Ticket
                         </Button>
                    </Flex>
               }
               {/* <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box>
                    <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px' my='10'></Box>
                    <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box> */}

          </Flex>
     )
}


const DetailTicketComponent = ({ setFormPage, setCheckboxPrice, checkboxPrice, handleDeleteCategory, handleDeleteTicket, handleSubmit, categoryDetails, handleCategoryChange, handleTicketChange, handleAddTicket, handleIncrement, setDetailTicket, ticketCounts }) => {
     return (
          <>
               <Stack align={'left'} w='full'
                    bg={'white'}
                    bgColor={'white'} p={[1, 1, 5]} spacing={5} borderRadius='md' shadow={'md'}
                    my={5}
               >
                    <HStack gap={5}>
                         {/* <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}
                              variant={'outline'} colorScheme="blue"
                              w='fit-content'
                         >Back to Event Form</Button> */}
                         <Heading size='md' >Input your category and ticket for your event</Heading>
                    </HStack>

                    {categoryDetails.map((category, categoryIndex) => {
                         return (
                              <SimpleGrid columns={2} key={`category-${categoryIndex}`} gap={5}>
                                   <Stack>
                                        <Flex justify={'space-between'} align={'center'} gap='5'>

                                             <Heading size='md' >Category {categoryIndex + 1}</Heading>
                                             <Spacer />
                                             {categoryIndex !== 0 && <Button leftIcon={<DeleteIcon />} colorScheme='red' variant={'outline'} onClick={() => handleDeleteCategory(categoryIndex)}>Delete Category</Button>
                                             }
                                             <Button leftIcon={<AddIcon />} onClick={() => handleIncrement()}
                                                  variant={'outline'} colorScheme="blue"
                                             >Add Category</Button>
                                        </Flex>

                                        <FormControl isRequired>
                                             <FormLabel>Title</FormLabel>
                                             <Input onChange={(e) => handleCategoryChange(categoryIndex, 'title', e.target.value)} value={category?.title} />
                                        </FormControl>
                                        <HStack w='100%' gap='5'>
                                             <FormControl w='25%' id="price" isRequired>
                                                  <FormLabel>Price Start</FormLabel>
                                                  <Input
                                                       type="number"
                                                       value={category?.price}
                                                       onChange={(e) => handleCategoryChange(categoryIndex, 'price', e.target.value)}
                                                  />
                                             </FormControl>
                                             <Checkbox
                                                  isChecked={checkboxPrice}
                                                  onChange={(e) => setCheckboxPrice(e.target.checked)}
                                             >Add Range Price</Checkbox>
                                             {checkboxPrice &&
                                                  <FormControl
                                                       w='25%'
                                                       id="price" isRequired>
                                                       <FormLabel>Price End</FormLabel>
                                                       <Input
                                                            value={category?.priceEnd}
                                                            type="number"
                                                            onChange={(e) => handleCategoryChange(categoryIndex, 'priceEnd', e.target.value)}
                                                       />
                                                  </FormControl>
                                             }
                                        </HStack>
                                        <FormControl isRequired>
                                             <FormLabel>Details</FormLabel>
                                             <Textarea
                                                  value={category.details}
                                                  onChange={(e) => handleCategoryChange(categoryIndex, 'details', e.target.value)}
                                             />
                                        </FormControl>

                                   </Stack>
                                   <Box>

                                        <Flex justify={'space-between'} align={'center'}>
                                             <Heading size={'md'}>Ticket Category {categoryIndex + 1}</Heading>
                                             <Button leftIcon={<AddIcon />} onClick={() => handleAddTicket(categoryIndex)}
                                                  variant={'outline'} colorScheme="blue"
                                             >
                                                  Add Ticket
                                             </Button>
                                        </Flex>
                                        {
                                             Array.from({ length: ticketCounts[categoryIndex] }).map((_, ticketIndex) => {
                                                  return (
                                                       <TicketComponent
                                                            key={`ticket-${categoryIndex}-${ticketIndex}`}
                                                            categoryIndex={categoryIndex}
                                                            category={category}
                                                            ticketIndex={ticketIndex}
                                                            handleTicketChange={handleTicketChange}
                                                            handleDeleteTicket={handleDeleteTicket}
                                                       />
                                                  )
                                             })

                                        }
                                   </Box>
                              </SimpleGrid>
                         )
                    })}
                    <Flex align='end' justify={'space-between'} mt='5' >
                         <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}
                              variant={'outline'} colorScheme="blue"
                         >
                              Back to Event Form
                         </Button>
                         <Button rightIcon={<FiChevronRight />} onClick={() => { setDetailTicket(false); setFormPage(true) }}
                              variant={'outline'} colorScheme="blue"
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

     )
}

const FormPage = ({ data, setData, handleSubmit, idProject, setFormPage, setDetailTicket, dataForm }) => {
     return (
          <Stack
               bg={'white'}
               bgColor={'white'} p={[1, 1, 5]} spacing={5} borderRadius='md' shadow={'md'}
               my='5'
          >
               <HStack align={'center'} gap={5}>
                    {/* <Button leftIcon={<FiChevronLeft />} onClick={() => { setDetailTicket(true); setFormPage(false) }} variant={'outline'} colorScheme='blue' w='fit-content'>Back to Ticket Form</Button> */}
                    <Heading size='md'>Pick form builder for this tickets</Heading>
               </HStack>

               <Stack my='5'>
                    <SimpleGrid columns={[1, 2, 3]} gap={3}>
                         {dataForm.length > 0 && dataForm.map((x, index) => {
                              return (
                                   <Stack key={index} borderWidth='1px' p={3} cursor='pointer' onClick={() => setData({ ...data, formId: x.id })} rounded={5} borderColor={data?.formId === x.id && 'black'}>
                                        <Text>{x.title}</Text>
                                        {x.category.length > 0 && x.category.map((y, index) => {
                                             return (
                                                  <Text key={index}>{y}</Text>
                                             )
                                        })}
                                   </Stack>
                              )
                         })}
                    </SimpleGrid>
               </Stack>

               <Flex justify={'space-between'} mt='5'>
                    <Button leftIcon={<FiChevronLeft />} onClick={() => { setDetailTicket(true); setFormPage(false) }} variant={'outline'} colorScheme='blue'>Back to Ticket Form</Button>
                    {idProject ?
                         <Button onClick={() => handleSubmit('edit')} variant={'outline'} colorScheme='blue'>Edit</Button>
                         :
                         <Button onClick={() => handleSubmit('create')} variant={'outline'} colorScheme='blue'>  Submit</Button>
                    }

               </Flex>
          </Stack>
     )
}

const FormTicketPage = () => {
     const globalState = useUserStore();
     const companyId = globalState?.currentCompany;
     const toast = useToast()
     const navigate = useNavigate()

     let [searchParams, setSearchParams] = useSearchParams();
     const idProject = searchParams.get("id");

     const [projectId, setProjectId] = useState("");
     const [projectName, setProjectName] = useState("");
     const [detailTicket, setDetailTicket] = useState(false);
     const [categoryCount, setCategoryCount] = useState(1);
     const [ticketCounts, setTicketCounts] = useState([1]);
     const [files, setFiles] = useState([])
     const [filesImage, setFilesImage] = useState('')
     const [logo, setLogo] = useState([])
     const [filesLogo, setFilesLogo] = useState('')
     const [checkboxDate, setCheckboxDate] = useState(false)
     const [checkboxPrice, setCheckboxPrice] = useState(false)
     const [categoryDetails, setCategoryDetails] = useState([
          { title: '', price: '', priceEnd: '', details: '', tickets: [{ title: '', price: '', endTicket: '', totalAudience: '', notes: '' }] }
     ]);
     const [data, setData] = useState({ isActive: true })
     const [eventType, setEventType] = useState([]);
     const [formPage, setFormPage] = useState(false)
     const [dataForm, setDataForm] = useState({})

     const getProject = () => {
          const res = globalState?.projects?.find(e => e.id === globalState?.currentProject)
          setProjectId(res?.id)
          setProjectName(res?.name)
     }
     const getTickets = async () => {
          const res = await getSingleDocumentFirebase('tickets', idProject)
          let newData = {
               title: res.title,
               description: res.description,
               dateStart: res.dateStart,
               time: res.time,
               timeEnd: res.timeEnd,
               tnc: res.tnc,
               isActive: res.isActive,
               price: res.price,
               formId: res.formId
          }
          if (res) {
                    console.log(res)
               if (res.dateEnd) {
                    setCheckboxDate(true)
                    newData = {
                         ...newData,
                         dataEnd: res.dateEnd
                    }
               }
               if (res.location) {
                    newData = {
                         ...newData,
                         location: res.location
                    }
               }
               if (res.address) {
                    newData = {
                         ...newData,
                         address: res.address
                    }
               }
               if (res.zoomId) {
                    newData = {
                         ...newData,
                         zoomId: res.zoomId
                    }
               }
               setData(newData)
               setProjectId(res.projectId)
               setProjectName(res.projectName)
               setLogo(res.logo)
               setFiles(res.thumbnail)
               setCategoryDetails(res.category)
               setTicketCounts([res.category[0].tickets.length])
               setEventType(res.eventType)
          }
     }
console.log(logo)
     const getDataForms = async () => {
          try {
               const q = query(collection(db, 'forms'),
                    where("projectId", "==", globalState.currentProject)
               );

               const unsubscribe = onSnapshot(q, (snapshot) => {
                    const data = [];
                    snapshot.forEach((doc) => {
                         const docData = doc.data();
                         data.push({ id: doc.id, ...docData });
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

     useEffect(() => {
          getDataForms()
          if (!idProject) {
               getProject()
          }
          getTickets()
     }, [globalState.currentProject])

     const handleAddTicket = async (categoryIndex) => {
          await setCategoryDetails((prevCategoryDetails) => {
               const updatedCategoryDetails = [...prevCategoryDetails];
               if (updatedCategoryDetails[categoryIndex]?.tickets?.length === ticketCounts[categoryIndex]) {
                    updatedCategoryDetails[categoryIndex].tickets.push({
                         title: '',
                         price: '',
                         endTicket: '',
                         totalAudience: '',
                         notes: '',
                    });
               }
               return updatedCategoryDetails;
          });
          setTicketCounts((prevTicketCounts) => {
               const updatedTicketCounts = [...prevTicketCounts];

               updatedTicketCounts[categoryIndex] = updatedTicketCounts[categoryIndex] + 1;
               return updatedTicketCounts;
          });

     };

     const handleEventTypeChange = (value) => {
          if (eventType.includes(value)) {
               setEventType((prevEventType) => prevEventType.filter((item) => item !== value));
          } else {
               setEventType((prevEventType) => [...prevEventType, value]);
          }
     };

     const handleIncrement = () => {
          setCategoryCount((prevCategoryCount) => prevCategoryCount + 1);
          setTicketCounts((prevTicketCounts) => [...prevTicketCounts, 1]);
          setCategoryDetails((prevCategoryDetails) => [
               ...prevCategoryDetails,
               { title: '', price: '', priceEnd: '', details: '', tickets: [{ title: '', price: '', endTicket: '', totalAudience: '', notes: '' }] }
          ]);
     };

     const handleTicketChange = (categoryIndex, ticketIndex, field, value) => {
          setCategoryDetails((prevCategoryDetails) => {
               const updatedCategoryDetails = [...prevCategoryDetails];
               updatedCategoryDetails[categoryIndex].tickets[ticketIndex][field] = value;
               return updatedCategoryDetails;
          });
     };

     const handleCategoryChange = (categoryIndex, field, value) => {
          setCategoryDetails((prevCategoryDetails) => {
               const updatedCategoryDetails = [...prevCategoryDetails];
               updatedCategoryDetails[categoryIndex][field] = value;
               return updatedCategoryDetails;
          });
     };

     const handleSubmit = async (type) => {
          const newData = {
               ...data,
               category: categoryDetails,
               projectId: projectId,
               projectName: projectName,
               eventType: eventType
          }

          if (filesImage[0]) {
               const resImage = await uploadFile(data?.title, "tickets", filesImage[0]);
               newData.thumbnail = resImage;
          }
          if (filesLogo[0]) {
               const resImage = await uploadFile(`${data?.title}-logo`, "tickets", filesLogo[0]);
               newData.logo = resImage;
          }
          if(files){
               newData.thumbnail =files
          }
          if(logo){
               newData.logo = logo
          }
          try {
               if (type === 'create') {
                    const res = await addDocumentFirebase('tickets', newData, companyId)


                    if (res && newData.formId) {
                         const collectionName = 'forms';
                         const docName = newData.formId;
                         const field = 'ticket_used';
                         const values = [res];

                         try {
                              const result = await arrayUnionFirebase(collectionName, docName, field, values);
                              console.log(result); // Pesan toast yang berhasil
                              toast({
                                   title: "Deoapp.com",
                                   description: `success add new ticket with document id ${res}`,
                                   status: "success",
                                   position: "top-right",
                                   isClosable: true,
                              });
                              navigate('/ticket')

                         } catch (error) {
                              console.log('Terjadi kesalahan:', error);
                         }
                    }

                    console.log(newData, 'ini new')

               } else {
                    console.log(newData)
                    const res = await updateDocumentFirebase('tickets', idProject, newData)
                    toast({
                         title: "Deoapp.com",
                         description: res,
                         status: "success",
                         position: "top-right",
                         isClosable: true,
                    })
                    navigate('/ticket')
               }
          } catch (error) {
               toast({
                    title: "Error",
                    description: error,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
               });
          }
     }

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
     }


     const handleDeleteTicket = (categoryIndex, ticketIndex) => {
          setCategoryDetails((prevCategoryDetails) => {
               const updatedCategoryDetails = [...prevCategoryDetails];
               updatedCategoryDetails[categoryIndex].tickets.splice(ticketIndex, 1);
               return updatedCategoryDetails;
          });
          setTicketCounts((prevTicketCounts) => {
               const updatedTicketCounts = [...prevTicketCounts];
               updatedTicketCounts[categoryIndex] = updatedTicketCounts[categoryIndex] - 1;
               return updatedTicketCounts;
          });
     }

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
               const newFileArray = [...logo];
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
                    };
               }
               setFilesLogo(newFiles);
          }
     };
     useEffect(() => {

     }, [categoryDetails.length !== 0])

     return (
          <>
               <Stack>
                    <BackButtons />
               </Stack>

               {detailTicket === false && formPage === false ?
                    <Container
                         justifyContent={'center'}
                         alignItems={'center'}
                         gap={5}
                         mt={0}
                         maxW={'container.lg'}
                         bg={'white'}
                         bgColor={'white'} p={[1, 1, 5]} spacing={5} borderRadius='md' shadow={'md'}
                         my={5}
                    >
                         <Stack>


                              <Heading size='md'>Event</Heading>

                              <FormControl isRequired>
                                   <FormLabel>Event Name</FormLabel>
                                   <Input onChange={(e) => setData({ ...data, title: e.target.value })} value={data?.title} />
                              </FormControl>
                              <FormControl isRequired>
                                   <FormLabel>Description of Event</FormLabel>
                                   <Textarea onChange={(e) => setData({ ...data, description: e.target.value })} value={data?.description} />
                              </FormControl>
                              <Flex justify={'space-between'}>
                                   <FormControl id="image-peaker">
                                        <HStack>
                                             <Stack>
                                                  {files?.length > 0 && (
                                                       <Image
                                                            boxSize="100%"
                                                            maxWidth={300}
                                                            borderRadius="xl"
                                                            shadow="sm"
                                                            src={idProject ? files : files[0].file}
                                                            alt={idProject ? data?.title : files[0].name}
                                                       />
                                                  )}
                                             </Stack>
                                        </HStack>
                                        <Stack>
                                             <Input
                                                  type="file"
                                                  display="none"
                                                  id="fileInput"
                                                  onChange={handleFileInputChange}
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
                                        </Stack>
                                   </FormControl>
                                   <FormControl id="image-peaker" >
                                        <HStack>
                                             <Stack>
                                                  {logo?.length > 0 && (
                                                       <Image
                                                            boxSize="100%"
                                                            maxWidth={300}
                                                            borderRadius="xl"
                                                            shadow="sm"
                                                            src={idProject ? logo : logo[0].file}
                                                            alt={idProject ? `${data?.title}-logo` : logo[0].name}
                                                       />
                                                  )}
                                             </Stack>
                                        </HStack>
                                        <Stack>
                                             <Input
                                                  type="file"
                                                  display="none"
                                                  id="logoInput"
                                                  onChange={handleFileLogoInputChange}
                                             />

                                             <label htmlFor="logoInput">
                                                  <HStack cursor="pointer">
                                                       <Stack>
                                                            <MdOutlinePermMedia />
                                                       </Stack>
                                                       <Text fontSize="sm" color="blue.600" fontStyle="italic">
                                                            Add Image Logo
                                                       </Text>
                                                  </HStack>
                                             </label>
                                        </Stack>
                                   </FormControl>
                              </Flex>
                              <HStack w='100%' justify={'space-between'} gap='5'>
                                   <FormControl id="price" isRequired >
                                        <FormLabel>Price</FormLabel>
                                        <Input
                                             type="number"
                                             value={data?.price}
                                             onChange={(e) => setData({ ...data, price: e.target.value })}
                                        />
                                   </FormControl>
                                   <FormControl isRequired  >
                                        <FormLabel>Event type</FormLabel>
                                        <Checkbox
                                             isChecked={eventType.includes('offline')}
                                             onChange={() => handleEventTypeChange('offline')}
                                             mr={5}
                                        >
                                             Offline
                                        </Checkbox>
                                        <Checkbox
                                             isChecked={eventType.includes('online')}
                                             onChange={() => handleEventTypeChange('online')}
                                        >
                                             Online
                                        </Checkbox>
                                   </FormControl>
                              </HStack>

                              <HStack align={'center'} gap='5'>

                                   <FormControl isRequired w='50%'>
                                        <FormLabel>Date Start</FormLabel>
                                        <Input type='date' onChange={(e) => setData({ ...data, dateStart: e.target.value })} value={data?.dateStart} />
                                   </FormControl>
                                   <Checkbox isChecked={checkboxDate} onChange={e => setCheckboxDate(e.target.checked)}>Date End</Checkbox>
                                   {
                                        checkboxDate &&
                                        <FormControl isRequired w='50%'>
                                             <FormLabel>Date End</FormLabel>
                                             <Input type='date' onChange={(e) => setData({ ...data, dateEnd: e.target.value })} value={data?.dateEnd} />
                                        </FormControl>
                                   }
                              </HStack>
                              <HStack>

                                   <FormControl isRequired w='50%'>
                                        <FormLabel>Time Start</FormLabel>
                                        <Input type='time' onChange={(e) => setData({ ...data, time: e.target.value })} value={data?.time} />
                                   </FormControl>
                                   <FormControl isRequired w='50%'>
                                        <FormLabel>Time End</FormLabel>
                                        <Input type='time' onChange={(e) => setData({ ...data, timeEnd: e.target.value })} value={data?.timeEnd} />
                                   </FormControl>
                              </HStack>
                              <FormControl id="Project" isRequired>
                                   <FormLabel>Project</FormLabel>
                                   <Input value={projectName} variant={'unstyled'} disabled />
                              </FormControl>


                              {eventType.includes('offline') && eventType.includes('online') ?
                                   <Flex w='100% ' justify={'space-between'} gap={5}>
                                        <Box w='100%' >
                                             <Heading size='md'>Offline Location</Heading>
                                             <LocationComponent type={'offline'} data={data} setData={setData} />
                                        </Box>
                                        <Box w='100%' >
                                             <Heading size='md'>Online Location</Heading>
                                             <LocationComponent type={'online'} data={data} setData={setData} />
                                        </Box>
                                   </Flex>
                                   : eventType.includes('online') ?

                                        <LocationComponent type={eventType[0]} data={data} setData={setData} />
                                        : eventType.includes('offline') ?
                                             <LocationComponent type={eventType[0]} data={data} setData={setData} />
                                             : <></>

                              }

                              <FormControl isRequired >
                                   <FormLabel>Terms & Conditions</FormLabel>
                                   <Textarea onChange={(e) => setData({ ...data, tnc: e.target.value })} value={data?.tnc} />
                              </FormControl>

                              <FormControl isRequired>
                                   <FormLabel>Activate this Event</FormLabel>
                                   <Flex align={'center'} gap={2}>
                                        <Text>No</Text>
                                        <Switch id='isChecked' isChecked={data?.isActive} onChange={() => setData({ ...data, isActive: !data?.isActive })} />
                                        <Text>Yes</Text>

                                   </Flex>
                              </FormControl>
                              <Flex align='end' justify={'end'} >
                                   <Button rightIcon={<FiChevronRight />} variant={'outline'} colorScheme="blue" onClick={() => setDetailTicket(true)}>
                                        Next
                                   </Button>
                              </Flex>
                         </Stack>
                    </Container >

                    : formPage === false ?
                         <DetailTicketComponent
                              categoryDetails={categoryDetails}
                              handleCategoryChange={handleCategoryChange}
                              handleTicketChange={handleTicketChange}
                              handleAddTicket={handleAddTicket}
                              handleIncrement={handleIncrement}
                              setDetailTicket={setDetailTicket}
                              ticketCounts={ticketCounts}
                              handleSubmit={handleSubmit}
                              handleDeleteTicket={handleDeleteTicket}
                              handleDeleteCategory={handleDeleteCategory}
                              setCheckboxPrice={setCheckboxPrice}
                              checkboxPrice={checkboxPrice}
                              idProject={idProject}
                              setFormPage={setFormPage}
                              formPage={formPage}
                              categoryCount={categoryCount}
                         /> :
                         <FormPage
                              handleSubmit={handleSubmit}
                              idProject={idProject}
                              setFormPage={setFormPage}
                              setDetailTicket={setDetailTicket}
                              dataForm={dataForm}
                              setData={setData}
                              data={data}
                         />
               }


          </>

     )
}

export default FormTicketPage