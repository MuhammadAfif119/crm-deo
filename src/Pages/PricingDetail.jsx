import React, { useEffect, useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { db } from '../Config/firebase';
import { addDoc, collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Button, Heading, HStack, Image, SimpleGrid, Spacer, Stack, Text, VStack } from '@chakra-ui/react';
import colors from '../Utils/colors'


function PricingDetail() {

  const API_KEY = "pk_test_eZL2hA7uIiCkLVuxcTNIIx7I008ckE9NzV";

  const [subscription, setSubscription] = useState(null)
  const [paymentLink, setPaymentLink] = useState(true)
  const [productsArr, setProductsArr] = useState([])


  const getDataSubscription = async () => {
    const col = collection(db, "customers", "QyE73yxpXkMJmVdOmlMGz2IRiqb2", "subscriptions"); //uid belum dinamis
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
  }, [])

  const getDataProducts = async () => {
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
    setProductsArr(products)
  }

  useEffect(() => {
    getDataProducts()

    return () => {
      setProductsArr([])
    }

  }, [])

  const checkOut = async (priceId) => {
    const docref = await addDoc(collection(db, "customers", "NBQhTYSrXpfEbGsuqDbvkYAuq8W2", "checkout_sessions"), //uid disini belum dinamis
      {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin
      }
    )

    onSnapshot(doc(db, "customers", "NBQhTYSrXpfEbGsuqDbvkYAuq8W2", "checkout_sessions", docref.id), async (doc) => { //uid disini belum dinamis
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


  const height = window.innerHeight
  const width = window.innerWidth




  return (
    <Stack pt={20}  bgColor={'gray.100'} minH={height} spacing='-10'>
      <Stack spacing={10} minH={height/2} alignItems='center' justifyContent={'center'}  bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/pricing_background@3x.png) no-repeat center  fixed" bgSize="cover">
        <Stack alignItems='center' justifyContent={'center'}>
        <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/diy-icon-white.svg' alt='https://buildfire.com/wp-content/themes/buildfire/assets/images/diy-icon-white.svg' w={'50px'}/>
        <Heading size={'2xl'}>BuildFire App Development Platform</Heading>
        <Text fontSize={'sm'} fontWeight='bold'>Build your own app. No coding required.</Text>
        </Stack>

        <Stack bgColor={'white'} p={2} borderRadius='3xl' borderWidth='medium' borderColor='blue.400'>
          <Text fontWeight={'bold'} fontSize='sm' color='blue.400'>Quarterly</Text>
        </Stack>

      </Stack>

      <Stack>
      {paymentLink !== null &&
        <SimpleGrid columns={[1, null, 3]} spacing={3} px={3}>
          {Object.entries(productsArr) !== null && (
            Object.entries(productsArr).map(([productId, productData]) => {
              const isCurrentPlan = productsArr?.name?.toLowerCase().includes(subscription?.role)
              console.log(productData.price, 'xxx')
              return (

                <VStack key={productId} bgColor='white' shadow={'base'} borderRadius='lg' spacing={4}  p={3}>
                  <Stack  alignItems={'flex-start'} justifyContent='flex-start' w={'100%'} spacing={2}>
                  <Image w={'30px'} src='https://buildfire.com/wp-content/themes/buildfire/assets/images/plan1@3x.png' alt='https://buildfire.com/wp-content/themes/buildfire/assets/images/plan1@3x.png'/>
                  <Text fontSize={'lg'} fontWeight="bold" color='black'>{productData.name}</Text>
                  <Text fontSize={'sm'} color='black'>{productData.description}</Text>
                  <HStack>
                    <Text color={'black'} fontWeight='bold'>$</Text>
                    <Heading color={'black'} size='2xl'>349</Heading>
                    <Text color={'black'} fontWeight='bold'>/ mo</Text>
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
                    onClick={() => checkOut(productData.price.priceId)}
                    bgColor={'blue.400'}
                  >Get Started</Button>
                  </Stack>
                </VStack>

              )

            }
            )
          )}
        </SimpleGrid>
      }
      </Stack>
    </Stack>
  )
}

export default PricingDetail