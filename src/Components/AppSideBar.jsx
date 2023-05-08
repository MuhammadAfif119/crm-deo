import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarBadge, Box, Button, Divider, Flex, HStack, Icon, IconButton, Image, Popover, PopoverContent, PopoverTrigger, Spacer, Stack, Text, useColorMode, useDisclosure, VStack } from '@chakra-ui/react';
import { MdArrowForwardIos, MdArrowBackIos, MdOutlineAnalytics, MdOutlineCalendarToday, MdRssFeed } from 'react-icons/md';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/1.png'
import logokotak from '../assets/kotakputih.png'
import { IoMdAnalytics } from 'react-icons/io';
import { useContext } from 'react';
import AuthContext from '../Routes/hooks/AuthContext';
import store from 'store'
import { FaCalendarAlt, FaCommentDots, FaShareAlt, FaTelegramPlane } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Config/firebase';
import { BsFillPersonFill } from 'react-icons/bs';

const AppSideBar = ({ setBarStatus }) => {

	const width = window.innerWidth
	const height = window.innerHeight

	// const [barStatus, setBarStatus] = useState(false)

	const navigate = useNavigate()

	const [userStorage, setUserStorage] = useState({})

	const { currentUser, signOut } = useContext(AuthContext)
	const [openAvatar, setOpenAvatar] = useState(false)

	const firstFieldRef = React.useRef(null)

	const getDataUserStorage = async () => {
		const res = await store.get("userData");
		setUserStorage(res)

	}

	const [socialAccountList, setSocialAccountList] = useState([])
	const [activeKey, setActiveKey] = useState("")
	const [activeTitle, setActiveTitle] = useState("")

	let [searchParams, setSearchParams] = useSearchParams();



	const getDataUser = async () => {
		try {
			const docRef = doc(db, "users", currentUser.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setSocialAccountList(docSnap.data().ayrshare_account);
				setActiveKey(docSnap?.data()?.ayrshare_account[0].profileKey)
				setActiveTitle(docSnap?.data()?.ayrshare_account[0].title)
				setSearchParams(`detail=${docSnap?.data()?.ayrshare_account[0].profileKey}&name=${docSnap?.data()?.ayrshare_account[0].title}`)
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.log(error, 'ini error')
		}

	}



	useEffect(() => {
		getDataUser()

		return () => {
		}
	}, [currentUser])

	const location = useLocation();

	useEffect(() => {
		if (location.pathname !== "/my-feed"){
			if (socialAccountList) {
				setSearchParams(`detail=${activeKey}&name=${activeTitle}`)

			}
	
		}
	return () => {
	}
}, [location.pathname, socialAccountList])





const { isOpen, onToggle } = useDisclosure();
const { colorMode } = useColorMode();

const handleBar = () => {
	setBarStatus(isOpen)
}

useEffect(() => {
	handleBar()
	getDataUserStorage()

	return () => {
	}
}, [isOpen])

const handleLogout = () => {
	signOut()
		.then(() => {
			navigate("/", { replace: true });
			store.clearAll();
		})
		.catch((error) => {
			console.log(error);
		});
}

const handleActiveParams = (key, title) => {
	setActiveKey(key)
	setActiveTitle(title)
	setSearchParams(`detail=${activeKey}&name=${activeTitle}`)
}




const sidebarBg = {
	light: 'white',
	dark: 'gray.800',
};

const sidebarColor = {
	light: 'gray.900',
	dark: 'white',
};

const sidebarHoverColor = {
	light: 'blue.600',
	dark: 'blue.200',
};


return (
	<Box
		bg={sidebarBg[colorMode]}
		color={sidebarColor[colorMode]}
		w={isOpen ? '240px' : '80px'}
		pt="5"
		pb="4"
		transition="width .3s ease"
		shadow="sm"
		position="fixed"
		// overflow="auto"
		// borderRightRadius="xl"
		boxShadow="lg"
		h={height}
	>
		<Flex align="center" justify="center" px="4" mb="8" >
			<Flex align="center">
				<IconButton
					aria-label="Toggle Navigation"
					icon={<Image w={isOpen ? '150px' : null} src={isOpen ? logo : logokotak} />}
					bg="transparent"
					_hover={{ bg: 'transparent' }}
					_focus={{ outline: 'none' }}
					transition={"0.2s ease-in-out"}
				/>
			</Flex>
		</Flex>

		<VStack spacing="5" px="4" alignItems={'flex-start'} minH={'90%'}  >
			<NavButton
				icon={MdRssFeed}
				label="My Feeds"
				hoverColor={sidebarHoverColor[colorMode]}
				onClick={() => navigate(`/my-feed`)}
				isOpen={isOpen}
			/>


			<NavButton
				icon={FaTelegramPlane}
				label="Posts"
				hoverColor={sidebarHoverColor[colorMode]}
				onClick={() => navigate(`/`)}
				isOpen={isOpen}
				transition={"0.2s ease-in-out"}
			/>

			<NavButton
				icon={FaCalendarAlt}
				label="Calendar"
				hoverColor={sidebarHoverColor[colorMode]}
				onClick={() => navigate(`/calendar`)}
				isOpen={isOpen}
			/>

			<NavButton
				icon={FaCommentDots}
				label="Comments"
				hoverColor={sidebarHoverColor[colorMode]}
				onClick={() => navigate(`/comments`)}
				isOpen={isOpen}
			/>

			<NavButton
				icon={IoMdAnalytics}
				label="Reports"
				hoverColor={sidebarHoverColor[colorMode]}
				onClick={() => navigate(`/reports`)}
				isOpen={isOpen}
			/>
			<NavButton
				icon={FaShareAlt}
				label="Social Accounts"
				hoverColor={sidebarHoverColor[colorMode]}
				onClick={() => navigate(`/social-account`)}
				isOpen={isOpen}
			/>



			<Spacer />

			<Stack w={'100%'} zIndex={100}>
				{currentUser ? (
					<>
						<Popover
							isOpen={openAvatar}
							initialFocusRef={firstFieldRef}
							onOpen={() => setOpenAvatar(true)}
							onClose={() => setOpenAvatar(false)}
							placement='right'
							closeOnBlur={false}
						>
							<PopoverTrigger >
								<Stack
									cursor={'pointer'}

								>
									<Avatar size={'sm'} src={''} alt={''}>
										<AvatarBadge boxSize='1.25em' bg='green.500' />
									</Avatar>
								</Stack>
							</PopoverTrigger>
							<PopoverContent p={5} bottom={5}
							>
								<Stack spacing={3}>
									<HStack >
										<Stack spacing={0} transition={"0.2s ease-in-out"}>
											<Text fontSize={'sm'} color='gray.700' fontWeight={'bold'} noOfLines={1}>{currentUser?.displayName}</Text>
											<Text fontSize={'xs'} color='gray.700' textTransform={'capitalize'}>{userStorage?.subscription}</Text>
										</Stack>



										<Spacer />
										<Button size={'sm'} bgColor={'red.600'} onClick={() => handleLogout()}>
											<Text fontSize={'xs'} color='twitter.100'>Logout</Text>
										</Button>
									</HStack>

									<Divider />

									<VStack spacing="2" alignItems={'flex-start'} >

										<Stack>
											<Text fontSize={'xs'} fontWeight='bold'>Social Account</Text>
										</Stack>

										{socialAccountList?.length > 0 && (
											socialAccountList?.map((x, index) => {
												return (
													<Stack justifyContent={'center'} p={2} key={index} borderWidth={2} borderColor={searchParams.get("detail") === x.profileKey ? "blue.300" : 'transparent'} borderRadius={'xl'} w='100%'>
														<HStack
															cursor={'pointer'}
															onClick={() => handleActiveParams(x.profileKey, x.title)}
														>
															<BsFillPersonFill />
															<Text fontSize={'xs'}>{x.title}</Text>
														</HStack>
													</Stack>
												)
											})
										)}


									</VStack>
								</Stack>

							</PopoverContent>
						</Popover>

					</>
				) : (
					<Button size={'sm'} bgColor={'blue.600'} onClick={() => navigate('/login')}>
						<Text fontSize={'xs'} color='twitter.100'>Login</Text>
					</Button>
				)}


			</Stack>


		</VStack>
	</Box>
);
};

const NavButton = ({ icon, label, hoverColor, onClick, isOpen }) => {
	const [isHover, setIsHover] = useState(false);

	const toggleHover = () => {
		setIsHover(!isHover);
	};

	return (
		<Flex
			align="center"
			p="3"
			borderRadius="md"
			cursor="pointer"
			_hover={{ bg: hoverColor, color: 'white' }}
			bg={isHover ? hoverColor : 'transparent'}
			color={isHover ? 'white' : null}
			onClick={onClick}
			onMouseEnter={toggleHover}
			onMouseLeave={toggleHover}

		>
			<Icon as={icon} fontSize='xl' />
			{isOpen && (
				<Text ml="4" fontSize="sm" fontWeight="medium">
					{label}
				</Text>
			)}
		</Flex>
	);
};

export default AppSideBar