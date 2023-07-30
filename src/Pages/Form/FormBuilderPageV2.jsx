import { Stack, Text, Input, Textarea, Select, Button, Grid, FormControl, Divider, Switch, useToast, Box, SimpleGrid, Heading, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Spacer } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSingleDocumentFirebase, updateDocumentFirebase } from '../../Api/firebaseApi';
import BackButtons from '../../Components/Buttons/BackButtons';
import CreateForm from '../../Components/Form/CreateForm';


function generateHTML(formFields) {
    let html = '';

    formFields.forEach((field) => {
        const { label, type, name, placeholder, options, idform, isRequired } = field;


        switch (type) {
            case 'text':
            case 'email':
            case 'number':
            case 'date':
            case 'file':
                html += `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: bold;" for="${name}">${label}${isRequired ? ' *' : ''}</label>
              <input type="${type}" name="${name}" placeholder="${placeholder}" style="width: 95%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"   ${isRequired ? 'required' : ''}/>
            </div>`;
                break;

            case 'textarea':
                html += `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: bold;" for="${name}">${label}${isRequired ? ' *' : ''}</label>
              <textarea name="${name}" placeholder="${placeholder}" style="width: 95%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
            </div>`;
                break;

            case 'select':
                html += `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: bold;" for="${name}">${label}${isRequired ? ' *' : ''}</label>
              <select name="${name}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                <option value="" disabled selected>Pilih opsi</option>`;
                options.forEach((option) => {
                    html += `<option value="${option}">${option}</option>`;
                });
                html += `
              </select>
            </div style="margin-bottom: 10px;">`;
                break;

            case 'button':
                html += `
                <div onclick="submitForm('${idform}')" style="display: flex; align-items: center; justify-content: center; background-color: #007BFF; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
            <button type="${type}" name="${name}"  style="padding: 10px; background-color: #007BFF; color: #fff; border: none; border-radius: 5px; cursor: pointer;">${label}</button>
            </div>
            `;

                break;

            default:
                break;
        }
    });

    return `<form  style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">${html}</form>`;
}

