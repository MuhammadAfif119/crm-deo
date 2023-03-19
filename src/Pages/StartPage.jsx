import { Button, Heading, HStack, Image, SimpleGrid, Spacer, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { MdArrowRightAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../Components/AppHeader'

function StartPage() {

    const navigate = useNavigate()

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

    return (
        <>
        <AppHeader/>
        <Stack pt={20} minH={height} bg="url(https://buildfire.com/wp-content/themes/buildfire/assets/images/gsf-hero-sm.jpg) no-repeat center center fixed" bgSize="cover">
            <Stack py={20} px={[null, null, 20]}>
                <Stack alignItems={'center'} justifyContent='center'>
                    <Text fontWeight={'bold'} color='white'>Turn your app idea into reality
                    </Text>
                    <Heading size={'2xl'} textAlign='center' color={'white'}>
                        How would you like your app built?

                    </Heading>
                </Stack>
                <SimpleGrid columns={[1, null, 2]} gap={5} py={10}>
                    <Stack alignItems={'center'} justifyContent='center'>
                        <Stack w={['90%', '70%', '50%']}  bgColor='white' borderRadius={'xl'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} alignItems={'center'} justifyContent='center'>
                            <Stack p={5} w={'80%'}>
                                <Heading color={'black'} size='lg' textAlign={'center'}>I want my app build for me</Heading>
                            </Stack>
                            <Stack w={'80%'} py={5}>
                                <Button bgColor={'blue.500'} size={'lg'} px={12} onClick={() => navigate('/sign-up')}>
                                    <HStack alignItems={'center'} justifyContent='center'>
                                        <Text fontSize={'md'} color='white'>Build it for me</Text>
                                        <MdArrowRightAlt size={30}  color='white'/>
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
                    <Stack alignItems={'center'} justifyContent='center' >
                        <Stack  w={['90%', '70%', '50%']}   bgColor='white' borderRadius={'xl'} _hover={{ transform: "scale(1.1)", shadow: 'xl', }} transition={"0.2s ease-in-out"} alignItems={'center'} justifyContent='center'>
                            <Stack p={5} w={'80%'}>
                                <Heading color={'black'} size='lg' textAlign={'center'}>I want to build it myself</Heading>
                            </Stack>
                            <Stack w={'80%'} py={5}>
                                <Button bgColor={'blue.500'} size={'lg'} px={12} onClick={() => navigate('/sign-up')}>
                                    <HStack alignItems={'center'} justifyContent='center'>
                                        <Text fontSize={'md'} color='white'>Build it myself</Text>
                                        <MdArrowRightAlt size={30}  color='white'/>
                                    </HStack>
                                </Button>
                            </Stack>
                            <Spacer />
                            <Stack bgColor={'gray.100'} p={5} w='100%' borderBottomRadius={'xl'}>
                                <Text textAlign={'center'} color='black' fontWeight={'bold'}>Simple, intuitive app builder. No coding skills required. Unlimited customization

                                </Text>
                            </Stack>
                        </Stack>
                    </Stack>
                </SimpleGrid>
            </Stack>

            <Stack alignItems={'center'} justifyContent='centrer'>
                <Text textAlign={'center'} fontWeight={'bold'} fontSize='lg' color={'white'}>Use the same platform we used to build over 10,000 mobile apps</Text>
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
        </Stack>
        </>
    )
}

export default StartPage