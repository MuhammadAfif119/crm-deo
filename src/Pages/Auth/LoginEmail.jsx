import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Spacer,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import logo from "../../assets/1.png";
import { MdEmail, MdVpnKey } from "react-icons/md";
import colors from "../../Utils/colors";
import AuthContext from "../../Routes/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import AppSponsor from "../../Components/AppSponsor";

function LoginEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, currentUser } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email !== "" && password !== "") {
      login(email, password);
    } else {
      toast({
        title: "Entrepreneurs.id",
        description: "Cek kembali email dan password anda.",
        color: "warning",
      });
    }
  };

  const height = window.innerHeight;
  const width = window.innerWidth;

  return (
    <>
      <Stack
        spacing={10}
        pt={20}
        minH={height}
        bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg) no-repeat center center fixed"
        bgSize="cover"
        alignItems={"center"}
        justifyContent="center"
      >
        <Stack alignItems={"center"} justifyContent="center">
          <Stack
            w={["90%", null, width / 4]}
            p={10}
            spacing={3}
            bgColor="blackAlpha.600"
            shadow={"md"}
            borderRadius={"xl"}
            _hover={{ transform: "scale(1.1)", shadow: "xl" }}
            transition={"0.2s ease-in-out"}
            alignItems={"center"}
            justifyContent="center"
          >
            <Box>
              <Image
                w="200px"
                borderRadius={20}
                src={logo}
                alt="Alternate Text"
              />
            </Box>
            <Spacer />
            <Stack alignItems="center">
              <InputGroup
                w={{
                  base: "100%",
                  md: "285",
                }}
              >
                <InputLeftAddon
                  shadow={"md"}
                  children={<MdEmail name="email" size={24} color="black" />}
                />
                <Input
                  w={{
                    base: "100%",
                    md: "100%",
                  }}
                  placeholder="email"
                  fontSize={"sm"}
                  shadow={3}
                  bgColor={"white"}
                  color={colors.black}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Stack>
            <Stack alignItems="center">
              <InputGroup
                w={{
                  base: "100%",
                  md: "100%",
                }}
              >
                <InputLeftAddon
                  shadow={"md"}
                  children={<MdVpnKey size={24} color="black" />}
                />
                <Input
                  w={{
                    base: "100%",
                    md: "100%",
                  }}
                  placeholder="password"
                  fontSize={"sm"}
                  shadow={"md"}
                  type="password"
                  bgColor={"white"}
                  color={colors.black}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Stack>

            <Button
              shadow={"md"}
              size={"sm"}
              bgColor={colors.buttonPrimary}
              onClick={() => handleLogin()}
            >
              <Text
                color={colors.buttonSecondary}
                fontSize="xs"
                fontWeight="bold"
              >
                CONTINUE
              </Text>
            </Button>

            <Spacer />

            <HStack space={1}>
              {/* <Text color={'gray.400'} fontSize={['xs', null, 'sm']} >Don't have any account ?</Text> */}
              {/* <Text color={'gray.400'} fontSize={['xs', null, 'sm']} cursor='pointer' fontWeight='bold' onClick={() => navigate("/signup")}>Join now !</Text> */}
            </HStack>
          </Stack>
        </Stack>

        <Stack>
          <AppSponsor />
        </Stack>
      </Stack>
    </>
  );
}

export default LoginEmail;
