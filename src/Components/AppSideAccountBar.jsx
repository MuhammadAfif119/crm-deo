import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarBadge, Box, Button, Flex, HStack, Icon, IconButton, Image, Popover, PopoverContent, PopoverTrigger, Spacer, Stack, Text, useColorMode, useDisclosure, VStack } from '@chakra-ui/react';
import { MdArrowForwardIos, MdArrowBackIos,  } from 'react-icons/md';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { RiAccountPinBoxLine } from 'react-icons/ri';
import { useContext } from 'react';
import AuthContext from '../Routes/hooks/AuthContext';
import store from 'store'
import { db } from '../Config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AppSideAccountBar = ({ setBarStatus }) => {

  const width = window.innerWidth
  const height = window.innerHeight

  //   const [barStatus, setBarStatus] = useState(false)

  const navigate = useNavigate()

  const [userStorage, setUserStorage] = useState({})

  const { currentUser } = useContext(AuthContext)


  const [userData, setUserData] = useState([])
  const [socialAccountList, setSocialAccountList] = useState([])
  const [socialMediaList, setSocialMediaList] = useState([])

  let [searchParams, setSearchParams] = useSearchParams();



  const getDataUser = async () => {
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setSocialAccountList(docSnap.data().ayrshare_account);
        setSocialMediaList(docSnap.data().social_accounts);
        setSearchParams(`detail=${docSnap?.data()?.ayrshare_account[0].profileKey}&name=${docSnap?.data()?.ayrshare_account[0].title}`)
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error, 'ini error')
    }

  }

  // const location = useLocation();
  // console.log(location.pathname, 'yses');




  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();

  const handleBar = () => {
    setBarStatus(isOpen)
  }

  useEffect(() => {
    getDataUser()

    return () => {
    }
  }, [currentUser])


  useEffect(() => {
    handleBar()

    return () => {
    }
  }, [isOpen])




  const sidebarBg = {
    light: 'white',
    dark: 'gray.800',
  };

  const sidebarColor = {
    light: 'gray.900',
    dark: 'white',
  };

  const sidebarHoverColor = {
    light: 'blue.600',
    dark: 'blue.200',
  };


  return (
    <Box
      bg={sidebarBg[colorMode]}
      color={sidebarColor[colorMode]}
      w={isOpen ? '200px' : '80px'}
      pt="5"
      pb="4"
      transition="width .3s ease"
      shadow="sm"
      position="fixed"
      borderRightRadius="xl"
      boxShadow="lg"
      height={height}
    >
      <Flex px="4" mb="8" >
        <Flex align="center">
          <IconButton
            aria-label="Toggle Navigation"
            icon={<Icon as={() => (isOpen ? <MdArrowBackIos /> : <MdArrowForwardIos />)} />}
            onClick={onToggle}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _focus={{ outline: 'none' }}
            size={'sm'}
            transition={"0.2s ease-in-out"}
          />


        </Flex>
      </Flex>

      <VStack spacing="2" px="4" alignItems={'flex-start'} >

        <Stack>
          <Text fontSize={'xs'}>Social Account</Text>
        </Stack>

        {socialAccountList?.length > 0 && (
          socialAccountList?.map((x, index) => {
            return (
              <Stack justifyContent={'center'} key={index} borderWidth={2} borderColor={searchParams.get("detail") === x.profileKey ? "blue.300" : 'transparent'} borderRadius={'xl'} w='100%'>
                <NavButton
                  icon={RiAccountPinBoxLine}
                  label={x.title}
                  hoverColor={sidebarHoverColor[colorMode]}
                  onClick={() => setSearchParams(`detail=${x.profileKey}&name=${x.title}`)}
                  isOpen={isOpen}
                />
              </Stack>
            )
          })
        )}


      </VStack>
    </Box>
  );
};

const NavButton = ({ icon, label, hoverColor, onClick, isOpen }) => {
  const [isHover, setIsHover] = useState(false);

  const toggleHover = () => {
    setIsHover(!isHover);
  };

  return (
    <Flex
      align="center"
      p="3"
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: hoverColor, color: 'white' }}
      bg={isHover ? hoverColor : 'transparent'}
      color={isHover ? 'white' : null}
      onClick={onClick}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}

    >
      <Icon as={icon} fontSize='xl' />
      {isOpen && (
        <Text ml="4" fontSize="xs" fontWeight="medium">
          {label}
        </Text>
      )}
    </Flex>
  );
};

export default AppSideAccountBar