import { Box, Center, Stack, Text } from '@chakra-ui/react'
import moment from 'moment'
import React from 'react'

function SingleCalendarComponent(props) {
	const lastWeek = moment().subtract(7, 'days').unix()
	const nextWeek = moment().add(7, 'days').unix()


	let fontColor = ''
	let color = ''

	if (props.data < lastWeek) {
		fontColor = 'white'
		color = 'red'
	}
	else if (props.data > nextWeek) {
		fontColor = 'white'
		color = 'green'
	}
	else {
		fontColor = 'black'
		color = 'yellow'
	}

	return (
		<Box bgColor={color} borderRadius='md' p='1' fontSize='2xs' m='1' shadow='base'>
			<Stack bgColor='white' alignSelf='center' borderRadius='md' border='1px' p={1}>
				<Text textAlign='center'>{props.date}</Text>
			</Stack>
			<Text textAlign={'center'} color={fontColor}>{props.month}</Text>
		</Box>
	)
}

export default SingleCalendarComponent