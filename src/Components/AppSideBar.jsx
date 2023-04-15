import React, { useEffect, useState } from 'react';
import { Avatar, AvatarBadge, Box, Button, Flex, HStack, Icon, IconButton, Image, Spacer, Stack, Text, useColorMode, useDisclosure, VStack } from '@chakra-ui/react';
import { AiOutlineCloudUpload, AiFillSetting } from 'react-icons/ai';
import { MdArrowForwardIos, MdArrowBackIos } from 'react-icons/md';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/1.png'
import logokotak from '../assets/kotakputih.png'
import { FiRss } from 'react-icons/fi';
import { useContext } from 'react';
import AuthContext from '../Routes/hooks/AuthContext';
import store from 'store'

const AppSideBar = ({ setBarStatus }) => {

  const width = window.innerWidth
  const height = window.innerHeight

  // const [barStatus, setBarStatus] = useState(false)

  const navigate = useNavigate()

  const [userStorage, setUserStorage] = useState({})

  const { currentUser,  signOut } = useContext(AuthContext)

  const getDataUser = async () => {
    const res = await store.get("userData");
    setUserStorage(res)
    
  }



  const { isOpen, onToggle } = useDisclosure();
  const { colorMode } = useColorMode();

  const handleBar = () => {
    setBarStatus(isOpen)
  }

  useEffect(() => {
    handleBar()
    getDataUser()

    return () => {
    }
  }, [isOpen])

  const handleLogout = () => {
    signOut()
      .then(() => {
        navigate("/", { replace: true });
        store.clearAll();
      })
      .catch((error) => {
        console.log(error);
      });
  }




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
      w={isOpen ? '240px' : '80px'}
      pt="5"
      pb="4"
      transition="width .3s ease"
      shadow="sm"
      position="fixed"
      overflow="auto"
      borderRightRadius="xl"
      boxShadow="lg"
      h={height}
    >
      <Flex align="center" justify="center" px="4" mb="8" >
        <Flex align="center">
          <IconButton
            aria-label="Toggle Navigation"
            icon={<Image w={isOpen ? '150px' : null} src={isOpen ? logo : logokotak} />}
            onClick={onToggle}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _focus={{ outline: 'none' }}
            transition={"0.2s ease-in-out"}

          />
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

      <VStack spacing="5" px="4" alignItems={'flex-start'} minH={'90%'}  >
        <NavButton
          icon={AiOutlineCloudUpload}
          label="Posts"
          hoverColor={sidebarHoverColor[colorMode]}
          onClick={() => navigate(`/`)}
          isOpen={isOpen}
          transition={"0.2s ease-in-out"}
        />
        <NavButton
          icon={IoShareSocialOutline}
          label="Social Accounts"
          hoverColor={sidebarHoverColor[colorMode]}
          onClick={() => navigate(`/social-account`)}
          isOpen={isOpen}
        />

        <NavButton
          icon={FiRss}
          label="My Feeds"
          hoverColor={sidebarHoverColor[colorMode]}
          onClick={() => navigate(`/my-feed`)}
          isOpen={isOpen}
        />

        <Spacer />

        <Stack  w={'100%'}>
          {currentUser ? (
            <>
              <HStack spacing={3}>
                <Avatar size={'sm'} src={''} alt={''}>
                  <AvatarBadge boxSize='1.25em' bg='green.500' />
                </Avatar>
                <Stack spacing={0} display={isOpen ? "flex" : 'none'} transition={"0.2s ease-in-out"}>
                  <Text fontSize={'sm'} color='gray.700' fontWeight={'bold'} noOfLines={1}>{currentUser?.displayName}</Text>
                  <Text fontSize={'xs'} color='gray.700' textTransform={'capitalize'}>{userStorage?.subscription}</Text>
                </Stack>
                <Spacer />
                <Button display={isOpen ? "flex" : 'none'} size={'sm'} bgColor={'red.600'} onClick={() => handleLogout()}>
                  <Text fontSize={'xs'} color='twitter.100'>Logout</Text>
                </Button>
              </HStack>
            </>
          ) : (
            <Button size={'sm'} bgColor={'blue.600'} onClick={() => navigate('/login')}>
              <Text fontSize={'xs'} color='twitter.100'>Login</Text>
            </Button>
          )}
        </Stack>


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
        <Text ml="4" fontSize="sm" fontWeight="medium">
          {label}
        </Text>
      )}
    </Flex>
  );
};

export default AppSideBar