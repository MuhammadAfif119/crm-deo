import { Box, Button, Center, Flex, Heading, HStack, Input, Select, SimpleGrid, Spacer, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useParams } from 'react-router-dom'
import { getSingleDocumentFirebase } from '../../Api/firebaseApi'
import KanbanColumnsComponent from '../../Components/Columns/KanbanColumnsComponent'

function PipelineViewPage() {
    const param = useParams()
    const [pipelineList, setPipelineList] = useState("")
	const isDesktop = useBreakpointValue({ base: false, lg: true })


    const fetchData = async () => {
        try {
            const result = await getSingleDocumentFirebase('pipelines', param.id)
			console.log(result)
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
            <HStack>
				<Text>Back</Text>
                <Heading size={'md'}>Pipelines {pipelineList?.title}</Heading>
				<Spacer/>
				<Input type='text' size='xs' w='3xs' placeholder='Search Leads'/>
				<Select size='xs' w='24' placeholder='Sort by'>
					<option>Kodok</option>
				</Select>
				<Button size='xs'  colorScheme='blue'>Filter</Button>
				<Button  size='xs' colorScheme='green'>+</Button>
            </HStack>
            <Stack>
                {pipelineList.length > 0 }
            </Stack>
			<Flex
						overflowX='auto'
							// columns={{ base: 1, md: 5 }}
						>
			<DndProvider backend={HTML5Backend}>
					{isDesktop ?
							<HStack>
							{pipelineList?.stages?.map((x,i)=>
								<KanbanColumnsComponent key={i} index={i} kanbanData={{name:x.stageName}} allowedDropEffect='move' filterData={{name:"filter"}}  column={x.stageName}  />

							)}

						</HStack>:
						<Center>
							<Heading>Desktop View Only</Heading>
						</Center>
					}
				</DndProvider>
				</Flex>

        </Stack>
    )
}

export default PipelineViewPage