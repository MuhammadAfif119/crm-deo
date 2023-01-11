import { Box, Button, HStack, Image, Spacer, Stack, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../Routes/hooks/AuthContext'
import logobelanja from '../assets/logoitem.png'
import store from 'store'

function AppHeader() {

	const { currentUser, signOut } = useContext(AuthContext)

	const navigate = useNavigate()

	const handleLogOut = () => {
		signOut()
			.then(() => {
				navigate("/", { replace: true });
				store.clearAll();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
			<HStack bgColor='white'  px={5} py={2} width='full' shadow={''} >
				<Stack alignItems={'center'} justifyContent='center' >
				<Image height='50px' src={logobelanja}  />
				</Stack>
				<Spacer />
				{currentUser?.uid ? (
					<HStack>
						<Button size={'sm'} onClick={() => handleLogOut()} colorScheme='red' variant='outline'>
							Logout
						</Button>
					</HStack>
				) : (
					<HStack>
						<Link to='/login'>
							<Button colorScheme='teal' variant='outline'>
								Login
							</Button>
						</Link>
						<Link to='/signup'>
							<Button colorScheme='teal' variant='solid'>
								Daftar
							</Button>
						</Link>
					</HStack>
				)}
			</HStack>
	)
}

export default AppHeader