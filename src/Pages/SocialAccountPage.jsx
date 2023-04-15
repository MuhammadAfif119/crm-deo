import { Avatar, AvatarBadge, Box, Button, Checkbox, Divider, Flex, HStack, Image, Input, Progress, SimpleGrid, Spacer, Stack, Tag, Text, Textarea, useToast, } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdOutlinePermMedia, MdSchedule } from 'react-icons/md'
import { FiSend } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import store from 'store'
import parse from 'html-react-parser';




import logodeo from '../assets/1.png'
import AppSideBar from '../Components/AppSideBar'
import colors from '../Utils/colors'
import axios from 'axios'
import { FaFacebook, FaFacebookF, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import moment from 'moment'
import ApiBackend from '../Api/ApiBackend'

function SocialAccountPage() {


    const width = window.innerWidth
    const height = window.innerHeight

    const [listData, setListData] = useState()

    const [barStatus, setBarStatus] = useState(false)
    const [generateData, setGenerateData] = useState(null);
    const [urlData, setUrlData] = useState("");
    const htmlRef = useRef(null);

    const contentWidth = barStatus ? "85%" : "95%";


    const navigate = useNavigate()
    const toast = useToast()


    const getSocialAccount = async () => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if (profileKey) {
            const res = await ApiBackend.post('/generateJWT', {
                domain: 'importir',
                profileKey: profileKey,
            })
            setGenerateData(res.data)
            // const url = res.data.url
            const url = res.data.url + "&logout=true"
            setUrlData(url)
        }
    }


    const getUser = async () => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey
        if (profileKey) {
            try {
                const res = await ApiBackend.post('user', {
                    profileKey
                })
                setListData(res.data)
                console.log(res.data, 'data profile')
            } catch (error) {
                console.log(error, 'ini error ')
            }
        }
    }

    const handleDisconnected = async (data) => {
        console.log(data, 'test')

        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey
        if (profileKey) {
            try {
                const res = await ApiBackend.post('unlinksocial', {
                    platform : data.platform,
                    profileKey
                })
                if(res.status === 200){
                    toast({
                        title: 'Deoapp.com',
                        description: 'Succes to disconnect from social accounts',
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                    })
                    getUser()
                }
            } catch (error) {
                console.log(error, 'ini error ')
            }
        }else{
            toast({
                title: 'Deoapp.com',
                description: 'You must set billing pricing',
                status: 'error',
                position: 'top-right',
                isClosable: true,
            })
        }

    } 

    const handleWindowConnected = () => {
        window.open(urlData, '_blank', 'noreferrer');

    }


    useEffect(() => {
        getUser()
        getSocialAccount()
        return () => {
        }
    }, [])



    return (
        <Stack p={5} >

                <Stack  transition={"0.2s ease-in-out"} minH={height} >
                    <Stack p={10} spacing={5}>
                        <Stack >
                            <Text fontSize={'xl'}>Social Accounts </Text>
                        </Stack>

                        <Stack shadow={'md'} justifyContent='center' borderRadius='lg' bgColor={'white'} borderTopWidth={5} borderColor='green.400' p={5} spacing={3}>
                            <Text fontSize={'sm'} color='gray.600'>{moment(listData?.created).format("LLLL")}</Text>
                            <HStack>
                                <Text fontSize={'xs'} color='gray.600'>Email</Text>
                                <Spacer />
                                <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{generateData?.title ? generateData?.title : "Please set your billing" }</Text>
                            </HStack>
                            <HStack>
                                <Text fontSize={'xs'} color='gray.600'>Social Media</Text>
                                <Spacer />
                                <Stack>
                                    <Button size={'sm'}>
                                        <Text fontSize={'xs'} onClick={() => handleWindowConnected()}>Connected</Text>
                                    </Button>

                                </Stack>

                            </HStack>
                            <Stack w={'full'}>
                                <Progress borderRadius={'xl'} size='md' value={listData?.monthlyApiCalls / 500 * 100} />
                            </Stack>
                        </Stack>

                        {/* <Stack>
                            <iframe src={urlData && urlData} width="680" height="500" frameborder="0"></iframe>
                        </Stack> */}

                        <Stack >
                            <SimpleGrid columns={[1, 2, 4]} gap={5}>
                                {listData?.displayNames?.length > 0 && listData?.displayNames?.map((x, index) => {

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

                                    const filterError = PlatformArr.filter((y) => y.name.includes(x.platform))
                                    const resIcon = filterError[0]?.icon


                                    return (
                                        <Stack shadow={'md'} alignItems={'center'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} justifyContent='center' borderRadius='lg' key={index} bgColor={'white'} borderTopWidth={5} borderColor='green.400' p={5} spacing={5} >
                                            <HStack>
                                                <Tag colorScheme={'green'}>Linked</Tag>


                                            </HStack>
                                            <Divider borderStyle={'dotted'} />
                                            <Stack>
                                                <Avatar src={x.userImage} alt={x.displayName}>
                                                    <AvatarBadge boxSize='1.25em' bg='green.500'> {resIcon}</AvatarBadge>
                                                </Avatar>
                                            </Stack>
                                            <Spacer />
                                            <Stack>
                                                <Text textAlign={'center'} fontSize='xs' color={'gray.600'}>{x.displayName}</Text>
                                            </Stack>

                                            <SimpleGrid columns={[1, 1, 2]} gap={2}>
                                                <Stack>
                                                    <a href={x.profileUrl} target="_blank" rel="noopener noreferrer">
                                                        <Button size={'sm'} colorScheme='green' >
                                                            <Text fontSize={'xs'}>Go to website</Text>
                                                        </Button>
                                                    </a>
                                                </Stack>
                                                <Stack>
                                                    <Button size={'sm'} colorScheme='blackAlpha' onClick={() => handleDisconnected(x)}>
                                                        <Text fontSize={'xs'}>Disconnected</Text>
                                                    </Button>
                                                </Stack>
                                            </SimpleGrid>

                                        </Stack>
                                    )
                                })}
                            </SimpleGrid>
                        </Stack>


                    </Stack>
                </Stack>

        </Stack >
    )
}

export default SocialAccountPage