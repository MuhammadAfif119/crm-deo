import {
  Stack,
  Text,
  Input,
  Textarea,
  Select,
  Button,
  Grid,
  FormControl,
  Divider,
  Switch,
  useToast,
  Box,
  SimpleGrid,
  Heading,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spacer,
  Checkbox,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import _axios from "../../Api/AxiosBarrier";
import {
  deleteDocumentFirebase,
  getCollectionFirebase,
  getSingleDocumentFirebase,
  updateDocumentFirebase,
} from "../../Api/firebaseApi";
import BackButtons from "../../Components/Buttons/BackButtons";
import TicketCard from "../../Components/Card/TicketCard";
import MembershipCard from "../../Components/Card/MembershipCard";
import CreateForm from "../../Components/Form/CreateForm";
import useUserStore from "../../Hooks/Zustand/Store";
import { formatFrice } from "../../Utils/Helper";
import ProductCard from "../../Components/Card/ProductCard";
import Shipping from "../../Components/Shipment/Shipping";
import { AiOutlineClose } from "react-icons/ai";

function generateHTML(formFields) {
  let html = "";

  formFields.forEach((field) => {
    const { label, type, name, placeholder, options, formId, isRequired } =
      field;

    switch (type) {
      case "text":
      case "email":
      case "number":
      case "date":
      case "file":
        html += `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: bold;" for="${name}">${label}${
          isRequired ? " *" : ""
        }</label>
              <input type="${type}" name="${name}" placeholder="${placeholder}" style="width: 95%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"   ${
          isRequired ? "required" : ""
        }/>
            </div>`;
        break;

      case "textarea":
        html += `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: bold;" for="${name}">${label}${
          isRequired ? " *" : ""
        }</label>
              <textarea name="${name}" placeholder="${placeholder}" style="width: 95%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
            </div>`;
        break;

      case "select":
        html += `
            <div style="margin-bottom: 10px;">
              <label style="display: block; font-weight: bold;" for="${name}">${label}${
          isRequired ? " *" : ""
        }</label>
              <select name="${name}" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                <option value="" disabled selected>Pilih opsi</option>`;
        options.forEach((option) => {
          html += `<option value="${option}">${option}</option>`;
        });
        html += `
              </select>
            </div style="margin-bottom: 10px;">`;
        break;

      case "button":
        html += `



                <div style="margin-bottom: 10px;">
                <div id="notification" style="display: none; color: green; text-align: center;">Terima kasih telah melakukan pendaftaran!</div>
                <div id="successMessage" style="display: none; color: green; text-align: center; font-size: 18px;">Terimakasih sudah melakukan pembayaran!</div>
              </div>
              <div onclick="submitForm('${formId}')" style="display: flex; align-items: center; justify-content: center; background-color: #007BFF; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                <button type="${type}" name="${name}" style="padding: 10px; background-color: #007BFF; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                  <span id="loader" style="display: none;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/importir-com.appspot.com/o/1.png?alt=media&token=7eff6537-54e9-454b-a9c7-b5c8f3b05e44" alt="Loading..." />
                  </span>
                  ${label}
                </button>
              </div>

            `;

        break;

      default:
        break;
    }
  });

  return `  <form  id="myForm" style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">${html}</form>
   
    `;
}

function generateJS(
  enableFacebookPixel,
  facebookPixelId,
  apiSubmitUrl,
  opportunityValue,
  selectedPaymentMethod,
  projectId
) {
  let jsScript = "";

  jsScript += ` <script>
    async function submitForm(formId) {
        const myForm = document.getElementById('myForm');
        const loader = document.getElementById('loader');
        const notification = document.getElementById('notification');
        const successMessage = document.getElementById('successMessage');
        const inputElements = document.querySelectorAll('input');
        const textAreaElements = document.querySelectorAll('textarea');
        const selectElements = document.querySelectorAll('select');
        const dataForm = {}; // Membuat object kosong untuk menyimpan data form
  
        loader.style.display = 'block'; 

  
      inputElements.forEach(input => {
        dataForm[input.name] = input.value;
      });
  
      textAreaElements.forEach(textarea => {
        dataForm[textarea.name] = textarea.value;
      });
  
      selectElements.forEach(select => {
        dataForm[select.name] = select.value;
      }); 

      dataForm.formId = formId;
      dataForm.opportunity_value = ${opportunityValue || 0};
      dataForm.status = 'open';
      
    
  
        const jsonData = JSON.stringify(dataForm);

        console.log('ID Form:', formId)
        console.log('JSON Form:', jsonData)

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '${apiSubmitUrl}', true);
        xhr.setRequestHeader('Content-Type', 'application/json'); // Set header untuk JSON

        try {
            const res = await xhr.send(jsonData);
            notification.style.display = 'none';
            successMessage.style.display = 'block';
            loader.style.display = 'none';

            const formRoute = dataForm.formId;
            const phoneRoute = dataForm.phoneNumber;
            const nameRoute = dataForm.name;

            window.location.href = "https://crm.deoapp.com/payment/ticket/"+ "${selectedPaymentMethod}"+'/'+ "${projectId}" +'/'+ phoneRoute + '/'+ nameRoute;

          } catch (error) {
            console.log(error, 'ini error');
          }
        
    }
  </script>`;

  // if (enableFacebookPixel && facebookPixelId) {
  //     jsScript += `

  //     <script>
  //     !function (f, b, e, v, n, t, s) {
  //         fbq('track', 'Lead', {
  //           content_name: 'FormSubmission',
  //         });

  //         if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
  //             n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
  //         if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
  //         n.queue = []; t = b.createElement(e); t.async = !0;
  //         t.src = v; s = b.getElementsByTagName(e)[0];
  //         s.parentNode.insertBefore(t, s)
  //     }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  //     fbq('init', '${facebookPixelId}');
  //     fbq('track', 'PageView');
  //     </script>
  //     <noscript>
  //     <img height="1" width="1" style="display:none"
  //         src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1" />
  //     </noscript>
  //     `;
  // }

  return jsScript;
}

function FormBuilderPage() {
  const param = useParams();
  const toast = useToast();

  const [modalEmbedCode, setModalEmbedCode] = useState(false);

  const [formData, setFormData] = useState("");

  const [loading, setLoading] = useState(false);

  const globalState = useUserStore();

  const [projectId, setProjectId] = useState(globalState.currentProject);

  const [productActive, setProductActive] = useState();

  const [formFields, setFormFields] = useState([]);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({});
  const [enableFacebookPixel, setEnableFacebookPixel] = useState(false);
  const [facebookPixelId, setFacebookPixelId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [apiSubmitUrl, setApiSubmitUrl] = useState(
    "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/createLead"
  );
  const [opportunityValue, setOpportunityValue] = useState(0);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedProductMethod, setSelectedProductMethod] = useState("");

  const [destinationResults, setDestinationResults] = useState([]);
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [priceSuggestions, setPriceSuggestions] = useState({});
  const [fetchingDestinations, setFetchingDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState({});
  const [fullAddress, setFullAddress] = useState();
  const [selectedCourier, setSelectedCourier] = useState();

  const [ticketActive, setTicketActive] = useState("");

  const [embedCode, setEmbedCode] = useState("");

  const [membershipList, setMembershipList] = useState([]);
  const [selectedMemberships, setSelectedMemberships] = useState([]);

  const handleMembershipSelect = (membership) => {
    if (selectedMemberships.includes(membership)) {
      setSelectedMemberships(
        selectedMemberships.filter((item) => item !== membership)
      );
    } else {
      setSelectedMemberships([...selectedMemberships, membership]);
    }
  };

  const getDataMembership = async () => {
    try {
      const res = await _axios.get("membershipList");
      setMembershipList(res.message);
    } catch (error) {
      console.log(error, "ini error");
    }
  };

  useEffect(() => {
    getDataMembership();

    return () => {};
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (
      productActive &&
      productActive.is_shipping === true &&
      formValues.city
    ) {
      setDestinationSearch(formValues.city);
    }
  };

  console.log(formValues, "ini form value");
  console.log(selectedCourier, "ini form value");

  const renderFormFields = (opportunityValue) => {
    if (formFields?.length > 0) {
      return formFields?.map((field) => {
        const { label, type, name, placeholder, isRequired, options, formId } =
          field;
        const inputPlaceholder = placeholder || "";
        const inputIsRequired = isRequired || false;
        const inputProps = {
          name,
          onChange: handleInputChange,
          value: formValues[name] || "",
        };

        const handleSubmitProduct = async () => {
          let updateData = formValues;
          updateData.formId = formId;

          if (formData?.product_used) {
            updateData.shippingDetails = {
              region: selectedCourier?.origin_name,
              destination: selectedCourier?.destination_name,
              price: selectedCourier?.price,
              currency: selectedCourier?.currency,
              address: fullAddress,
            };
          }

          updateData.totalPrice =
            parseInt(opportunityValue) + parseInt(selectedCourier.price);
          updateData.opportunity_value = opportunityValue
            ? opportunityValue
            : "0";
          updateData.status = "open";

          const data = updateData;
          console.log(data, "ini submitted data");
          try {
            const res = await axios.post(
              "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/createLead",
              data
            );

            // window.location.href = `http://localhost:3000/payment/${selectedProductMethod}/${selectedPaymentMethod}/${projectId}/${updateData.phoneNumber}/${updateData.name}`;
            window.location.href = `http://crm.deoapp.com/payment/${selectedProductMethod}/${selectedPaymentMethod}/${projectId}/${updateData.phoneNumber}/${updateData.name}`;
          } catch (error) {
            console.log(error, "ini error");
          }
          // Implement your form submission logic here
        };

        const handleSubmit = async () => {
          let updateData = formValues;
          updateData.formId = formId;

          updateData.opportunity_value = opportunityValue
            ? opportunityValue
            : "0";
          updateData.status = "open";

          const data = updateData;
          console.log(data, "ini submitted data");
          try {
            const res = await axios.post(
              "https://asia-southeast2-deoapp-indonesia.cloudfunctions.net/createLead",
              data
            );

            window.location.href = `http://localhost:3000/payment/${selectedProductMethod}/${selectedPaymentMethod}/${projectId}/${updateData.phoneNumber}/${updateData.name}`;
            // window.location.href = `http://crm.deoapp.com/payment/${selectedProductMethod}/${selectedPaymentMethod}/${projectId}/${updateData.phoneNumber}/${updateData.name}`;
          } catch (error) {
            console.log(error, "ini error");
          }
          // Implement your form submission logic here
        };

        return (
          <FormControl key={name} isRequired={inputIsRequired}>
            {type !== "button" && (
              <Text>
                {label}
                {inputIsRequired ? (
                  <span style={{ color: "red" }}>*</span>
                ) : null}
              </Text>
            )}
            {type === "text" && (
              <Input
                type="text"
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}
            {type === "number" && (
              <Input
                type="number"
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}
            {type === "email" && (
              <Input
                type="email"
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}
            {type === "textarea" && (
              <Textarea
                name={name}
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}
            {type === "select" && (
              <Select
                name={name}
                placeholder={inputPlaceholder}
                {...inputProps}
              >
                {options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
            {type === "date" && (
              <Input
                type="date"
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}
            {type === "time" && (
              <Input
                type="time"
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}
            {type === "file" && (
              <Input
                type="file"
                placeholder={inputPlaceholder}
                {...inputProps}
              />
            )}

            {type === "request" && (
              <Shipping
                my={3}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                selectedCourier={selectedCourier}
                setSelectedCourier={setSelectedCourier}
                setFullAddress={setFullAddress}
              />
            )}

            <Box textAlign={"center"}>
              {type === "button" && (
                <Button
                  onClick={
                    formData.product_used ? handleSubmitProduct : handleSubmit
                  }
                  colorScheme="blue"
                >
                  {label}
                </Button>
              )}
            </Box>
          </FormControl>
        );
      });
    }
  };

  const handleEmbedCode = () => {
    setModalEmbedCode(true);
    const formHTML = generateHTML(formFields);
    const jsScript = generateJS(
      enableFacebookPixel,
      facebookPixelId,
      apiSubmitUrl,
      opportunityValue,
      selectedPaymentMethod,
      projectId
    );

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
    setLoading(true);
    const collectionName = "forms";
    const docName = param.id;

    // Pengecekan apakah selectedMemberships tidak kosong
    let membershipUsedData = {}; // Objek untuk field membership_used
    if (selectedMemberships && selectedMemberships.length > 0) {
      membershipUsedData = { membership_used: selectedMemberships };
    }

    const data = {
      form_fields: formFields,
      facebookPixelId,
      enableFacebookPixel,
      isActive,
      apiSubmitUrl: `${apiSubmitUrl}`,
      paymentMethod: selectedPaymentMethod,
      product: selectedProductMethod,
      paymentMethodId: process.env.REACT_APP_PAYMENT_XENDIT,
      ...membershipUsedData, // Menambahkan field membership_used jika tidak kosong
    };

    try {
      const result = await updateDocumentFirebase(
        collectionName,
        docName,
        data
      );
      console.log(result);

      toast({
        title: "Deoapp.com",
        description: "success update form",
        status: "success",
        position: "top-right",
        isClosable: true,
      });

      navigate(-1);

      // Pesan toast yang berhasil
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    const formHTML = generateHTML(formFields);
    const jsScript = generateJS(
      enableFacebookPixel,
      facebookPixelId,
      apiSubmitUrl,
      opportunityValue,
      selectedPaymentMethod,
      projectId
    );

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
      const result = await getSingleDocumentFirebase("forms", param.id);
      setFormData(result);
      if (result?.ticket_used) {
        try {
          const resultTicket = await getSingleDocumentFirebase(
            "tickets",
            result.ticket_used[0]
          );
          setTicketActive(resultTicket);
          setOpportunityValue(resultTicket?.price);
        } catch (error) {
          console.log(error, "ini error");
        }
      }

      if (result?.product_used) {
        try {
          const resultProduct = await getSingleDocumentFirebase(
            "listings_product",
            result.product_used[0]
          );
          setProductActive(resultProduct);
          setOpportunityValue(parseInt(resultProduct?.price));
        } catch (error) {
          console.log(error, "ini error");
        }
      }

      if (result?.form_fields) {
        setFormFields(result?.form_fields);
        setEnableFacebookPixel(result?.enableFacebookPixel);
        setFacebookPixelId(result?.facebookPixelId);
        setIsActive(result?.isActive);
        setSelectedPaymentMethod(result?.paymentMethod);
        setSelectedProductMethod(result?.product);
        setSelectedMemberships(result?.membership_used);
      } else {
        setFormFields([
          {
            label: "Name",
            type: "text",
            name: "name",
            placeholder: "Masukkan nama lengkap",
            isRequired: true,
          },
          {
            label: "Email",
            type: "email",
            name: "email",
            placeholder: "Masukkan alamat email",
            isRequired: true,
          },
          {
            label: "Phone number",
            type: "number",
            name: "phoneNumber",
            placeholder: "Masukkan nomor telpon",
            isRequired: true,
          },
          {
            label: "Additional message",
            type: "textarea",
            name: "pesan",
            placeholder: "Masukkan pesan Anda",
          },
          // {
          //   label: "City",
          //   type: "text",
          //   name: "city",
          //   placeholder: "Kota/Kecamatan",
          // },
          // {
          //   label: "Address",
          //   type: "textarea",
          //   name: "alamat",
          //   placeholder: "Masukkan pesan Anda",
          // },
          {
            label: "Pilihan",
            type: "select",
            name: "pilihan",
            options: ["Pilihan 1", "Pilihan 2", "Pilihan 3"],
          },
          // {
          //   label: "City Selection",
          //   type: "select",
          //   name: "citySelection",
          //   options: destinationSuggestions,
          // },
          { label: "date", type: "date", name: "date", isRequired: true },
          {
            label: "File",
            type: "file",
            name: "bukti transfer",
            isRequired: true,
          },
          {
            label: "Submit",
            type: "button",
            name: "submit_button",
            formId: result.token,
          },
        ]);
        setEnableFacebookPixel(false);
        setFacebookPixelId("GTM-XXXXX");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formData);

  const getDestination = async () => {
    if (productActive && productActive.is_shipping === true) {
      setFetchingDestinations(true);
      const url = "https://getdestination-qwuyxef5gq-uc.a.run.app";
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: url,
        data: {
          username: "DBRAND",
          api_key: "e34a6683064f208340e6b8e683c7163f",
          is_production: true,
        },
      };
      try {
        const result = await axios(config);
        // console.log("result destination", result)
        if (
          result?.data?.data !== undefined &&
          result?.data?.data?.detail?.length > 0
        ) {
          setDestinationResults(result?.data?.data?.detail);
          console.log(result);
        }
      } catch (error) {
        console.log(error, "error getting destination");
      } finally {
        setFetchingDestinations(false);
      }
    }
  };

  useEffect(() => {
    getDataForm();

    return () => {};
  }, []);

  const handlePaymentMethodChange = (option) => {
    setSelectedPaymentMethod(option);
  };

  const renderPaymentOptions = () => {
    const paymentOptions = ["xendit", "midtrans", "xendit recurring", "none"]; // Ganti dengan opsi pembayaran yang sesuai
    return (
      <Stack spacing={2}>
        <HStack spacing={5}>
          {paymentOptions.map((option) => (
            <Checkbox
              key={option}
              value={option}
              isChecked={selectedPaymentMethod === option}
              onChange={() => handlePaymentMethodChange(option)}
              textTransform="capitalize"
            >
              {option}
            </Checkbox>
          ))}
        </HStack>
      </Stack>
    );
  };

  const handleProductMethodChange = (option) => {
    setSelectedProductMethod(option);
  };

  const renderProductOptions = () => {
    const paymentOptions = [
      "ticket",
      "membership",
      "listing",
      "product",
      "none",
    ]; // Ganti dengan opsi pembayaran yang sesuai
    return (
      <Stack spacing={2}>
        <HStack spacing={5}>
          {paymentOptions.map((option) => (
            <Checkbox
              key={option}
              value={option}
              isChecked={selectedProductMethod === option}
              onChange={() => handleProductMethodChange(option)}
              textTransform="capitalize"
            >
              {option}
            </Checkbox>
          ))}
        </HStack>

        {/* <Stack>
          {selectedProductMethod === "membership" && (
            <Stack spacing={5}>
              <Stack>
                <Heading size={"md"}>Membership</Heading>
              </Stack>
              <Stack>
                {membershipList.length > 0 && (
                  <SimpleGrid columns={[1, 2, 3]} gap={3}>
                    {membershipList?.map((x, index) => {
                      return (
                        <MembershipCard
                          key={index}
                          membership={x}
                          selectedMemberships={selectedMemberships}
                          handleMembershipSelect={handleMembershipSelect}
                        />
                      );
                    })}
                  </SimpleGrid>
                )}
              </Stack>
            </Stack>
          )}
        </Stack> */}
      </Stack>
    );
  };

  const handleDeleteForm = async () => {
    const collectionName = "forms";
    const docName = param.id;

    try {
      const result = await deleteDocumentFirebase(collectionName, docName);
      console.log(result);

      toast({
        title: "Deoapp.com",
        description: "success delete form",
        status: "success",
        position: "top-right",
        isClosable: true,
      });

      navigate(-1);
    } catch (error) {
      console.log("Terjadi kesalahan:", error);
    }
  };

  return (
    <Stack spacing={5}>
      <BackButtons />

      <HStack>
        <Heading size={"lg"} textTransform="capitalize">
          {formData.title}
        </Heading>
        <Spacer />
        <Button onClick={handleDeleteForm} size={"sm"} colorScheme="red">
          Delete
        </Button>
      </HStack>

      <Divider />

      <Flex
        pos={"relative"}
        flexDir={"row"}
        // templateColumns={{ base: "1fr", md: "1.3fr 1fr" }}
        gap={4}
        py={5}
      >
        <Stack w={"60%"}>
          <Stack
            minH={"500px"}
            bgColor={"white"}
            p={[1, 1, 5]}
            spacing={5}
            borderRadius="md"
            shadow={"md"}
          >
            <HStack>
              <Heading size={"md"}>Form Costumize</Heading>
              <Spacer />
              <Switch
                isChecked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </HStack>

            <CreateForm
              setFormFields={setFormFields}
              formFields={formFields}
              setFormValues={setFormValues}
              formValues={formValues}
            />

            <Heading size={"md"}>Facebook GTM-ID</Heading>

            <Stack>
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
            </Stack>

            <Stack spacing={5}>
              <Heading size={"md"}>Payment Method</Heading>
              <Stack>{renderPaymentOptions()}</Stack>

              <Heading size={"md"}>Product Form</Heading>
              <Stack>{renderProductOptions()}</Stack>
            </Stack>

            <HStack alignItems={"flex-end"} justifyContent="flex-end">
              <Button
                variant={"outline"}
                onClick={handleEmbedCode}
                colorScheme="blue"
              >
                Show Embed Code
              </Button>

              <Button
                variant={"outline"}
                isLoading={loading}
                onClick={handleSaveForm}
                colorScheme="blue"
              >
                Save Form
              </Button>
            </HStack>
          </Stack>

          <Stack>
            {productActive && (
              <Stack
                bgColor={"white"}
                p={[1, 1, 5]}
                spacing={5}
                borderRadius="md"
                shadow={"md"}
              >
                <Heading size={"md"}>Product Active</Heading>
                <Stack onClick={() => console.log(ticketActive, "ini xx")}>
                  <ProductCard item={productActive} />
                </Stack>
              </Stack>
            )}
            {ticketActive && (
              <Stack
                bgColor={"white"}
                p={[1, 1, 5]}
                spacing={5}
                borderRadius="md"
                shadow={"md"}
              >
                <Heading size={"md"}>Ticket Active</Heading>
                <Stack onClick={() => console.log(ticketActive, "ini xx")}>
                  <TicketCard item={ticketActive} />
                </Stack>
              </Stack>
            )}
          </Stack>

          {selectedProductMethod === "membership" && (
            <Stack p={[1, 1, 5]} bg={"white"} borderRadius={"md"} shadow={"md"}>
              <Stack spacing={5}>
                <Stack>
                  <Heading size={"md"}>Membership</Heading>
                </Stack>
                <Stack>
                  {membershipList.length > 0 && (
                    <SimpleGrid columns={[1, 2, 3]} gap={3}>
                      {membershipList?.map((x, index) => {
                        return (
                          <MembershipCard
                            key={index}
                            membership={x}
                            selectedMemberships={selectedMemberships}
                            handleMembershipSelect={handleMembershipSelect}
                          />
                        );
                      })}
                    </SimpleGrid>
                  )}
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>

        <Stack
          pos={"absolute"}
          right={-5}
          w={"40%"}
          p={[1, 1, 5]}
          bgColor={"white"}
          minH={"530px"}
          spacing={5}
          borderRadius="md"
          shadow={"md"}
        >
          <Stack>
            <Heading size={"md"}>Data penerima: </Heading>
          </Stack>
          <Stack spacing={3} p={[1, 1, 5]}>
            {renderFormFields(opportunityValue)}
          </Stack>
        </Stack>
      </Flex>

      <Modal isOpen={modalEmbedCode} onClose={() => setModalEmbedCode(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Embed Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Box
                borderWidth="1px"
                bgColor={"blackAlpha.800"}
                color="whiteAlpha.800"
                borderRadius="md"
                padding="4"
                maxH={"300px"}
                fontSize="sm"
                overflowY="scroll"
              >
                <pre>{embedCode}</pre>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              variant={"outline"}
              size="sm"
              mr={3}
              onClick={handleCopyCode}
            >
              Copy embed code
            </Button>
            <Button
              colorScheme="red"
              variant={"outline"}
              size="sm"
              mr={3}
              onClick={() => setModalEmbedCode(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}

export default FormBuilderPage;
