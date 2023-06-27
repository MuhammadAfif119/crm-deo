import { Box, Container, Heading, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { FiUser } from 'react-icons/fi'
import BreadCrumbComponent from '../../Components/BreadCrumbs/BreadCrumbComponent'
import IconCardComponent from '../../Components/Cards/IconCardComponent'

function SettingsPage() {

	const data = [
		{ icon: FiUser, title: 'Account', link: 'account', description: 'Update your acccount' },
		{ icon: FiUser, title: 'Account', link: 'account', description: 'Update your acccount' },
		{ icon: FiUser, title: 'Account', link: 'account', description: 'Update your acccount' },
		{ icon: FiUser, title: 'Account', link: 'account', description: 'Update your acccount' },
		{ icon: FiUser, title: 'Account', link: 'account', description: 'Update your acccount' }
	]

	return (
		<Container>
			<Heading>Setting</Heading>
			<BreadCrumbComponent data={[{ title: 'Setting', link: '/setting' }]} />
			<SimpleGrid columns='3'>
				{data.map((x, i) => <IconCardComponent key={i} data={x} />)}
			</SimpleGrid>
		</Container>
	)
}

export default SettingsPage