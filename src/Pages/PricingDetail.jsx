import React, { useContext, useEffect, useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { auth, db } from '../Config/firebase';
import { addDoc, collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Box, Button, Heading, HStack, Image, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Spacer, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import colors from '../Utils/colors'
import { FaHome } from 'react-icons/fa';
import { MdAccountCircle, MdEmail, MdFlag, MdLock, MdOutlinePhoneIphone } from 'react-icons/md';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import AppHeader from '../Components/AppHeader';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';


function PricingDetail() {

  const API_KEY = "pk_test_eZL2hA7uIiCkLVuxcTNIIx7I008ckE9NzV";

  const toast = useToast()
  const navigate = useNavigate()

  const { signUp, currentUser } = useContext(AuthContext);


  const [subscription, setSubscription] = useState(null)
  const [paymentLink, setPaymentLink] = useState(true)
  const [productsArr, setProductsArr] = useState([])
  const [modalAccount, setModalAccount] = useState(false)
  const [priceIdValue, setPriceIdValue] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)




  const getDataSubscription = async () => {
    const col = collection(db, "customers", currentUser?.uid, "subscriptions"); //uid belum dinamis
    const querySnapshot = await getDocs(col);
    querySnapshot.forEach(async (doc) => {
      // console.log('subscription', doc.data())
      setSubscription({
        role: doc.data().role,
        current_period_start: doc.data().current_period_start,
        current_period_end: doc.data().current_period_end,
      })
    })
  }

  useEffect(() => {
    getDataSubscription()

    return () => {
    }
  }, [currentUser])


  const getDataProducts = async () => {
    const priceData = [ 349, 449, 669 ]
    let products = {};
    const col = collection(db, "products");
    const q = query(col, where("active", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // console.log('productdoc', doc.id)
      // console.log('productdata', doc.data())
      products[doc.id] = doc.data()

      // for get price
      const priceSnapshot = await getDocs(collection(db, `products/${doc.id}/prices`));
      priceSnapshot.forEach((priceDoc) => {
        products[doc.id].price = {
          priceId: priceDoc.id,
          priceData: priceDoc.data()
        }
      
      })

    });

    // products.priceAmount = priceData.forEach((x) => {return(x)})
    // console.log(products, 'xxx')
    setProductsArr(products)
  }

  useEffect(() => {
    getDataProducts()

    return () => {
    }

  }, [])

  const checkOut = async (priceId, uid) => {
    const docref = await addDoc(collection(db, "customers", uid, "checkout_sessions"), //uid disini belum dinamis
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin
      }
    )

    onSnapshot(doc(db, "customers", uid, "checkout_sessions", docref.id), async (doc) => { //uid disini belum dinamis
      const { sessionId } = doc.data()
      console.log(sessionId)
      try {
        if (sessionId) {
          const stripe = await loadStripe(API_KEY);
          stripe.redirectToCheckout({ sessionId })
        }
      } catch (error) {
        console.log(error.message)
      }
    });


  }

  const handleModal = async (priceId) => {
    setModalAccount(true)
    setPriceIdValue(priceId)
  }

  const handleAccount = () => {

    const displayName = name;

    if ((email === "" && password === "" && name === "") || password !== confirmPassword)
      return toast({
        title: "Something Wrong",
        description: "check your email, password, data",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-end",
      });

    if (email !== "" && password !== "" && name !== "") {
      try {
        setLoading(true)
        signUp(email, password)
          .then(async (userCredential) => {
            await updateProfile(auth.currentUser, {
              displayName,
            });
            sendEmailVerification(auth.currentUser);

            // Signed in
            const user = userCredential.user;
            if (user) {
              toast({
                title: "Success Create",
                description: `Success Create account ${user.displayName}`,
                status: "success",
                duration: 10000,
                isClosable: true,
                position: "top-right",
              });
            }

            await checkOut(priceIdValue, user.uid)
          })
          .catch((error) => {
            toast({
              title: "Something Wrong",
              description: `It looks like you don't have account in your browser, please signup and reload this page / ${error.message}`,
              status: "error",
              duration: 10000,
              isClosable: true,
              position: "top-right",
            });
            setLoading(false)
          });
      } catch (error) {
        toast({
          title: "Something Wrong",
          description: error,
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top-end",
        });
        setLoading(false)
      }
    } else {
      toast({
        title: "Something Wrong",
        description: "check your data",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-end",
      });
    }
  }


  const height = window.innerHeight
  const width = window.innerWidth




  return (
    <>
    {/* <AppHeader/> */}
    <Stack bgColor={'gray.100'} minH={height} spacing='-10'>
      <Stack pt={20} spacing={10} minH={height / 1.8} alignItems='center' justifyContent={'center'} bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/pricing_background@3x.png) no-repeat center  fixed" bgSize="cover">
        <Stack alignItems='center' justifyContent={'center'}>
          <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/diy-icon-white.svg' alt='https://buildfire.com/wp-content/themes/buildfire/assets/images/diy-icon-white.svg' w={'50px'} />
          <Heading size={'2xl'} color='white'>BuildFire App Development Platform</Heading>
          <Text fontSize={'sm'} color='white'  fontWeight='bold'>Build your own app. No coding required.</Text>
        </Stack>

        <Stack bgColor={'white'} p={2} borderRadius='xl' borderWidth='medium' borderColor='blue.400'>
          <Text fontWeight={'bold'} fontSize='sm' color='blue.400'>Quarterly</Text>
        </Stack>

      </Stack>

      <Stack>
        {paymentLink !== null &&
          <SimpleGrid columns={[1, null, 3]} gap={6} px={6}>
            {Object.entries(productsArr) && (
              Object.entries(productsArr).map(([productId, productData]) => {
                const isCurrentPlan = productsArr?.name?.toLowerCase().includes(subscription?.role)
                return (

                  <VStack key={productId} bgColor='white' shadow={'base'} borderRadius='lg' spacing={5} p={3}>
                    <Stack alignItems={'flex-start'} justifyContent='flex-start' w={'100%'} spacing={3}>
                      <Image w={'30px'} src='https://buildfire.com/wp-content/themes/buildfire/assets/images/plan2@3x.png' alt='https://buildfire.com/wp-content/themes/buildfire/assets/images/plan1@3x.png' />
                      <Text fontSize={'lg'} fontWeight="bold" color='black'>{productData.name}</Text>
                      <Text fontSize={'sm'} color='black'>{productData.description}</Text>
                      <HStack>
                        <Text alignSelf={'flex-start'} color={'black'} fontWeight='bold'>$</Text>
                        <Heading color={'black'} size='3xl'>349</Heading>
                        <Text alignSelf={'flex-end'}  color={'black'} fontWeight='bold'>/ mo</Text>
                      </HStack>
                      <Text fontSize={'sm'} color='black'>Per month billed quarterly.</Text>

                    </Stack>
                    <Spacer />
                    <Stack w={'full'}>
                      <Button
                        fontSize="sm"
                        fontWeight="bold"
                        size={'sm'}
                        color={colors.light}
                        disabled={isCurrentPlan}
                        // onClick={() => checkOut(productData.price.priceId)}
                        // onClick={currentUser !== null ? (() => checkOut(productData.price.priceId, currentUser?.uid)) : (() => handleModal(productData.price.priceId))}
                        onClick={currentUser !== null ? (() => checkOut(productData.price.priceId, currentUser?.uid)) : (() => navigate('/login'))}
                        bgColor={'blue.400'}
                      >
                        <Text color={'white'}>Get Started</Text>
                      </Button>
                    </Stack>
                  </VStack>

                )

              }
              )
            )}
          </SimpleGrid>
        }

        <Modal isOpen={modalAccount} onClose={() => setModalAccount(false)} >
          <ModalOverlay />
          <ModalContent bgColor={'blue.100'} >
            <ModalHeader>
              <Stack cursor={'pointer'} onClick={() => setModalAccount(true)}>
                <HStack spacing={2} alignItems='center' >
                  <Text fontSize={'lg'} fontWeight='bold'>New Account</Text>
                </HStack>
              </Stack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody >
              <Stack>
                <Stack alignItems="center">
                  <InputGroup w={{
                    base: '100%',
                    md: '285'
                  }}>
                    <InputLeftAddon bgColor={'blue.400'} children={<MdAccountCircle size={24} color="white" />} />
                    <Input placeholder="Full name"
                      fontSize={'md'}
                      type="text"
                      bgColor={'white'}
                      color={colors.black}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>

                </Stack>

                <Stack alignItems="center">
                  <InputGroup w={{
                    base: '100%',
                    md: '285'
                  }}>
                    <InputLeftAddon bgColor={'blue.400'} children={<MdEmail name="email" size={24} color="white" />} />
                    <Input w={{
                      base: '100%',
                      md: '100%'
                    }} placeholder="Email"
                      fontSize={'md'}
                      bgColor={'white'}
                      color={colors.black}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </Stack>

                <Stack alignItems="center">
                  <InputGroup w={{
                    base: '100%',
                    md: '285'
                  }}>
                    <InputLeftAddon bgColor={'blue.400'}  children={<MdLock size={24} color="white" />} />
                    <Input w={{
                      base: '100%',
                      md: '100%'
                    }} placeholder="Password"
                      fontSize={'md'}
                      type="password"
                      bgColor={'white'}
                      color={colors.black}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </Stack>

                <Stack alignItems="center">
                  <InputGroup w={{
                    base: '100%',
                    md: '285'
                  }}>
                    <InputLeftAddon bgColor={'blue.400'}  children={<MdLock size={24} color="white" />} />
                    <Input w={{
                      base: '100%',
                      md: '100%'
                    }} placeholder="Confirm password"
                      fontSize={'md'}
                      id="password"
                      type="password"
                      bgColor={'white'}
                      color={colors.black}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </InputGroup>
                </Stack>
              </Stack>
            </ModalBody>

            <ModalFooter>
              {loading ? (
                <Stack alignItems={'center'} justifyContent='center'>
                  <Spinner />
                </Stack>
              ) : (
                <>
                  <Button size={'sm'} colorScheme='twitter' mr={3} onClick={() => setModalAccount(false)}>
                    <Text color={colors.white}>Close</Text>
                  </Button>
                  <Button colorScheme='twitter' size={'sm'} onClick={() => handleAccount()}>
                    <Text color={colors.white}>Submit</Text>
                  </Button>
                </>
              )}
            </ModalFooter>

          </ModalContent>
        </Modal>
      </Stack>
    </Stack>
    </>
  )
}

export default PricingDetail