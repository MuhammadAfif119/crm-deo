import React, { useState } from "react";
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import card from "../../assets/kotakputih.png"

function CalendarInputPage() {
  const [datas, setDatas] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [image, setImage] = useState();

  const unixTimestampStart = Math.floor(new Date(startDate).getTime() / 1000);
  const unixTimestampEnd = Math.floor(new Date(endDate).getTime() / 1000);

  const data = {
    ...datas, 
    startDate: unixTimestampStart, 
    endDate: unixTimestampStart, 
    image: image};
  console.log(data)

  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          <Image
            rounded={"md"}
            alt={"product image"}
            src={image? image : "http://localhost:3000/static/media/kotakputih.cb3515c0d29bb858cafa.png" }
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "2xl", lg: "3xl" }}
            >
              Create New Agenda
            </Heading>
          </Box>

          <Stack spacing={{ base: 4, sm: 6 }} direction={"column"}>
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Agenda Details
              </Text>

              <List spacing={2}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setDatas({ ...datas, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Platform</FormLabel>
                  <Select placeholder="Select option" onChange={(e) =>
                      setDatas({ ...datas, platform: e.target.value })
                    }>
                    <option value="Instagram">Instagram</option>
                    <option value="Linkedin">Linkedin</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Youtube">Youtube</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Tiktok">Tiktok</option>
                    <option value="Google">Google</option>
                    <option value="Pinterest">Pinterest</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input type="text" onChange={(e) => setImage(e.target.value)}/>
                </FormControl>
                <FormControl>
                  <FormLabel>Post</FormLabel>
                  <Input type="text" onChange={(e) =>
                      setDatas({ ...datas, post: e.target.value })
                    }/>
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Input type="text" onChange={(e) =>
                      setDatas({ ...datas, status: e.target.value })
                    }/>
                </FormControl>
              </List>
            </Box>
          </Stack>

          <Button
            rounded={"none"}
            w={"full"}
            mt={8}
            size={"lg"}
            py={"7"}
            bg={useColorModeValue("gray.900", "gray.50")}
            color={useColorModeValue("white", "gray.900")}
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
          >
            Submit
          </Button>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}

export default CalendarInputPage;
