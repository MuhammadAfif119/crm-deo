import { DeleteIcon, ExternalLinkIcon, RepeatIcon } from '@chakra-ui/icons'
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
    Text,
    Divider
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getAllCollectionData, getWhereCollectionData } from "../../Api/importirApi"
import Swal from 'sweetalert2'

function DomainsPage() {
    const [data, setData] = useState(null);
    const [keysData, setKeysData] = useState([]);
    const [dataBody, setDataBody] = useState(null);
    const [collec, setCollec] = useState(null);
    const [selectedSource, setSelectedSource] = useState('');



    const changeProject = async (id) => {
        setCollec(id);
        const data = {
            projectId: "303N0DI0t1WLUnWgSiqb",
            sourceType: id
        };

        try {
            const res = await getAllCollectionData(data);
            setData(res);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const changeSourceList = async (value) => {
        const dataList = {
            sourceType: collec,
            collectionName: value,
            query: []
        };
        try {
            const res = await getWhereCollectionData(dataList);
            const keys = Object.keys(res.data[0]);
            setKeysData(keys)
            setDataBody(res.data)
            console.log(keys)
        } catch (error) {
            console.error("Error:", error);
        }
        setSelectedSource(value);
        // Lakukan tindakan sesuai dengan source yang dipilih
    }

    useEffect(() => {
        // Memuat data awal saat komponen dimuat
        async function fetchData() {
            try {
                const res = await changeProject(); // Ganti dengan fungsi untuk mengambil data
                setData(res); // Menyimpan data ke dalam state
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchData();
    }, []);


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
                        {data && (
                            <div>
                                <FormControl mt={3}>
                                    <FormLabel>Name</FormLabel>
                                    <Select m='1' value={selectedSource} mt={1} placeholder=" -- Select --" onChange={(e) => changeSourceList(e.target.value)}>
                                        {data.map((x, i) => (
                                            <option key={i} value={x}>{x.toUpperCase()}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        )}

                    </Stack>
                    <Stack>
                        {dataBody && (
                            <Table variant='striped' colorScheme='gray'>
                                <Thead>
                                    <Tr>
                                        <HStack>
                                            {keysData.map((key, index) => (
                                                <Th key={index}>{key}</Th>
                                            ))}
                                        </HStack>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {dataBody.map((x, i) => (
                                        <Tr key={i}>
                                            {keysData.map((key, index) => (
                                                <Td key={index}>{x[key]}</Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

export default DomainsPage