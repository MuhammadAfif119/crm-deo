import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { updatePassword } from "firebase/auth";
import { auth } from "../../Config/firebase";

const SettingPasswordPage = () => {
  const user = auth.currentUser;
  const toast = useToast();

  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [input, setInput] = useState({ password: null, confirmPassword: null });

  const handleClick = (type) => {
    if (type === "password") {
      setShow({ ...show, password: !show.password });
    } else {
      setShow({ ...show, confirmPassword: !show.confirmPassword });
    }
  };

  const handleUpdate = () => {
    console.log(input, "dwdw");
    if (
      input.password === null ||
      input.password === "" ||
      Input.confirmPassword === null ||
      Input.confirmPassword === ""
    ) {
      toast({
        title: "Error",
        description: "Fields are required!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (input.password === input.confirmPassword) {
      updatePassword(user, input.password)
        .then(() => {
          toast({
            title: "Success",
            description: "Password has been edited!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch((error) => {
          toast({
            title: error.code,
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Error",
        description: "Password did not match!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const inputStyles = {
    "&::placeholder": {
      color: "gray.500",
    },
  };

  return (
    <Box
      as="section"
      py={{
        base: "4",
        md: "8",
      }}
    >
      <Container
        py={{
          base: "4",
          md: "8",
        }}
      >
        {/* <Box mb="5">
          <BackButtons />
        </Box> */}

        <Stack spacing="5">
          <Stack
            spacing="4"
            direction={{
              base: "column",
              sm: "row",
            }}
            justify="space-between"
          >
            <Box>
              <Text fontSize="lg" fontWeight="medium">
                Password
              </Text>
              <Text color="muted" fontSize="sm">
                Change your password
              </Text>
            </Box>
            {/* <Button alignSelf="start" onClick={() => handleUpdate()}>
              Save
            </Button> */}
          </Stack>
          <Divider />
          <Stack spacing="5" divider={<StackDivider />}>
            <FormControl id="name" isRequired>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify="space-between"
              >
                <FormLabel variant="inline" w={{ base: "100%", md: "30%" }}>
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    bgColor="white"
                    color="black"
                    sx={inputStyles}
                    resize="none"
                    pr="4.5rem"
                    type={show.password ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={(e) =>
                      setInput({ ...input, password: e.target.value })
                    }
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClick("password")}
                    >
                      {show.password ? <FiEye /> : <FiEyeOff />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Stack>
            </FormControl>
            <FormControl id="name" isRequired>
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                spacing={{
                  base: "1.5",
                  md: "8",
                }}
                justify="space-between"
              >
                <FormLabel variant="inline" w={{ base: "100%", md: "30%" }}>
                  Confirm Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    bgColor="white"
                    color="black"
                    sx={inputStyles}
                    resize="none"
                    pr="4.5rem"
                    type={show.confirmPassword ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={(e) =>
                      setInput({ ...input, confirmPassword: e.target.value })
                    }
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClick("confirmPassword")}
                    >
                      {show.confirmPassword ? <FiEye /> : <FiEyeOff />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Stack>
            </FormControl>
            <Flex direction="row-reverse">
              <Button onClick={() => handleUpdate()} colorScheme="green">
                Save
              </Button>
            </Flex>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default SettingPasswordPage;
