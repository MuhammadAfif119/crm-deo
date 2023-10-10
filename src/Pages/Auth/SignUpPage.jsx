import {
  Box,
  Button,
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
import {
  MdEmail,
  MdAccountCircle,
  MdOutlinePhoneIphone,
  MdLock,
  MdVisibilityOff,
  MdVisibility,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import logo from "../../assets/1.png";
import { auth, db } from "../../Config/firebase";

function SignUpPage() {
  const [name, setName] = useState("");
  const [nohp, setNohp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = () => {
    const displayName = name;
    if (
      (email === "" && password === "" && nohp === "" && name === "") ||
      password !== confirmPassword
    )
      return toast({
        title: "Something Wrong",
        description: "check your email, password, data",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-end",
      });

    if (email !== "" && password !== "" && nohp !== "" && name !== "") {
      try {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            await updateProfile(auth.currentUser, {
              displayName,
            });
            sendEmailVerification(auth.currentUser);

            // Signed in
            const user = userCredential.user;
            if (user) {
              await setDoc(doc(db, "users", user.uid), {
                name: name,
                keyword_name: name.toLowerCase().split(" ").join(""),
                email: user.email,
                createdAt: new Date(),
              });

              setLoading(false);
              navigate("/", { replace: true });

              toast({
                title: "Success Create",
                description: `Success Create account ${user.displayName}`,
                status: "success",
                duration: 10000,
                isClosable: true,
                position: "top-right",
              });
            }
          })
          .catch((error) => {
            toast({
              title: "Something Wrong",
              description: `It looks like you don't have account in your browser, please signup and reload this page / ${error.message}`,
              status: "error",
              duration: 10000,
              isClosable: true,
              position: "top-right",
            });
            setLoading(false);
          });
      } catch (error) {
        toast({
          title: "Something Wrong",
          description: error,
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top-end",
        });
        setLoading(false);
      }
    } else {
      toast({
        title: "Something Wrong",
        description: "check your data",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-end",
      });
    }
  };

  const height = window.innerHeight;
  const width = window.innerWidth;

  return (
    <>
      {/* <AppHeader /> */}

      <Stack
        pt={20}
        spacing={10}
        minH={height}
        bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg) no-repeat center center fixed"
        bgSize="cover"
        alignItems={"center"}
        justifyContent="center"
      >
        <Stack alignItems={"center"} justifyContent="center">
          <Stack
            w={["90%", null, width / 4]}
            spacing={3}
            p={10}
            bgColor="blackAlpha.500"
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
                  children={<MdAccountCircle size={24} color="black" />}
                />
                <Input
                  placeholder="Full name"
                  fontSize={"sm"}
                  type="text"
                  bgColor={"white"}
                  color={"blackAlpha.700"}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputGroup>
            </Stack>

            <Stack alignItems="center">
              <InputGroup
                w={{
                  base: "100%",
                  md: "285",
                }}
              >
                <InputLeftAddon
                  children={<MdOutlinePhoneIphone size={24} color="black" />}
                />
                <Input
                  w={{
                    base: "100%",
                    md: "100%",
                  }}
                  placeholder="Phone number"
                  fontSize={"sm"}
                  type="number"
                  bgColor={"white"}
                  color={"blackAlpha.700"}
                  onChange={(e) => setNohp(e.target.value)}
                />
              </InputGroup>
            </Stack>

            <Stack alignItems="center">
              <InputGroup
                w={{
                  base: "100%",
                  md: "285",
                }}
              >
                <InputLeftAddon
                  children={<MdEmail name="email" size={24} color="black" />}
                />
                <Input
                  w={{
                    base: "100%",
                    md: "100%",
                  }}
                  placeholder="Email"
                  fontSize={"sm"}
                  bgColor={"white"}
                  color={"blackAlpha.700"}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Stack>

            <Stack alignItems="center">
              <InputGroup
                w={{
                  base: "90%",
                  md: "275",
                }}
              >
                <InputLeftAddon children={<MdLock size={24} color="black" />} />
                <Input
                  w={{
                    base: "100%",
                    md: "100%",
                  }}
                  placeholder="Password"
                  fontSize={"sm"}
                  type={showPassword ? "text" : "password"}
                  bgColor={"white"}
                  color={"blackAlpha.700"}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Stack alignItems="center">
              <InputGroup
                w={{
                  base: "90%",
                  md: "275",
                }}
              >
                <InputLeftAddon children={<MdLock size={24} color="black" />} />
                <Input
                  w={{
                    base: "100%",
                    md: "100%",
                  }}
                  placeholder="Confirm password"
                  fontSize={"sm"}
                  id="password"
                  type={showConfirmPassword ? "text" : "password"}
                  bgColor={"white"}
                  color={"blackAlpha.700"}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement>
                  {showConfirmPassword ? (
                    <MdVisibilityOff
                      size={20}
                      color="black"
                      onClick={toggleConfirmPasswordVisibility}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <MdVisibility
                      size={20}
                      color="black"
                      onClick={toggleConfirmPasswordVisibility}
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
                  onClick={() => handleSignup()}
                >
                  <Text color={"black"} fontSize="xs" fontWeight="bold">
                    CREATE ACCOUNT
                  </Text>
                </Button>
              )}
            </Stack>

            <Spacer />
            <Spacer />

            <HStack space={1}>
              <Text color={"gray.400"} fontSize="sm">
                Back to
              </Text>
              <Text
                color={"gray.400"}
                fontWeight="bold"
                fontSize="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Text>
            </HStack>
          </Stack>
        </Stack>

        <Stack>{/* <AppSponsor /> */}</Stack>
      </Stack>
    </>
  );
}

export default SignUpPage;
