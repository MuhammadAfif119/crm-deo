import { Button, Checkbox, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiSettings } from 'react-icons/fi';

function CreateForm({ setFormFields, formFields }) {
    // const [formValues, setFormValues] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleAddField = () => {
        setFormFields((prevFields) => [
            ...prevFields,
            {
                label: '',
                type: 'text',
                name: '',
                isRequired: false, // Menggunakan boolean
            },
        ]);
    };
    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    // };

    const handleOpenModal = () => {
        onOpen()
    }
    const handleCloseModal = () => {
        onClose()
    }
    const renderFormFields = () => {
        if (formFields?.length > 0)
            return formFields.map((field, index) => {
                const { label, type, name, placeholder, isRequired, options, idform } = field;

                const inputPlaceholder = placeholder ? placeholder : '';
                const inputIsRequired = isRequired === true; // Menggunakan boolean

                // const inputProps = { name, onChange: handleInputChange, value: formValues[name] || '', isRequired: inputIsRequired };

                return (
                    <div key={index}>
                        <Text>{`Field ${index + 1}`}</Text>
                        <InputGroup size='md'>
                            <Input
                                type="text" placeholder="Label Field" value={label} onChange={(e) => handleLabelChange(e, index)}
                            />
                            <InputRightElement w='fit-content'>
                                <Button variant={'ghost'} onClick={handleOpenModal}>
                                    <FiSettings />
                                </Button>
                            </InputRightElement>
                        </InputGroup>

                        {type !== "button" && (                  
                            <Input type="text" placeholder="placeholder Field" value={inputPlaceholder} onChange={(e) => handlePlaceHolderChange(e, index)} />
                        )}
                        <Select
                            value={type}
                            onChange={(e) => handleTypeChange(e, index)}
                            placeholder="Tipe Field"
                        // Isi opsi select dengan data field type yang telah Anda berikan
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
                        <Input type="text" placeholder="name Field" value={name} onChange={(e) => handleNameChange(e, index)} />
                        {type === 'select' && (
                            <>
                                <Text>Opsi Field:</Text>
                                {options?.map((option, optionIndex) => (
                                    <Input
                                        key={optionIndex}
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(e, index, optionIndex)}
                                        placeholder={`Opsi ${optionIndex + 1}`}
                                    />
                                ))}
                                <Button onClick={() => handleAddOption(index)}>Tambah Opsi</Button>
                            </>
                        )}
                        {type === 'button' ? (
                            <>
                                <Input type="text" placeholder="ID Form" value={idform} onChange={(e) => handleIdFormChange(e, index)} />
                            </>
                        ) : (
                            <>
                                <Text>Is Required:</Text>
                                <Checkbox isChecked={inputIsRequired} onChange={(e) => handleIsRequiredChange(e, index)} />
                            </>
                        )}

                        <Button onClick={() => handleRemoveField(index)}>Hapus</Button>
                    </div>
                );
            });
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

    const handlePlaceHolderChange = (event, index) => {
        const updatedFields = [...formFields];
        updatedFields[index].placeholder = event.target.value;
        setFormFields(updatedFields);
    };

    const handleTypeChange = (event, index) => {
        const updatedFields = [...formFields];
        updatedFields[index].type = event.target.value;
        setFormFields(updatedFields);
    };

    const handleNameChange = (event, index) => {
        const updatedFields = [...formFields];
        updatedFields[index].name = event.target.value;
        setFormFields(updatedFields);
    };

    const handleOptionChange = (event, fieldIndex, optionIndex) => {
        const updatedFields = [...formFields];
        updatedFields[fieldIndex].options[optionIndex] = event.target.value;
        setFormFields(updatedFields);
    };

    const handleAddOption = (fieldIndex) => {
        const updatedFields = [...formFields];
        if (!updatedFields[fieldIndex].options) {
            updatedFields[fieldIndex].options = [];
        }
        updatedFields[fieldIndex].options.push('');
        setFormFields(updatedFields);
    };

    const handleIdFormChange = (event, index) => {
        const updatedFields = [...formFields];
        updatedFields[index].idform = event.target.value;
        setFormFields(updatedFields);
    };

    const handleIsRequiredChange = (event, index) => {
        const updatedFields = [...formFields];
        updatedFields[index].isRequired = event.target.checked;
        setFormFields(updatedFields);
    };

    return (
        <Stack>
            <Stack>{renderFormFields()}</Stack>
            <Button onClick={handleAddField} colorScheme="teal">
                Tambah Field Baru
            </Button>
            <Modal isOpen={isOpen} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
}

export default CreateForm;
