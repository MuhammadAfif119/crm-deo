import { HStack, Stack } from '@chakra-ui/react'
import React from 'react'
import ViewPageListing from './ViewPageListing'
import AddButtons from '../../Components/Buttons/AddButtons'
import BackButtons from '../../Components/Buttons/BackButtons'

function ListingPage() {
    return (
        <Stack p={[1, 1, 5]}>
            <HStack>
                <BackButtons />
                <AddButtons type={'Listings'} link={'/listing/create'} />
            </HStack>
            <Stack>
                <ViewPageListing />
            </Stack>
        </Stack>
    )
}

export default ListingPage