// import React, { useEffect, useState, Fragment } from "react";
// import useUserStore from "../../Hooks/Zustand/Store";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../../Config/firebase";
// import {
//   Accordion,
//   AccordionButton,
//   AccordionIcon,
//   AccordionItem,
//   AccordionPanel,
//   Box,
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   Flex,
//   Heading,
//   Image,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   SimpleGrid,
//   Stack,
//   Tag,
//   TagLabel,
//   Text,
// } from "@chakra-ui/react";
// import themeConfig from "../../Config/themeConfig";
// import { Search2Icon } from "@chakra-ui/icons";
// import moment from "moment/moment";

// const HistoryPage = () => {
//   const [history, setHistory] = useState();
//   const [search, setSearch] = useState();
//   const [render, setRender] = useState();
//   const [visibleFilterCount, setVisibleFilterCount] = useState(15);

//   // const getHistory = async () => {
//   //   try {
//   //     const docRef = query(collection(db, "orders"));
//   //     const querySnapshot = await getDocs(docRef);
//   //     const categoryData = querySnapshot.docs.map((doc) => doc.data());
//   //     setHistory(categoryData);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   const getHistory = async () => {
//     try {
//       const docRef = query(collection(db, "orders"));
//       const querySnapshot = await getDocs(docRef);
//       if (!querySnapshot.empty) {
//         const mappedData = {};

//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           const category = data.module;
//           if (!mappedData[category]) {
//             mappedData[category] = [];
//           }
//           // console.log(category,"--------------")
//           mappedData[category].push({ id: doc.id, ...data });
//         });

//         setHistory(mappedData);
//       } else {
//         console.log("Koleksi kosong.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
//   console.log(history);
//   useEffect(() => {
//     getHistory();
//     // getBook();
//   }, []);
//   // const filteredUsers = history?.filter((item) => {
//   //   return (
//   //     item.name &&
//   //     item.name.toLowerCase().includes(search && search.toLowerCase())
//   //   );
//   // });
//   // const fiterVisible = filteredUsers?.slice(0, visibleFilterCount);
//   return (
//     <>
//       <Stack>
//         <Accordion allowToggle>
//           {history &&
//             Object.keys(history)?.map((data, index) =>
//               data === "undefined" ? null : (
//                 <AccordionItem key={index}>
//                   <AccordionButton>
//                     <Text
//                       fontWeight="bold"
//                       fontSize={"20px"}
//                       style={{ textTransform: "uppercase" }}
//                       p={"3%"}
//                     >
//                       {data}
//                     </Text>
//                     <AccordionIcon />
//                   </AccordionButton>

//                   {history[data]?.map((x, subIndex) => (
//                     <Fragment key={subIndex}>
//                       {data === "lms" && (
//                         <AccordionPanel pb={4}>
//                           <Card
//                             direction={{ base: "column", sm: "row" }}
//                             overflow="hidden"
//                             variant="outline"
//                             key={subIndex}
//                           >
//                             <Image
//                               objectFit="cover"
//                               maxW={{ base: "100%", sm: "200px" }}
//                               src={themeConfig.logokotak}
//                               alt="Caffe Latte"
//                             />

//                             <Stack w={"80%"}>
//                               <CardBody>
//                                 <Flex justifyContent={"space-between"}>
//                                   <Heading size="md">{x.email}</Heading>
//                                   <Tag
//                                     borderRadius="full"
//                                     variant="solid"
//                                     colorScheme="green"
//                                     marginRight={0}
//                                   >
//                                     <TagLabel>{x.paymentStatus}</TagLabel>
//                                   </Tag>
//                                 </Flex>
//                                 <SimpleGrid columns={[2]}>
//                                   <Box
//                                     border="none"
//                                     padding="4"
//                                     borderRadius="md"
//                                     display="grid"
//                                     gridTemplateColumns="max-content max-content 1fr"
//                                     gridGap="2"
//                                   >
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Payment Method
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       {x.paymentMethod}
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Total Price
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Rp. {x.amount?.toLocaleString()}
//                                     </Text>
//                                   </Box>
//                                   <Box>
//                                     <Accordion allowToggle>
//                                       <AccordionItem>
//                                         <h2>
//                                           <AccordionButton>
//                                             <Box
//                                               as="span"
//                                               flex="1"
//                                               textAlign="left"
//                                             >
//                                               Orders
//                                             </Box>
//                                             <AccordionIcon />
//                                           </AccordionButton>
//                                         </h2>
//                                         {x.orders?.map((item, idx) => (
//                                           <Box key={idx} borderRadius="md">
//                                             <AccordionPanel mt={"20px"}>
//                                               <Text
//                                                 fontSize="lg"
//                                                 fontFamily={"Sans-serif"}
//                                               >
//                                                 {item.name}
//                                               </Text>
//                                               <Image
//                                                 objectFit="cover"
//                                                 maxW={{
//                                                   base: "100%",
//                                                   sm: "200px",
//                                                 }}
//                                                 src={item.image}
//                                               />
//                                               <Box
//                                                 marginTop={"15px"}
//                                                 border="none"
//                                                 borderRadius="md"
//                                                 display="grid"
//                                                 gridTemplateColumns="max-content max-content 1fr"
//                                                 gridGap="2"
//                                               >
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   Price
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   Rp.{" "}
//                                                   {item.price?.toLocaleString()}
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   quantity
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   {item.qty}
//                                                 </Text>
//                                               </Box>
//                                             </AccordionPanel>
//                                           </Box>
//                                         ))}
//                                       </AccordionItem>
//                                     </Accordion>
//                                   </Box>
//                                 </SimpleGrid>
//                               </CardBody>
//                             </Stack>
//                           </Card>
//                         </AccordionPanel>
//                       )}

