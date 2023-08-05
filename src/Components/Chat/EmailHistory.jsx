import { HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'

function EmailHistory({ data }) {
    return (
        <Stack p={[1, 1, 5]} h='500px' overflowY={'scroll'}>
            {data.length > 0 &&
                <Stack>
                    {data.map((x, index) => {
                        return (
                            <Stack key={index} borderRadius='md' borderTopWidth={1} borderColor='green.400' shadow={'md'} p={3}>
                                <Text textTransform={'capitalize'} fontSize='sm' fontWeight={500}>{x.title}</Text>
                                <Text fontSize={'xs'} color='gray.500'>{x.subject}</Text>
                                <HStack>
                                    <Text fontSize={'xs'} color='gray.500' textTransform={'capitalize'}>{x.type}</Text>
                                    <Spacer/>
                                    <Text  fontSize={'xs'} color='gray.500' >{moment(x.createdAt.seconds * 1000).fromNow()}</Text>
                                </HStack>
                            </Stack>
                        )
                    })}
                </Stack>
            }
        </Stack>
    )
}

export default EmailHistory