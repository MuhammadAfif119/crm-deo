import React, { useState, useEffect, useContext, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  Avatar,
  AvatarBadge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  HStack,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { auth, db } from "../../Config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AppSideAccountBar from "../../Components/AppSideAccountBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import useUserStore from "../../Hooks/Zustand/Store";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState();
  const globalState = useUserStore();
  const Navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [select, setSelect] = useState(null);

  const height = window.innerHeight;

  const [barStatus, setBarStatus] = useState(false);

  const contentWidth = barStatus ? "85%" : "95%";

  let [searchParams, setSearchParams] = useSearchParams();

  const currentUser = auth.currentUser;
  useEffect(() => {
    const event1 = [
      {
        id: 1,
        title: "test1",
        start: moment(1697517637 * 1000).toDate(),
        end: moment(1697534334 * 1000).toDate(),
        status: "pending",
      },
      {
        id: 2,
        title: "test",
        start: moment(1697517637 * 1000).toDate(),
        end: moment(1697534334 * 1000).toDate(),
        status: "pending",
      },
      {
        id: 3,
        title: "test",
        start: moment(1697517637 * 1000).toDate(),
        end: moment(1697534334 * 1000).toDate(),
        status: "pending",
      },
      {
        id: 4,
        title: "test",
        start: moment(1697517637 * 1000).toDate(),
        end: moment(1697534334 * 1000).toDate(),
        status: "pending",
      },
      {
        id: 5,
        title: "test",
        start: moment(1697517637 * 1000).toDate(),
        end: moment(1697534334 * 1000).toDate(),
        status: "pending",
      },
      {
        id: 6,
        title: "test",
        start: moment(1697517637 * 1000).toDate(),
        end: moment(1697534334 * 1000).toDate(),
        status: "pending",
      },
    ];
    setMyEvents(event1);
  }, []);

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, allDay }];
      });
    },
    [setMyEvents]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setMyEvents]
  );
  const fetchEvents = async () => {
    try {
      const docRef = doc(db, "schedule", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap?.data().data;
        setEvents(
          data.map((item) => ({
            title: item.name,
            start: moment(item.startDate.seconds * 1000).toDate(),
            // end: moment(item.dateTime).add(1, 'hour').toDate(),
            end: moment(item.endDate.seconds * 1000).toDate(),
            imageUrl: item.image,
            platform: item.platform,
            post: item.post,
            status: item.status,
          }))
        );
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  console.log(myEvents);

  const PlatformArr = [
    {
      name: "youtube",
      icon: <FaYoutube />,
    },
    {
      name: "twitter",
      icon: <FaTwitter />,
    },
    {
      name: "facebook",
      icon: <FaFacebook />,
    },
    {
      name: "instagram",
      icon: <FaInstagram />,
    },
    {
      name: "tiktok",
      icon: <FaTiktok />,
    },
    {
      name: "linkedin",
      icon: <FaLinkedin />,
    },
    {
      name: "google",
      icon: <FaGoogle />,
    },
    {
      name: "pinterest",
      icon: <FaPinterest />,
    },
  ];

  useEffect(() => {
    fetchEvents();

    return () => {};
  }, []);

  const handleCreate = () => {
    Navigate("/calendar/input");
  };

  const handleView = () => {
    Navigate("/calendar/view");
  };

  const handleOpen = (e) => {
    setSelect(e);
    onOpen();
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = "#3174ad";
    const style = {
      backgroundColor,
      borderRadius: "20px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  const Event = ({ event }) => {
    const filterError = PlatformArr?.filter((y) =>
      y?.name?.includes(event.platform)
    );
    const resIcon = filterError[0]?.icon;

    return (
      <HStack
        alignItems={"center"}
        p={1}
        spacing={3}
        cursor={"pointer"}
        onClick={() => handleOpen(event)}
      >
        {/* <Avatar src={event.imageUrl} alt="event" style={{ width: '20px', height: '20px' }} /> */}

        <Avatar
          // cursor={"pointer"}
          size="xs"
          src={event?.imageUrl}
          alt={event?.imageUrl}
        >
          <AvatarBadge boxSize="1.5em" bg="green.500">
            {resIcon && resIcon}
          </AvatarBadge>
        </Avatar>

        <Stack spacing={0}>
          <HStack>
            <Text noOfLines={1} fontSize={"xx-small"}>
              {event?.title}
            </Text>
            {event?.status && (
              <Text noOfLines={1} fontSize={"xx-small"} color="gray.300">
                ( {event?.status} )
              </Text>
            )}
          </HStack>
          <Text noOfLines={1} fontSize={"xx-small"}>
            {event?.post}
          </Text>
        </Stack>
      </HStack>
    );
  };

  return (
    <>
      <Flex>
        <Button onClick={handleCreate} m={"2%"}>
          Create Agenda
        </Button>
        <Button onClick={handleView} m={"2%"}>
          View Agenda
        </Button>
      </Flex>

      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        <Stack w={"100%"} transition={"0.2s ease-in-out"} minH={height}>
          <Stack p={10}>
            <Text fontSize={"xl"} fontWeight="bold" color={"gray.600"}>
              {" "}
              Calendar{" "}
            </Text>
            <DnDCalendar
              localizer={localizer}
              events={myEvents}
              draggableAccessor={(myEvents) => true}
              startAccessor="start"
              endAccessor="end"
              onEventDrop={moveEvent}
              onEventResize={resizeEvent}
              popup
              resizable
              style={{
                height: "100vh",
                backgroundColor: "white",
                padding: 10,
                borderRadius: "10px",
              }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: Event,
              }}
            />
          </Stack>
        </Stack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                defaultValue={select?.title}
                // onChange={(e) => setDatas({ ...datas, title: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="text"
                defaultValue={select?.start}
                // onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type="text"
                defaultValue={select?.end}
                // onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Input
                type="text"
                defaultValue={select?.status}
                // onChange={(e) => setDatas({ ...datas, status: e.target.value })}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CalendarManagementPage;
