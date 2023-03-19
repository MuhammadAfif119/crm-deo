import { Button, Divider, Heading, HStack, Image, Input, layout, Progress, Select, SimpleGrid, Spacer, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { SlArrowRight } from 'react-icons/sl'
import { useNavigate } from 'react-router-dom'
import AppImageSlideAgain from '../Components/Carousel/AppImageSlideAgain'
import { auth, db } from '../Config/firebase'
import AuthContext from '../Routes/hooks/AuthContext'
import store from 'store'

function SignupDeo() {
  const width = window.innerWidth
  const height = window.innerHeight
  const [progress, setProgress] = useState(30)

  const navigate = useNavigate()

  const { signUp } = useContext(AuthContext);



  const data = [
    {
      categories: 'All Styles',
      heading: 'Start your app with a template',
      text: 'You can always change your template and content later',
      display: [
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/wellness-light-cover.png',
          title: 'Wellness App - Light Theme',
          id: 'wellnessapp',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/wellness%20-%20%20light%20-%2012.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/wellness%20-%20%20light%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/wellness%20-%20%20light%20-%202.png'
          ]
        },
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/rectangle%205%20(1)1.png',
          title: 'Educational Game - Icon T',
          id: 'educationalgame',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/game%20-%20icon%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/game%20-%20icon%20-%203.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/game%20-%20icon%20-%204.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/game%20-%20icon%20-%205.png'
          ]
        },
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education-color1.png',
          title: 'Classes & Training - Icon Theme',
          id: 'classestraining',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/classes%20%26%20training-%20%20icon%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/classes%20%26%20training-%20%20icon%207.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/classes%20%26%20training-%20%20icon%203.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/classes%20%26%20training-%20%20icon%204.png'
          ]
        },
      ]
    },



    {
      categories: 'eCommerce',
      heading: 'Start your app with a template',
      text: 'You can always change your template and content later',
      display: [
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/grocery-store-cover.png',
          title: 'Grocery Store - Shopify',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/grocery%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/grocery%20-%205.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/grocery%20-%206.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/grocery%20-%209.png'
          ]
        },
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/http://imageserver.prod.s3.amazonaws.com/1717/8d61ca30-c817-11e9-a495-8b693eedf8b1.png',
          title: 'Liquor Store - Shopify',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/brewmaster%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/brewmaster%20-%202.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/brewmaster%20-%204.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/brewmaster%20-%208.png',
          ]
        },
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/http://imageserver.prod.s3.amazonaws.com/1717/7ff338c0-c817-11e9-a495-8b693eedf8b1.png',
          title: 'Instrument store - Shopify',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/melodic%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/melodic%20-%202.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/melodic%20-%206.png',
          ]
        },
      ]
    },

    {
      categories: 'Education',
      heading: 'Start your app with a template',
      text: 'You can always change your template and content later',
      display: [
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/uni%20-%20color.png',
          title: 'University Education - Color',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education_uni_color_1.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education_uni_color_5.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education_uni_color_7.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education_uni_color_6.png'
          ]
        },
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/edu_kids_dark.png',
          title: 'Education - Dark Theme',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20dark%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20dark%20-%207.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20dark%20-%208.png',
          ]
        },
        {
          image: 'https://apmyztgbko.cloudimg.io/s/width/240/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/_light.png',
          title: 'Education - Light Theme',
          imageAll: [
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20light%20-%201.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20light%20-%205.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20light%20-%204.png',
            'https://apmyztgbko.cloudimg.io/s/width/340/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/education%20-%20light%20-%202.png'
          ]
        },
      ]
    },


  ]

  const [tamplate, setTamplate] = useState(data[0])
  const [display, setDisplay] = useState(null)

  const [layoutTamplate, setLayoutTamplate] = useState(true)
  const [layoutAccount, setLayoutAccount] = useState(false)
  const [layoutFinish, setLayoutFinish] = useState(false)
  const toast = useToast()


  const [ appName, setAppName ]=useState('')
  const [ industry, setIndustry ]=useState('')
  const [ name, setName ]=useState('')
  const [ websiteLink, setWebsiteLink ]=useState('')
  const [ numberPhone, setNumberPhone ]=useState('')
  const [ email, setEmail ]=useState('')
  const [ password, setPassword ]=useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const handleAccountLayout = () => {
    if (tamplate !== null && display !== null) {
      setLayoutTamplate(false)
      setLayoutAccount(true)
      setProgress(progress+30)
    }

  } 

  const handleNewAccount = () => {
    const displayName = name;
		if ((email === "" && password === "" && numberPhone === "" && name === "" && industry === "") || password !== confirmPassword)
			return toast({
				title: "Something Wrong",
				description: "check your email, password, data",
				status: "error",
				duration: 10000,
				isClosable: true,
				position: "top-end",
			});

      if (email !== "" && password !== ""  && numberPhone !== "" && industry !== "" && name !== ""  ) {
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
              await setDoc(doc(db, "users", user.uid), {
                appName: appName,
                websiteLink: websiteLink, 
                name: name,
                keyword_name: (name).toLowerCase().split(' ').join(''),
                email: user.email,
                uid_user: user.uid,
                numberPhone: numberPhone,
                industry: (industry).toLowerCase(),
                role: 'user',
                subscription: 'null',
                displayOrder : display,
                createdAt: new Date(),
              });

                  setLoading(false)
                  setLayoutAccount(false)
                  setLayoutFinish(true)
                  setProgress(progress+40)
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
      }else{
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

  const handleFinish = () => {

  }


  return (
    <Stack bgColor={'gray.100'} spacing={2}>
      <HStack minW={width} h='100px' bgColor={'white'} shadow='md' px={5}>
        <Stack cursor={'pointer'} onClick={() => navigate('/')}>
          <Image w={'150px'} src='https://apmyztgbko.cloudimg.io/s/width/200/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/70d99d60-bba1-11ea-afeb-9b24b15f2961.png' alt='https://apmyztgbko.cloudimg.io/s/width/200/https://s3-us-west-2.amazonaws.com/imageserver.prod/1717/70d99d60-bba1-11ea-afeb-9b24b15f2961.png' />
        </Stack>
        <Stack
          bgColor="white"
          p={2}
          borderRadius="sm"
          shadow={"base"}
          minW='80%'
        >
          <Progress
            size={"xs"}
            hasStripe
            value={progress}
            colorScheme="blue"
          />
        </Stack>
      </HStack>


      {layoutTamplate === true && (
        <Stack display={'flex'} flexDirection={['column', null, 'row']} gap={2} justifyContent={'center'} spacing={0} >
          <Stack py={3} px='6' minW={['100%', null, '20%']} bgColor={'white'}>
            <Text fontSize={'xs'} fontWeight='bold'>Categories</Text>
            <Divider />
            {data.length > 0 && data.map((x, index) => {
              return (
                <Stack key={index} cursor='pointer' onClick={() => setTamplate(x)} fontWeight={tamplate?.categories === x.categories ? 'bold' : 'normal'}>
                  <Text color={'black'} fontSize='sm'>{x.categories}</Text>
                </Stack>
              )
            })}
          </Stack>


          <Stack py={3} px='6' w={'50%'} bgColor={'white'} display={['none', 'null', 'flex']}>
            {tamplate && (
              <Stack spacing={10}>
                <Stack>
                  <Text fontSize={'2xl'} color='gray.700'>{tamplate.heading}</Text>
                  <Text fontSize={'xs'} color='gray.700'>{tamplate.text}</Text>
                </Stack>

                <SimpleGrid columns={[2, 2, 2, 3]} gap={4}>
                  {tamplate?.display?.length > 0 && tamplate.display.map((x, index) => {
                    return (
                      <Stack key={index} alignItems='center' justifyContent={'center'} cursor='pointer' _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} onClick={() => setDisplay(x)}>
                        <Text fontSize={'xs'} color='gray.700'>{x.title}</Text>
                        <Image src={x.image} alt={x.image} />
                      </Stack>
                    )
                  })}
                </SimpleGrid>
              </Stack>
            )}
          </Stack>


          <Stack py={3} px='6' minW={['100%', null, '25%']} bgColor={'white'}>
            <Stack w={'full'}>
              <Button size={'sm'} bgColor='blue.400' onClick={() => handleAccountLayout()}>
                <HStack alignItems={'center'} justifyContent='space-evenly'>
                  <Text fontSize={'sm'} color='white' >Start with this Template</Text>
                  <SlArrowRight color="white" />
                </HStack>
              </Button>
              {display !== null && (
                <Stack>
                  <AppImageSlideAgain images={display?.imageAll} />
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}

      {layoutAccount === true && (
        <Stack bgColor={'white'} alignItems='center' justifyContent={'center'}>
          <SimpleGrid columns={[1, 2, 2]} h={height} gap={3}>
            <Stack >
              <Image src={display?.imageAll[0]} />
            </Stack>
            <Stack alignItems={'center'} justifyContent='center' >
              <Stack borderWidth={1} borderColor='gray.300' borderRadius={'xl'} p={10} spacing={3} >
                <Input placeholder='App name' fontSize={'sm'} onChange={(e) => setAppName(e.target.value)}  />
                <Text color={'gray.300'} fontSize='xs'> You can always change this later.</Text>
                <Select  w='210px' bgColor={'white'} placeholder="Select Industry" fontSize={'sm'}  onChange={(e) => setIndustry(e.target.value)}>
                  <option value="business">Business</option>
                  <option value="delivery">Delivery & Navigation</option>
                  <option value="ecommerce">Ecommerce</option>
                  <option value="education">Education & Training</option>
                </Select>
                  <Input placeholder='Full Name' fontSize={'sm'} onChange={(e) => setName(e.target.value)} />
                <Input placeholder='Website' fontSize={'sm'} onChange={(e) => setWebsiteLink(e.target.value)}  />
                <Input placeholder='Number Phone' fontSize={'sm'} type='number' onChange={(e) => setNumberPhone(e.target.value)} />
                <Input placeholder='Email' fontSize={'sm'} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder='Password' fontSize={'sm'} type='password' onChange={(e) => setPassword(e.target.value)} />
                <Input placeholder='Confirm Password' fontSize={'sm'} type='password' onChange={(e) => setConfirmPassword(e.target.value)} />
                <Text fontSize={'xs'} color='blue.300'>View the Terms and Privacy Policy</Text>
                <Stack alignItems={'center'} justifyContent='center'>
                  {loading? (
                    <Spinner color='blue' />
                  ) : (
                    <Button bgColor={'blue.400'} onClick={() => handleNewAccount()}>
                    <HStack>
                      <Text color={'white'}>Get started</Text>
                      <Spacer />
                      <SlArrowRight color="white" />
                    </HStack>
                  </Button>
                  )}
                 
                </Stack>
              </Stack>

            </Stack>
          </SimpleGrid>
        </Stack>
      )}

      {layoutFinish === true && (
        <Stack  h={height/1.5} bgColor={'white'} alignItems='center' justifyContent={'center'}>
          <Stack spacing={10}>
            <Stack>
          <Heading textAlign={'center'}>You're finish complete the data</Heading>
          <Text color={'gray.400'} textAlign='center' fontSize='sm'>Please check your general payment !</Text>
          </Stack>
          <Button bgColor={'blue.400'} onClick={() => handleFinish()}>
          <HStack alignItems={'center'} justifyContent='space-evenly'>
                  <Text fontSize={'sm'} color='white' >Finish</Text>
                  <Spacer />
                  <SlArrowRight color="white" />
                </HStack>
          </Button>
          </Stack>
        </Stack>
      )}


    </Stack>
  )
}

export default SignupDeo