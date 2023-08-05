import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Divider, Flex, Grid, HStack, Input, Select, SimpleGrid, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSingleDocumentFirebase, setDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';

function DetailPipelineAddCard({ stages, handleModalClose, formId }) {

    const toast = useToast()



    const globalState = useUserStore();
    const nameRef = useRef("");
    const emailRef = useRef("");
    const phoneNumberRef = useRef("");
    const columnRef = useRef();
    const statusRef = useRef("");
    const sourceRef = useRef("");
    const opportunityValueRef = useRef("");



    const handleSaveData = async () => {
        const updatedData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            phoneNumber: phoneNumberRef.current.value,
            column: columnRef.current.value,
            status: statusRef.current.value,
            source: sourceRef.current.value,
            opportunity_value: opportunityValueRef.current.value,
            projectId: globalState.currentProject,
            companyId: globalState.currentCompany
        };

        const collectionName = 'leads';
        const docName = `${updatedData.phoneNumber}-${formId}`;
        const value = updatedData;


        try {
            const result = await setDocumentFirebase(collectionName, docName, value, globalState.currentCompany);
            handleModalClose()

            toast({
                title: "Deoapp.com",
                description: "success update card",
                status: "success",
                position: "top-right",
                isClosable: true,
            });
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
                            <Stack>
                                <Text>Contact Name</Text>
                                <Input  ref={nameRef} />
                            </Stack>

                            <Stack>
                                <Text>Email</Text>
                                <Input  ref={emailRef} />
                            </Stack>

                            <Stack>
                                <Text>Phone</Text>
                                <Input  ref={phoneNumberRef} />
                            </Stack>
                        </SimpleGrid>

                        <Divider pt={3} />

                        <Stack>
                            <Text fontWeight={500}>Opportunity Details</Text>
                        </Stack>

                        <Divider />

                        <SimpleGrid columns={[2]} gap={3} fontSize='sm'>
                            <Stack>
                                <Text>Name</Text>
                                <Input  ref={nameRef} />
                            </Stack>

                            <Stack>
                                <Text>Stage</Text>
                                <Select  variant='outline' fontWeight='normal' ref={columnRef}>
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
                                <Select  variant='outline' fontWeight='normal' ref={statusRef}>
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
                                <Input type={'number'}  ref={opportunityValueRef} />
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
