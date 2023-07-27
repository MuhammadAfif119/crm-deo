import { Box, Button, Checkbox, Flex, FormControl, FormLabel, HStack, Heading, Image, Input, Select, Spacer, Stack, Switch, Text, Textarea, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import BackButtons from '../../Components/Buttons/BackButtons'
import { MdOutlinePermMedia } from 'react-icons/md'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { addDocumentFirebase, getSingleDocumentFirebase, updateDocumentFirebase, uploadFile } from '../../Api/firebaseApi'
import useUserStore from '../../Routes/Store'
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { useSearchParams } from 'react-router-dom'

const LocationComponent = ({ type, data, setData }) => {
     if (type === 'offline') {
          return (
               <>
                    <FormControl py='5' isRequired>
                         <FormLabel>Address</FormLabel>
                         <Input type='text' id='address' name='address' onChange={(e) => setData({ ...data, address: e.target.value })} value={data?.address} />
                    </FormControl>
                    <FormControl isRequired>
                         <FormLabel>Location</FormLabel>
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
          <Flex border={'1px solid black'} pl='5' rounded={5} gap={5} mt='5' key={key}>
               <Box w='90%' paddingBottom='5'>
                    <FormControl py='5' isRequired>
                         <FormLabel>Title</FormLabel>
                         <Input onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'title', e.target.value)}
                              value={category?.tickets[ticketIndex]?.title}
                         />
                    </FormControl>
                    <HStack>
                         <FormControl py='5' isRequired w='33.3%'>
                              <FormLabel>Price</FormLabel>
                              <Input onChange={(e) => handleTicketChange(categoryIndex, ticketIndex, 'price', e.target.value)}
                                   value={category?.tickets[ticketIndex]?.price}

                              />
                         </FormControl>
                         <FormControl py='5' isRequired w='fit-content'>
                              <FormLabel>End Ticket</FormLabel>
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
               </Box>
               <Flex borderLeft={'dashed 1px black'} w='10%' alignItems={'center'} justifyContent={'center'} flexDir={'column'}>
                    {
                         ticketIndex !== 0 &&
                         <Button leftIcon={<DeleteIcon />} colorScheme='red' transform={'rotate(90deg)'} onClick={() => handleDeleteTicket(categoryIndex, ticketIndex)}>
                              Delete Ticket
                         </Button>
                    }
                    {/* <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box>
                    <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px' my='10'></Box>
                    <Box rounded={'100%'} border={'solid 1px black'} w='30px' h='30px'></Box> */}

               </Flex>
          </Flex>
     )
}


