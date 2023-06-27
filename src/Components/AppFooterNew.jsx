import {
  Box,
  Container,
  Flex,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GoLocation } from "react-icons/go";
import {
  AiOutlineMail,
  AiFillApple,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";

function AppFooterNew() {
  return (
    <Stack>
      <Stack bgColor={"gray.100"} py={10}>
        <SimpleGrid columns={[1, null, 3]} gap={10}>
          <Stack alignItems={"center"} justifyContent="center">
            <Stack
              bgColor={"white"}
              p={3}
              borderRadius="md"
              shadow={"md"}
              w="50px"
              h={"50px"}
              alignItems="center"
              justifyContent={"center"}
            >
              <Image src="https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/app-builder.svg" />
            </Stack>
            <Stack>
              <Text color={"gray.600"} fontSize="sm" fontWeight={"bold"}>
                Powerful app builder
              </Text>
            </Stack>
          </Stack>

          <Stack alignItems={"center"} justifyContent="center">
            <Stack
              bgColor={"white"}
              p={3}
              borderRadius="md"
              shadow={"md"}
              w="50px"
              h={"50px"}
              alignItems="center"
              justifyContent={"center"}
            >
              <Image src="https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/ios-and-android.svg" />
            </Stack>
            <Stack>
              <Text color={"gray.600"} fontSize="sm" fontWeight={"bold"}>
                IOS, Android, & PWA
              </Text>
            </Stack>
          </Stack>

          <Stack alignItems={"center"} justifyContent="center">
            <Stack
              bgColor={"white"}
              p={3}
              borderRadius="md"
              shadow={"md"}
              w="50px"
              h={"50px"}
              alignItems="center"
              justifyContent={"center"}
            >
              <Image src="https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/unlimited-customization.svg" />
            </Stack>
            <Stack>
              <Text color={"gray.600"} fontSize="sm" fontWeight={"bold"}>
                Unlimited Costumization
              </Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Stack>

      <Stack>
        <Box>
          <Box>
            <Box
              bg={useColorModeValue("white")}
              color={useColorModeValue("black")}
            >
              <Container as={Stack} maxW={"6xl"} py="30px" px="10px">
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing="30px">
                  <Stack align={"flex-start"} spacing="20px">
                    <Text fontSize="25px" fontWeight="bold">
                      Deoapp.com
                    </Text>
                    <Text fontSize={"sm"} color="gray.800">
                      Deoapp adalah platform untuk membantu bisnis kamu membuat
                      aplikasi tanpa harus ngoding
                    </Text>

                    <HStack
                      alignItems={"flex-start"}
                      justifyContent="flex-start"
                    >
                      <Stack>
                        <GoLocation />
                      </Stack>
                      <Stack>
                        <Text fontSize={"sm"} color="gray.800">
                          Jl. Puri Utama No.7, RT.004/RW.008, Petir, Kec.
                          Cipondoh, Kota Tangerang, Banten 15147
                        </Text>
                      </Stack>
                    </HStack>

                    <HStack
                      alignItems={"flex-start"}
                      justifyContent="flex-start"
                    >
                      <Stack>
                        <AiOutlineMail />
                      </Stack>
                      <Stack>
                        <Text fontSize={"sm"} color="gray.800">
                          edruspasardigital12@gmail.com
                        </Text>
                      </Stack>
                    </HStack>

                    <HStack
                      alignItems={"flex-start"}
                      justifyContent="flex-start"
                    >
                      <Stack>
                        <BsFillTelephoneFill />
                      </Stack>
                      <Stack>
                        <Text fontSize={"sm"} color="gray.800">
                          +62 087887147471
                        </Text>
                      </Stack>
                    </HStack>
                  </Stack>
                  <Stack align={"flex-start"} spacing="20px">
                    <Link to="#">
                      <Text fontSize="25px" fontWeight="bold">
                        Deoapp
                      </Text>
                    </Link>
                    <Link to="#">
                      <Text fontSize={"sm"} color="gray.800">
                        Solutions
                      </Text>
                    </Link>
                    <Link to="#">
                      <Text fontSize={"sm"} color="gray.800">
                        Features
                      </Text>
                    </Link>
                    <Link to="#">
                      <Text fontSize={"sm"} color="gray.800">
                        Reseller
                      </Text>
                    </Link>
                    <Link to="/pricing">
                      <Text fontSize={"sm"} color="gray.800">
                        Pricing
                      </Text>
                    </Link>
                    <Link to="#">
                      <Text fontSize={"sm"} color="gray.800">
                        Costumer & Stories
                      </Text>
                    </Link>
                    <Link to="#">
                      <Text fontSize={"sm"} color="gray.800">
                        Resource
                      </Text>
                    </Link>
                  </Stack>
                  <Stack align={"flex-start"} spacing="20px">
                    <Link to="#">
                      <Text fontSize="25px" fontWeight="bold">
                        Bantuan & Panduan
                      </Text>
                    </Link>
                    <Link to="/syaratketentuan">
                      <Text fontSize={"sm"} color="gray.800">
                        Syarat & Ketentuan
                      </Text>
                    </Link>
                    <Link to="/kebijakanprivasi">
                      <Text fontSize={"sm"} color="gray.800">
                        Kebijakan Privasi
                      </Text>
                    </Link>
                    <Link to="/disclaimer">
                      <Text fontSize={"sm"} color="gray.800">
                        Disclaimer
                      </Text>
                    </Link>
                    <Link to="#">
                      <Text fontSize={"sm"} color="gray.800">
                        Hubungi Kami
                      </Text>
                    </Link>
                  </Stack>
                  <Stack align={"flex-start"} spacing="20px">
                    <Text fontSize="25px" fontWeight="bold">
                      Download Aplikasi
                    </Text>
                    <Stack gap={2}>
                      <Stack alignItems={"center"} w={["200px", null, null]}>
                        <Image src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png?hl=id" />
                      </Stack>

                      <Stack alignItems={"center"} w={["200px", null, null]}>
                        <Image src="data:image/png;base64,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" />
                      </Stack>
                    </Stack>
                    <Text>Ikuti Kami:</Text>
                    <HStack
                      spacing={10}
                      m={5}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <a href={`http://instagram.com/`}>
                        <Stack>
                          <AiFillInstagram size="40px" />
                        </Stack>
                      </a>
                      <a href={`https://www.youtube.com/`}>
                        <Stack>
                          <AiFillYoutube size="40px" />
                        </Stack>
                      </a>
                      <a href={`https://www.tiktok.com/`}>
                        <Stack>
                          <FaTiktok size="30px" />
                        </Stack>
                      </a>
                    </HStack>
                  </Stack>
                </SimpleGrid>
              </Container>
              <Box py={10}>
                <Flex
                  align={"center"}
                  _before={{
                    content: '""',
                    borderBottom: "1px solid",
                    borderColor: useColorModeValue("gray.200", "gray.700"),
                    flexGrow: 1,
                    mr: 8,
                  }}
                  _after={{
                    content: '""',
                    borderBottom: "1px solid",
                    borderColor: useColorModeValue("gray.200", "gray.700"),
                    flexGrow: 1,
                    ml: 8,
                  }}
                ></Flex>
                <Text pt={6} fontSize={"sm"} textAlign={"center"}>
                  Copyright 2021 Deoapp | All Right Reserved | Owned by PT Edrus
                  Pasar Digital
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default AppFooterNew;
