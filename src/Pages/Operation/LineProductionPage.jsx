import React, { useEffect, useRef, useState } from 'react'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, HStack, Heading, SimpleGrid, useDisclosure, useToast, Stack, Text, AvatarGroup, Flex, Avatar, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Grid, Center, VStack, Divider, Icon, Input, Spacer } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { DeleteIcon } from '@chakra-ui/icons'
import AddButtonComponentMindmap from '../../Components/Buttons/AddButtonComponentMindmap'
import { FcMindMap } from 'react-icons/fc'
import { arrayRemove, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../../Config/firebase'
import moment from 'moment'
import { clientTypessense } from '../../Api/Typesense'
import useUserStore from '../../Hooks/Zustand/Store'
import { deleteDocumentFirebase, deleteSubcollection, getCollectionFirebase, getCollectionFirebaseV2 } from '../../Api/firebaseApi'
import BackButtons from '../../Components/Buttons/BackButtons'

const LineProductionPage = () => {
  const [flowchart, setFlowchart] = useState([])
  const [selectedFlowchart, setSelectedFlowchart] = useState(null)
  const navigate = useNavigate()
  const globalState = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const toast = useToast()
  const [modal, setModal] = useState({ delete: false, user: false })
  const [editor, setEditor] = useState()
  const [data, setData] = useState()

  const [searchInput, setSearchInput] = useState("")
  const [dataMindmapSearch, setDataMindmapSearch] = useState([])

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 8;


  const getMindmapV2 = async () => {
    if (globalState?.currentCompany) {
      const conditions = [
        { field: 'companyId', operator: '==', value: globalState?.currentCompany },
        { field: 'type', operator: '==', value: 'production' },
        { field: 'users', operator: 'array-contains', value: globalState?.uid },
      ];

      const sortBy = { field: 'createdAt', direction: 'desc' };
      const limitValue = startIndex + itemsPerPage;

      try {
        const resAssets = await getCollectionFirebase('productions', conditions, sortBy, limitValue);
        const projectDataArray = await Promise.all(
          resAssets?.map(async (projectData) => {
            const userSnapshot = await getDocs(collection(db, `productions/${projectData?.id}/users`));
            const userData = userSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            projectData.usersProjectData = userData;
            return projectData;
          })
        );

        setFlowchart(projectDataArray.length > 0 ? projectDataArray : []);
      } catch (error) {
        console.log(error);
      }
    }

  };



  const handleDeleteFlowchart = async () => {
    const resSubCollection = await deleteSubcollection(`folders/${selectedFlowchart?.id}/users`)
    // console.log(resSubCollection, 'xxx')
    if (resSubCollection) {
      // console.log('cek')
      const res = await deleteDocumentFirebase('productions', selectedFlowchart?.id)
      if (res) {
        setSelectedFlowchart(null)
        // setModal({ ...modal, delete: false })
        toast({
          title: "Deoapp.com",
          description: res,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
        onClose()
        getMindmapV2()
      }
    }
  }

  const modalTeam = (team) => {
    console.log(team, 'mamama')
    // setSelectedFlowchart(x)
    setData(team)

    const detail = team?.usersProjectData?.map(x => {
      return {
        name: x.name,
        email: x.email,
        id: x.id
      }
    })
    setEditor(detail)
    setModal({ ...modal, user: true })
  }

  const handleRemoveUser = async (x) => {
    try {
      const dataRef = doc(db, 'productions', data?.id)
      await updateDoc(dataRef, { owner: arrayRemove(x.id) })
      await updateDoc(dataRef, { users: arrayRemove(x.id) })
      await deleteDocumentFirebase(`productions/${data.id}/users`, x.id)

      setModal({ ...modal, user: false })
      toast({
        title: 'Deleted',
        description: 'User Deleted',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      getMindmapV2()
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleSearch = (q) => {
    setSearchInput(q)


    const searchParameters = {
      q: q,
      query_by: "title",
      filter_by: `type: production && companyId:${globalState.currentCompany} && users:${globalState.uid}`,
      sort_by: "_text_match:desc"
    };
    clientTypessense
      .collections("flowcharts")
      .documents()
      .search(searchParameters)
      .then((x) => {
        const hits = x?.hits?.map((x) => x.document)
        console.log(hits)
        setDataMindmapSearch(hits)
      })
      .catch((err) => console.log(err.message))

  }


  const handleLoadMore = () => {
    setStartIndex((prev) => prev + itemsPerPage);
  };

  useEffect(() => {
    if (globalState?.currentCompany) {
      getMindmapV2()
    }

  }, [globalState?.currentCompany, startIndex])


  return (
    <Stack spacing={5} p={[1, 1, 5]}>
      <HStack>
        <BackButtons />

        <Stack>
          <Input placeholder='Search' bgColor={'white'} shadow='md' borderRadius={'md'} size={'md'} onChange={(e) => handleSearch(e.target.value)} />
        </Stack>
        <Spacer />
        <AddButtonComponentMindmap type={'production'} link={'/production/line'} />
      </HStack>
      {searchInput !== "" ? (
        <SimpleGrid columns={4} spacing={3} pt='5'>
          {dataMindmapSearch.length > 0 && (
            dataMindmapSearch?.map((item, index) => (
              <Stack shadow={'base'} bgColor='white' key={index} >
                <VStack align={'flex-start'} w={'full'} h={'full'} justify={'space-between'}>
                  <HStack spacing={3} px={4} pt={4} w='100%'>
                    <Stack onClick={() => navigate(`/production/${item?.id}`)}>
                      <FcMindMap size={50} />
                    </Stack>
                    <Stack>
                      <Text textTransform={'capitalize'} color='blackAlpha.800' onClick={() => navigate(`/mindmap/${item?.id}`)} noOfLines={2} fontSize={'sm'} fontWeight={'medium'}>{item.title}</Text>
                      <AvatarGroup size='sm' max={5} onClick={() => modalTeam(item)}>
                        {
                          item?.usersProjectData?.map((z, i) =>
                            <Avatar key={i} name={z.name} />

                          )
                        }
                      </AvatarGroup>
                    </Stack>


                  </HStack>
                  <HStack alignItems={'center'} justifyContent='space-around' w={'full'} p={3}>
                    <Text spacing={3} fontSize={'2xs'}>{`${moment(item?.createdAt * 1000).format("llll")}`} </Text>
                    <Spacer />
                    {item?.owner?.includes(globalState?.uid) &&
                      <Box >
                        <DeleteIcon onClick={() => { onOpen(); setSelectedFlowchart(item) }} />
                      </Box>
                    }
                  </HStack>
                </VStack>

              </Stack>
            ))
          )}

        </SimpleGrid>


      ) : (
        <SimpleGrid columns={4} spacing={3} pt='5'>
          {flowchart?.map((item, index) => (
            <Stack shadow={'base'} bgColor='white' key={index} >
              <VStack align={'flex-start'} w={'full'} h={'full'} justify={'space-between'}>
                <HStack spacing={3} px={4} pt={4} w='100%'>
                  <Stack onClick={() => navigate(`/production/line/${item?.id}`)}>
                    <FcMindMap size={50} />
                  </Stack>
                  <Stack>
                    <Text textTransform={'capitalize'} color='blackAlpha.800' onClick={() => navigate(`/production/line/${item?.id}`)} noOfLines={2} fontSize={'sm'} fontWeight={'medium'}>{item.title}</Text>
                    <AvatarGroup size='sm' max={5} onClick={() => modalTeam(item)}>
                      {
                        item?.usersProjectData.map((z, i) =>
                          <Avatar key={i} name={z.name} />

                        )
                      }
                    </AvatarGroup>
                  </Stack>


                </HStack>
                <HStack alignItems={'center'} justifyContent='space-around' w={'full'} p={3}>
                  <Text spacing={3} fontSize={'2xs'}>{`${moment.unix(item?.createdAt?.seconds).format("llll")}`} </Text>
                  <Spacer />
                  {item?.owner?.includes(globalState?.uid) &&
                    <Box >
                      <DeleteIcon cursor={'pointer'} onClick={() => { onOpen(); setSelectedFlowchart(item) }} />
                    </Box>
                  }
                </HStack>
              </VStack>

            </Stack>
          ))}
        </SimpleGrid>

      )}

      <Stack alignItems={'center'} justifyContent='center' py={5}>
        <Box>
          {flowchart?.length > startIndex && <Button onClick={handleLoadMore} size='sm'>Load More</Button>}
        </Box>
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Flowchart
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure want to delete flowchart '<b>{selectedFlowchart?.title}</b>'? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={() => handleDeleteFlowchart()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal onClose={() => setModal({ ...modal, user: false })} isOpen={modal?.user} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>

              <Center>
                <VStack my={3}>
                  <Heading size={'md'}>{data?.title}</Heading>
                  <Text fontSize={'xs'}>Created By : {data?.usersProjectData[0]?.name}</Text>
                  <Divider />
                </VStack>
              </Center>
              {editor?.map((x, i) => (
                <HStack key={i} justify={'space-between'} w={'full'} py={1}>
                  {x.name === data?.usersProjectData[0]?.name ?
                    <>
                      <HStack gap={3}>
                        <Avatar size={'md'} name={x.name} />
                        <VStack align={'flex-start'}>
                          <Text fontWeight={'medium'} fontSize={'sm'}>{x.name}</Text>
                          <Text fontSize={'xs'}>{x.email}</Text>
                        </VStack>
                      </HStack>
                      <Stack>

                        <Box p={4}>
                          <Text fontStyle={'italic'} fontSize={'xs'}>Creator</Text>
                        </Box>

                      </Stack>
                    </>
                    :
                    <>
                      <HStack gap={3}>
                        <Avatar size={'md'} name={x.name} />
                        <VStack align={'flex-start'}>
                          <Text fontWeight={'medium'} fontSize={'sm'}>{x.name}</Text>
                          <Text fontSize={'xs'}>{x.email}</Text>
                        </VStack>
                      </HStack>
                      <Stack>
                        {data?.owner?.includes(globalState?.uid) &&
                          <Box p={4} w='15%'>
                            <DeleteIcon cursor={'pointer'} onClick={() => handleRemoveUser(x)} />
                          </Box>
                        }
                      </Stack>
                    </>}

                </HStack>

              ))}

              {/* {selectedFlowchart?.length > 0 && selectedFlowchart?.map((item, index) => (


                                <HStack key={index}>
                                    {
                                        item?.usersProjectData?.map((z, i) => (
                                            <Stack>
                                                <Avatar name={z.name} src={z.name} />
                                                <Text>{z.name}</Text>
                                            </Stack>
                                        )
                                        )
                                    }
                                </HStack>
                            ))} */}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setModal({ ...modal, user: false })}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default LineProductionPage