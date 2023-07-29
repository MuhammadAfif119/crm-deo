import { Heading, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleDocumentFirebase } from '../../Api/firebaseApi'

function PipelineViewPage() {

    const param = useParams()
    const [pipelineList, setPipelineList] = useState("")

    const fetchData = async () => {
        try {
            const result = await getSingleDocumentFirebase('pipelines', param.id)
            setPipelineList(result)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        fetchData()

        return () => {
        }
    }, [])

    return (
        <Stack p={[1,1,5]}>
            <Stack>
                <Heading size={'md'}>Pipelines</Heading>
            </Stack>
            <Stack>
                {pipelineList.length > 0 }
            </Stack>
        </Stack>
    )
}

export default PipelineViewPage