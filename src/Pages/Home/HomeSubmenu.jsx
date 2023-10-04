import {
  IoBrushOutline,
  IoChatbubbleOutline,
  IoMailOutline,
  IoNewspaperOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { HiOutlineLink } from "react-icons/hi2";
import { GoBell } from "react-icons/go";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { auth } from "../../Config/firebase";
import { DeleteIcon } from "@chakra-ui/icons";
import { FcPlus } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";

export const dataToInput = [
  {
    name: "Profile Settings",
    icon: IoSettingsOutline,
    type: "input",
    // content: <ProfileSettingInput />,
  },
  {
    name: "Contacts",
    icon: IoPersonOutline,
    type: "input",
    // content: <ContactInput />,
  },
  {
    name: "Links",
    icon: HiOutlineLink,
    type: "switch",
    // content: <LinkInput />,
  },
  //   {
  //     name: "Consultations",
  //     icon: IoChatbubbleOutline,
  //
  //     type: "switch",
  //   },
  {
    name: "Feed",
    icon: IoNewspaperOutline,
    type: "switch",
    // content: <FeedInput />,
  },
  //   {
  //     name: "Push Notifications",
  //     icon: GoBell,
  //
  //     type: "switch",
  //   },
  //   {
  //     name: "Mailer",
  //     icon: IoMailOutline,
  //
  //     type: "switch",
  //   },
  //   {
  //     name: "Project Info",
  //     icon: IoStorefrontOutline,
  //
  //     type: "switch",
  //   },
  {
    name: "Theme Layout",
    icon: IoBrushOutline,
    type: "switch",
    // content: <ThemeInput />,
  },
];
