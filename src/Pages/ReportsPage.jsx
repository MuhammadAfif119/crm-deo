import { Avatar, AvatarBadge, Button, Flex, HStack, Progress, SimpleGrid, Spacer, Stack, Text, useToast } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { FaFacebook, FaFacebookF, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'

import store from 'store'
import ApiBackend from '../Api/ApiBackend';
import AppSideAccountBar from '../Components/AppSideAccountBar';
import { db } from '../Config/firebase';
import AuthContext from '../Routes/hooks/AuthContext';
import { AiOutlineGlobal } from 'react-icons/ai';
import { IoAnalyticsSharp } from 'react-icons/io5';
import moment from 'moment';
import AnalyticsTwitter from '../Components/Analytics/AnalyticsTwitter';
import AnalyticsData from '../Components/Analytics/AnalyticsData';

function ReportsPage() {

  const [barStatus, setBarStatus] = useState(false)
  const contentWidth = barStatus ? "85%" : "95%";

  const height = window.innerHeight

  let [searchParams, setSearchParams] = useSearchParams();
  const [platformActive, setPlatformActive] = useState("")
  const [socialMediaList, setSocialMediaList] = useState([])
  const [dataAnalytics, setDataAnalytics] = useState({})
  // const [userData, setUserData] = useState({})


  const profileKey = searchParams.get("detail")
  const nameParams = searchParams.get("name")

  const { currentUser, loadingShow, loadingClose } = useContext(AuthContext);
  const toast = useToast()


  const getListSocial = async () => {
    loadingShow()
    try {

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const filterArr = docSnap?.data()?.social_accounts?.filter((x) => x.title === nameParams)
        setSocialMediaList(filterArr)
      } else {
        console.log("No such document!");
      }
      loadingClose()
    } catch (error) {
      console.log(error)
      loadingClose()
    }
  }

  useEffect(() => {
    getListSocial()
    return () => {
    }
  }, [currentUser, profileKey])

  const handleAnalytics = async (platforms) => {
    setPlatformActive(platforms)
    try {
      const res = await ApiBackend.post('analyticssocial', {
        platforms,
        profileKey
      })

      if (res.data.status === "success") {
        setDataAnalytics(res.data[platforms].analytics)
        console.log(res.data[platforms].analytics)
      }else{
        toast({
          title: 'Deoapp.com',
          description: res.data[platforms].message,
          status: 'error',
          position: 'top-right',
          isClosable: true,
        })
      }

    } catch (error) {
      console.log(error, 'ini error')
    }
  }





  // const getAnalytics = async () => {

  //     if(profileKey){
  //         try {
  //             const res = await ApiBackend.post('/analyticslinks', {
  //                 lastDays : 1,
  //                 profileKey
  //             })
  //             console.log(res, 'report')
  //         } catch (error) {
  //             console.log(error)
  //         }
  //     }
  // }

  // useEffect(() => {
  //     getAnalytics()

  //   return () => {
  //   }
  // }, [profileKey])

  return (
    <>
      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        <Stack >
          <AppSideAccountBar setBarStatus={setBarStatus} />
        </Stack>

        <Spacer />

        <Stack w={contentWidth} transition={"0.2s ease-in-out"} minH={height} >
          <Stack p={10} spacing={5}>

            <Text fontSize={'xl'} fontWeight='bold' color={'gray.600'}>Report page</Text>

            <SimpleGrid columns={[1]} gap={2}>
              {socialMediaList?.length > 0 && (
                socialMediaList?.map((x, index) => {
                  return (
                    <Stack key={index} shadow={'md'} borderRadius='lg' bgColor={'white'} borderWidth={2} borderColor={x?.title === nameParams ? 'green.400' : 'transparent'} p={5} spacing={3}>
                      <HStack>
                        <Text fontSize={'xs'} color='gray.600'>Name</Text>
                        <Spacer />
                        <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{x?.title}</Text>
                      </HStack>

                      <HStack>
                        <Text fontSize={'xs'} color='gray.600'>Updated</Text>
                        <Spacer />
                        <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{moment(x?.lastUpdated).toLocaleString()}</Text>
                      </HStack>

                      <Stack >
                        <SimpleGrid columns={[1, 2, 4]} gap={3}>
                          {x?.displayNames?.length > 0 && x?.displayNames?.map((z, index) => {

                            const PlatformArr = [
                              {
                                name: 'youtube',
                                icon: <FaYoutube color='white' size={10} />,
                              },
                              {
                                name: 'twitter',
                                icon: <FaTwitter color='white' size={10} />,
                              },
                              {
                                name: 'facebook',
                                icon: <FaFacebook color='white' size={10} />,
                              },
                              {
                                name: 'instagram',
                                icon: <FaInstagram color='white' size={10} />,
                              },
                              {
                                name: 'tiktok',
                                icon: <FaTiktok color='white' size={10} />,
                              },
                              {
                                name: 'linkedin',
                                icon: <FaLinkedin color='white' size={10} />,
                              },
                              {
                                name: 'google',
                                icon: <FaGoogle color='white' size={10} />,
                              },
                              {
                                name: 'pinterest',
                                icon: <FaPinterest color='white' size={10} />,
                              }
                            ]

                            const filterError = PlatformArr.filter((y) => y.name.includes(z.platform))
                            const resIcon = filterError[0]?.icon


                            return (
                              <Stack shadow={'md'} alignItems={'center'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} justifyContent='center' borderRadius='lg' key={index} bgColor={'white'} borderTopWidth={5} borderColor='green.400' p={5}  >

                                <Stack>
                                  <Avatar src={z.userImage} alt={z.displayName}>
                                    <AvatarBadge boxSize='1.25em' bg='green.500'> {resIcon}</AvatarBadge>
                                  </Avatar>
                                </Stack>
                                <Spacer />
                                <Stack>
                                  <Text textAlign={'center'} fontSize='xs' color={'gray.600'}>{z.displayName}</Text>
                                </Stack>

                                <Stack >
                                  <SimpleGrid columns={[2]} gap={2}>
                                    <Stack alignItems={'center'} justifyContent='center'>
                                      <Button size={'xs'} colorScheme='green' onClick={() => handleAnalytics(z.platform)}>
                                        <IoAnalyticsSharp />
                                      </Button>
                                    </Stack>
                                    <Stack alignItems={'center'} justifyContent='center'>
                                      <a href={z.profileUrl} target="_blank" rel="noopener noreferrer">
                                        <Button size={'xs'} colorScheme='green' >
                                          <AiOutlineGlobal />
                                        </Button>
                                      </a>
                                    </Stack>
                                  </SimpleGrid>
                                </Stack>

                              </Stack>
                            )
                          })}
                        </SimpleGrid>
                      </Stack>
                    </Stack>
                  )
                })
              )}
            </SimpleGrid>

            <Stack>
              <AnalyticsData data={dataAnalytics} platform={platformActive}/>
            </Stack>

          </Stack>
        </Stack>
      </Flex>

    </ >
  )
}

export default ReportsPage