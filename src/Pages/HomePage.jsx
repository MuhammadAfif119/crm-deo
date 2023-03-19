import { Button, Heading, HStack, Image, SimpleGrid, Skeleton, Spacer, Stack, Tag, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import AppCarosel from '../Components/AppCarosel'
import { AiFillStar } from 'react-icons/ai'
import { formatFrice } from '../Utils/Helper'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../Routes/hooks/AuthContext'
import colors from '../Utils/colors'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { SlArrowRight } from 'react-icons/sl'
import { db } from '../Config/firebase'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { BsShieldFillCheck } from 'react-icons/bs'
import { MdArrowRightAlt } from 'react-icons/md'
import ImageSlide from '../Components/AppImageSlide'


function HomePage() {

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

	const dataMobile = [
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone.jpg'
		},
		{
			head: 'Business Workflow Apps',
			text: 'Automate business processes and make your team more efficient.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone2.jpg'
		},
		{
			head: 'Employee Communication Apps',
			text: 'Immediately improve engagement and compliance with capabilities only available in a mobile app.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone3.jpg'
		},
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone4.jpg'
		},
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone5.jpg'
		},
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone6.jpg'
		},
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone7.jpg'
		},
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone8.jpg'
		},
		{
			head: 'Fully Custom Mobile Apps',
			text: 'Full cycle product development bringing innovative ideas to life.',
			image: 'https://buildfire.com/wp-content/themes/buildfire/assets/images/phone9.jpg'
		},

	]

	const height = window.innerHeight
	const width = window.innerWidth







	return (
		<Stack bgColor={colors.black} >
			<Stack pt={20} h='full' >
				<SimpleGrid columns={[1, null, 2]} px={['10', null, '20']} >
					<Stack alignItems={'center'} justifyContent='center'>
						<Stack w={['100%', null, '80%']} spacing={5}>
							<Heading fontWeight='bold' size={'3xl'} textAlign='start' color={'white'}>The Most Powerful App Maker For iOS & Android</Heading>
							<Text fontSize={'sm'} color={'white'}>BuildFire’s powerful and easy to use mobile app builder makes it so you can create mobile apps for iOS & Android in a fraction of the time and cost.</Text>

							<Stack>
								<HStack alignItems={'center'} color={'white'}>
									<BsShieldFillCheck />
									<Text fontSize={'sm'} >Simple and intuitive app builder - No coding required</Text>
								</HStack>

								<HStack alignItems={'center'} color={'white'}>
									<BsShieldFillCheck />
									<Text fontSize={'sm'} >Build custom functionality with our developer SDK</Text>
								</HStack>

								<HStack alignItems={'center'} color={'white'}>
									<BsShieldFillCheck />
									<Text fontSize={'sm'} >Build for FREE for 14 days. No credit card required</Text>
								</HStack>
							</Stack>

							<HStack spacing={5}>
								<Button bgColor={'blue.500'} size={'lg'} px={12}  onClick={() => navigate('get-started')}>
									<HStack alignItems={'center'} justifyContent='center'>
										<Text fontSize={'md'} color='white'>Get Started</Text>
										<MdArrowRightAlt color='white' size={30} />
									</HStack>
								</Button>

								<Button size={'lg'} px={12} borderColor='white' bgColor={'transparent'} borderWidth={0.5}>
									<HStack alignItems={'center'} justifyContent='center'>
										<Text fontSize={'md'} color='white'>Get a free consultation</Text>
									</HStack>
								</Button>
								{/* <Button></Button> */}
							</HStack>
						</Stack>	
					</Stack>
					<Stack >
						<Stack alignItems={'center'} justifyContent='center' maxH={height / 1.2}>
							<ImageSlide />
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


			<Stack bgColor={'gray.100'} >
				<Stack p={[5, null, 20]}>

					<Stack >
						<Heading color={'black'} textAlign='center' >
							Mobile App Development Tailored For Your Unique Business Goals
						</Heading>
					</Stack>
					<Stack>
						<SimpleGrid columns={[1, null, 3]} gap={8} p={5}>
							{dataMobile.length > 0 && dataMobile.map((x, index) => {
								return (
									<Stack key={index} bgColor='white' px={5} pt={5} borderTopWidth={5} borderColor='blue.400' borderRadius={'md'} shadow={'lg'} >
										<Stack>
											<Text color={'black'} fontSize='lg'>
												{x.head}
											</Text>

											<Text color={'gray.400'} fontSize='sm'>{x.text}</Text>
										</Stack>
										<Spacer/>
										<Image src={x.image} alt={x.image} />
									</Stack>
								)
							})}
						</SimpleGrid>
					</Stack>
					<Stack justifyContent={'center'} alignItems='center'>
						<Button px={12} py={5} size='xl' bgColor={'green.400'}>
							<Text fontSize={'md'} color='white' onClick={() => navigate('/get-started')}>Get Started</Text>
						</Button>
					</Stack>
				</Stack>
			</Stack>


		</Stack>
	)
}

export default HomePage