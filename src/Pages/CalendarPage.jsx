import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Avatar, AvatarBadge, Flex, HStack, Spacer, Stack, Text } from '@chakra-ui/react';
import AuthContext from '../Routes/hooks/AuthContext';
import { db } from '../Config/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import AppSideAccountBar from '../Components/AppSideAccountBar';
import { useSearchParams } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  const height = window.innerHeight

  const [barStatus, setBarStatus] = useState(false)


  const contentWidth = barStatus ? "85%" : "95%";

  let [searchParams, setSearchParams] = useSearchParams();

  const profileKey = searchParams.get("detail")

  const { currentUser } = useContext(AuthContext)



  const fetchEvents = async () => {
    try {

      const docRef = doc(db, "schedule", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap?.data().data
        setEvents(
          data.map((item) => ({
            title: item.name,
            start: moment(item.startDate.seconds * 1000).toDate(),
            // end: moment(item.dateTime).add(1, 'hour').toDate(),
            end: moment(item.endDate.seconds * 1000).toDate(),
            imageUrl: item.image,
            platform: item.platform,
            post: item.post
          }))
        );
      } else {
        console.log("No such document!");
      }


      // const q = query(
      //   collection(db, "schedule"),
      //   where("uid", "==", currentUser.uid)
      // );
      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   data.push(doc.data());
      // });
      // setEvents(
      //   data.map((item) => ({
      //     title: item.name,
      //     start: moment(item.startDate.seconds * 1000).toDate(),
      //     // end: moment(item.dateTime).add(1, 'hour').toDate(),
      //     end: moment(item.endDate.seconds * 1000).toDate(),
      //     imageUrl: item.image,
      //   }))
      // );

    } catch (error) {
      console.log(error, 'ini error')
    }
  }

  const PlatformArr = [
    {
      name: 'youtube',
      icon: <FaYoutube />,
    },
    {
      name: 'twitter',
      icon: <FaTwitter />,
    },
    {
      name: 'facebook',
      icon: <FaFacebook />,
    },
    {
      name: 'instagram',
      icon: <FaInstagram />,
    },
    {
      name: 'tiktok',
      icon: <FaTiktok />,
    },
    {
      name: 'linkedin',
      icon: <FaLinkedin />,
    },
    {
      name: 'google',
      icon: <FaGoogle />,
    },
    {
      name: 'pinterest',
      icon: <FaPinterest />,
    }
  ]

  useEffect(() => {
    fetchEvents()

    return () => {

    }
  }, [])


  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = '#3174ad';
    const style = {
      backgroundColor,
      borderRadius: '20px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style: style,
    };
  };

  const Event = ({ event }) => {

    const filterError = PlatformArr?.filter((y) => y?.name?.includes(event.platform))
    const resIcon = filterError[0]?.icon

    return (
      <HStack alignItems={'center'} p={1} spacing={3} >
        {/* <Avatar src={event.imageUrl} alt="event" style={{ width: '20px', height: '20px' }} /> */}

        <Avatar cursor={'pointer'} size="xs" src={event?.imageUrl} alt={event?.imageUrl} >
          <AvatarBadge boxSize='1.5em' bg='green.500' >
            {resIcon && resIcon}
          </AvatarBadge>
        </Avatar>

        <Stack spacing={0}>
          <Text noOfLines={1} fontSize={'xx-small'}>{event.title}</Text>
            <Text noOfLines={1} fontSize={'xx-small'}>{event.post}</Text>
        </Stack>
      </HStack>
    );
  };

  return (
    <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
      <Stack >
        <AppSideAccountBar setBarStatus={setBarStatus} />
      </Stack>
      <Spacer />
      <Stack w={contentWidth} transition={"0.2s ease-in-out"} minH={height} >
        <Stack p={10}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100vh', backgroundColor: 'white', padding: 10, borderRadius: '10px' }}
            eventPropGetter={eventStyleGetter}
            components={{
              event: Event,
            }}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default CalendarPage;