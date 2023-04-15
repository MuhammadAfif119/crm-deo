import { Avatar, AvatarBadge, Stack } from '@chakra-ui/react'
import React from 'react'

function AppHeaderV2() {
    return (
        <Stack >
            <Stack alignItems={'flex-end'} p={2} justifyContent='flex-end'>
                <Avatar size={'sm'} src={''} alt={''}>
                    <AvatarBadge boxSize='1.25em' bg='green.500'/> 
                </Avatar>
            </Stack>
        </Stack>
    )
}

export default AppHeaderV2