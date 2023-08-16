import {
    Box, Button, Heading, HStack, Spacer, Table,
    Stack,
    FormControl,
    FormLabel,
    Select,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Grid,
    GridItem,
    SimpleGrid,
    Input,
    Text,
    IconButton,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { getAllCollectionData, getWhereCollectionData } from "../../Api/importirApi"

function DomainsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [keysData, setKeysData] = useState([]);
    const [dataBody, setDataBody] = useState([]);
    const [collec, setCollec] = useState(null);
    const [selectedSource, setSelectedSource] = useState('');
    const [dataPipeline, setDataPipeline] = useState({
        conditions: []
    });


    const changeProject = async (id) => {
        setCollec(id);
        const data = {
            projectId: "303N0DI0t1WLUnWgSiqb",
            sourceType: id
        };

        setDataBody([])
        setKeysData([])

        try {
            const res = await getAllCollectionData(data);
            setData(res);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const changeSourceList = async () => {
        // setKeysData([])
        // setDataBody([])

        const dataList = {
            sourceType: collec,
            collectionName: selectedSource,
            query: dataPipeline.conditions
        };
        setDataBody([])
        setKeysData([])
        try {
            setIsLoading(true)
            const res = await getWhereCollectionData(dataList);
            setIsLoading(false)
            const keys = Object.keys(res.data[0]);
            setKeysData(keys)
            setDataBody(res.data)
            console.log("ini data ",keys)
        } catch (error) {
            setIsLoading(true)
            console.error("Error:", error);
        }
    }

    const handleAddNewStage = () => {
        setIsLoading(false)
        const dataPipelineLocal = dataPipeline.conditions;
        dataPipelineLocal.push({ type: "", column: "", value: "", operator: "" })
        setDataPipeline(data => ({ ...data, conditions: dataPipelineLocal }))
    };

    const handleDeleteStage = (index) => {
        setIsLoading(false)
        setDataPipeline((prev) => ({
            ...prev,
            conditions: prev.conditions.filter((_, i) => i !== index),
        }));
    };

    const handleStageNameChange = (index, columnName) => {
        setIsLoading(false)
        setDataPipeline((prev) => {
            const newStages = [...prev.conditions];
            newStages[index].column = columnName;
            return { ...prev, conditions: newStages };
        });
        console.log(index, columnName);
    };

    const handleValueChange = (index, value) => {
        updatePipelineData(index, { value });
        console.log(index, value);
    };
    
    const updatePipelineData = (index, updates) => {
        setIsLoading(false)
        setDataPipeline(prev => {
            const newStages = [...prev.conditions];
            newStages[index] = { ...newStages[index], ...updates };
            return { ...prev, conditions: newStages };
        });
    };

    const handleStageOperatorChange = (index, operator) => {
        setIsLoading(false)
        const updatedStages = [...dataPipeline.conditions];
        updatedStages[index].operator = operator;
    
        setDataPipeline(prev => ({
            ...prev,
            conditions: updatedStages
        }));
    };

    const changeFilterType = (i, val) => {
        setIsLoading(false)
        const conditionLocal = dataPipeline.conditions
        conditionLocal[i].type = val
        setDataPipeline(data => ({ ...data, conditions: conditionLocal }))
    }

    return (
        <>
            <Stack p={[1, 1, 5]}>
                <Stack spacing={4}>
                    <HStack>
                        <Heading size={'md'} fontWeight={'bold'}>Data</Heading>
                        <Spacer />
                    </HStack>
                    <Stack bgColor={'white'} spacing={1} borderRadius={'xl'} p={3} m={[1, 1, 4]} shadow={'md'} overflowY={'auto'} mx="auto" align="center">
                        <FormControl mt={3}>
                            <FormLabel>Query Data</FormLabel>
                            <Select m='1' placeholder=" -- Select --" onChange={(e) => changeProject(e.target.value)}>
                                <option value={'facebook-marketing'}>Facebook Marketing</option>
                                <option value={'google-ads'}>Google Ads</option>
                            </Select>
                        </FormControl>
                        {
                            data.length > 0 ?
                                <div>
                                    <FormControl mt={3}>
                                        <FormLabel>Name</FormLabel>
                                        <Select m='1' value={selectedSource} mt={1} placeholder=" -- Select --" onChange={(e) => setSelectedSource(e.target.value)}>
                                            {data.map((x, i) => (
                                                <option key={i} value={x}>{x.toUpperCase()}</option>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {dataPipeline?.conditions.map((stage, index) => (
                                        <SimpleGrid columns={5} spacing={3} my={3}>
                                            <Stack spacing={2}>
                                                <Select
                                                    size={"sm"}
                                                    w='100%'
                                                    placeholder=" -- Select --"
                                                    value={stage.type}
                                                    onChange={(e) => changeFilterType(index, (e.target.value).toLowerCase())}
                                                >
                                                    <option value={'date'}>Date</option>
                                                    <option value={'string'}>String</option>
                                                </Select>
                                            </Stack>
                                            <Stack spacing={2}>
                                                {
                                                    stage.type === 'date' ?
                                                        <Input
                                                            type="date"
                                                            size={"sm"}
                                                            w='100%'
                                                            value={stage.value}
                                                            placeholder='date'
                                                            onChange={(e) => handleValueChange(index, e.target.value)}
                                                        />
                                                        :
                                                        <Input
                                                            type="text"
                                                            size={"sm"}
                                                            w='100%'
                                                            value={stage.value}
                                                            onChange={(e) => handleValueChange(index, e.target.value)}
                                                            placeholder='text'
                                                        />
                                                }
                                            </Stack>
                                            <Stack spacing={2}>
                                                {/* <Text>Stage Name</Text> */}
                                                <Input
                                                    size={"sm"}
                                                    w='100%'
                                                    placeholder="Colomn Name"
                                                    value={stage.column}
                                                    onChange={(e) => handleStageNameChange(index, (e.target.value).toLowerCase())}
                                                />
                                            </Stack>

                                            <Stack spacing={2}>
                                                <Select
                                                    size={"sm"}
                                                    w='100%'
                                                    placeholder=" -- Select --"
                                                    value={stage.operator}
                                                    onChange={(e) => handleStageOperatorChange(index, e.target.value)}
                                                >
                                                    <option value={'=='}>(==) equal to</option>
                                                    <option value={'!='}>(!=) not equal to</option>
                                                    <option value={'>'}>&gt; greater than</option>
                                                    <option value={'>='}>&ge; greater than or equal to</option>
                                                    <option value={'<'}>&lt; less than</option>
                                                    <option value={'<='}>&le; less than or equal to</option>
                                                </Select>
                                            </Stack>

                                            <Button colorScheme={'red'} size="sm" onClick={() => handleDeleteStage(index)}>Delete</Button>
                                        </SimpleGrid>
                                    ))}

                                    <Grid h='100px' templateRows='repeat(2, 1fr)' templateColumns='repeat(5, 1fr)' gap={4}>
                                        <GridItem colSpan={4}>
                                            {
                                                selectedSource !== "" ?
                                                    isLoading ?
                                                        <Button isLoading colorScheme='green' m='1' width='full'>Search</Button> :
                                                        <Button colorScheme='green' m='1' width='full' onClick={() => changeSourceList()}>Search</Button>
                                                    : ""
                                            }
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            {
                                                selectedSource !== "" ?
                                                    <Button colorScheme='blue' m='1' width='full' onClick={() => handleAddNewStage()}>Add Condition</Button>
                                                    : ""
                                            }
                                        </GridItem>
                                    </Grid>
                                </div>
                                :
                                ""
                        }

                    </Stack>
                    <Box overflow={'scroll'}>
                        <Table variant='striped' colorScheme='gray'>
                            <Thead>
                                {
                                    dataBody.length > 0 ?
                                        <Tr>
                                            {keysData.map((key, index) => (
                                                <Th key={index}>{key}</Th>
                                            ))}
                                        </Tr>
                                        :
                                        <Tr>
                                            <Th>#</Th>
                                        </Tr>
                                }

                            </Thead>
                            <Tbody>
                                {
                                    dataBody.length > 0 ?
                                        dataBody.map((x, i) => (
                                            <Tr key={i}>
                                                {keysData.map((key, index) => (
                                                    <Td key={index}>{x[key]}</Td>
                                                ))}
                                            </Tr>
                                        ))
                                        :
                                        <Tr>
                                            <Td>Not Found</Td>
                                        </Tr>
                                }
                            </Tbody>
                        </Table>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}

export default DomainsPage