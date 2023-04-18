import { Avatar, AvatarBadge, Box, Button, Checkbox, Divider, Flex, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, SimpleGrid, Spacer, Stack, Tag, Text, Textarea, useToast, } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdOutlinePermMedia, MdSchedule } from 'react-icons/md'
import { FiSend } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import store from 'store'
import parse from 'html-react-parser';




import logodeo from '../assets/1.png'
import AppSideBar from '../Components/AppSideBar'
import colors from '../Utils/colors'
import axios from 'axios'
import { FaFacebook, FaFacebookF, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import moment from 'moment'
import ApiBackend from '../Api/ApiBackend'
import { TbPresentationAnalytics } from 'react-icons/tb'
import { arrayUnion, collection, deleteField, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../Config/firebase'
import AuthContext from '../Routes/hooks/AuthContext'
import AppSideAccountBar from '../Components/AppSideAccountBar'

function SocialAccountPage() {


    const width = window.innerWidth
    const height = window.innerHeight


    const [barStatus, setBarStatus] = useState(false)

    const [socialAccountModal, setSocialAccountModal] = useState(false)
    const [titleAccount, setTitleAccount] = useState("")
    const [userData, setUserData] = useState("")
    const [socialAccountList, setSocialAccountList] = useState([])
    const [socialMediaList, setSocialMediaList] = useState([])

    let [searchParams, setSearchParams] = useSearchParams();

    const profileKey = searchParams.get("detail")
    const nameParams = searchParams.get("name")



    const navigate = useNavigate()
    const toast = useToast()

    const { currentUser, loadingShow, loadingClose } = useContext(AuthContext);

    const contentWidth = barStatus ? "85%" : "95%";



    const getListSocial = async () => {
        loadingShow()
        try {

            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
                setSocialAccountList(docSnap.data().ayrshare_account);
                setSocialMediaList(docSnap.data().social_accounts);
            } else {
                console.log("No such document!");
            }
            loadingClose()
        } catch (error) {
            console.log(error)
            loadingClose()
        }
    }



    const handleCreateAccount = async () => {
        const res = await store.get("userData");
        const role = res?.role
        if (role === "user") {
            navigate(`/pricing/${currentUser.email}`)
        }
        if (role === "member") {
            setSocialAccountModal(true)
        }
        if (role === undefined) {
            toast({
                title: 'Deoapp.com',
                description: 'You must login',
                status: 'warning',
                position: 'top-right',
                isClosable: true,
            })
            navigate(`/login`)
        }
    }

    const handleSubmitAccount = async () => {
        loadingShow()
        try {
            const res = await ApiBackend.post('createprofile', {
                title: titleAccount,
            })
            if (res.status === 200) {
                console.log(res.data, 'xxx')
                await updateDoc(doc(db, "users", currentUser.uid), {
                    ayrshare_account: arrayUnion(res.data)
                });

                loadingClose()
                setSocialAccountModal(false);
            }
        } catch (error) {
            console.log(error, 'ini error ')
        }
    }


    const handleDataAccount = async () => {
        if (socialAccountList?.length > 0) {
            socialAccountList?.forEach(async (x) => {

                if (x.profileKey) {
                    loadingShow()
                    try {
                        const res = await ApiBackend.post('user', {
                            profileKey: x.profileKey
                        })

                        if (res.status === 200) {
                            console.log(res.data)

                            await updateDoc(doc(db, "users", currentUser.uid), {
                                social_accounts: deleteField()
                            });

                            await updateDoc(doc(db, "users", currentUser.uid), {
                                social_accounts: arrayUnion(res.data)
                            });
                            getListSocial()
                        }
                        loadingClose()
                    } catch (error) {
                        console.log(error, 'ini error ')
                        loadingClose()
                    }
                    loadingClose()
                }
            });
        }
    }

    const handleDisconnected = async (data) => {

        if (profileKey) {
            try {
                const res = await ApiBackend.post('unlinksocial', {
                    platform: data.platform,
                    profileKey
                })
                if (res.status === 200) {
                    toast({
                        title: 'Deoapp.com',
                        description: 'Succes to disconnect from social accounts',
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                    })
                    // getUser()
                }
            } catch (error) {
                console.log(error, 'ini error ')
            }
        } else {
            toast({
                title: 'Deoapp.com',
                description: 'You must set billing pricing',
                status: 'error',
                position: 'top-right',
                isClosable: true,
            })
        }

    }

    const handleWindowConnected = async (x) => {

        if (x.profileKey) {
            const res = await ApiBackend.post('/generateJWT', {
                domain: 'importir',
                profileKey: x.profileKey,
            })
            const url = res.data.url + "&logout=true"
            window.open(url, '_blank', 'noreferrer');

        }

    }


    useEffect(() => {
        getListSocial()
        return () => {
        }
    }, [currentUser])



    return (
        <>
            <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
                <Stack >
                    <AppSideAccountBar setBarStatus={setBarStatus} />
                </Stack>

                <Spacer />

                <Stack w={contentWidth} transition={"0.2s ease-in-out"} minH={height} >
                    <Stack p={10} spacing={5}>
                        <HStack>
                            <Stack >
                                <Text fontSize={'xl'} fontWeight='bold' color={'gray.600'}>Social Accounts </Text>
                            </Stack>
                            <Spacer />
                            <Stack >
                                <Button size='sm' colorScheme={'twitter'} onClick={() => handleCreateAccount()}>
                                    <Text fontSize={'xs'}>+ Social Account</Text>
                                </Button>
                            </Stack>
                        </HStack>

                        <Stack shadow={'md'} justifyContent='center' borderRadius='lg' bgColor={'white'} borderTopWidth={5} borderColor='blue.500' p={5} spacing={3}>
                            <Text fontSize={'sm'} color='gray.600'>{moment(userData?.createdAt?.seconds * 1000).format("LLLL")}</Text>
                            <HStack>
                                <Text fontSize={'xs'} color='gray.600'>Email</Text>
                                <Spacer />
                                <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{userData?.email}</Text>
                            </HStack>
                            <HStack>
                                <Text fontSize={'xs'} color='gray.600'>Subscription</Text>
                                <Spacer />
                                <Stack>
                                    <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{userData?.subscription}</Text>

                                </Stack>

                            </HStack>

                            <HStack>
                                <Text fontSize={'xs'} color='gray.600'>Phone Number</Text>
                                <Spacer />
                                <Stack>
                                    <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{userData?.nohp}</Text>

                                </Stack>

                            </HStack>

                            <Divider />

                            <HStack>
                                <Text fontSize={'xs'} color='gray.600'>User Account</Text>
                                <Spacer />
                                <Stack>
                                    {socialAccountList?.length > 0 && (
                                        socialAccountList?.map((x, index) => {

                                            return (
                                                <HStack key={index}>
                                                    <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{x?.title}</Text>
                                                    <Spacer />
                                                    <Button size={'sm'}>
                                                        <Text fontSize={'xs'} onClick={() => handleWindowConnected(x)}>Connected</Text>
                                                    </Button>
                                                </HStack>

                                            )
                                        })
                                    )}
                                </Stack>


                            </HStack>
                        </Stack>

                        <Stack>
                            <HStack>
                                <Text>Account</Text>
                                <Spacer />
                                <Button size={'sm'} colorScheme='twitter'>
                                    <Text fontSize={'xs'} onClick={() => handleDataAccount()}>Update</Text>
                                </Button>
                            </HStack>
                            <SimpleGrid columns={[1, 2, 2]} gap={2}>
                                {socialMediaList?.length > 0 && (
                                    socialMediaList?.map((x, index) => {
                                        return (
                                            <Stack key={index} shadow={'md'} borderRadius='lg' bgColor={'white'} borderWidth={2} borderColor={x?.title === nameParams ? 'blue.500' : 'transparent'} p={5} spacing={3}>
                                                <HStack>
                                                    <Text fontSize={'xs'} color='gray.600'>Name</Text>
                                                    <Spacer />
                                                    <Text fontSize={'xs'} color='gray.900' fontWeight={'bold'}>{x?.title}</Text>
                                                </HStack>
                                                <HStack>
                                                    <Text fontSize={'xs'} color='gray.600'>Monthly api calls</Text>
                                                    <Spacer />
                                                    <Stack>
                                                        <Text fontSize={'xs'} color='gray.600'>{x?.monthlyApiCalls}</Text>

                                                    </Stack>

                                                </HStack>
                                                <Stack w={'full'}>
                                                    <Progress borderRadius={'xl'} size='md' value={x?.monthlyApiCalls / 500 * 100} />
                                                </Stack>


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
                                                                <Stack shadow={'md'} alignItems={'center'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} justifyContent='center' borderRadius='lg' key={index} bgColor={'white'} borderTopWidth={5} borderColor='blue.500' p={5}  >

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
                                                                        <SimpleGrid columns={[1]} gap={2}>
                                                                            <Stack alignItems={'center'} justifyContent='center'>
                                                                                <a href={z.profileUrl} target="_blank" rel="noopener noreferrer">
                                                                                    <Button size={'sm'} colorScheme='twitter' >
                                                                                        <Text fontSize={'xs'}>Go to website</Text>
                                                                                    </Button>
                                                                                </a>
                                                                            </Stack>
                                                                            <Stack alignItems={'center'} justifyContent='center'>
                                                                                <Button size={'sm'} colorScheme='blackAlpha' onClick={() => handleDisconnected(z)}>
                                                                                    <Text fontSize={'xs'}>Disconnected</Text>
                                                                                </Button>
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
                        </Stack>

                    </Stack>
                </Stack>
            </Flex>

            <Modal isOpen={socialAccountModal} onClose={() => setSocialAccountModal(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack>
                            <TbPresentationAnalytics size={20} />
                            <Text fontSize={'md'}>New Social Account</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack>
                            <Text>Title</Text>
                            <Input size={'sm'} placeholder='New Title' value={titleAccount} onChange={(e) => setTitleAccount(e.target.value)} />
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button size={'sm'} colorScheme='blackAlpha' mr={3} onClick={() => setSocialAccountModal(false)}>
                            Close
                        </Button>
                        <Button size={'sm'} colorScheme='twitter' mr={3} onClick={() => handleSubmitAccount()}>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ >
    )
}

export default SocialAccountPage