//                       {data === "rms" && (
//                         <AccordionPanel pb={4}>
//                           <Card
//                             direction={{ base: "column", sm: "row" }}
//                             overflow="hidden"
//                             variant="outline"
//                             key={subIndex}
//                           >
//                             <Image
//                               objectFit="cover"
//                               maxW={{ base: "100%", sm: "200px" }}
//                               src={themeConfig.logokotak}
//                               alt="Caffe Latte"
//                             />

//                             <Stack w={"80%"}>
//                               <CardBody>
//                                 <Flex justifyContent={"space-between"}>
//                                   <Heading size="md">{x.name}</Heading>
//                                   <Tag
//                                     borderRadius="full"
//                                     variant="solid"
//                                     colorScheme="green"
//                                     marginRight={0}
//                                   >
//                                     <TagLabel>{x.orderStatus}</TagLabel>
//                                   </Tag>
//                                 </Flex>
//                                 <SimpleGrid columns={[2]}>
//                                   <Box
//                                     border="none"
//                                     padding="4"
//                                     borderRadius="md"
//                                     display="grid"
//                                     gridTemplateColumns="max-content max-content 1fr"
//                                     gridGap="2"
//                                   >
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Payment Method
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       {x.paymentMethod}
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Total Price
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Rp. {x.totalPrice?.toLocaleString()}
//                                     </Text>
//                                   </Box>
//                                   <Box>
//                                     <Accordion allowToggle>
//                                       <AccordionItem>
//                                         <h2>
//                                           <AccordionButton>
//                                             <Box
//                                               as="span"
//                                               flex="1"
//                                               textAlign="left"
//                                             >
//                                               Orders
//                                             </Box>
//                                             <AccordionIcon />
//                                           </AccordionButton>
//                                         </h2>
//                                         {x.orders?.map((item, idx) => (
//                                           <Box key={idx} borderRadius="md">
//                                             <AccordionPanel mt={"20px"}>
//                                               <Text
//                                                 fontSize="lg"
//                                                 fontFamily={"Sans-serif"}
//                                               >
//                                                 {item.category}
//                                               </Text>
//                                               <Box
//                                                 marginTop={"15px"}
//                                                 border="none"
//                                                 borderRadius="md"
//                                                 display="grid"
//                                                 gridTemplateColumns="max-content max-content 1fr"
//                                                 gridGap="2"
//                                               >
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   Price
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   Rp.{" "}
//                                                   {item.base_price?.toLocaleString()}
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   quantity
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   {item.quantity}
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   title
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   {item.title}
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   variant
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   {item.variant}
//                                                 </Text>
//                                               </Box>
//                                             </AccordionPanel>
//                                           </Box>
//                                         ))}
//                                       </AccordionItem>
//                                     </Accordion>
//                                   </Box>
//                                 </SimpleGrid>
//                               </CardBody>
//                             </Stack>
//                           </Card>
//                         </AccordionPanel>
//                       )}

//                       {data === "crm" && (
//                         <AccordionPanel pb={4}>
//                           <Card
//                             direction={{ base: "column", sm: "row" }}
//                             overflow="hidden"
//                             variant="outline"
//                             key={subIndex}
//                           >
//                             <Image
//                               objectFit="cover"
//                               maxW={{ base: "100%", sm: "200px" }}
//                               src={themeConfig.logokotak}
//                               alt="Caffe Latte"
//                             />

