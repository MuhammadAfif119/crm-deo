import { Box, Container, HStack, Heading, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { FcManager, FcLock } from 'react-icons/fc'
import BreadCrumbComponent from '../../Components/BreadCrumbs/BreadCrumbComponent'
import IconCardComponent from '../../Components/Cards/IconCardComponent'
import { Link } from 'react-router-dom'

function SettingsPage() {

	const data = [
		{ icon: FcManager, title: 'Account', link: 'account', description: 'Update your acccount' },
		{ icon: FcLock, title: 'Password', link: 'change-password', description: 'Change your password' },

	]

	return (
		<Box>
			<Heading>Setting</Heading>
			<Box my='3'>
				<BreadCrumbComponent data={[{ title: 'Setting', link: '/setting' }]} />
			</Box>
			<SimpleGrid columns='4' gap='5'>

				{data.map((x, i) => <Stack
					key={i}
					_hover={{
						transform: 'scale(1.05)',
						shadow: 'xl',
					}}
					transition="0.2s ease-in-out"
					spacing={2}
					borderTopWidth={3}
					borderColor="green.500"
					bgColor="#2B2B2B"
					py={4}
					px={2}
					borderRadius="md"
					shadow="md"
				>
					<Link to={`${x.link}`}>
						<HStack spacing={2}>
							<Stack p={5}>

								<Icon
									as={x.icon}
									boxSize={12}
								/>

							</Stack>
							<Box>
								<Text textTransform="capitalize" fontSize={'xl'} fontWeight={500}>
									{x.title}
								</Text>
								<Text fontSize="md">{x.description}</Text>
							</Box>
						</HStack>
					</Link>


				</Stack>)}
			</SimpleGrid>
		</Box>
	)
}

export default SettingsPage