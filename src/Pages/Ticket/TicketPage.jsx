import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Button, Divider, Flex, HStack, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Stack, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { deleteDocumentFirebase, deleteFileFirebase, getCollectionWhereFirebase } from '../../Api/firebaseApi'
import moment from 'moment';
import useUserStore from '../../Hooks/Zustand/Store'

const TicketPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const today = moment();
  const monthNames = moment.monthsShort();
  const globalState = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [data, setData] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [active, setActive] = useState(true)

  const getData = async () => {
    try {
      const res = await getCollectionWhereFirebase('tickets', 'projectId', '==', globalState?.currentProject)
      setData(res)

    } catch (error) {
      console.log(error)
    }
  }

  const handleModal = (type, item) => {
    onOpen()
    setSelectedData({ type: type, item: item })
  }

  const handleDelete = async (x) => {
    try {
      console.log(x)
      deleteFileFirebase(`${x.title}_800x800`, `tickets`).then(() => {
        deleteFileFirebase(`${x.title}-logo_800x800`, `tickets`).then(() => {
          deleteDocumentFirebase('tickets', x?.id).then((res) => {
            toast({
              title: "Deoapp.com",
              description: res,
              status: "success",
              position: "top-right",
              isClosable: true,
            });
            getData()
            onClose()
          })
        })
      })

    } catch (error) {
      toast({
        title: "Deoapp.com",
        description: error,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }

  }



  useEffect(() => {
    getData()
  }, [globalState?.currentProject])

  return (
    <Box >
      <Flex justify={'space-between'} align={'center '}>
        <Heading>Ticket</Heading>
        <Button leftIcon={<AddIcon />} colorScheme='green' onClick={() => navigate('/ticket/create')}>Add New Ticket</Button>
      </Flex>
      <Flex textAlign={'center'} my={5} >
        <Box w='50%' onClick={() => setActive(true)} p='3' cursor={'pointer'} borderTopWidth={3} rounded={5} borderLeftWidth={3} borderColor={active === true ? 'green' : 'transparent'} shadow={active === false ? 'md' : 'none'}>
          <Heading size='sm'>
            Active
          </Heading>
        </Box>
        <Box w='50%' onClick={() => setActive(false)} p='3' cursor={'pointer'} borderTopWidth={3} rounded={5} shadow={active === true ? 'md' : 'none'} borderRightWidth={3} borderColor={active === false ? 'green' : 'transparent'}>
          <Heading size='sm'>
            In-Active
          </Heading>
        </Box>
      </Flex>
      <SimpleGrid columns={data.length !== 0 ? [2, 3] : 1} gap='5'>
        {data.length !== 0 ? data?.filter((item) =>
          active
            ? active === item?.isActive && today.isBefore(item?.dateStart)
            : active === item?.isActive || today.isSameOrAfter(item?.dateStart)
        ).map((item, index) => {
          return (
            <>
              <Box pos={'relative'} key={index} >
                <VStack border={'1px solid black'} cursor={'pointer'} _hover={{ shadow: 'lg' }} rounded={8} bgColor={'transparent'} h={'auto'} p={5} my='2' justify={'left'} align={'left'} >
                  <Flex justify={'space-between'} align={'center'}>
                    <Heading size={'sm'} onClick={() => handleModal('read', item)}>{item?.title}</Heading>
                    <Button variant={'unstyled'} onClick={() => handleModal('delete', item)}>
                      <DeleteIcon />
                    </Button>
                  </Flex>
                  <Box onClick={() => handleModal('read', item)}>
                    <Flex gap={2} align={'center'}>
                      <FiCalendar />
                      <Text size={'sm'}>{moment(item?.dateStart).format("DD")} {monthNames[moment(item?.dateStart).month()]} {moment(item?.dateStart).format("YYYY")}</Text>
                      {item?.dateEnd &&

                        <Text size={'sm'}>- {moment(item?.dateEnd).format("DD")} {monthNames[moment(item?.dateEnd).month()]} {moment(item?.dateEnd).format("YYYY")}</Text>
                      }
                    </Flex>
                    <Flex align={'center'} gap='2'>
                      <FiClock />
                      <Text size={'sm'}>{item?.time}</Text>
                      <Text size='sm'> - {item?.timeEnd}</Text>
                    </Flex>
                    <Flex align={'center'} gap={2}>
                      <FiMapPin />
                      <Text size={'sm'}>{item?.address || 'Zoom'}</Text>
                    </Flex>
                    <Flex justify={'space-between'} align={'center'}>
                      {/* <PriceTag price={x.price} />
              {x.sold === true ? <Text textTransform={'uppercase'} fontWeight={'medium'}>fully booked</Text> :
                today.isAfter(x?.endTicket) ?
                  <Text color={'red'} textTransform={'uppercase'} fontWeight={'medium'}>sale ended</Text>

                  :
                  <Button size={'sm'} colorScheme={value?.webConfig?.colorScheme}>Buy Ticket</Button>
              } */}
                    </Flex>
                  </Box>
                </VStack>
                <Box position={'absolute'} w='20px' h='32px' borderLeftRadius={'75px'} border={'1px solid black'} bottom={'50%'} right={0} bgColor={"gray.50"} borderRight={0} zIndex={2}></Box>
                <Box position={'absolute'} w='20px' h='32px' borderRightRadius={'75px'} border={'1px solid black'} bottom={'50%'} left={0} bgColor={"gray.50"} borderLeft={0} zIndex={2}></Box>
              </Box>
            </>

          )
        }) : <Heading my='5' size='sm' textAlign={'center'}>You don't have any ticket yet in this project.</Heading>
        }
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedData?.type === 'read' ? 'Event Details' : 'Confirm Delete'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedData?.type === 'read' ?
              <>
                <Image src={selectedData?.item?.thumbnail || selectedData?.item?.thumbnaill} aspectRatio={16 / 9} objectFit={'contain'} maxH={'300px'} />
                <Text fontWeight={'bold'} fontSize='lg'>{selectedData?.item?.title}</Text>
                <Text>{selectedData?.item?.description}</Text>
                <Flex gap={2} align={'center'}>
                  <FiCalendar />
                  <Text size={'sm'}>{moment(selectedData?.item?.dateStart).format("DD")} {monthNames[moment(selectedData?.item?.dateStart).month()]} {moment(selectedData?.item?.dateStart).format("YYYY")}</Text>
                  {selectedData?.item?.dateEnd &&

                    <Text size={'sm'}>- {moment(selectedData?.item?.dateEnd).format("DD")} {monthNames[moment(selectedData?.item?.dateEnd).month()]} {moment(selectedData?.item?.dateEnd).format("YYYY")}</Text>
                  }
                </Flex>
                <Flex align={'center'} gap='2'>
                  <FiClock />
                  <Text size={'sm'}>{selectedData?.item?.time}</Text>
                  <Text size='sm'> - {selectedData?.item?.timeEnd}</Text>
                </Flex>
                <Flex align={'center'} gap={2}>
                  <FiMapPin />
                  <Text size={'sm'}>{selectedData?.item?.address || 'Zoom'}</Text>
                </Flex>
              </>
              : <Text>Are you sure want to delete ticket <b>{selectedData?.item?.title}</b>?</Text>
            }
          </ModalBody>

          <ModalFooter>
            {selectedData?.type === 'read' ?
              <Button colorScheme='blue' mr={3} leftIcon={<EditIcon />} onClick={() => navigate(`/ticket/edit?id=${selectedData?.item?.id}`)}>
                Edit
              </Button> :
              <Button colorScheme='red' mr={3} leftIcon={<DeleteIcon />} onClick={() => handleDelete(selectedData?.item)}>
                Delete
              </Button>
            }

          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default TicketPage