const DetailTicketComponent = ({ idProject, setCheckboxPrice, checkboxPrice, handleDeleteCategory, handleDeleteTicket, handleSubmit, categoryDetails, handleCategoryChange, handleTicketChange, handleAddTicket, handleIncrement, setDetailTicket, ticketCounts }) => {
     return (
          <>
               <Box mt='5'>
                    <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}>Back</Button>
                    {categoryDetails.map((category, categoryIndex) => {
                         return (
                              <div key={`category-${categoryIndex}`}>
                                   {

                                        <>
                                             <Flex justify={'space-between'} align={'center'} mt='5' gap='5'>

                                                  <Heading size='md' pb='5'>Category {categoryIndex + 1}</Heading>
                                                  <Spacer />
                                                  {categoryIndex !== 0 && <Button leftIcon={<DeleteIcon />} colorScheme='red' onClick={() => handleDeleteCategory(categoryIndex)}>Delete Category</Button>
                                                  }
                                                  <Button leftIcon={<AddIcon />} onClick={() => handleIncrement()}>Add Category</Button>
                                             </Flex>

                                             <FormControl isRequired>
                                                  <FormLabel>Title</FormLabel>
                                                  <Input onChange={(e) => handleCategoryChange(categoryIndex, 'title', e.target.value)} value={category?.title} />
                                             </FormControl>
                                             <HStack w='100%' gap='5' mt='5'>
                                                  <FormControl w='25%' id="price" isRequired>
                                                       <FormLabel>Price</FormLabel>
                                                       <Input
                                                            type="number"
                                                            value={category?.price}
                                                            onChange={(e) => handleCategoryChange(categoryIndex, 'price', e.target.value)}
                                                       />
                                                  </FormControl>
                                                  <Checkbox
                                                       isChecked={checkboxPrice}
                                                       onChange={(e) => setCheckboxPrice(e.target.checked)}
                                                  >Add Price</Checkbox>
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
                                             <FormControl py='5' isRequired>
                                                  <FormLabel>Details</FormLabel>
                                                  <Textarea
                                                       value={category.details}
                                                       onChange={(e) => handleCategoryChange(categoryIndex, 'details', e.target.value)}
                                                  />
                                             </FormControl>
                                             <Flex justify={'space-between'} pb='5'>
                                                  <Heading size={'md'}>Ticket Category {categoryIndex + 1}</Heading>
                                                  <Button leftIcon={<AddIcon />} onClick={() => handleAddTicket(categoryIndex)}>
                                                       Add Ticket
                                                  </Button>
                                             </Flex>
                                        </>
                                   }
                                   {Array.from({ length: ticketCounts[categoryIndex] }).map((_, ticketIndex) => (
                                        <TicketComponent
                                             key={`ticket-${categoryIndex}-${ticketIndex}`}
                                             categoryIndex={categoryIndex}
                                             category={category}
                                             ticketIndex={ticketIndex}
                                             handleTicketChange={handleTicketChange}
                                             handleDeleteTicket={handleDeleteTicket}
                                        />
                                   ))}
                              </div>
                         )
                    })}
               </Box>
               <Flex justify={'space-between'} mt='5'>
                    <Button leftIcon={<FiChevronLeft />} onClick={() => setDetailTicket(false)}>Back</Button>
                    {idProject ?
                         <Button onClick={() => handleSubmit('edit')}>Edit</Button>
                         :
                         <Button onClick={() => handleSubmit('create')}>Submit</Button>
                    }

               </Flex>
          </>

     )
}
const FormTicketPage = () => {
     const { userDisplay } = useUserStore();
     const companyId = userDisplay?.currentCompany;
     const toast = useToast()

     let [searchParams, setSearchParams] = useSearchParams();
     const idProject = searchParams.get("id");

     const [projectList, setProjectList] = useState([]);
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

     const getData = async () => {
          try {
               const q = query(
                    collection(db, "projects"),
                    where("companyId", "==", companyId),
                    limit(25)
               );

               const unsubscribe = onSnapshot(q, (snapshot) => {
                    const datas = [];
                    snapshot.forEach((doc) => {
                         const docData = doc.data();
                         datas.push({ id: doc.id, ...docData });
                    });
                    setProjectList(datas);
               });

               return () => {
                    unsubscribe();
               };
          } catch (error) {
               console.log(error, "ini error");
          }
     };

     const getTickets = async () => {
          const res = await getSingleDocumentFirebase('tickets', idProject)
          if (res) {
               const newData = {
                    title: res.title,
                    description: res.description,
                    dateStart: res.dateStart,
                    time: res.time,
                    timeEnd: res.timeEnd,
                    tnc: res.tnc,
                    isActive: res.isActive,
               }
             
               if (res.dateEnd) {
                    setCheckboxDate(true)
                    newData.dataEnd = res.dateEnd 
               }
               if (res.location) {
                    newData.location = res.location 
               }
               if (res.address) {
                    newData.address = res.address 
               }
               setData(newData)
               setProjectId(res.projectId)
               setProjectName(res.projectName)
               setLogo(res.logo)
               setFiles(res.thumbnail)
               setCategoryDetails(res.category)
          }
     }

     useEffect(() => {
          getData()
          getTickets()
     }, [userDisplay.currentCompany])

     console.log(data)


     const handleAddTicket = (categoryIndex) => {
          setCategoryDetails((prevCategoryDetails) => {
               const updatedCategoryDetails = [...prevCategoryDetails];
               updatedCategoryDetails[categoryIndex].tickets.push({
                    title: '',
                    price: '',
                    endTicket: '',
                    totalAudience: '',
                    notes: '',
               });
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

     const handleProjectChange = (value) => {
          const projectFind = projectList.find((x) => x.id === value);
          setProjectId(projectFind.id);
          setProjectName(projectFind.name);
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
          try {
               if (type === 'create') {
                    const res = await addDocumentFirebase('tickets', newData, companyId)
                    toast({
                         title: "Deoapp.com",
                         description: `success add new ticket with document id ${res}`,
                         status: "success",
                         position: "top-right",
                         isClosable: true,
                    });
               } else {
                    const res = await updateDocumentFirebase('tickets', idProject, newData)
                    toast({
                         title: "Deoapp.com",
                         description: res,
                         status: "success",
                         position: "top-right",
                         isClosable: true,
                    })
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


     return (
          <Box pb='5'>
               {detailTicket === false ?
                    <>
                         <BackButtons />
                         <Flex justify={'space-between'} align={'center'}>
                              <Heading size='md' mt='5'>Event</Heading>
                              <Switch mt='5' id='isChecked' isChecked={data?.isActive} onChange={() => setData({ ...data, isActive: !data?.isActive })} />
                         </Flex>
                         <FormControl py='5' isRequired>
                              <FormLabel>Event Name</FormLabel>
                              <Input onChange={(e) => setData({ ...data, title: e.target.value })} value={data?.title} />
                         </FormControl>
                         <FormControl isRequired>
                              <FormLabel>Description of Event</FormLabel>
                              <Textarea onChange={(e) => setData({ ...data, description: e.target.value })} value={data?.description} />
                         </FormControl>
                         <FormControl id="image-peaker" pt='5'>
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
                         <FormControl w='25%' id="price" isRequired pt='5'>
                              <FormLabel>Price</FormLabel>
                              <Input
                                   type="number"
                                   value={data?.price}
                                   onChange={(e) =>setData({...data, price: e.target.value})}
                              />
                         </FormControl>
                         <HStack align={'center'}>

                              <FormControl py='5' isRequired w='25%'>
                                   <FormLabel>Date Start</FormLabel>
                                   <Input type='date' onChange={(e) => setData({ ...data, dateStart: e.target.value })} value={data?.dateStart} />
                              </FormControl>
                              <Checkbox isChecked={checkboxDate} onChange={e => setCheckboxDate(e.target.checked)} px='5'>Date End</Checkbox>
                              {
                                   checkboxDate &&
                                   <FormControl isRequired w='25%'>
                                        <FormLabel>Date End</FormLabel>
                                        <Input type='date' onChange={(e) => setData({ ...data, dateEnd: e.target.value })} value={data?.dateEnd} />
                                   </FormControl>
                              }
                         </HStack>
                         <HStack>

                              <FormControl isRequired w='25%'>
                                   <FormLabel>Time Start</FormLabel>
                                   <Input type='time' onChange={(e) => setData({ ...data, time: e.target.value })} value={data?.time} />
                              </FormControl>
                              <FormControl isRequired w='25%'>
                                   <FormLabel>Time End</FormLabel>
                                   <Input type='time' onChange={(e) => setData({ ...data, timeEnd: e.target.value })} value={data?.timeEnd} />
                              </FormControl>
                         </HStack>
                         <FormControl mt='5' id="Project" isRequired>
                              <FormLabel>Project</FormLabel>
                              <Select
                                   borderRadius="lg"
                                   placeholder={idProject ? '' : 'Project'}
                                   onChange={(e) => handleProjectChange(e.target.value)}
                              >
                                   {projectList?.length > 0 &&
                                        projectList?.map((x, index) => (
                                             <option value={x.id} key={index} selected={x.id === projectId}>
                                                  <Text textTransform={"capitalize"}>{x.name}</Text>
                                             </option>
                                        ))}
                              </Select>
                         </FormControl>
                         <FormControl id="image-peaker" pt='5'>
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
                         <FormControl isRequired mt='5'>
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
                         {eventType.includes('offline') && eventType.includes('online') ?
                              <Flex w='100% ' justify={'space-between'} gap={5}>
                                   <Box w='100%' mt='5'>
                                        <Heading size='md'>Offline Location</Heading>
                                        <LocationComponent type={'offline'} data={data} setData={setData} />
                                   </Box>
                                   <Box w='100%' mt='5'>
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

                         <FormControl isRequired mt='5'>
                              <FormLabel>Terms & Conditions</FormLabel>
                              <Textarea onChange={(e) => setData({ ...data, tnc: e.target.value })} value={data?.tnc} />
                         </FormControl>
                         <Flex align='end' justify={'end'} mt='5' >
                              <Button rightIcon={<FiChevronRight />} onClick={() => setDetailTicket(true)}>
                                   Next
                              </Button>
                         </Flex>
                    </>
                    :
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
                    />
               }


          </Box >
     )
}

export default FormTicketPage