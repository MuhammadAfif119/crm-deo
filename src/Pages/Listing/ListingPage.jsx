import { Button, Grid, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { FcPlus } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import FormPageListing from './FormPageListing'
import ViewPageListing from './ViewPageListing'

function ListingPage() {

    const navigate = useNavigate()
    return (
        <Stack p={[1, 1, 5]}>
            <HStack>



                <Heading size={'md'}>
                    Listing
                </Heading>
                <Spacer />
                <Stack>
                    <Button onClick={() => navigate('/listing/create')} bgColor={'white'} shadow='md' variant='outline' borderColor='#F05A28' color='#F05A28'>
                        <HStack>
                            <FcPlus />
                            <Text>Listing</Text>
                        </HStack>
                    </Button>
                </Stack>
            </HStack>
            <Stack>
                <ViewPageListing />
            </Stack>
        </Stack>
    )
}

export default ListingPage