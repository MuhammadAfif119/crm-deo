import { Button, Heading, HStack, Image, SimpleGrid, Spacer, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { MdArrowRightAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

function PricingPage() {

    const imageSponsor = [
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/pepsi@2x.png',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/paypal@2x.png',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/praxair@2x.png',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/cisco@2x.png',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/pandora@2x.webp',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/aon@2x.webp',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/travelers@2x.webp',
        'https://buildfire.com/wp-content/themes/buildfire/assets/images/logos/la-phil@2x.webp'
    ]

    const height = window.innerHeight
    const width = window.innerWidth

    const navigate = useNavigate()

    return (
        <Stack pt={20} h={height} bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg) no-repeat center center fixed" bgSize="cover">
            <Stack py={10} px={[null, null, 20]}>
                <Stack alignItems={'center'} justifyContent='center'>

                    <Heading size={'2xl'} textAlign='center'>
                        Pricing to meet your budget and needs

                    </Heading>
                </Stack>
                <SimpleGrid columns={[1, null, 2]} gap={5} py={10}>
                    <Stack alignItems={'center'} justifyContent='center'>
                        <Stack w={['90%', null, '90%']} bgColor='white' borderRadius={'xl'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} alignItems={'center'} justifyContent='center'>
                            <Stack p={5} pt={10} w={'80%'} alignItems='center' justifyContent='center'>
                                <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/app-builder.svg' w={'30px'} />
                            </Stack>
                            <Stack p={5} w={'80%'}>
                                <Heading color={'black'} size='lg' textAlign={'center'}>Buildfire Plus Professional Service</Heading>
                            </Stack>
                            <Stack w={'80%'}>
                                <Text color={'black'} fontSize='sm' textAlign={'center'}>Our team of experts will build your app.</Text>
                            </Stack>
                            <Stack py={5} >
                                <Button bgColor={'green.500'} size={'lg'} px={12} onClick={() => navigate('app-development')}>
                                    <HStack alignItems={'center'} justifyContent='center'>
                                        <Text fontSize={'md'}>View plans</Text>
                                        <MdArrowRightAlt size={30} />
                                    </HStack>
                                </Button>
                            </Stack>
                            <Spacer />
                            <Stack bgColor={'gray.100'} p={5} w='100%' borderBottomRadius={'xl'}>
                                <Text textAlign={'center'} color='black' fontWeight={'bold'}>Get a world-class app built by our talented design and development team

                                </Text>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack alignItems={'center'} justifyContent='center'>
                        <Stack w={['90%', null, '90%']} bgColor='white' borderRadius={'xl'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} alignItems={'center'} justifyContent='center'>
                            <Stack p={5} pt={10} w={'80%'} alignItems='center' justifyContent='center'>
                                <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/app-builder.svg' w={'30px'} />
                            </Stack>
                            <Stack p={5} w={'80%'}>
                                <Heading color={'black'} size='lg' textAlign={'center'}>App Development Platform</Heading>
                            </Stack>
                            <Stack w={'80%'}>
                                <Text color={'black'} fontSize='sm' textAlign={'center'}>Build your app with our DIY platform - no coding required. <br />
                                    Try it for free for 14 days!

                                </Text>
                            </Stack>
                            <Stack py={5} >
                                <Button bgColor={'green.500'} size={'lg'} px={12} onClick={() => console.log('get-started')}>
                                    <HStack alignItems={'center'} justifyContent='center'>
                                        <Text fontSize={'md'}>View plans</Text>
                                        <MdArrowRightAlt size={30} />
                                    </HStack>
                                </Button>
                            </Stack>
                            <Spacer />
                            <Stack bgColor={'gray.100'} p={5} w='100%' borderBottomRadius={'xl'}>
                                <Text textAlign={'center'} color='black' fontWeight={'bold'}>Get a world-class app built by our talented design and development team

                                </Text>
                            </Stack>
                        </Stack>
                    </Stack>
                </SimpleGrid>
            </Stack>

            <Stack alignItems={'center'} justifyContent='centrer'>
                <Text textAlign={'center'} fontWeight={'bold'} fontSize='lg'>Use the same platform we used to build over 10,000 mobile apps</Text>
                <SimpleGrid columns={[imageSponsor.length / 2, null, imageSponsor.length]}>
                    {imageSponsor.length > 0 && imageSponsor.map((x, index) => {
                        return (
                            <Stack key={index} >
                                <Image src={x} alt={x} />
                            </Stack>
                        )
                    })}

                </SimpleGrid>
            </Stack>

            <Stack bgColor={'gray.100'} py={10}>
                <SimpleGrid columns={[1, null, 3]}>
                    <Stack alignItems={'center'} justifyContent='center'>
                        <Stack  bgColor={'white'} p={3} borderRadius='md' shadow={'md'} w='50px' h={'50px'} alignItems='center' justifyContent={'center'}>
                            <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/app-builder.svg'  />
                        </Stack>
                        <Stack>
                            <Text color={'black'} fontSize='sm' fontWeight={'bold'}>Powerful app builder</Text>
                        </Stack>
                    </Stack>

                    <Stack alignItems={'center'} justifyContent='center'>
                        <Stack  bgColor={'white'} p={3} borderRadius='md' shadow={'md'} w='50px' h={'50px'} alignItems='center' justifyContent={'center'}>
                            <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/ios-and-android.svg' />
                        </Stack>
                        <Stack>
                            <Text color={'black'} fontSize='sm' fontWeight={'bold'}>IOS, Android, & PWA</Text>
                        </Stack>
                    </Stack>

                    <Stack alignItems={'center'} justifyContent='center'>
                        <Stack  bgColor={'white'} p={3} borderRadius='md' shadow={'md'} w='50px' h={'50px'} alignItems='center' justifyContent={'center'}>
                            <Image src='https://buildfire.com/wp-content/themes/buildfire/assets/images/footer/unlimited-customization.svg'  />
                        </Stack>
                        <Stack>
                            <Text color={'black'} fontSize='sm' fontWeight={'bold'}>Unlimited Costumization</Text>
                        </Stack>
                    </Stack>

                </SimpleGrid>
            </Stack>
        </Stack>
    )
}

export default PricingPage