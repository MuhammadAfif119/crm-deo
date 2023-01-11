import { AspectRatio, Stack } from '@chakra-ui/react'
import React from 'react'

function InformationPage() {
    const link = 'https://docs.xendit.co/id/xenpayments/virtual-account/making-payments'

    return (
        <Stack>
            <AspectRatio maxW='100%' ratio={1}>
                <iframe
                    title='xendit'
                    src={link}
                    allowFullScreen
                />
            </AspectRatio>
        </Stack>
    )
}

export default InformationPage