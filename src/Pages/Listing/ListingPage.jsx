import { Grid, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import FormPageListing from './FormPageListing'
import ViewPageListing from './ViewPageListing'

function ListingPage() {
    return (
        <Stack p={[1, 1, 5]}>
                    <FormPageListing />
        </Stack>
    )
}

export default ListingPage