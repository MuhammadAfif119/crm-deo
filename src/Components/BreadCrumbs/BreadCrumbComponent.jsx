import React from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'


function BreadCrumbComponent(props) {
	let data = []
	if (props.data)
		data = props.data
	else
		data = [
			{ title: 'Home', link: '/' },
			{ title: 'About', link: '/about' },
			{ title: 'Product', link: '/product' },
		]


	return (
		<Breadcrumb fontWeight='medium' fontSize='sm'>
			{data.map((x, i) =>
				<BreadcrumbItem key={i}>
					<Link to={x.link}>
						{x.title}
					</Link>
				</BreadcrumbItem>
			)}
		</Breadcrumb>)
}

export default BreadCrumbComponent