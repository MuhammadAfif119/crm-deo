import { Badge, Box, Center, Icon, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { IoAppsOutline, IoCartOutline, IoHeartOutline, IoHomeOutline, IoPersonOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import logobelanja from '../assets/logokotak.png'
import AuthContext from '../Routes/hooks/AuthContext';

function AppFooter() {

	const { cart, productListWishlist } = useContext(AuthContext)

	return (
		<Box mt='5' bgColor='brand.100' shadow='lg' position='sticky' bottom={0} p='2'>
			<SimpleGrid columns={5} textAlign='center' fontSize='sm'>
				<Box>
					<Link to='/'>
						<Icon as={IoHomeOutline} boxSize='7' />
						<Text fontSize={'xs'} fontWeight='bold' >Home</Text>
					</Link>
				</Box>
				<Box>
					<Link to='/favorite'>
						<Icon as={IoHeartOutline} boxSize='7' />
						<Badge bgColor='red' color='white' mt='-10' ml='-2' borderRadius='full'>{productListWishlist?.data?.length}</Badge>
						<Text  fontSize={'xs'} fontWeight='bold' >Favorite</Text>
					</Link>
				</Box>
				<Center>
					<Link to='/product'>
						<Stack width='20' alignItems={'center'} justifyContent='center' spacing={0} color='white' height='20' p='2' borderRadius='full' mt='-9' bgColor='black' shadow='2xl'>
							<Image height='50px' src={logobelanja}  />
						</Stack>
					</Link>
				</Center>
				<Box>
					<Link to='/cart'>
						<Icon as={IoCartOutline} boxSize='7' />
						<Badge bgColor='red' color='white' mt='-10' ml='-2' borderRadius='full'>{cart?.data?.length}</Badge>
						<Text  fontSize={'xs'} fontWeight='bold' >Cart</Text>
					</Link>
				</Box>
				<Box>
					<Link to='/profile'>

						<Icon as={IoPersonOutline} boxSize='7' />
						<Text  fontSize={'xs'} fontWeight='bold' >Profile</Text>
					</Link>
				</Box>
			</SimpleGrid>
		</Box>
	)
}

export default AppFooter