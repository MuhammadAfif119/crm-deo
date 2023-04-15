import { Avatar, AvatarBadge, Button, Checkbox, Divider, Flex, HStack, Image, Input, Progress, SimpleGrid, Spacer, Stack, Tag, Text, Textarea, } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { MdOutlinePermMedia, MdSchedule } from 'react-icons/md'
import { FiSend } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'


import logodeo from '../assets/1.png'
import AppSideBar from '../Components/AppSideBar'
import colors from '../Utils/colors'
import axios from 'axios'
import { FaFacebook, FaFacebookF, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import AppHeader from '../Components/AppHeader'
import moment from 'moment'
import ApiBackend from '../Api/ApiBackend'
import AppSideBarFeed from '../Components/AppSideBarFeed'

function MyFeedRssPage() {


    const width = window.innerWidth
    const height = window.innerHeight

    const [listData, setListData] = useState([])
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [barStatus, setBarStatus] = useState(false)
    const contentWidth = barStatus ? "85%" : "95%";

    const navigate = useNavigate()

    const dataFeed = [
        'https://rss.app/feeds/v1.1/t0k6Xf0VyyWHaKJU.json',
        'https://rss.app/feeds/v1.1/mTUy4HvoGddBH4Nv.json',
    ]

    const getFeed = async () => {
        try {
            const res = await axios.get('https://rss.app/feeds/v1.1/t0k6Xf0VyyWHaKJU.json')
            if (res.status === 200) {
                setListData(res.data.items, 'ini data user')
                console.log(res.data.items)
            }
        } catch (error) {
            console.log(error, 'ini error ')
        }
    }


    useEffect(() => {
        getFeed()

        return () => {
        }
    }, [])



    return (
            <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
                <Stack  zIndex={100}>
                    <AppSideBarFeed setBarStatus={setBarStatus} />
                </Stack>
                <Spacer
                />
                <Stack
                    Stack
                    w={contentWidth}
                    transition={"0.2s ease-in-out"}
                    minH={height}
                >
                    <Stack transition={"0.2s ease-in-out"} minH={height}  >
                        <Stack p={10} spacing={5}>
                            <Stack >
                                <Text fontSize={'xl'}>Feeds</Text>
                            </Stack>


                            <Stack >
                                <SimpleGrid columns={[1, 2, 4]} gap={5}>
                                    {listData?.length > 0 && listData?.map((x, index) => {

                                        return (
                                            <Stack shadow={'md'} alignItems={'center'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} justifyContent='center' borderRadius='lg' key={index} bgColor={'white'} borderTopWidth={5} borderColor='green.400' p={5} spacing={5} >
                                                <HStack>
                                                    <Text >{x.title}</Text>


                                                </HStack>
                                                <Divider borderStyle={'dotted'} />
                                                {x.image && (
                                                    <Stack>
                                                        <Image crossOrigin="anonymous" src={x?.image} alt={'img'} borderRadius='md' />
                                                    </Stack>
                                                )}
                                                <Spacer />
                                                <Stack>
                                                    <Text textAlign={'center'} fontSize='xs' color={'gray.600'}>{x.content_text}</Text>
                                                </Stack>

                                                <HStack>
                                                    <Stack>
                                                        {x?.authors?.length > 0 &&
                                                            x?.authors?.map((y, index) => {
                                                                return (
                                                                    <Text key={index} textAlign={'center'} fontSize='xs' color={'gray.400'}>{y.name}</Text>

                                                                )
                                                            })
                                                        }
                                                    </Stack>

                                                    <Spacer />
                                                    <Text textAlign={'center'} fontSize='xs' color={'gray.400'}>{moment(x.date_published).fromNow()}</Text>
                                                </HStack>

                                                <SimpleGrid columns={[1]} gap={2}>
                                                    <Stack>
                                                        <a href={x.url} target="_blank" rel="noopener noreferrer">
                                                            <Button size={'sm'} colorScheme='green' >
                                                                <Text fontSize={'xs'}>Go to website</Text>
                                                            </Button>
                                                        </a>
                                                    </Stack>
                                                </SimpleGrid>

                                            </Stack>
                                        )
                                    })}
                                </SimpleGrid>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Flex>

    )
}

export default MyFeedRssPage