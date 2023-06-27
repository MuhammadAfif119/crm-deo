import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Container,
    Divider,
    Flex,
    HStack,
    Icon,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    useBreakpointValue,
  } from "@chakra-ui/react";
  import { FiHelpCircle, FiMenu, FiSearch, FiSettings } from "react-icons/fi";
import themeConfig from "../../Config/themeConfig";
  
  function HeaderComponent({ layout }) {
    const isDesktop = useBreakpointValue({
      base: false,
      lg: true,
    });
  
    if (layout.type === "horizontal" || layout.type === "vertical-horizontal")
      return (
        <Box
          mb={{
            base: "6",
            md: "12",
          }}
          as="nav"
          width={"full"}
          bg={"transparent"}
          position="sticky"
          zIndex="docked"
          top="0"
          shadow={"base"}
          rounded={"lg"}
        >
          <Box as="nav" bg={"white"} rounded={"lg"}>
            {/* <Container> */}
            <Flex
              justify="space-between"
              py={{
                base: "2",
                lg: "2",
              }}
              px={{
                base: "4",
                lg: "6",
              }}
            >
              <HStack spacing="4">
                {/* <Logo /> */}
  
                {layout.type === "horizontal" ? (
                  <Image src={themeConfig.logo} maxH={30} />
                ) : (
                  <></>
                )}
  
                {layout.type === "horizontal" ? (
                  isDesktop && (
                    <ButtonGroup variant="ghost" spacing="1">
                      <Button>Home</Button>
                      <Button aria-current="page">Dashboard</Button>
                      <Button>Tasks</Button>
                      <Button>Bookmarks</Button>
                      <Button>Users</Button>
                    </ButtonGroup>
                  )
                ) : (
                  <></>
                )}
              </HStack>
              {isDesktop ? (
                <HStack spacing="4">
                  <ButtonGroup variant="ghost" spacing="1">
                    <IconButton
                      icon={<FiSearch fontSize="1.25rem" />}
                      aria-label="Search"
                    />
                    <IconButton
                      icon={<FiSettings fontSize="1.25rem" />}
                      aria-label="Settings"
                    />
                    <IconButton
                      icon={<FiHelpCircle fontSize="1.25rem" />}
                      aria-label="Help Center"
                    />
                  </ButtonGroup>
                  {layout.type === "vertical-horizontal" &&
                  layout.userProfile === "navbar" ? (
                    <>
                      <Avatar
                        boxSize="10"
                        name="Christoph Winston"
                        src="https://tinyurl.com/yhkm2ek8"
                      />
                    </>
                  ) : layout.type === "horizontal" ? (
                    <Avatar
                      boxSize="10"
                      name="Christoph Winston"
                      src="https://tinyurl.com/yhkm2ek8"
                    />
                  ) : (
                    <> </>
                  )}
                </HStack>
              ) : (
                <IconButton
                  variant="ghost"
                  icon={<FiMenu fontSize="1.25rem" />}
                  aria-label="Open Menu"
                />
              )}
            </Flex>
            {/* </Container> */}
            {/* {isDesktop && (
            <>
              <Divider />
              <Container py="3">
              <Flex justify="space-between" py={"3"} px={"4"}>
                <ButtonGroup variant="ghost" spacing="1">
                  <Button aria-current="page">Overview</Button>
                  <Button>Analytics</Button>
                  <Button>Key Metrics</Button>
                  <Button>Risks</Button>
                  <Button>Alerts</Button>
                </ButtonGroup>
  
                <InputGroup maxW="xs">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiSearch} color="muted" boxSize="5" />
                  </InputLeftElement>
                  <Input placeholder="Search" />
                </InputGroup>
              </Flex>
              </Container>
            </>
          )} */}
          </Box>
        </Box>
      );
  
    return <></>;
  }
  
  export default HeaderComponent;
  