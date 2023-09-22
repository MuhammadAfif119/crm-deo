import { ArrowRightIcon, DeleteIcon } from "@chakra-ui/icons";
import {
	Badge,
	Box,
	Flex,
	Heading,
	HStack,
	Image,
	Spacer,
	StackDivider,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { convertMilisecond } from "../../Utils/timeUtil";
import { FiCalendar } from "react-icons/fi";
import Modals from "../Modals/Modals";

function BasicCardComponent(props) {
	let data;
	let { update, setUpdate, getData } = props;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [type, setType] = useState(null);


	if (props.data) {
		data = props.data;
	} else {
		data = {
			image: "https://bit.ly/dan-abramov",
			title: "ini title",
			subTitle: [],
			time: 124124124,
			linkTo: "",
			editLink: "",
			deleteLink: "",
		};
	};

	const handleDelete = () => {
		onOpen();
		setType("deleteCourse");
	};


	return (
		<HStack
			maxH="32"
			borderRadius="md"
			p="5"
			m="1"
			width="full"
			bg='white'
			shadow='md'
			_hover={{
				transform: 'scale(1.04)',
				transition: "60ms linear",
			}}
		>
			<Image
				width="100px"
				height="50px"
				objectFit="cover"
				src={data?.thumbnail}
				alt={data?.title}
			/>
			<Box>
				<HStack>
					<Heading fontSize="md">{data?.title}</Heading>
					<Badge fontSize={8} colorScheme="blue">{data?.courseType}</Badge>
				</HStack>
				<HStack divider={<StackDivider />}>
					<Text>{data?.sections?.length} Sections</Text>
					<Text>{data?.lessons?.length} Lessons</Text>
					<HStack>
						<FiCalendar />
						{/* <Text>{convertMilisecond(data?.createdAt)}</Text> */}
						datedatedate
					</HStack>
				</HStack>
			</Box>
			<Spacer />
			<Box onClick={() => handleDelete()} cursor="pointer">
				<DeleteIcon />
			</Box>

			<Link to={`/courses/${data.id}`} state={data}>
				<ArrowRightIcon />
			</Link>
			<Modals
				datas={data}
				isOpen={isOpen}
				onClose={onClose}
				type={type}
				update={update}
				setUpdate={setUpdate}
				getData={getData}
			/>
		</HStack>
	);
}

export default BasicCardComponent;
