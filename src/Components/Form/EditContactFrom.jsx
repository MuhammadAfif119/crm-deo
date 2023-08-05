import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Divider, Grid, HStack, Input, Select, SimpleGrid, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { setDocumentFirebase } from '../../Api/firebaseApi';
import useUserStore from '../../Hooks/Zustand/Store';

function EditContactFrom({ data }) {

    const globalState = useUserStore();
    const nameRef = useRef(data?.name);
    const emailRef = useRef(data?.email);
    const phoneNumberRef = useRef(data?.phoneNumber);
    const dateOfBirthRef = useRef(data?.dateOfBirth);
    const sourceRef = useRef(data?.source);
    const contactTypeRef = useRef(data?.contactType);

    const toast = useToast()

    const handleSaveData = async () => {
        const updatedData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            phoneNumber: phoneNumberRef.current.value,
            dateOfBirth: dateOfBirthRef.current.value,
            source: sourceRef.current.value,
            contactType: contactTypeRef.current.value,
        };

        const collectionName = 'contacts';
        const docName = data.id;
        const value = updatedData;


        try {
            const result = await setDocumentFirebase(collectionName, docName, value, globalState.currentCompany);
            // handleModalClose()

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
        <Stack p={[1, 1, 5]}>
            <Stack>
                <Stack spacing={5}>
                    <Stack overflowY='scroll' spacing={4}>
                        <Stack py={2}>
                            <Text fontWeight={500}>Contact</Text>
                        </Stack>

                        <Divider />
                        <SimpleGrid columns={[1]} gap={3} fontSize='sm'>
                            <Stack>
                                <Text>Name</Text>
                                <Input size={'sm'}  placeholder='Name' defaultValue={data?.name} ref={nameRef} />
                            </Stack>

                            <Stack>
                                <Text>Email</Text>
                                <Input size={'sm'}  placeholder='Email' defaultValue={data?.email} ref={emailRef} />
                            </Stack>

                            <Stack>
                                <Text>Phone</Text>
                                <Input  size={'sm'} placeholder='Phone' defaultValue={data?.phoneNumber} ref={phoneNumberRef} />
                            </Stack>
                        </SimpleGrid>

                        <Divider pt={3} />

                        <Stack>
                            <Text fontWeight={500}>Opportunity Details</Text>
                        </Stack>

                        <Divider />

                        <SimpleGrid columns={[1]} gap={3} fontSize='sm'>
                            <Stack>
                                <Text>Date Of Birth</Text>
                                <Input size={'sm'} type={'date'} placeholder='Date Of Birth' defaultValue={data?.dateOfBirth} ref={dateOfBirthRef} />
                            </Stack>

                            <Stack>
                                <Text>Contact Source</Text>
                                <Input size={'sm'} placeholder='Contact Source' defaultValue={data?.source} ref={sourceRef} />
                            </Stack>

                            
                            <Stack>
                                    <Text>Contact Type</Text>
                                    <Select size={'sm'} placeholder='Contact Type' defaultValue={data?.contactType} variant='outline' fontWeight='normal' ref={contactTypeRef}>
                                        <option value={'lead'}>Lead</option>
                                        <option value={'customer'}>Customer</option>
                                    </Select>
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
                    <HStack gap={3} alignItems='flex-end' justifyContent={'flex-end'}>
                        <Button leftIcon={<AddIcon boxSize={3} />} colorScheme='green' onClick={handleSaveData}>
                            Save
                        </Button>
                        {/* <Button leftIcon={<CloseIcon boxSize={3} />} colorScheme='red' onClick={() => console.log()}>
                            Cancel
                        </Button> */}
                    </HStack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default EditContactFrom