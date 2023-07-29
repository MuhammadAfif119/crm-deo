import { Button, HStack, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spacer, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDocumentFirebase } from '../../Api/firebaseApi';
import { db } from '../../Config/firebase';
import { checkIdSelect } from '../../Hooks/Middleware/UserMiddleWare';
import useUserStore from "../../Hooks/Zustand/Store";
import { FcPlus } from 'react-icons/fc';


function FormPageV2() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const globalState = useUserStore();

    const [dataForm, setDataForm] = useState([]);

    const [dataInput, setDataInput] = useState({
        title: "",
        projectId: "",
        category: [],
        description: "",
    });

    const navigate = useNavigate()

    const toast = useToast({
        position: "top",
        align: "center",
    });

    const getData = async () => {
        try {
            const q = query(collection(db, 'forms'),
                where("projectId", "==", globalState.currentProject)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = [];
                snapshot.forEach((doc) => {
                    const docData = doc.data();
                    data.push({ id: doc.id, ...docData });
                });

                setDataForm(data);
            });

            return () => {
                unsubscribe();
            };
        } catch (error) {
            console.log(error, 'ini error');
        }
    };

    useEffect(() => {
        getData();

        return () => {

        };
    }, [globalState.currentProject]);

    const handleAddData = (e) => {
        const { name, value } = e.target;
        setDataInput((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const categories = e.target.value.split(',').map((category) => category.trim());
        setDataInput((prevData) => ({ ...prevData, category: categories }));
    };

    const handleSubmitModal = async () => {
        const validationResult = checkIdSelect(
            globalState.currentCompany,
            globalState.currentProject
        );

        if (!validationResult.success) {
            toast(validationResult.error);
            return;
        }

        const collectionName = 'forms';
        const data = {
            isActive: true,
            title: dataInput.title,
            projectId: globalState.currentProject,
            category: dataInput.category,
            description: dataInput.description,
        };

        try {
            const docID = await addDocumentFirebase(collectionName, data, globalState.currentCompany);
            console.log('ID Dokumen Baru:', docID);
            onClose();
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
    };

    return (
        <Stack p={[1, 1, 5]}>
            <HStack>
            <Heading size='md'>Form page</Heading>
            <Spacer />
                <Button onClick={onOpen} bgColor={'white'} shadow='md' variant='outline' borderColor='#F05A28' color='#F05A28'>
                    <HStack>
                        <FcPlus  />
                        <Text>Form</Text>
                    </HStack>
                </Button>
            </HStack>

            <Stack>
                <SimpleGrid columns={[1, 2 ,3]} gap={3}>
                {dataForm.length > 0 && dataForm.map((x, index) => {
                    return(
                        <Stack key={index} borderWidth='1px' p={3} cursor='pointer' onClick={() => navigate(`/form-builder/${x.id}`)}>
                            <Text>{x.title}</Text>
                            {x.category.length > 0 && x.category.map((y, index) => {
                                return(
                                    <Text key={index}>{y}</Text>
                                )
                            })}
                        </Stack>
                    )
                } )}
                </SimpleGrid>
            </Stack>




            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Form Baru</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input name="title" type="text" placeholder="Judul Form" onChange={handleAddData} />
                        <Input name="description" type="text" placeholder="Deskripsi Form" onChange={handleAddData} />
                        <Input type="text" placeholder="Kategori Form (pisahkan dengan koma)" onChange={handleCategoryChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmitModal}>
                            Submit
                        </Button>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
}

export default FormPageV2;
