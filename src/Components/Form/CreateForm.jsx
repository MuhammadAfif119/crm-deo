import { Box, Button, Checkbox, HStack, Input, InputGroup, InputRightElement, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Select, SimpleGrid, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';



const FormField = ({ index, moveField, field,  toast, label, handleLabelChange, isFieldBeingEdited, handleEditField, handleRemoveField }) => {

    const handleAlert = () => {

        toast({
            title: "Deoapp.com",
            description: 'cannot delete this field',
            status: "error",
            position: "top-right",
            isClosable: true,
          });
    }


    return (
                <HStack key={index}>
                    <InputGroup size='md'>
                        <Input
                            type="text" placeholder="Label Field" value={label} onChange={(e) => handleLabelChange(e, index)}
                        />
                        <InputRightElement w='fit-content'>
                            {/* Tampilkan tombol edit ketika field belum dalam mode edit */}
                            {!isFieldBeingEdited(index) && (
                                <Button variant={'ghost'} onClick={() => handleEditField(index)}>
                                    <FiEdit />
                                </Button>
                            )}
                        </InputRightElement>
                    </InputGroup>
                    <Stack onClick={() => field.name !== "phoneNumber" && field.name !== "submit_button" &&  field.name !== "name" ? handleRemoveField(index) : handleAlert()} cursor='pointer'>
                    {/* <Stack onClick={() =>  handleAlert()} cursor='pointer'> */}
                        <MdDeleteOutline color='red' />
                    </Stack>

                </HStack>
    );
};


function CreateForm({ setFormFields, formFields }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure(); // Modal untuk edit field

    const [newFieldShape, setNewFieldShape] = useState({
        label: '',
        type: 'text',
        name: '',
        isRequired: false,
    });

    const [editingFieldIndex, setEditingFieldIndex] = useState(null);
    const [newOptionValue, setNewOptionValue] = useState('');

    const toast = useToast()



    const handleEditField = (index) => {
        setEditingFieldIndex(index);
        setNewFieldShape(formFields[index]); // Set data field yang akan diubah ke state newFieldShape
        onEditOpen(); // Munculkan modal ketika tombol edit ditekan
    };

    const handleCancelEditField = () => {
        setEditingFieldIndex(null);
        setNewFieldShape({ // Reset state newFieldShape menjadi kosong ketika pembatalan edit
            label: '',
            type: 'text',
            name: '',
            isRequired: false,
        });
        onEditClose(); // Tutup modal ketika pembatalan edit
    };

    const handleSaveEditedField = () => {
        if (editingFieldIndex !== null) {
            const updatedFields = [...formFields];
            const fieldToUpdate = { ...newFieldShape };

            updatedFields[editingFieldIndex] = fieldToUpdate;
            setFormFields(updatedFields);
            setEditingFieldIndex(null);
            setNewFieldShape({
                label: '',
                type: 'text',
                name: '',
                isRequired: false,
            });
            onEditClose(); // Tutup modal setelah menyimpan perubahan
        }
    };

    const isFieldBeingEdited = (index) => index === editingFieldIndex;

    const [isAddingField, setIsAddingField] = useState(false);

    const handleAddField = () => {
        setIsAddingField(true);
        onOpen();
    };

    const handleCloseModal = () => {
        setNewFieldShape({
            label: '',
            type: 'text',
            name: '',
            isRequired: false,
        });
        onClose();
        onEditClose(); // Tutup modal edit ketika menutup modal tambah field baru
    };


    const moveField = (dragIndex, hoverIndex) => {
        console.log('masuk');
        const updatedFields = [...formFields];
        const draggedField = updatedFields[dragIndex];
    
        updatedFields.splice(dragIndex, 1);
        updatedFields.splice(hoverIndex, 0, draggedField);
    
        setFormFields(updatedFields);
    };

    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  
    const handleDragStart = (e, index) => {
      setDraggedItemIndex(index);
    };
  
    const handleDrop = (e, index) => {
      e.preventDefault();
      setDraggedOverIndex(index);
    };

    useEffect(() => {
        if (draggedItemIndex !== null && draggedOverIndex !== null) {
          const updatedFields = [...formFields];
          const draggedItem = updatedFields[draggedItemIndex];
    
          updatedFields.splice(draggedItemIndex, 1);
          updatedFields.splice(draggedOverIndex, 0, draggedItem);
    
          setFormFields(updatedFields);
          setDraggedItemIndex(null);
          setDraggedOverIndex(null);
        }
      }, [draggedItemIndex, draggedOverIndex, formFields, setFormFields]);
  

      const renderFormFields = () => {
        return (
          <OrderedList spacing={2}>
            {formFields.map((field, index) => {
              const { label } = field;
    
              return (
                <ListItem
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <FormField
                    field={field}
                    index={index}
                    moveField={moveField}
                    label={label}
                    handleLabelChange={handleLabelChange}
                    isFieldBeingEdited={isFieldBeingEdited}
                    handleEditField={handleEditField}
                    handleRemoveField={handleRemoveField}
                    toast={toast}
                  />
                </ListItem>
              );
            })}
          </OrderedList>
        );
      };




    const handleRemoveField = (index) => {
        setFormFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields.splice(index, 1);
            return updatedFields;
        });
    };

    const handleLabelChange = (event, index) => {
        const updatedFields = [...formFields];
        updatedFields[index].label = event.target.value;
        setFormFields(updatedFields);
    };

    const handleAddNewField = () => {
        const fieldToAdd = { ...newFieldShape };

        if (fieldToAdd.type === 'select') {
            fieldToAdd.options = [];

            fieldToAdd.options.push('');
        }

        setFormFields((prevFields) => [...prevFields, fieldToAdd]);
        setIsAddingField(false); // Atur kembali nilai isAddingField menjadi false setelah menambah field baru
        handleCloseModal();
    };

    const handleOptionChange = (event, fieldIndex, optionIndex) => {
        const updatedFields = [...formFields];
        // Pastikan field memiliki properti "options" sebelum mengubahnya
        if (updatedFields[fieldIndex].options) {
            updatedFields[fieldIndex].options[optionIndex] = event.target.value;
            setFormFields(updatedFields);
        }
    };

    const handleNewOptionChange = (event) => {
        setNewOptionValue(event.target.value);
    };

    const handleAddOption = () => {
        const updatedFields = [...formFields];
        if (isAddingField) {
            // Jika sedang menambah field baru, field baru akan berada di akhir array
            const newFieldIndex = updatedFields.length;
            if (!updatedFields[newFieldIndex].options) {
                updatedFields[newFieldIndex].options = [];
            }
            updatedFields[newFieldIndex].options.push(newOptionValue);
            setFormFields(updatedFields);
            setNewOptionValue(''); // Mengosongkan input opsi baru setelah menambah opsi
        } else if (editingFieldIndex !== null) {
            // Jika sedang mengedit field, gunakan editingFieldIndex
            if (updatedFields[editingFieldIndex].options) {
                updatedFields[editingFieldIndex].options.push(newOptionValue);
                setFormFields(updatedFields);
                setNewOptionValue(''); // Mengosongkan input opsi baru setelah menambah opsi
            }
        }
    };


    const handleRemoveOption = (fieldIndex, optionIndex) => {
        const updatedFields = [...formFields];
        if (updatedFields[fieldIndex].options) {
            updatedFields[fieldIndex].options.splice(optionIndex, 1);
            setFormFields(updatedFields);
        }
    };

    return (
        <Stack>
            <Stack p={[1, 1, 5]} spacing={5}>
                <Stack spacing={2}>{renderFormFields()}</Stack>
                <HStack justifyContent={'flex-end'} alignItems='flex-end'>
                    <Box>
                        <Button variant={'outline'} onClick={() => console.log(formFields, 'form')} colorScheme="blue">
                            Check
                        </Button>
                    </Box>
                    <Box>
                        <Button variant={'outline'} onClick={handleAddField} colorScheme="blue">
                            Add new field
                        </Button>
                    </Box>
                </HStack>
            </Stack>


            <Modal isOpen={isOpen} onClose={handleCloseModal} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Custom Field</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Stack>
                            <SimpleGrid columns={[1, 2, 2]} gap={4}>
                                <Stack>
                                    <Stack>
                                        <Text fontWeight={500} color='gray.700'>Label</Text>
                                        <Input
                                            type="text" placeholder="Label Field" value={newFieldShape.label} onChange={(e) => setNewFieldShape({ ...newFieldShape, label: e.target.value })}
                                        />
                                    </Stack>

                                    <Stack>
                                        <Text fontWeight={500} color='gray.700'>Input Type</Text>
                                        <Select
                                            value={newFieldShape.type}
                                            onChange={(e) => setNewFieldShape({ ...newFieldShape, type: e.target.value })}
                                            placeholder="Tipe Field"
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="time">Time</option>
                                            <option value="file">File</option>
                                            <option value="textarea">Textarea</option>
                                            <option value="select">Select</option>
                                            <option value="request">By Request</option>
                                            <option value="button">Button</option>
                                        </Select>
                                    </Stack>

                                    {newFieldShape.type !== 'button' && (
                                        <Stack>
                                            <Text fontWeight={500} color='gray.700'>Placeholders</Text>
                                            <Input type="text" placeholder="Placeholder Field" value={newFieldShape.placeholder} onChange={(e) => setNewFieldShape({ ...newFieldShape, placeholder: e.target.value })} />

                                        </Stack>

                                    )}


                                </Stack>
                                <Stack>
                                    <Stack>
                                        <Text fontWeight={500} color='gray.700'>Fields</Text>
                                        <Input type="text" placeholder="Name Field" isDisabled={newFieldShape.name === "phoneNumber" || newFieldShape.name === "submit_button"  || newFieldShape.name === "name"? true:false} value={newFieldShape.name} onChange={(e) => setNewFieldShape({ ...newFieldShape, name: e.target.value })} />

                                    </Stack>

                                    <Stack>
                                        {newFieldShape.type === 'button' ? (
                                            <Stack fontWeight={500} color='gray.700'>
                                                <Text fontWeight={500} color='gray.700'>Form ID</Text>
                                                <Input type="text" placeholder="ID Form" value={newFieldShape.formId} onChange={(e) => setNewFieldShape({ ...newFieldShape, formId: e.target.value })} />
                                            </Stack>
                                        ) : (
                                            <Stack>
                                                <Text fontWeight={500} color='gray.700'>Is Required:</Text>
                                                <Checkbox isChecked={newFieldShape.isRequired} onChange={(e) => setNewFieldShape({ ...newFieldShape, isRequired: e.target.checked })} />
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            </SimpleGrid>





                            {newFieldShape.type === 'select' && (
                                <Stack>
                                    <Text fontWeight={500} color='gray.700'>Opsi Field: </Text>
                                    <Text color={'red'} fontStyle='italic' fontSize={'xs'}>* Set in your edit fields</Text>
                                </Stack>
                            )}
                        </Stack>

                    </ModalBody>
                    <ModalFooter>
                        <HStack>
                            <Button variant={'outline'} size='sm' onClick={handleAddNewField} colorScheme='blue'>Save</Button>
                            <Button variant={'outline'} size='sm' colorScheme='red' mr={3} onClick={handleCloseModal}>
                                Batal
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditOpen} onClose={handleCancelEditField} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit field</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack>
                            <SimpleGrid columns={[1, 2, 2]} gap={4}>
                                <Stack>
                                    <Stack>
                                        <Text fontWeight={500} color='gray.700'>Label</Text>
                                        <Input
                                            type="text" placeholder="Label Field" value={newFieldShape.label} onChange={(e) => setNewFieldShape({ ...newFieldShape, label: e.target.value })}
                                        />
                                    </Stack>

                                    <Stack>
                                        <Text fontWeight={500} color='gray.700'>Input Type</Text>
                                        <Select
                                            value={newFieldShape.type}
                                            onChange={(e) => setNewFieldShape({ ...newFieldShape, type: e.target.value })}
                                            placeholder="Tipe Field"
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="time">Time</option>
                                            <option value="file">File</option>
                                            <option value="textarea">Textarea</option>
                                            <option value="select">Select</option>
                                            <option value="button">Button</option>
                                        </Select>
                                    </Stack>

                                    {newFieldShape.type !== 'button' && (
                                        <Stack>
                                            <Text fontWeight={500} color='gray.700'>Placeholders</Text>
                                            <Input type="text" placeholder="Placeholder Field" value={newFieldShape.placeholder} onChange={(e) => setNewFieldShape({ ...newFieldShape, placeholder: e.target.value })} />

                                        </Stack>

                                    )}


                                </Stack>
                                <Stack>
                                    <Stack>
                                        <Text fontWeight={500} color='gray.700'>Fields</Text>
                                        <Input isDisabled={newFieldShape.name === "phoneNumber" || newFieldShape.name === "submit_button"  || newFieldShape.name === "name"? true : false} type="text" placeholder="Name Field" value={newFieldShape.name} onChange={(e) => setNewFieldShape({ ...newFieldShape, name: e.target.value })} />

                                    </Stack>

                                    <Stack>
                                        {newFieldShape.type === 'button' ? (
                                            <Stack>
                                                <Text fontWeight={500} color='gray.700'>Form ID</Text>
                                                <Input type="text" placeholder="ID Form" isDisabled value={newFieldShape.formId} onChange={(e) => setNewFieldShape({ ...newFieldShape, formId: e.target.value })} />
                                            </Stack>
                                        ) : (
                                            <Stack>
                                                <Text fontWeight={500} color='gray.700'>Is Required:</Text>
                                                <Checkbox isChecked={newFieldShape.isRequired} onChange={(e) => setNewFieldShape({ ...newFieldShape, isRequired: e.target.checked })} />
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            </SimpleGrid>

                            <Stack>
                                {newFieldShape.type === 'select' && (
                                    <>
                                        <Text fontWeight={500} color='gray.700'>Opsi Field:</Text>
                                        {newFieldShape.options?.map((option, optionIndex) => (
                                            <InputGroup key={optionIndex} size="md">
                                                <Input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(e, editingFieldIndex, optionIndex)}
                                                    placeholder={`Opsi ${optionIndex + 1}`}
                                                />
                                                <InputRightElement w="fit-content">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleRemoveOption(editingFieldIndex, optionIndex)}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                        ))}
                                        <InputGroup size="md">
                                            <Input
                                                type="text"
                                                value={newOptionValue}
                                                onChange={handleNewOptionChange}
                                                placeholder={`Opsi ${newFieldShape?.options?.length + 1}`}
                                            />
                                            <InputRightElement w="fit-content">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleAddOption(editingFieldIndex)}
                                                >
                                                    Tambah
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </>
                                )}
                            </Stack>
                        </Stack>


                    </ModalBody>
                    <ModalFooter>
                        <HStack>
                            <Button variant={'outline'} onClick={handleSaveEditedField} colorScheme='blue'>Save</Button>
                            <Button variant={'outline'} colorScheme='red' mr={3} onClick={handleCloseModal}>
                                Batal
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
}

export default CreateForm;
