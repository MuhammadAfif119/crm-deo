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
import BackButtons from "../../Components/Buttons/BackButtons";

const LinkItems = [
  { name: "User Live", icon: HiStatusOnline, navigate: "/administration/user-live" },
  { name: "User List", icon: HiUsers, navigate: "/administration/user-list" },
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
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
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
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" marginTop={"10%"}>
        <Box cursor={"pointer"}>
          <Image src={themeConfig.logokotak} borderRadius="full"/>
        </Box>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      
      <Box marginTop="15%">
      {LinkItems.map((link) => (
        <Link key={link.name} to={link.navigate}>
          <NavItem icon={link.icon}>
            {link.name}
          </NavItem>
        </Link>
      ))}
      </Box>
      <BackButtons />
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
        <Image src={themeConfig.logokotak} borderRadius="full" h="50px" w="50px"/>
      </Text>
    </Flex>
  );
};

export default AdminSidebar;
