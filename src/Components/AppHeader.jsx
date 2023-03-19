import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Image,
  Input,
  Center,
  Avatar,
  Toast,
  HStack,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import store from "store";
import { Link } from "react-router-dom";

import logobelanja from '../assets/logoitem.png'
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import colors from "../Utils/colors";
import AuthContext from "../Routes/hooks/AuthContext";

export default function AppHeader() {

  const { isOpen, onToggle } = useDisclosure();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate()


	const height = window.innerHeight
	const width = window.innerWidth

  useEffect(() => {
    const onScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      if (currentPosition > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Box>
      <Stack
        bgColor={isScrolled ? 'white' : 'transparent'}
        color="white"
		boxShadow={isScrolled ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none'}
        px={[ 0, null, 20 ]}
        borderStyle={"solid"}
		py={2}
		alignItems='center'
		justifyContent={'space-evenly'}
		transition={'all 0.3s ease-in-out'}
		position={'fixed'}
		w={'100%'}
      >
        <HStack spacing={10} justifyContent="space-evenly" alignItems="center">
          <Box >
            <Link to="/">
              <Image w={'150px'} src={logobelanja} />
            </Link>
          </Box>

		  <Flex
          flex={{ base: 1, md: "auto" }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon color={isScrolled ? 'black' : 'white'} w={5} h={5} />
            }
            color='black'
            aria-label={"Toggle Navigation"}
          />
        </Flex>

          <Flex display={{ base: "none", md: "flex" }}>
            <Center>
              <DesktopNav isScrolled={isScrolled}/>
            </Center>
          </Flex>
          <Spacer />
          <Flex display={{ base: "none", md: "flex" }}>
            <AccountNav navigate={navigate}/>
          </Flex>
        </HStack>
      </Stack>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const AccountNav = ({navigate}) => {



  return (

    
    <Stack flex={{ base: 1, md: 2 }} alignItems="center" direction={"row"} spacing={3}>
      <Button bgColor={'blue.400'} size='md' px={10} onClick={() => navigate('/get-started')}>
		<Text fontSize={'sm'}>Build an App</Text>
	  </Button>
    </Stack>)
}

const DesktopNav = ({isScrolled}) => {
  const linkColor = useColorModeValue("white");
  const linkHoverColor = useColorModeValue("white");
  const popoverContentBgColor = useColorModeValue("black");

  return (
    <Stack direction={"row"} spacing={20}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                to={navItem.to ?? "#"}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                <Text fontSize={"sm"} color={isScrolled ? 'black' : 'white'}>
                  {navItem.label}
                </Text>
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, to, subLabel }: NavItem) => {
  return (
    <Link
      to={to}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("black") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "white" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"white"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue("black")} p={4}  pt={20} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, to }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={to ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color={useColorModeValue("white")}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>


      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} to={child.to}>
                {child.label}
              </Link>
            ))}
        </Stack>

      </Collapse>

    </Stack>
  );
};

interface NavItem {
  label: string;
  children?: Array<NavItem>;
  to?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Solutions",
    to: "/",
  },
  {
    label: "Features",
    to: "/",
  },
  {
    label: "Reseller",
    to: "/",
  },
  {
    label: "Pricing",
    to: "/pricing",
  },
  {
    label: "Costumer Stories",
    to: "/",
  },
  {
    label: "Resource",
    to: "/",
  },
  // {
  //   label: "Course",
  //   to: "/course",
  // },
];