import { Stack, Text, Input, Textarea, Select, Button, Grid, FormControl } from '@chakra-ui/react';
import React, { useState } from 'react';
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
            <div>
              <label for="${name}">${label}${isRequired ? ' *' : ''}</label>
              <input type="${type}" name="${name}" placeholder="${placeholder}" style="/* Isi dengan CSS inline sesuai dengan tampilan input Anda */"  ${isRequired ? 'required' : ''}/>
            </div>`;
                break;

            case 'textarea':
                html += `
            <div>
              <label for="${name}">${label}${isRequired ? ' *' : ''}</label>
              <textarea name="${name}" placeholder="${placeholder}" style="/* Isi dengan CSS inline sesuai dengan tampilan textarea Anda */"></textarea>
            </div>`;
                break;

            case 'select':
                html += `
            <div>
              <label for="${name}">${label}${isRequired ? ' *' : ''}</label>
              <select name="${name}" style="/* Isi dengan CSS inline sesuai dengan tampilan select Anda */">
                <option value="" disabled selected>Pilih opsi</option>`;
                options.forEach((option) => {
                    html += `<option value="${option}">${option}</option>`;
                });
                html += `
              </select>
            </div>`;
                break;

            case 'button':
                html += `
            <button type="${type}" name="${name}" onclick="submitForm('${idform}')">${label}</button>`;

                break;

            default:
                break;
        }
    });

    return `<form>${html}</form>`;
}

function generateJS(enableFacebookPixel, facebookPixelId, apiSubmitUrl) {
    let jsScript = '';

    jsScript += ` <script>
    function submitForm(idform) {
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
      
    
  
        const jsonData = JSON.stringify(dataForm); // Mengonversi objek dataForm menjadi JSON

        console.log('ID Form:', idform)
        console.log('JSON Form:', jsonData)

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '${apiSubmitUrl}/' + idform, true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Set header untuk JSON
        xhr.send(jsonData); // Mengirim dataForm dalam format JSON
    
        // Add Facebook Pixel event here
        fbq('track', 'Lead', {
          content_name: 'FormSubmission',
        });
    }
  </script>`

    if (enableFacebookPixel && facebookPixelId) {
        jsScript += `
       
        
        <script>
        !function (f, b, e, v, n, t, s) {
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
    const [formFields, setFormFields] = useState([
        { label: 'Nama', type: 'text', name: 'nama', placeholder: 'Masukkan nama lengkap', isRequired: true },
        { label: 'Email', type: 'email', name: 'email', placeholder: 'Masukkan alamat email', isRequired: true },
        { label: 'nomor telpon', type: 'number', name: 'nomor telpon', placeholder: 'Masukkan nomor telpon', isRequired: true },
        { label: 'Pesan', type: 'textarea', name: 'pesan', placeholder: 'Masukkan pesan Anda' },
        { label: 'Pilihan', type: 'select', name: 'pilihan', options: ['Pilihan 1', 'Pilihan 2', 'Pilihan 3'] },
        { label: 'date', type: 'date', name: 'date', isRequired: true },
        { label: 'File', type: 'file', name: 'bukti transfer', isRequired: true },
        { label: 'Submit', type: 'button', name: 'submit_button', idform: 'rifqyganteng' },
    ]);

    const [formValues, setFormValues] = useState({});
    const [enableFacebookPixel, setEnableFacebookPixel] = useState(true);
    const [facebookPixelId, setFacebookPixelId] = useState('YOUR_PIXEL_ID_HERE');
    const [apiSubmitUrl, setApiSubmitUrl] = useState('https://deoapp.com/kodok');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const renderFormFields = () => {
        return formFields.map((field) => {
            const { label, type, name, placeholder, isRequired, options } = field;
            const inputPlaceholder = placeholder || '';
            const inputIsRequired = isRequired || false;
            const inputProps = { name, onChange: handleInputChange, value: formValues[name] || '' };

            const handleSubmit = () => {
                console.log('Form values:', formValues);
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
                    <Stack>
                        {type === 'button' && <Button onClick={handleSubmit} colorScheme="teal">{label}</Button>}
                    </Stack>
                </FormControl>
            );
        });
    };

    const handleFormSubmit = () => {
        const formHTML = generateHTML(formFields);
        const jsScript = generateJS(enableFacebookPixel, facebookPixelId, apiSubmitUrl);

        // Sisipkan hasil HTML ke dalam dokume


        console.log('Hasil HTML embed dengan inline CSS dan script:', formHTML);
        console.log('Hasil JS script:', jsScript);
    };

    return (
        <Stack>
            <Grid templateColumns={{ base: '1fr', md: '1.5fr 1fr' }} gap={10}>
                <Stack>
                    <CreateForm setFormFields={setFormFields} formFields={formFields} setFormValues={setFormValues} formValues={formValues} />
                </Stack>
                <Stack>
                    {renderFormFields()}
                </Stack>
            </Grid>

            <Stack>
                <Button onClick={handleFormSubmit} colorScheme="teal">
                    html
                </Button>
            </Stack>

            <Stack>
                <Button onClick={() => console.log('form fields:', formFields)} colorScheme="teal">
                    check form
                </Button>
            </Stack>
        </Stack>
    );
}

export default FormBuilderPage;
