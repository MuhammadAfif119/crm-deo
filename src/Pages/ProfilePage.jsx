import { Box, HStack, Spacer, Stack, Text, VStack } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { MdAccountCircle, MdArrowForwardIos } from 'react-icons/md'
import AuthContext from '../Routes/hooks/AuthContext'
import {CiBoxList, CiShoppingTag, CiStickyNote, CiShoppingBasket } from 'react-icons/ci'
import { IoHelpCircleOutline } from 'react-icons/io5'
import {IoIosLogOut} from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import store from 'store'

function ProfilePage() {
  const width = window.innerWidth
  const height = window.innerHeight

  const navigate = useNavigate()

  const { currentUser, signOut } = useContext(AuthContext)


  const tab = [
    {
      icon: <CiShoppingTag size={25} color="white"/>,
      title: 'Orders',
      route: '/order',
    },

    {
      icon: <CiShoppingBasket size={25} color="white"/>,
      title: 'Live Orders',
      route: '/shipping',
    },

    {
      icon: <CiBoxList size={25} color="white"/>,
      title: 'Invoices',
      route: '/invoices',
    },

    {
      icon: <CiStickyNote size={25} color="white"/>,
      title: 'Terms & Conditions',
      route: '/termcondition',
    },

    {
      icon: <IoHelpCircleOutline size={25} color="white"/>,
      title: 'Help',
      route: '/help',
    },

    {
      icon: <IoIosLogOut size={25} color="white"/>,
      title: 'Logout',
      route: 'logout'
    },

  ]

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


  return (
    <Box minH={height}>
      <Stack bgColor='gray.100' borderRadius={'xl'} shadow={'md'} alignItems='center' height={height / 3}>
        <Stack alignItems="center" m={4} my={10} >
          <Stack bgColor='black' shadow={'md'} alignItems={'center'} justifyContent='center' borderRadius={'xl'} p={5}>
            <MdAccountCircle size={120} color="white" />
            <Text color={'white'} fontWeight='bold' fontSize={'md'}>{currentUser?.displayName}</Text>
          </Stack>
        </Stack>
      </Stack>

      <VStack bgColor='white' borderRadius={'xl'} shadow={'md'} alignItems='center'>
        {tab.map((x, index) => {
          return (
            <Stack w={'100%'} my={1} key={index} >
              <Stack onClick={x.route === "logout" ? (() => handleLogout()) : (() => navigate(x.route)) }>
                <HStack space={2} alignItems='center' bgColor='white' p={'10px'} shadow={'md'} >
                  <Stack bgColor={'black'} p={2} borderRadius='xl' shadow={'md'}>
                   { x.icon }
                  </Stack>
                  <Text letterSpacing={1} fontSize='sm'>{x.title}</Text>
                  <Spacer />
                  <MdArrowForwardIos size={20} color="black" />
                </HStack>

              </Stack>
            </Stack>
          )
        })}
      </VStack>

    </Box>
  )
}

export default ProfilePage