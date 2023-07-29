import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spacer,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import logo from "../../assets/1.png";
import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdVpnKey,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Config/firebase";
import useUserStore from "../../Hooks/Zustand/Store";


function LoginEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const globalState = useUserStore();

  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email !== "" && password !== "") {
      try {
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        globalState.setUid(user.uid)
        globalState.setName(user.displayName)
        globalState.setEmail(user.email)
        globalState.setIsLoggedIn(true);
  
        toast({
          title: 'Login Successful',
          description: `You have successfully logged in as ${userCredential.user.email}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
  
        navigate("/");
      } catch (error) {
        console.log(error, 'ini error');
        toast({
          title: 'Error',
          description: error.code === 'auth/wrong-password'
            ? 'Wrong email or password. Please try again.'
            : 'An error occurred. Please try again.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };
  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <Stack>
          <Stack alignItems={"center"} justifyContent="center">
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={5}
              pb={10}
              bgColor="blackAlpha.500"
              p={10}
              borderRadius="xl"
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
                    fontSize={"md"}
                    shadow={3}
                    bgColor={"white"}
                    color={"black"}
                    onChange={
                      (e) => setEmail(e.target.value)
                      //   setDataLogin({ ...dataLogin, email: e.target.value })
                    }
                  />
                </InputGroup>
              </Stack>
              <Stack alignItems="center">
                <InputGroup
                  w={{
                    base: "92%",
                    md: "92%",
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
                    fontSize={"md"}
                    shadow={"md"}
                    type={showPassword ? "text" : "password"}
                    bgColor={"white"}
                    color={"black"}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                  />
                  <InputRightElement>
                    {showPassword ? (
                      <MdVisibilityOff
                        size={20}
                        color="black"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <MdVisibility
                        size={20}
                        color="black"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </InputRightElement>
                </InputGroup>
              </Stack>

              <Stack pt={5}>
                {loading ? (
                  <Spinner size={"sm"} />
                ) : (
                  <Button
                    alignItems={"center"}
                    justifyContent="center"
                    size={"sm"}
                    bgColor={"white"}
                    onClick={() => handleLogin()}
                  >
                    <Text color={"black"} fontSize="xs" fontWeight="bold">
                      CONTINUE
                    </Text>
                  </Button>
                )}
              </Stack>

              <Spacer />

              <HStack space={1}>
                <Text color={"gray.400"} fontSize={["xs", null, "sm"]}>
                  Don't have any account ?
                </Text>
                {/* <Text
                  color={"gray.400"}
                  fontSize={["xs", null, "sm"]}
                  cursor="pointer"
                  fontWeight="bold"
                  onClick={() => navigate("/signup")}
                >
                  Join now !
                </Text> */}
              </HStack>
            </Stack>
          </Stack>
          <Spacer />

          <Stack>
            {/* <AppSponsor /> */}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default LoginEmail;
