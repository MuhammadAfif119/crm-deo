import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi'
import { formatFrice } from '../../Utils/Helper'

function TicketCard({ item }) {

    const monthNames = moment.monthsShort();


    return (
        <Box pos={'relative'}  >
            <VStack spacing={3} rounded={5} borderWidth='1px' p={3} bgColor='white' shadow={'md'} align={'left'} justify={'space-between'} cursor={'pointer'}
                _hover={{
                    bg: "gray.100",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                    cursor: "pointer"
                }}
            >
                <Flex justify={'space-between'} align={'center'}>
                    <Heading size={'sm'} textTransform='capitalize'>{item?.title} - {item?.projectName}</Heading>
                    <Button variant={'unstyled'} onClick={() => console.log('delete', item)}>
                        <DeleteIcon />
                    </Button>
                </Flex>
                <Box >
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

                </Box>
                <Stack>
                        <Heading size={'md'} color='green.500'>Rp. {formatFrice(item.price)}</Heading>
                </Stack>
            </VStack>

        </Box>
    )
}

export default TicketCard