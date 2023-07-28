import { Avatar, Badge, Center, chakra, HStack, Stack, Text } from '@chakra-ui/react'
import { Reorder } from 'framer-motion'
import { useState } from 'react'
const List = chakra(Reorder.Group)
const ListItem = chakra(Reorder.Item)
const issues = [
	{
		id: '9',
		author: {
			avatarUrl: 'https://bit.ly/prosper-baba',
			name: 'Prosper Otemuyiwa',
		},
		type: 'Feature',
		title: 'Calculate the net thrust of an engine',
	},
	{
		id: '12',
		author: {
			avatarUrl: 'https://bit.ly/code-beast',
			name: 'Christian Nwamba',
		},
		type: 'Bug',
		title: 'Decide on a type of fule',
	},
	{
		id: '13',
		author: {
			avatarUrl: 'https://bit.ly/kent-c-dodds',
			name: 'Kent C. Dodds',
		},
		type: 'Feature',
		title: 'Construct combustion chamber',
	},
	{
		id: '24',
		author: {
			avatarUrl: 'https://bit.ly/ryan-florence',
			name: 'Ryan Florence',
		},
		type: 'Feature',
		title: 'Design the rocket engine nozzle',
	},
	{
		id: '25',
		author: {
			avatarUrl: 'https://bit.ly/sage-adebayo',
			name: 'Segun Adebayo',
		},
		type: 'Bug',
		title: 'Calculate spefic impulse performance',
	},
]
export const ListDragableComponent = () => {
	const [order, setOrder] = useState(() => issues.map((issue) => issue.id))

	return (
		<Center
			maxW="sm"
			mx="auto"
			py={{
				base: '4',
				md: '8',
			}}
		>
			<Stack spacing="5" flex="1">
				<Stack spacing="1">
					<Text fontSize="lg" fontWeight="medium">
						Sortable list
					</Text>
					<Text color="muted" fontSize="sm">
						Grab a card and move it
					</Text>
				</Stack>
				<List values={order} onReorder={setOrder} listStyleType="none">
					<Stack spacing="3" width="full">
						{order
							.map((item) => issues.find((value) => value.id === item))
							.map((issue) =>
								issue ? (
									<ListItem
										key={issue.id}
										value={issue.id}
										bg="bg-surface"
										p="4"
										boxShadow="sm"
										position="relative"
										borderRadius="lg"
										cursor="grab"
										whileTap={{
											cursor: 'grabbing',
											scale: 1.1,
										}}
									>
										<Stack shouldWrapChildren spacing="4">
											<Text fontSize="sm" fontWeight="medium" color="emphasized">
												{issue.title}
											</Text>
											<HStack justify="space-between">
												<Badge colorScheme={issue.type === 'Feature' ? 'green' : 'red'} size="sm">
													{issue.type}
												</Badge>
												<HStack spacing="3">
													<Text fontSize="xs" color="subtle" fontWeight="medium">
														CHA-{issue.id}
													</Text>
													<Avatar
														src={issue.author.avatarUrl}
														name={issue.author.name}
														boxSize="6"
													/>
												</HStack>
											</HStack>
										</Stack>
									</ListItem>
								) : null,
							)}
					</Stack>
				</List>
			</Stack>
		</Center>
	)
}