import {
	Box,
	Button,
	Heading,
	SimpleGrid,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modals from "../../Components/Modals/Modals";
import BreadCrumbComponent from "../../Components/BreadCrumbs/BreadCrumbComponent";

const CreateCourse = () => {
	const navigate = useNavigate();
	const [datas, setDatas] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const product = [
		{
			icon: "📚",
			title: "Mini Course",
			description: "Sell individual videos, set price for individual course",
		},
		{
			icon: "📖🗂️",
			title: "Full Course",
			description: `Sell courses with multiple Sections, and multiple Lessons per Section`,
		},
		// {
		// 	icon: "📚",
		// 	title: "Drip Course",
		// 	description: "Start a product from scratch",
		// },
		// {
		// 	icon: "📚",
		// 	title: "Membership",
		// 	description: "Start a product from scratch",
		// },
		// {
		// 	icon: "📚",
		// 	title: "Community",
		// 	description: "Start a product from scratch",
		// },
	];

	const handleModal = (x) => {
		onOpen();
		setDatas({
			type: "addCourse",
			title: `Add New ${x.title}`,
			course_type : x.title === 'Full Course' ? "full_course" : "mini_course"
		});
	};

	const data = [
		{ title: "Home", link: "/" },
		{ title: "Courses", link: "/courses" },
		{ title: "Create Course", link: "/courses/create" },
	];

	return (
		<>
			<BreadCrumbComponent data={data} />

			<SimpleGrid columns="3" my="2">
				{product.map((x, i) => (
					<Box
						key={i}
						p="5"
						borderRadius="md"
						shadow="base"
						m="2"
						bg='white'
					>
						<Heading mb={5}>{x.icon}</Heading>
						<Heading fontSize="sm">{x.title}</Heading>
						<Text>{x.description}</Text>
						<Button
							onClick={() => handleModal(x)}
							colorScheme="green"
							mt={10}
						>
							Get Started
						</Button>
					</Box>
				))}
			</SimpleGrid>

			<Modals
				isOpen={isOpen}
				onClose={onClose}
				datas={datas}
				navigate={navigate}
			/>
		</>
	);
};

export default CreateCourse;
