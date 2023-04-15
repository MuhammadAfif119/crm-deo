import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, AvatarBadge, Box, Button, Checkbox, Divider, Flex, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spacer, Spinner, Stack, Text, Textarea, useDisclosure, useToast, } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { MdOutlinePermMedia, MdSchedule } from 'react-icons/md'
import { FiSend } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import store from 'store'

import logodeo from '../assets/1.png'
import AppSideBar from '../Components/AppSideBar'
import colors from '../Utils/colors'
import { FaFacebook, FaFacebookF, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import moment from 'moment'
import { AiOutlineComment } from 'react-icons/ai'
import { TbPresentationAnalytics } from 'react-icons/tb'
import AppHeader from '../Components/AppHeader'
import AuthContext from '../Routes/hooks/AuthContext'
import { BiFilterAlt } from 'react-icons/bi'
import { BsTrash } from 'react-icons/bs'
import ApiBackend from '../Api/ApiBackend'

function SocialBuildPage() {


    const width = window.innerWidth
    const height = window.innerHeight

    const navigate = useNavigate()

    const toast = useToast()

    const [barStatus, setBarStatus] = useState(false)
    const contentWidth = barStatus ? "85%" : "95%";

    const [posting, setPosting] = useState('')
    const [shortenLinks, setShotenLinks] = useState(false)
    const [platformActive, setPlatformActive] = useState([])
    const [files, setFiles] = useState([]);
    const [lastRecords, setLastRecord] = useState(0)
    const [lastDays, setLastDays] = useState(0)
    const [historyList, setHistoryList] = useState([])
    const [scheduleActive, setScheduleActive] = useState(false)
    const [schedulePosting, setSchedulePosting] = useState('')
    const [commentModal, setCommentModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [analyticsModal, setAnalyticsModal] = useState(false)
    const [comment, setComment] = useState('')
    const [commentActive, setCommentActive] = useState('')
    const [postActive, setPostActive] = useState('')
    const [commentDetailList, setCommentDetailList] = useState([])
    const [socialMediaKeysArr, setSocialMediaKeysArr] = useState([])

    const [analyticsDetailList, setAnalyticsDetailList] = useState([])

    const [loadingComment, setLoadingComment] = useState(false)

    const { loadingShow, loadingClose } = useContext(AuthContext)


    const cancelRef = React.useRef()

    const today = new Date().toISOString().substr(0, 10);


    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");



    const handleReset = () => {
        setStartDate("")
        setEndDate("")
    }


    const getHistory = async () => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey


        if (profileKey) {
            if (startDate && endDate) {
                try {
                    loadingShow()
                    const res = await ApiBackend.post('history', {
                        lastRecords: lastRecords,
                        lastDays: lastDays,
                        profileKey
                    })

                    const filtered = res.data.filter((item) => {
                        const dateLocal = moment(item.created).toLocaleString()
                        const dateFormat = moment(dateLocal).format("YYYY-MM-DD")
                        return (
                            moment(dateFormat).isSameOrAfter(startDate, "day") &&
                            moment(dateFormat).isSameOrBefore(endDate, "day")
                        );
                    });
                    setHistoryList(filtered)
                    loadingClose()
                } catch (error) {
                    console.log(error, 'ini error')
                    loadingClose()
                }
            } else {
                try {
                    loadingShow()
                    const res = await ApiBackend.post('history', {
                        lastRecords: lastRecords,
                        lastDays: lastDays,
                        profileKey
                    })
                    if (res.data.status === "error") {
                        toast({
                            title: 'Deoapp.com',
                            description: res.data.message,
                            status: 'error',
                            position: 'top-right',
                            isClosable: true,
                        })
                    }
                    setHistoryList(res.data)
                    loadingClose()
                } catch (error) {
                    console.log(error, 'ini error')
                    loadingClose()
                }

            }
        }
        loadingClose()
    }

    const handleDeleteModal = (idPost) => {
        setDeleteModal(true)
        setPostActive(idPost)
    }

    const handleDelete = async () => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if (profileKey) {
            try {
                const res = await ApiBackend.post('delete', {
                    id: postActive.id,
                })
                if (res.status === 200) {
                    toast({
                        title: 'Deoapp.com',
                        description: 'Success delete this post',
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                    })
                    setDeleteModal(false)
                    setPostActive("")
                    getHistory()
                }
            } catch (error) {
                console.log(error, 'ini error')
            }
        }
    }



    const handleComment = async (idPost) => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if (profileKey) {
            setCommentModal(true)
            setCommentActive(idPost)
            setLoadingComment(true)
            try {
                const res = await ApiBackend.post('getcomment', {
                    id: idPost.id,
                    profileKey
                })
                const obj = res.data
                const { id, status, tiktok, lastUpdated, nextUpdate, code, ...socialMedia } = obj; // memfilter properti id dan status dari objek
                if (status === 'success') {
                    setCommentDetailList(socialMedia)
                    const socialMediaKeys = Object.keys(commentDetailList && commentDetailList); // mengambil array kunci properti objek socialMedia
                    setSocialMediaKeysArr(socialMediaKeys)

                } else {
                    toast({
                        title: 'Deoapp.com',
                        description: socialMedia.message,
                        status: 'error',
                        position: 'top-right',
                        isClosable: true,
                    })
                }
                setLoadingComment(false)


            } catch (error) {
                console.log(error, 'ini error')
                setLoadingComment(false)

            }
        }

        setLoadingComment(false)

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

    const handlePostComment = async () => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if (profileKey) {
            try {
                const res = await ApiBackend.post('postcomment', {
                    id: commentActive.id,
                    platforms: commentActive.postIds.map((x) => x.platform),
                    comment: comment,
                    profileKey
                })
                if (res.status === 200) {
                    toast({
                        title: 'Deoapp.com',
                        description: 'Success comment.',
                        status: 'success',
                        position: 'top-right',
                        isClosable: true,
                    })
                    setCommentActive('')
                    setComment('')
                    setCommentModal(false)
                }
            } catch (error) {
                console.log(error, 'ini error')
                toast({
                    title: 'Deoapp.com',
                    description: error.message,
                    status: 'error',
                    position: 'top-right',
                    isClosable: true,
                })
            }
        }

    }

    const handleAnalytics = async (idPost) => {
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if (profileKey) {

            setAnalyticsModal(true)

            try {
                const res = await ApiBackend.post('analyticspost', {
                    id: idPost.id,
                    platforms: idPost.platforms,
                    profileKey
                })
                const obj = res.data
                console.log(obj , 'xxx')
                const { id, status, ...analytics } = obj;
                setAnalyticsDetailList(analytics)
            } catch (error) {
                console.log(error, 'ini error')
            }
        }


    }





    useEffect(() => {
        getHistory()

        return () => {
        }
    }, [startDate && endDate])


    const handleAddPlatform = (media) => {
        setPlatformActive([media])
        if (!platformActive.includes(media)) {
            setPlatformActive([...platformActive, media]);
        } else {
            setPlatformActive(platformActive.filter((platform) => platform !== media));
        }
    };

    const handleFileInputChange = (event) => {
        const { files: newFiles } = event.target;
        if (newFiles.length) {
            const newFileArray = [...files];
            for (let i = 0; i < newFiles.length; i++) {
                const reader = new FileReader();
                reader.readAsDataURL(newFiles[i]);
                reader.onload = () => {
                    console.log(reader.result);
                    newFileArray.push({ file: reader.result, fileName: newFiles[i].name, description: newFiles[i].type });
                    setFiles(newFileArray);
                };
            }
        }
    };


    const handlePost = async () => {
        loadingShow()
        let fileImage = []
        const res = await store.get("userData");
        const profileKey = res?.ayrshare_account?.profileKey

        if (profileKey) {
            if (files.length > 0) {

                files.forEach(async (x) => {
                    try {
                        const res = await ApiBackend.post('upload', {
                            file: x.file,
                            fileName: x.fileName,
                            description: x.description
                        })
                        fileImage.push(res.data.url)
                        if (fileImage.length === files.length) {
                            try {
                                const res = await ApiBackend.post('post', {
                                    post: posting,
                                    platforms: platformActive,
                                    mediaUrls: fileImage,
                                    shortenLinks: shortenLinks,
                                    scheduleDate: schedulePosting,
                                    profileKey
                                })
                                if (res.status === 200) {
                                    toast({
                                        title: 'Deoapp.com',
                                        description: 'Success posting.',
                                        status: 'success',
                                        position: 'top-right',
                                        isClosable: true,
                                    })
                                    setPosting("")
                                    setFiles([])
                                    setPlatformActive([])
                                    setShotenLinks(false)
                                    loadingClose()
                                }
                            } catch (error) {
                                console.log(error, 'ini error ')
                            }
                            loadingClose()
                        }
                        loadingClose()
                    } catch (error) {
                        console.log(error, 'ini error')
                    }

                })
            } else {
                if (posting !== "" || platformActive.length !== 0) {
                    try {
                        const res = await ApiBackend.post('post', {
                            post: posting,
                            platforms: platformActive,
                            mediaUrls: null,
                            shortenLinks: shortenLinks,
                            scheduleDate: schedulePosting,
                            profileKey
                        })
                        if (res.status === 200) {
                            toast({
                                title: 'Deoapp.com',
                                description: 'Success posting.',
                                status: 'success',
                                position: 'top-right',
                                isClosable: true,
                            })
                            setPosting("")
                            setFiles([])
                            setPlatformActive([])
                            setShotenLinks(false)
                            loadingClose()
                        }
                    } catch (error) {
                        console.log(error, 'ini error ')
                    }
                    loadingClose()
                } else {
                    loadingClose()
                    toast({
                        title: 'Deoapp.com',
                        description: 'please check your posting',
                        status: 'warning',
                        position: 'top-right',
                        isClosable: true,
                    })
                }
                loadingClose()
            }
        }

    }

    const handleDialogSchedule = () => {
        setSchedulePosting('')
        setScheduleActive(true)
    }

    const handleErrorMessage = (message) => {
        toast({
            title: 'Deoapp.com',
            description: message,
            status: 'error'
        })
    }



    return (
        <Stack bgColor={colors.secondary}>

            <Flex bgColor={'gray.100'} flex={1} flexDirection='row' spacing={3} >
                <Stack h={height} zIndex={100}>
                    <AppSideBar setBarStatus={setBarStatus} />
                </Stack>
                <Spacer />

                <Stack w={contentWidth} transition={"0.2s ease-in-out"} minH={height} py={10}  >
                    <Stack p={10} >
                        <Stack>
                            <Text fontSize={'xl'}>Create a post</Text>
                        </Stack>
                        <Stack borderRadius='lg' bgColor={'white'} shadow='md' spacing={3} p={5} >
                            <Text fontSize={'sm'} color='gray.500' >
                                Type your post
                            </Text>
                            <Textarea placeholder='Here is a sample placeholder' fontSize={'sm'} onChange={(e) => setPosting(e.target.value)} />
                            <Checkbox colorScheme='blue' defaultChecked onChange={(e) => setShotenLinks(e.target.checked)}>
                                <Text fontSize={'sm'}>
                                    Shorten Links
                                </Text>
                            </Checkbox>
                            <Checkbox colorScheme='blue' defaultChecked onChange={(e) => console.log(e.target.checked, 'shorten')}>
                                <Text fontSize={'sm'}>
                                    Twitter thread
                                </Text>
                            </Checkbox>
                            <HStack spacing={2} alignItems='center' >

                                <Stack>
                                    <Input
                                        type="file"
                                        onChange={handleFileInputChange}
                                        display="none"
                                        id="fileInput"
                                    />
                                    <label htmlFor="fileInput">
                                        <HStack cursor={'pointer'}>
                                            <Stack>
                                                <MdOutlinePermMedia />

                                            </Stack>
                                            <Text fontSize={'sm'}>
                                                Add Image / Video
                                            </Text>
                                        </HStack>
                                    </label>
                                </Stack>


                            </HStack>
                            <SimpleGrid columns={[1, 2, 3]} gap={3}>
                                {files.length > 0 && files.map((x, index) => {
                                    return (
                                        // <Text fontSize={'sm'} key={index}>
                                        //     File yang dipilih: {x.name} ({x.type}, {x.size} bytes)
                                        // </Text>
                                        <Stack key={index}>
                                            <Image src={x.file} borderRadius='xl' alt={x.name} shadow='md' />
                                        </Stack>
                                    )
                                })}
                            </SimpleGrid>

                            <HStack spacing={5} alignItems='center' >
                                <Button size={'sm'} p={5} shadow='lg' onClick={() => handlePost()}>
                                    <HStack spacing={2} >
                                        <FiSend />
                                        <Text fontSize={'sm'}>Post</Text>
                                    </HStack>

                                </Button>

                                <Button size={'sm'} p={5} shadow='lg' onClick={() => handleDialogSchedule()}>
                                    <HStack spacing={2} >
                                        <MdSchedule />
                                        <Text fontSize={'sm'}>Schedule</Text>
                                    </HStack>

                                </Button>

                                {schedulePosting && (
                                    <Stack spacing={0}>
                                        <Text fontSize={'xs'} color='gray.500'>Schedule</Text>
                                        <Text fontSize={'sm'} color='gray.800'>{moment(schedulePosting).format("LLLL")}</Text>
                                    </Stack>
                                )}
                            </HStack>

                        </Stack>
                        <Stack p={5} alignItems='center' justifyContent={'center'} spacing={5}>
                            <Stack>
                                <Text color={'gray.500'} fontSize='sm'>Post the these networks</Text>
                            </Stack>
                            <HStack spacing={10}>

                                <Stack>
                                    <FaTwitter size={20} cursor='pointer' onClick={() => handleAddPlatform('twitter')} color={platformActive.includes('twitter') ? "green" : 'gray'} />
                                </Stack>


                                <Stack>
                                    <FaYoutube size={20} cursor='pointer' onClick={() => handleAddPlatform('youtube')} color={platformActive.includes('youtube') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaTiktok size={20} cursor='pointer' onClick={() => handleAddPlatform('tiktok')} color={platformActive.includes('tiktok') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaInstagram size={20} cursor='pointer' onClick={() => handleAddPlatform('instagram')} color={platformActive.includes('instagram') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaLinkedin size={20} cursor='pointer' onClick={() => handleAddPlatform('linkedin')} color={platformActive.includes('linkedin') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaTelegram size={20} cursor='pointer' onClick={() => handleAddPlatform('telegram')} color={platformActive.includes('telegram') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaFacebook size={20} cursor='pointer' onClick={() => handleAddPlatform('facebook')} color={platformActive.includes('facebook') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaGoogle size={20} cursor='pointer' onClick={() => handleAddPlatform('google')} color={platformActive.includes('google') ? "green" : 'gray'} />
                                </Stack>

                                <Stack>
                                    <FaPinterest size={20} cursor='pointer' onClick={() => handleAddPlatform('pinterest')} color={platformActive.includes('pinterest') ? "green" : 'gray'} />
                                </Stack>

                            </HStack>
                        </Stack>




                        <HStack>
                            <HStack>
                                <Text fontSize={'xl'}>History post</Text>
                                <Text fontSize={'md'} color='gray.500'>( {historyList.length} most recent )</Text>
                            </HStack>
                            <Spacer />

                            <HStack alignItems="center">
                                <Box mr={2}>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        max={today}
                                        size='sm'
                                        fontSize={'sm'}
                                        bgColor='white'
                                        borderRadius={'lg'}
                                        shadow='md'
                                    />
                                </Box>
                                <Box mr={2}>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        max={today}
                                        size='sm'
                                        fontSize={'sm'}
                                        bgColor='white'
                                        borderRadius={'lg'}
                                        shadow='md'
                                    />
                                </Box>
                                <Button colorScheme={'blue'} fontSize='sm' size={'sm'} onClick={() => handleReset()}>
                                    <HStack spacing={2}>
                                        <BiFilterAlt />
                                        <Text>Reset</Text>
                                    </HStack>
                                </Button>
                            </HStack>
                        </HStack>

                        {historyList.length > 0 && historyList.map((x, index) => {


                            return (
                                <Stack borderRadius='lg' key={index} shadow='md' bgColor={'white'} borderTopWidth={5} borderColor='green.400' p={5} >
                                    <HStack>
                                        <Stack spacing={5}>
                                            <Stack>
                                                <Text fontSize={'xs'}>{moment(x.created).format("LLLL")}</Text>
                                            </Stack>
                                            <Stack>
                                                <Text fontSize={'xs'} color='gray.600'>{x.post}</Text>
                                            </Stack>
                                            <Stack >
                                                <HStack gap={2} >
                                                    {x.mediaUrls.length > 0 && x.mediaUrls.map((y, index) => {
                                                        return (
                                                            <Stack key={index}>
                                                                <Image borderRadius={'lg'} w={'150px'} shadow={'md'} src={y} alt={y} />
                                                            </Stack>
                                                        )
                                                    })}

                                                </HStack>
                                            </Stack>


                                            <HStack spacing={5}>
                                                <Stack cursor={'pointer'} onClick={() => handleComment(x)}>
                                                    <AiOutlineComment size={20} />
                                                </Stack>
                                                <Stack cursor={'pointer'} onClick={() => handleAnalytics(x)}>
                                                    <TbPresentationAnalytics size={20} />
                                                </Stack>
                                                <Stack cursor={'pointer'} onClick={() => handleDeleteModal(x)}>
                                                    <BsTrash size={18} />
                                                </Stack>
                                            </HStack>
                                        </Stack>

                                        <Spacer />
                                        <Stack alignItems={'flex-end'} spacing={3} justifyContent='flex-end'>

                                            <Stack >
                                                <Text color={'gray.500'} fontSize='sm'>{x.errors && x.postIds ? "Response Active" : "Response Inactive"}</Text>
                                            </Stack>

                                            <HStack>
                                                <HStack spacing={2}>
                                                    {x.postIds && (
                                                        x.postIds.map((z, index) => {


                                                            const filterSuccess = PlatformArr.filter((y) => y.name.includes(z.platform))
                                                            const resIcon = filterSuccess[0]?.icon

                                                            return (
                                                                <a href={z.postUrl} key={index} target="_blank" rel="noopener noreferrer">
                                                                    <Stack color={'green'} key={z.id} cursor='pointer' onClick={() => console.log(z.postUrl)}>
                                                                        {resIcon}
                                                                    </Stack>
                                                                </a>
                                                            )
                                                        })
                                                    )}
                                                </HStack>

                                                <HStack spacing={2}>
                                                    {x.errors && (
                                                        x.errors.map((z, index) => {

                                                            const filterError = PlatformArr.filter((y) => y.name.includes(z.platform))
                                                            const resIcon = filterError[0]?.icon

                                                            return (
                                                                <Stack key={index} color='red' cursor='pointer' onClick={() => handleErrorMessage(z.message)}>
                                                                    {resIcon}
                                                                </Stack>
                                                            )
                                                        })
                                                    )}
                                                </HStack>

                                                {x.errors && x.postIds === undefined && (
                                                    <HStack spacing={2}>
                                                        {x.platforms && (
                                                            x.platforms.map((z, index) => {

                                                                const filterError = PlatformArr.filter((y) => y.name.includes(z))
                                                                const resIcon = filterError[0]?.icon

                                                                return (
                                                                    <Stack key={index} cursor='pointer' color={'gray'} onClick={() => console.log(z.message)}>
                                                                        {resIcon}
                                                                    </Stack>
                                                                )
                                                            })
                                                        )}
                                                    </HStack>
                                                )}


                                            </HStack>
                                        </Stack>


                                    </HStack>

                                </Stack>
                            )
                        })}

                    </Stack>
                </Stack>

                <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={() => setScheduleActive(false)}
                    isOpen={scheduleActive}
                    isCentered
                >
                    <AlertDialogOverlay />

                    <AlertDialogContent>
                        <AlertDialogHeader> <Text fontSize={'md'}>Posting Schedule</Text></AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            <Stack>
                                <Text fontSize={'sm'} color='gray.500'>Do you want to schedule a post for this ?
                                </Text>
                                <Input type={'datetime-local'} fontSize='sm' size={'sm'} onChange={(e) => setSchedulePosting(e.target.value)} />
                            </Stack>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setScheduleActive(false)}>
                                No
                            </Button>
                            <Button colorScheme='blue' ml={3} onClick={() => setScheduleActive(false)}>
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>


                <AlertDialog
                    isOpen={deleteModal}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setDeleteModal(false)}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Posting
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure delete this posting? You can't undo this action afterwards.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={() => handleDelete()} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <Modal isOpen={commentModal} onClose={() => setCommentModal(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <HStack>
                                <AiOutlineComment size={20} />
                                <Text fontSize={'md'}>Comments</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack>
                                <Stack spacing={3}>
                                    <Text fontSize={'sm'} color='gray.500'>Enter a new comments</Text>
                                    <Textarea fontSize={'xs'} onChange={(e) => setComment(e.target.value)} placeholder='text your comment in here' />
                                    <Stack alignItems={'flex-end'} justifyContent='flex-end'>
                                        <Button size={'sm'} colorScheme='blue' onClick={() => handlePostComment()}>
                                            <HStack spacing={2} alignItems='center' >
                                                <FiSend />
                                                <Text fontSize={'sm'}>Comment</Text>
                                            </HStack>
                                        </Button>
                                    </Stack>
                                </Stack>
                                <Stack spacing={3}>
                                    <Text fontSize={'sm'} color='gray.500'>List Comments</Text>

                                </Stack>
                                <Stack p={3} spacing={3}>
                                    {loadingComment ? (
                                        <Stack alignItems={'center'} justifyContent='center' h={'200px'} >
                                            <Spinner size='sm' />
                                        </Stack>
                                    ) : (
                                        socialMediaKeysArr?.length > 0 && (
                                            socialMediaKeysArr?.map((key) => (
                                                <Stack >
                                                    {commentDetailList[key]?.length > 0 || commentDetailList[key] !== null ? (

                                                        commentDetailList[key]?.map((data, index) => {



                                                            const filterError = PlatformArr?.filter((y) => y?.name?.includes(key && key))
                                                            const resIcon = filterError[0]?.icon


                                                            // if (key === 'linkedin') {
                                                            return (
                                                                <HStack alignItems='flex-start' justifyContent={'flex-start'} key={index}>
                                                                    <a href={data?.from?.url} target={'_blank'} rel="noopener noreferrer">
                                                                        <Avatar cursor={'pointer'} size="sm" src={data?.profileImageUrl} alt={data?.from?.name} >
                                                                            <AvatarBadge boxSize='1.7em' bg='green.500' >
                                                                                {resIcon && resIcon}
                                                                            </AvatarBadge>
                                                                        </Avatar>
                                                                    </a>
                                                                    <Stack alignItems={'flex-start'} justifyContent='center' shadow={'md'} bgColor={'blue.500'} maxW='60%' minH='50px' borderRadius={'lg'} p={3}>
                                                                        <Stack spacing={0} color='white'>
                                                                            <Text fontSize={'xs'} fontWeight='bold' textTransform={'capitalize'} >{key === "linkedin" ? data?.from?.name : key === "twitter" ? `@${data?.userName}` : ""} </Text>
                                                                            <Text fontSize={'xx-small'} >on {moment(data?.created).format("LLLL")}</Text>
                                                                        </Stack>
                                                                        <Stack color='white'>
                                                                            <Text fontSize={'xs'} >
                                                                                {data?.comment}
                                                                            </Text>
                                                                        </Stack>
                                                                    </Stack>

                                                                </HStack>
                                                            )
                                                            // }

                                                        })

                                                    )
                                                        :
                                                        (
                                                            <Stack alignItems={'center'} justifyContent='center' h={'200px'} >
                                                                <Text fontSize={'xs'} color='gray.500'>No have data comment</Text>
                                                            </Stack>
                                                        )
                                                    }

                                                </Stack>
                                            ))
                                        )
                                    )}


                                    {/* {commentDummys.length > 0 && commentDummys.map((x, index) => {
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
                                            <Stack key={index}>
                                                {x.name === "Rifqy Yusuf" ? (
                                                    <HStack alignItems='flex-start' justifyContent={'flex-end'}>
                                                        <Stack alignItems={'flex-start'} justifyContent='center' shadow={'md'} bgColor={'blue.500'} maxW='60%' minH='50px' borderRadius={'lg'} p={3}>
                                                            <Stack spacing={0} color='white'>
                                                                <Text fontSize={'xs'} fontWeight='bold' textTransform={'capitalize'} >{x.name} </Text>
                                                                <Text fontSize={'xx-small'} >on {moment(x.time).format("LLLL")}</Text>
                                                            </Stack>
                                                            <Stack color='white'>
                                                                <Text fontSize={'xs'} >
                                                                    {x.comment}
                                                                </Text>
                                                            </Stack>
                                                        </Stack>
                                                        <Avatar size="sm" src={x.userImage} alt={x.displayName}>
                                                            <AvatarBadge boxSize='1.5em' bg='green.500'> {resIcon}</AvatarBadge>
                                                        </Avatar>
                                                    </HStack>
                                                ) : (
                                                    <HStack alignItems='flex-start' justifyContent={'flex-start'}>
                                                        <Avatar size="sm" src={x.userImage} alt={x.displayName}>
                                                            <AvatarBadge boxSize='1.5em' bg='green.500'> {resIcon}</AvatarBadge>
                                                        </Avatar>
                                                        <Stack alignItems={'flex-start'} justifyContent='center' shadow={'md'} bgColor={'blue.500'} maxW='60%' minH='50px' borderRadius={'lg'} p={3}>
                                                            <Stack spacing={0} color='white'>
                                                                <Text fontSize={'xs'} fontWeight='bold' textTransform={'capitalize'}>{x.name} </Text>
                                                                <Text fontSize={'xx-small'} >on {moment(x.time).format("LLLL")}</Text>
                                                            </Stack>
                                                            <Stack>
                                                                <Text color='white' fontSize={'xs'} >
                                                                    {x.comment}
                                                                </Text>
                                                            </Stack>
                                                        </Stack>
                                                    </HStack>
                                                )}
                                            </Stack>
                                        )
                                    })} */}
                                </Stack>
                            </Stack>
                        </ModalBody>

                        <Divider />
                        <ModalFooter>
                            <Button colorScheme='blackAlpha' size='sm' mr={3} onClick={() => setCommentModal(false)}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal isOpen={analyticsModal} onClose={() => setAnalyticsModal(false)}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <HStack>
                                <TbPresentationAnalytics size={20} />
                                <Text fontSize={'md'}>Analytics</Text>
                            </HStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack>
                                <Stack >
                                    {Object.entries(analyticsDetailList).map(([key, value]) => (
                                        <Stack key={key}>
                                            <Text fontSize={'sm'} fontWeight='bold' textTransform={'capitalize'}>{key}</Text>
                                            <Divider />
                                            <pre style={{ fontSize: '10px', width: '300px' }}>{JSON.stringify(value.analytics, null, 2)}</pre>
                                        </Stack>
                                    ))}
                                </Stack>


                            </Stack>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blackAlpha' mr={3} onClick={() => setAnalyticsModal(false)}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </Flex >






        </Stack >
    )
}

export default SocialBuildPage