function generateJS(enableFacebookPixel, facebookPixelId, apiSubmitUrl) {
    let jsScript = '';

    jsScript += ` <script>
    async function submitForm(idform) {
      const inputElements = document.querySelectorAll('input');
      const textAreaElements = document.querySelectorAll('textarea');
      const selectElements = document.querySelectorAll('select');
      const dataForm = {}; // Membuat object kosong untuk menyimpan data form
  
      inputElements.forEach(input => {
        dataForm[input.name] = input.value;
      });
  
      textAreaElements.forEach(textarea => {
        dataForm[textarea.name] = textarea.value;
      });
  
      selectElements.forEach(select => {
        dataForm[select.name] = select.value;
      }); 

      dataForm.idform = idform
      
    
  
        const jsonData = JSON.stringify(dataForm);

        console.log('ID Form:', idform)
        console.log('JSON Form:', jsonData)

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '${apiSubmitUrl}', true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Set header untuk JSON

        try {
            const res = await xhr.send(jsonData);
            console.log(res, 'ini res');
          } catch (error) {
            console.log(error, 'ini error');
          }
        
    }
  </script>`

    if (enableFacebookPixel && facebookPixelId) {
        jsScript += `
       
        
        <script>
        !function (f, b, e, v, n, t, s) {
            fbq('track', 'Lead', {
              content_name: 'FormSubmission',
            });

            if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${facebookPixelId}');
        fbq('track', 'PageView');
        </script>
        <noscript>
        <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1" />
        </noscript>
        `;
    }

    return jsScript;
}
function FormBuilderPage() {

    const param = useParams()
    const toast = useToast();

    const [modalEmbedCode, setModalEmbedCode] = useState(false)

    const [formData, setFormData] = useState('')

    const [loading, setLoading] = useState(false)

    const [formFields, setFormFields] = useState([]);
    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({});
    const [enableFacebookPixel, setEnableFacebookPixel] = useState(false);
    const [facebookPixelId, setFacebookPixelId] = useState('');
    const [isActive, setIsActive] = useState(false);

    const [apiSubmitUrl, setApiSubmitUrl] = useState('https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/createLead');

    const [embedCode, setEmbedCode] = useState('');


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const renderFormFields = () => {
        if (formFields?.length > 0) {
            return formFields?.map((field) => {
                const { label, type, name, placeholder, isRequired, options, idform } = field;
                const inputPlaceholder = placeholder || '';
                const inputIsRequired = isRequired || false;
                const inputProps = { name, onChange: handleInputChange, value: formValues[name] || '' };

                const handleSubmit = async () => {


                    let updateData = formValues
                    updateData.formId = idform

                    const data = updateData
                    try {
                    const res =  await axios.post('https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/createLead', data) 
                    console.log(res, 'ini ress')
                    } catch (error) {
                     console.log(error, 'ini error')   
                    }
                    // Implement your form submission logic here
                };

                return (
                    <FormControl key={name} isRequired={inputIsRequired}>
                        {type !== "button" && (
                            <Text>{label}{inputIsRequired ? <span style={{ color: 'red' }}>*</span> : null}</Text>

                        )}
                        {type === 'text' && <Input type="text" placeholder={inputPlaceholder} {...inputProps} />}
                        {type === 'number' && <Input type="number" placeholder={inputPlaceholder} {...inputProps} />}
                        {type === 'email' && <Input type="email" placeholder={inputPlaceholder} {...inputProps} />}
                        {type === 'textarea' && <Textarea name={name} placeholder={inputPlaceholder} {...inputProps} />}
                        {type === 'select' && (
                            <Select name={name} placeholder={inputPlaceholder} {...inputProps}>
                                {options?.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        )}
                        {type === 'date' && <Input type="date" placeholder={inputPlaceholder} {...inputProps} />}
                        {type === 'time' && <Input type="time" placeholder={inputPlaceholder} {...inputProps} />}
                        {type === 'file' && <Input type="file" placeholder={inputPlaceholder} {...inputProps} />}

                        <Box textAlign={'center'}>
                            {type === 'button' && <Button onClick={handleSubmit} colorScheme="blue">{label}</Button>}
                        </Box>
                    </FormControl>
                );
            });
        }

    };

    const handleEmbedCode = () => {
        setModalEmbedCode(true)
        const formHTML = generateHTML(formFields);
        const jsScript = generateJS(enableFacebookPixel, facebookPixelId, apiSubmitUrl);



        // Menggabungkan elemen-elemen HTML menjadi satu teks lengkap dengan head dan body
        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <!-- Masukkan tag <head> Anda disini -->
            </head>
            <body>
              ${formHTML}
              ${jsScript}
            </body>
          </html>
        `;

        // Menyimpan hasil elemen HTML lengkap ke state embedCode
        setEmbedCode(fullHTML);
    };
    const handleSaveForm = async () => {
        setLoading(true)
        const collectionName = 'forms';
        const docName = param.id;
        const data = {
            form_fields: formFields,
            facebookPixelId,
            enableFacebookPixel,
            isActive,
            apiSubmitUrl: `${apiSubmitUrl}/${param.id}`,

        };

        try {
            const result = await updateDocumentFirebase(collectionName, docName, data);
            console.log(result);

            toast({
                title: "Deoapp.com",
                description: "success update form",
                status: "success",
                position: "top-right",
                isClosable: true,
            });

            navigate(-1)

            // Pesan toast yang berhasil
        } catch (error) {
            console.log('Terjadi kesalahan:', error);
        }
        finally {
            setLoading(false)
        }
    }

    const handleCopyCode = () => {
        const formHTML = generateHTML(formFields);
        const jsScript = generateJS(enableFacebookPixel, facebookPixelId, apiSubmitUrl);

        // Menggabungkan elemen-elemen HTML menjadi satu teks lengkap dengan head dan body
        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <!-- Masukkan tag <head> Anda disini -->
            </head>
            <body>
              ${formHTML}
              ${jsScript}
            </body>
          </html>
        `;


        // const embedCode = `${formHTML}\n\n${jsScript}`;
        const embedCode = fullHTML;

        // Menyalin kode embed ke clipboard
        navigator.clipboard.writeText(embedCode);

        // Menampilkan pesan toast bahwa kode telah berhasil disalin
        toast({
            title: "Embed Code Copied",
            description: "Embed code has been copied to clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const getDataForm = async () => {
        try {
            const result = await getSingleDocumentFirebase('forms', param.id)
            setFormData(result)
            if (result?.form_fields) {
                setFormFields(result?.form_fields)
                setEnableFacebookPixel(result?.enableFacebookPixel)
                setFacebookPixelId(result?.facebookPixelId)
                setIsActive(result?.isActive)

            } else {
                setFormFields([
                    { label: 'Nama', type: 'text', name: 'nama', placeholder: 'Masukkan nama lengkap', isRequired: true },
                    { label: 'Email', type: 'email', name: 'email', placeholder: 'Masukkan alamat email', isRequired: true },
                    { label: 'nomor telpon', type: 'number', name: 'nomor telpon', placeholder: 'Masukkan nomor telpon', isRequired: true },
                    { label: 'Pesan', type: 'textarea', name: 'pesan', placeholder: 'Masukkan pesan Anda' },
                    { label: 'Pilihan', type: 'select', name: 'pilihan', options: ['Pilihan 1', 'Pilihan 2', 'Pilihan 3'] },
                    { label: 'date', type: 'date', name: 'date', isRequired: true },
                    { label: 'File', type: 'file', name: 'bukti transfer', isRequired: true },
                    { label: 'Submit', type: 'button', name: 'submit_button', idform: result.token },
                ])
                setEnableFacebookPixel(false)
                setFacebookPixelId('YOUR_PIXEL_ID_HERE')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDataForm()

        return () => {
        }
    }, [])



    return (
        <Stack spacing={5}>
            <BackButtons />


            <Heading size={'lg'} textTransform='capitalize'>{formData.title}</Heading>

            <Divider />
            <Grid templateColumns={{ base: '1fr', md: '1.3fr 1fr' }} gap={4} py={5}>
                <Stack >
                    <Stack minH={'500px'} bgColor={'white'} p={[1, 1, 5]} spacing={5} borderRadius='md' shadow={'md'}>
                        <HStack>
                            <Heading size={'md'}>Form Costumize</Heading>
                            <Spacer />
                            <Switch
                                isChecked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </HStack>

                            <CreateForm setFormFields={setFormFields} formFields={formFields} setFormValues={setFormValues} formValues={formValues} />

                        <Heading size={'md'}>Facebook Pixel ID</Heading>


                        <Stack spacing={5} px={[1, 1, 5]}>
                            <FormControl>
                                <Stack>
                                    <HStack>
                                        <Input
                                            type="text"
                                            value={facebookPixelId}
                                            onChange={(e) => setFacebookPixelId(e.target.value)}
                                            placeholder="Masukkan Facebook Pixel ID"
                                        />
                                        <Switch
                                            isChecked={enableFacebookPixel}
                                            onChange={(e) => setEnableFacebookPixel(e.target.checked)}
                                        />
                                    </HStack>
                                </Stack>
                            </FormControl>

                            <HStack alignItems={'flex-end'} justifyContent='flex-end'>
                                <Button variant={'outline'} onClick={handleEmbedCode} colorScheme="blue">
                                    Show Embed Code
                                </Button>

                                <Button variant={'outline'} isLoading={loading} onClick={handleSaveForm} colorScheme="blue">
                                    Save Form
                                </Button>

                            </HStack>


                        </Stack>
                    </Stack>

                </Stack>
                <Stack  >
                    <Stack p={[1, 1, 5]} bgColor={'white'} minH={'500px'} spacing={5} borderRadius='md' shadow={'md'}>
                        <Stack>
                            <Heading size={'md'}>Data penerima: </Heading>
                        </Stack>
                        <Stack spacing={3} p={[1, 1, 5]}>
                            {renderFormFields()}
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>

            <Modal isOpen={modalEmbedCode} onClose={() => setModalEmbedCode(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Embed Code</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack>

                            <Box borderWidth="1px" bgColor={'blackAlpha.800'} color='whiteAlpha.800' borderRadius="md" padding="4" maxH={'300px'} fontSize='sm' overflowY='scroll'>
                                <pre>
                                    {embedCode}
                                </pre>
                            </Box>

                        </Stack>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" variant={'outline'} size='sm' mr={3} onClick={handleCopyCode}>
                            Copy embed code
                        </Button>
                        <Button colorScheme="red" variant={'outline'} size='sm' mr={3} onClick={() => setModalEmbedCode(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </Stack>
    );
}

export default FormBuilderPage;
