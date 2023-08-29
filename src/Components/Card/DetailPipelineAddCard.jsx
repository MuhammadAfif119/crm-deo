import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Avatar, AvatarGroup, Box, Button, Divider, Flex, Grid, HStack, Input, Select, SimpleGrid, Spacer, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSingleDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';
import { decryptToken } from '../../Utils/encrypToken';

function DetailPipelineAddCard({ stages, handleModalAddClose, formId, searchResult, handleSearchUsers, fetchData }) {

    const toast = useToast()



    const globalState = useUserStore();
    const [selectedUser, setSelectedUser] = useState(null);

    const nameRef = useRef("");
    const emailRef = useRef("");
    const phoneNumberRef = useRef("");
    const columnRef = useRef();
    const statusRef = useRef("");
    const sourceRef = useRef("");
    const opportunityValueRef = useRef("");




    const handleUserProjectClick = (user) => {
        setSelectedUser(user);
        console.log(user, 'ini user')
        nameRef.current.value = user.name;
        emailRef.current.value = user.email;
        phoneNumberRef.current.value = user.phoneNumber;
        columnRef.current.value = user.column || ""
        statusRef.current.value = user.status || ""
        sourceRef.current.value = user.source || ""
        opportunityValueRef.current.value = user.opportunity_value;
    };



    const handleSaveData = async () => {

        if (!selectedUser) {
            toast({
                title: "Deoapp.com",
                description: "Please select a user first.",
                status: "warning",
                position: "top-right",
                isClosable: true,
            });
            return;
        }


        const updatedData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            phoneNumber: phoneNumberRef.current.value,
            column: columnRef.current.value,
            status: statusRef.current.value,
            source: sourceRef.current.value,
            opportunity_value: opportunityValueRef.current.value,
            projectId: globalState.currentProject,
            companyId: globalState.currentCompany,
            createdAt : new Date(),
            lastUpdated: new Date(),
            formId
        };

        const collectionName = 'leads';
        const docName = `${updatedData?.phoneNumber}-${decryptToken(formId)}`;
        const value = updatedData;


        try {
            const result = await setDocumentFirebase(collectionName, docName, value, globalState.currentCompany);
            handleModalAddClose()

            toast({
                title: "Deoapp.com",
                description: "success update card",
                status: "success",
                position: "top-right",
                isClosable: true,
            });
            if(result){
                fetchData()

            }
            console.log(result); // Pesan toast yang berhasil
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
    };


    return (
        <Stack>
            <Stack>
                <Grid templateColumns={{ base: '1fr', md: '1fr' }}>
                    {/* <Stack py={2}>
                        <Text fontWeight={500}>Opportunity Details</Text>
                    </Stack> */}
                    <Stack h={'550px'} overflowY='scroll'>
                        <Stack py={2}>
                            <Text fontWeight={500}>Contact Details</Text>
                        </Stack>

                        <Divider />
                        <SimpleGrid columns={[2]} gap={3} fontSize='sm'>

                            <Stack >
                                <Stack>
                                    <Text>Contact List</Text>

                                    <Input type='text' placeholder='Search users' onChange={(e) => handleSearchUsers(e.target.value)} />
                                </Stack>
                                {searchResult?.found > 0 ?
                                    searchResult.hits.map((x, index) => {

                                        return (
                                            <HStack key={index} p='2' borderBottom='1px' >
                                                <Avatar name={x.document.name} src={x.document.image ? x.document.image : ''} />
                                                <Box>
                                                    <Text>{x.document.name}</Text>
                                                    <Text>{x.document.email}</Text>
                                                </Box>
                                                <Spacer />
                                                <Button colorScheme='green' onClick={() => handleUserProjectClick(x.document)}>+</Button>
                                            </HStack>
                                        )

                                    })
                                    : <></>}

                            </Stack>
                            <Stack>

                                <Stack>
                                    <Text>Email</Text>
                                    <Input ref={emailRef} />
                                </Stack>

                                <Stack>
                                    <Text>Phone</Text>
                                    <Input ref={phoneNumberRef} />
                                </Stack>
                            </Stack>
                        </SimpleGrid>

                        <Divider pt={3} />

                        <Stack>
                            <Text fontWeight={500}>Opportunity Details</Text>
                        </Stack>

                        <Divider />

                        <SimpleGrid columns={[2]} gap={3} fontSize='sm'>
                            <Stack>
                                <Text>Contact Name</Text>
                                <Input ref={nameRef} />
                            </Stack>

                            <Stack>
                                <Text>Stage</Text>
                                <Select variant='outline' fontWeight='normal' ref={columnRef}>
                                    {stages?.length > 0 &&
                                        stages.map((x, index) => {
                                            return (
                                                <option key={index} value={x.stageName}>
                                                    {x.stageName}
                                                </option>
                                            );
                                        })}
                                </Select>
                            </Stack>

                            <Stack>
                                <Text>Status</Text>
                                <Select variant='outline' fontWeight='normal' ref={statusRef}>
                                    <option value={'open'}>Open</option>
                                    <option value={'won'}>Won</option>
                                    <option value={'lost'}>Lost</option>
                                </Select>
                            </Stack>
                            <Stack>
                                <Text>Source</Text>
                                <Input ref={sourceRef} />
                            </Stack>

                            <Stack>
                                <Text>Opportunity Value</Text>
                                <Input type={'number'} ref={opportunityValueRef} />
                            </Stack>
                        </SimpleGrid>

                        {/* <Stack>
              <Text>Tags</Text>
              <CreatableSelect
                isClearable={true}
                value={selectedTagsRef.current}
                options={data?.category?.map((category) => ({ label: category, value: category })) || []}
                isMulti
                onChange={handleTagChange}
              />
            </Stack> */}
                    </Stack>
                </Grid>
                <HStack gap={5} alignItems='flex-end' justifyContent={'flex-end'}>
                    <Button leftIcon={<AddIcon boxSize={3} />} colorScheme='green' onClick={handleSaveData}>
                        Save
                    </Button>
                </HStack>
            </Stack>


        </Stack>
    );
}

export default DetailPipelineAddCard;
