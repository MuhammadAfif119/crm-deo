import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Image,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  HStack,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import { ReactText } from "react";
import themeConfig from "../../Config/themeConfig";
import { HiStatusOnline, HiUsers } from "react-icons/hi";
import { RiBuilding4Fill } from "react-icons/ri";
import { AiOutlineFolder } from "react-icons/ai";
import { ArrowBackIcon, CalendarIcon } from "@chakra-ui/icons";
import { TbAffiliate } from "react-icons/tb";
import { BsBuildingFillGear } from "react-icons/bs";


const LinkItems = [
  {
    name: "User Live",
    icon: HiStatusOnline,
    navigate: "/administration/user-live",
  },
  { name: "User List", icon: HiUsers, navigate: "/administration/user-list" },
  { name: "Billing", icon: RiBuilding4Fill, navigate: "/administration/billing" },
  // { name: "History", icon: AiOutlineFolder, navigate: "/administration/history" },
  { name: "Affiliate Billing", icon: TbAffiliate, navigate: "/administration/affiliate-billing" },
  { name: "Data Company", icon: BsBuildingFillGear  , navigate: "/administration/data-company" },
  { name: "Data Calendar", icon: CalendarIcon  , navigate: "/administration/calendar" },  
];

const AdminSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav
        display={{ base: "flex", md: "none" }}
        onOpen={onOpen}
        position="fixed"  
        top="0"          
        left="0"         
        width="100%"      
        zIndex="999"      
      />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
};


const SidebarContent = ({ onClose, ...rest }) => {
  const navigate = useNavigate();

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        marginTop={"18%"}
      >
        <Box cursor={"pointer"}>
          <Flex
            direction="row"
            alignItems="center"
            gap={2}
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            <ArrowBackIcon boxSize={5} color="#808080" />
            <Text fontWeight={500} color="#808080">
              Back
            </Text>
          </Flex>
          <Image src={themeConfig.logokotak} borderRadius="full" />
        </Box>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Box marginTop="15%">
        {LinkItems.map((link) => (
          <Link key={link.name} to={link.navigate}>
            <NavItem icon={link.icon}>{link.name}</NavItem>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        <Image
          src={themeConfig.logokotak}
          borderRadius="full"
          h="50px"
          w="50px"
        />
      </Text>
    </Flex>
  );
};

export default AdminSidebar;
