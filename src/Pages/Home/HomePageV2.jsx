import { Heading, HStack, Spacer, Stack } from '@chakra-ui/react'
import React from 'react'

function HomePageV2() {
    return (
        <Stack p={[1, 1, 5]}>
            <Stack spacing={4}>
                <HStack>
                    <Heading size={"md"} fontWeight="bold">
                        Home
                    </Heading>
                    <Spacer />
                    <HStack>
                    
                    </HStack>
                </HStack>


                <Stack
                    bgColor="white"
                    spacing={1}
                    borderRadius="xl"
                    p={3}
                    m={[1, 1, 5]}
                    shadow="md"
                >
                   
                </Stack>
            </Stack>

        </Stack>
    )
}

export default HomePageV2