//                             <Stack w={"80%"}>
//                               <CardBody>
//                                 <Flex justifyContent={"space-between"}>
//                                   <Heading size="md">{x.name}</Heading>
//                                   <Tag
//                                     borderRadius="full"
//                                     variant="solid"
//                                     colorScheme="green"
//                                     marginRight={0}
//                                   >
//                                     <TagLabel>{x.orderStatus}</TagLabel>
//                                   </Tag>
//                                 </Flex>
//                                 <SimpleGrid columns={[2]}>
//                                   <Box
//                                     border="none"
//                                     padding="4"
//                                     borderRadius="md"
//                                     display="grid"
//                                     gridTemplateColumns="max-content max-content 1fr"
//                                     gridGap="2"
//                                   >
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Category
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       {x.category}
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Email
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       {x.email}
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Phone Number
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       {x.phoneNumber}
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Payment Method
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       {x.paymentMethod}
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Total Price
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       :
//                                     </Text>
//                                     <Text
//                                       fontSize="lg"
//                                       fontFamily={"Sans-serif"}
//                                     >
//                                       Rp. {x.amount?.toLocaleString()}
//                                     </Text>
//                                   </Box>
//                                   <Box>
//                                     <Accordion allowToggle>
//                                       <AccordionItem>
//                                         <h2>
//                                           <AccordionButton>
//                                             <Box
//                                               as="span"
//                                               flex="1"
//                                               textAlign="left"
//                                             >
//                                               Orders
//                                             </Box>
//                                             <AccordionIcon />
//                                           </AccordionButton>
//                                         </h2>
//                                         {x.orders?.map((item, idx) => (
//                                           <Box key={idx} borderRadius="md">
//                                             <AccordionPanel mt={"20px"}>
//                                               <Text
//                                                 fontSize="lg"
//                                                 fontFamily={"Sans-serif"}
//                                               >
//                                                 {item.name}
//                                               </Text>
//                                               <Box
//                                                 marginTop={"15px"}
//                                                 border="none"
//                                                 borderRadius="md"
//                                                 display="grid"
//                                                 gridTemplateColumns="max-content max-content 1fr"
//                                                 gridGap="2"
//                                               >
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   Price
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   Rp.{" "}
//                                                   {item.price?.toLocaleString()}
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   quantity
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   :
//                                                 </Text>
//                                                 <Text
//                                                   fontSize="lg"
//                                                   fontFamily={"Sans-serif"}
//                                                 >
//                                                   {item.qty}
//                                                 </Text>
//                                               </Box>
//                                             </AccordionPanel>
//                                           </Box>
//                                         ))}
//                                       </AccordionItem>
//                                     </Accordion>
//                                   </Box>
//                                 </SimpleGrid>
//                               </CardBody>
//                             </Stack>
//                           </Card>
//                         </AccordionPanel>
//                       )}

//                       {data === "ai" && (
//                         <AccordionPanel pb={4}>
//                           <Card
//                             direction={{ base: "column", sm: "row" }}
//                             overflow="hidden"
//                             variant="outline"
//                             key={subIndex}
//                           >
//                             <Image
//                               objectFit="cover"
//                               maxW={{ base: "100%", sm: "200px" }}
//                               src={themeConfig.logokotak}
//                               alt="Caffe Latte"
//                             />

//                             <Stack w={"80%"}>
//                               <CardBody>
//                                 <Flex justifyContent={"space-between"}>
//                                   <Heading size="md">{x.company_name}</Heading>
//                                   <Tag
//                                     borderRadius="full"
//                                     variant="solid"
//                                     colorScheme="green"
//                                     marginRight={0}
//                                   >
//                                     <TagLabel>{x.paymentStatus}</TagLabel>
//                                   </Tag>
//                                 </Flex>
//                                 <Box
//                                   border="none"
//                                   padding="4"
//                                   borderRadius="md"
//                                   display="grid"
//                                   gridTemplateColumns="max-content max-content 1fr"
//                                   gridGap="2"
//                                 >
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Expire At
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     {moment(x.expired_at).format(
//                                       "DD-MM-YYYY"
//                                     )}
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Name
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     {x.user_name}
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Phone Number
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     {x.user_phone}
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Email
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     {x.user_email}
//                                   </Text>

//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Payment Method
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     {x.paymentMethod}
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Total Price
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Rp. {x.package_amount?.toLocaleString()}
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     Code
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     :
//                                   </Text>
//                                   <Text fontSize="lg" fontFamily={"Sans-serif"}>
//                                     {x.package_code}
//                                   </Text>
//                                 </Box>
//                               </CardBody>
//                             </Stack>
//                           </Card>
//                         </AccordionPanel>
//                       )}
//                     </Fragment>
//                   ))}
//                 </AccordionItem>
//               )
//             )}
//         </Accordion>
//       </Stack>
//     </>
//   );
// };

// export default HistoryPage;
