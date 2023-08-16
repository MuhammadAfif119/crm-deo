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
            query: []
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
            console.log(keys)
        } catch (error) {
            setIsLoading(true)
            console.error("Error:", error);
        }
    }


    return (
        <>
            <Stack p={[1, 1, 5]}>
                <Stack spacing={4}>
                    <HStack>
                        <Heading size={'md'} fontWeight={'bold'}>Data</Heading>
                        <Spacer />
                        {/* <Link to='new'>
						<Button colorScheme='green' size={'sm'}>+</Button>
					</Link> */}
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
                                    {
                                        selectedSource !== "" ?
                                            isLoading  ? 
                                            <Button isLoading colorScheme='green' m='1' width='full'>Search</Button>  : 
                                            <Button colorScheme='green' m='1' width='full' onClick={() => changeSourceList()}>Search</Button>	
                                        : ""
                                    }
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