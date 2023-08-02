import { Stack } from '@chakra-ui/react'
import React from 'react'
import ViewPageListing from './ViewPageListing'
import AddButtons from '../../Components/Buttons/AddButtons'

function ListingPage() {
    return (
        <Stack p={[1, 1, 5]}>
            <AddButtons type={'Listings'} link={'/listing/create'}/>
            <Stack>
                <ViewPageListing />
            </Stack>
        </Stack>
    )
}

export default ListingPage