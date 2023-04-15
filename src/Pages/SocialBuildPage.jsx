import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, AvatarBadge, Box, Button, Checkbox, Divider, Flex, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spacer, Spinner, Stack, Text, Textarea, useDisclosure, useToast, } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { MdOutlinePermMedia, MdSchedule } from 'react-icons/md'
import { FiSend } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import store from 'store'

import { FaFacebook, FaFacebookF, FaGoogle, FaInstagram, FaLinkedin, FaPinterest, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa'
import moment from 'moment'
import AuthContext from '../Routes/hooks/AuthContext'
import ApiBackend from '../Api/ApiBackend'
import AppSideAccountBar from '../Components/AppSideAccountBar'

function SocialBuildPage() {


    const width = window.innerWidth
    const height = window.innerHeight

    const navigate = useNavigate()

    const toast = useToast()

    const [posting, setPosting] = useState('')
    const [shortenLinks, setShotenLinks] = useState(false)
    const [platformActive, setPlatformActive] = useState([])
    const [files, setFiles] = useState([]);
    const [scheduleActive, setScheduleActive] = useState(false)
    const [schedulePosting, setSchedulePosting] = useState('')

    const [barStatus, setBarStatus] = useState(false)


    const contentWidth = barStatus ? "85%" : "95%";

    let [searchParams, setSearchParams] = useSearchParams();

    const profileKey = searchParams.get("detail")


    const { loadingShow, loadingClose } = useContext(AuthContext)


    const cancelRef = React.useRef()


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

    const handleDialogSchedule = () => {
        setSchedulePosting('')
        setScheduleActive(true)
    }




    return (
        <Stack >

            <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>

                <Stack >
                    <AppSideAccountBar setBarStatus={setBarStatus} />
                </Stack>
                <Spacer />

                <Stack w={contentWidth}  transition={"0.2s ease-in-out"} minH={height}  >
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

                    </Stack>
                </Stack>

            </ Flex>

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

        </Stack >
    )
}

export default SocialBuildPage