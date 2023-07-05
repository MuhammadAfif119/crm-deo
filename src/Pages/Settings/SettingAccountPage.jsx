// import {
//   Avatar,
//   Box,
//   Button,
//   Container,
//   Divider,
//   Flex,
//   FormControl,
//   FormHelperText,
//   FormLabel,
//   Input,
//   InputGroup,
//   InputLeftAddon,
//   Stack,
//   StackDivider,
//   Text,
//   Textarea,
// } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// // import { updateProfileFirebase } from '../../Apis/firebaseApi';
// // import { DropZoneComponent } from '../../Components/Forms/DropZoneComponent'
// import { auth } from "../../Config/firebase";

// export const SettingAccountPage = () => {
//   const [data, setData] = useState({});
//   const user = auth.currentUser;

//   const handleUpdate = async () => {
//     console.log(data);
//     await updateProfileFirebase(data);
//   };

//   useEffect(() => {
//     return () => {};
//   }, []);

//   return (
//     <Box
//       as="section"
//       py={{
//         base: "4",
//         md: "8",
//       }}
//     >
//       <Container
//         py={{
//           base: "4",
//           md: "8",
//         }}
//       >
//         <Stack spacing="5">
//           <Stack
//             spacing="4"
//             direction={{
//               base: "column",
//               sm: "row",
//             }}
//             justify="space-between"
//           >
//             <Box>
//               <Text fontSize="lg" fontWeight="medium">
//                 Your Profile
//               </Text>
//               <Text color="muted" fontSize="sm">
//                 Tell others who you are
//               </Text>
//             </Box>
//             <Button alignSelf="start" onClick={() => handleUpdate()}>
//               Save
//             </Button>
//           </Stack>
//           <Divider />
//           <Stack spacing="5" divider={<StackDivider />}>
//             <FormControl id="name">
//               <Stack
//                 direction={{
//                   base: "column",
//                   md: "row",
//                 }}
//                 spacing={{
//                   base: "1.5",
//                   md: "8",
//                 }}
//                 justify="space-between"
//               >
//                 <FormLabel variant="inline">Name</FormLabel>
//                 <Input
//                   onChange={(e) =>
//                     setData({ ...data, displayName: e.target.value })
//                   }
//                   maxW={{
//                     md: "3xl",
//                   }}
//                   defaultValue={user?.displayName ? user.displayName : ""}
//                 />
//               </Stack>
//             </FormControl>
//             <FormControl id="email">
//               <Stack
//                 direction={{
//                   base: "column",
//                   md: "row",
//                 }}
//                 spacing={{
//                   base: "1.5",
//                   md: "8",
//                 }}
//                 justify="space-between"
//               >
//                 <FormLabel variant="inline">Email</FormLabel>
//                 <Input
//                   type="email"
//                   disabled
//                   maxW={{
//                     md: "3xl",
//                   }}
//                   defaultValue={user?.email ? user.email : ""}
//                 />
//               </Stack>
//             </FormControl>
//             <FormControl id="phone">
//               <Stack
//                 direction={{
//                   base: "column",
//                   md: "row",
//                 }}
//                 spacing={{
//                   base: "1.5",
//                   md: "8",
//                 }}
//                 justify="space-between"
//               >
//                 <FormLabel variant="inline">Phone</FormLabel>
//                 <Input
//                   type="tel"
//                   onChange={(e) =>
//                     setData({ ...data, phoneNumber: e.target.value })
//                   }
//                   maxW={{
//                     md: "3xl",
//                   }}
//                   defaultValue={user?.phoneNumber ? user.phoneNumber : ""}
//                 />
//               </Stack>
//             </FormControl>
//             <FormControl id="picture">
//               <Stack
//                 direction={{
//                   base: "column",
//                   md: "row",
//                 }}
//                 spacing={{
//                   base: "1.5",
//                   md: "8",
//                 }}
//                 justify="space-between"
//               >
//                 <FormLabel variant="inline">Photo</FormLabel>
//                 <Stack
//                   spacing={{
//                     base: "3",
//                     md: "5",
//                   }}
//                   direction={{
//                     base: "column",
//                     sm: "row",
//                   }}
//                   width="full"
//                   maxW={{
//                     md: "3xl",
//                   }}
//                 >
//                   <Avatar
//                     size="lg"
//                     name={user.email}
//                     src={user?.photoURL ? user.photoURL : ""}
//                   />
//                   <DropZoneComponent width="full" />
//                 </Stack>
//               </Stack>
//             </FormControl>
//             <FormControl id="website">
//               <Stack
//                 direction={{
//                   base: "column",
//                   md: "row",
//                 }}
//                 spacing={{
//                   base: "1.5",
//                   md: "8",
//                 }}
//                 justify="space-between"
//               >
//                 <FormLabel variant="inline">Website</FormLabel>
//                 <InputGroup
//                   maxW={{
//                     md: "3xl",
//                   }}
//                 >
//                   <InputLeftAddon>https://</InputLeftAddon>
//                   <Input defaultValue="www.chakra-ui.com" />
//                 </InputGroup>
//               </Stack>
//             </FormControl>
//             <FormControl id="bio">
//               <Stack
//                 direction={{
//                   base: "column",
//                   md: "row",
//                 }}
//                 spacing={{
//                   base: "1.5",
//                   md: "8",
//                 }}
//                 justify="space-between"
//               >
//                 <Box>
//                   <FormLabel variant="inline">Bio</FormLabel>
//                   <FormHelperText mt="0" color="muted">
//                     Write a short introduction about you
//                   </FormHelperText>
//                 </Box>
//                 <Textarea
//                   maxW={{
//                     md: "3xl",
//                   }}
//                   rows={5}
//                   resize="none"
//                 />
//               </Stack>
//             </FormControl>

//             <Flex direction="row-reverse">
//               <Button onClick={() => handleUpdate()}>Save</Button>
//             </Flex>
//           </Stack>
//         </Stack>
//       </Container>
//     </Box>
//   );
// };
