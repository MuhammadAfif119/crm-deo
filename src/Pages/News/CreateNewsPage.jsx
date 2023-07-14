import {
    Box, Button, Flex, Heading, useDisclosure, ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Modal,
    Input,
    Text,
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
    VStack,
    Spinner,
    FormControl,
    FormLabel,
    useToast,
    SimpleGrid,
    Tooltip,
    Image,
    Stack,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { addDocumentFirebase, updateDocumentFirebase, UploadBlob, uploadFile } from '../../Api/firebaseApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill.css';
import { serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../Routes/Store';
import BackButtons from '../../Components/Buttons/BackButtons';
import { MdOutlinePermMedia } from 'react-icons/md';

const CreateNewsPage = () => {
    const navigate = useNavigate();
    const { onOpen, isOpen, onClose } = useDisclosure();
    // const { currentProject } = useGlobalState();

    const { userDisplay } = useUserStore();

    const projectId = userDisplay.currentProject
    const companyId = userDisplay.currentCompany


    const [newTag, setNewTag] = useState('');
    const [dataInput, setDataInput] = useState({
        tags: []
    });
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(false);
    const [loading, setLoading] = useState(false);
    const contentRef = useRef();

    const toast = useToast();
    const breadcrumbData = [
        { title: 'Home', link: '/' },
        { title: 'News', link: '/news' },
        { title: 'Create', link: '/Create' },
    ];


    const handleDropImage = async (file) => {
        const filesFormats = ["image/jpg", "image/jpeg", "image/png", "image/heic"];
        const isRightFormat = filesFormats.includes(file.type);
        if (!isRightFormat) {
            toast({
                title: 'Please upload image with the following formats:',
                description: '.png, .jpeg, .jpg, .webp, .heic',
                isClosable: true,
                duration: 9000,
                status: 'error',
            })
            return;
        }
        setIsUploading(true)
        await uploadFile(dataInput.title, 'articles', file)
            .then(
                (uploadedImg) => {
                    console.log(uploadedImg, "this is data result");
                    setDataInput({
                        ...dataInput,
                        thumbnailURL: uploadedImg,
                    });
                    setIsUploading(false)
                }
            );
    };

    const handleSave = async () => {
        setLoading(true)
        setDataInput({
            ...dataInput,
            content: contentRef.current,
            projectId: projectId,
        })
        //
        //
        if (Object.keys(projectId)?.length === 0) {
            setLoading(false)
            toast({
                title: 'Which project you want to post this article to?',
                description: 'Please select project from the sidebar on the left',
                isClosable: true,
                duration: 9000,
                status: 'warning',
            })
        } else {
            // 1. save to news collection via adddoc
            addDocumentFirebase('news',
                {
                    ...dataInput,
                    content: contentRef.current,
                    status: 'active',
                    createdAt: new Date(),
                    timestamp: serverTimestamp(),
                    projectsId: projectId,
                    thumbnail: dataInput?.thumbnailURL??
                        'https://cdn0-production-images-kly.akamaized.net/vX9Wn584ZkWXU4ehZAr2hpApnKM=/640x360/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3181463/original/093797600_1594883363-r5t6y7u8989HL.jpg'
                }, companyId).then((id) => {
                    console.log('added with id ', id)
                    toast({
                        title: 'Posting article success',
                        isClosable: true,
                        duration: 9000,
                        status: 'success',
                    })
                    navigate(-1)
                }).catch(err => {
                    console.log(err.message)
                    toast({
                        title: 'Which project you want to post this article to?',
                        description: 'Please select project from the sidebar on the left',
                        isClosable: true,
                        duration: 9000,
                        status: 'warning',
                    })
                })
            ////2. save to tags by project id, field : news, array union
            // updateDocumentFirebase('tags', currentProject?.id, {
            //     news: [...dataInput.tags]
            // }).finally(() => {
            //     setLoading(true)
            // })
        }
    };

    const handleSaveTag = () => {
        let arr = [...dataInput.tags]
        arr.push(newTag)
        setDataInput({
            ...dataInput,
            tags: arr
        })
        onClose()
    };

    const deleteTag = (i) => {
        let arr = [...dataInput.tags]
        if (arr.length === 1) {
            arr = []
            setDataInput({
                ...dataInput,
                tags: arr
            });
        } else {
            arr.splice(i, 1)
            setDataInput({
                ...dataInput,
                tags: arr
            });
        };
    };

    const contentChange = (value) => {
        contentRef.current = value
    };

    return (
        <>
            <BackButtons />
            <Flex justifyContent='space-between'>
                <Heading>News</Heading>
            </Flex>
            {/* <BreadCrumbComponent data={breadcrumbData} /> */}
            <Box my={10}>
                <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input bg='white' onChange={e => setDataInput({ ...dataInput, title: e.target.value })} placeholder='Title Here' />
                </FormControl>
                <Box my={2}>
                    <HStack>
                        <Text>Tags: </Text>
                        <Button onClick={onOpen} colorScheme='green' size='sm'>Add New Tag</Button>
                    </HStack>
                    {dataInput?.tags?.length > 0 &&
                        <Box padding={5} mt={5} bg='white' display='flex' flexDirection="row" >
                            <VStack>
                                <HStack spacing={4}>
                                    {dataInput?.tags?.map((x, i) => (
                                        <Tag
                                            size={'md'}
                                            borderRadius='full'
                                            variant='solid'
                                            colorScheme='green'
                                            key={i}
                                        >
                                            <TagLabel>{x}</TagLabel>
                                            <TagCloseButton onClick={() => deleteTag(i)} />
                                        </Tag>
                                    ))}
                                </HStack>
                            </VStack>
                        </Box>}
                </Box>
                <Box mb='5'>
                    <Tooltip label='Thumbnail image for your news / articles'>
                        <Text fontWeight={600} color='gray.600'>Thumbnail</Text>
                    </Tooltip>
                    {/* <SimpleGrid columns={2} gap={2}> */}
                        <Input
                        mt='5'
                            accept='image/png, image/jpeg, image/jpg, image/webp'
                            type='file'
                            // minH='50px'
                            // variant={'ghost'}
                            // placeholder='Insert image here'
                            display={'none'}
                            id='fileInput'
                            onChange={(e) => handleDropImage(e.target.files[0])}
                        />
                        <label htmlFor="fileInput">
                            <HStack cursor="pointer" mt='3'>
                                <Stack>
                                    <MdOutlinePermMedia />
                                </Stack>
                                <Text fontSize="sm" color="blue.600" fontStyle="italic">
                                    Add Image Thumbnail for News
                                </Text>
                            </HStack>
                        </label>
                    <Image maxW="300px" src={dataInput?.thumbnailURL?.replace('_800x800$1','')} />
                    {/* </SimpleGrid> */}
                </Box>
                {isUploading ? <Spinner /> : null}
                {/* <ReactQuill
                    // theme="snow"
                    value={contentRef.current}
                    onChange={(e) => contentChange(e)}
                // className='quill'
                // style={{
                //     marginTop: 50,
                //     backgroundColor: 'white',
                //     marginBottom: 20
                // }}
                /> */}
                <ReactQuill
                    value={contentRef.current}
                    onChange={e => contentChange(e)}
                />
                <Button mt='5' positon='absolute' w='full' colorScheme='facebook' onClick={() => handleSave(contentRef.current)} disabled={loading}>{loading ? <Spinner mx={5} /> : <Text>Save</Text>}</Button>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Tag</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input placeholder='enter tag here' onChange={e => setNewTag(e.target.value)} onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTag()
                        }} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSaveTag}>
                            Submit
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default CreateNewsPage