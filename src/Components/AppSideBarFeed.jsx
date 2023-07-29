import React, { useEffect, useState, useRef } from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, AvatarBadge, Box, Button, Center, Container, Flex, Heading, HStack, Icon, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Popover, PopoverContent, PopoverTrigger, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorMode, useDisclosure, VStack } from '@chakra-ui/react';
import { AiOutlineCloudUpload, AiOutlineComment } from 'react-icons/ai';
import { MdArrowForwardIos, MdArrowBackIos, MdOutlineAnalytics, MdOutlineCalendarToday, MdStarRate, MdLibraryAdd, MdOutlineDeleteForever, MdOutlineShare } from 'react-icons/md';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/1.png'
import logokotak from '../assets/kotakputih.png'
import { FiRss } from 'react-icons/fi';
import { useContext } from 'react';
import store from 'store'
import { async } from '@firebase/util';
import { createRssFetch } from '../Api/FetchRss';
import { ChevronRightIcon } from '@chakra-ui/icons';

const AppSideBarFeed = () => {

	const width = window.innerWidth
	const height = window.innerHeight
	const navigate = useNavigate()
	const location = useLocation();
	const { colorMode } = useColorMode();
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [urlFeed, setUrlFeed] = useState()

	const data = ['Jokowi', 'gayung', 'auk apa', 'loncat dari gedung lantai 5']


	const sidebarBg = {
		light: 'white',
		dark: 'gray.800',
	};

	const sidebarColor = {
		light: 'gray.900',
		dark: 'white',
	};


	const createRss = async () => {
		try {
			const response = await createRssFetch(urlFeed)
			console.log(response)
		} catch (error) {
			console.log(error)

		}
	}

	useEffect(() => {

		return () => {
		}
	}, [])




	return (
		<>
			<Box
				bg={sidebarBg[colorMode]}
				color={sidebarColor[colorMode]}
				w={'200px'}
				p="5"
				transition="width .3s ease"
				shadow="sm"
				position="fixed"
				overflow="auto"
				borderRightRadius="xl"
				boxShadow="lg"
				h={height}
			>
				{/* <Box>

					<HStack>
						<Icon as={MdStarRate} />
						<Heading fontSize='sm'>Favorites</Heading>
					</HStack>

				</Box> */}

				<Accordion allowMultiple>
					<AccordionItem>
						<h2>
							<AccordionButton>
								<Box as="span" flex='1' textAlign='left' onClick={() => console.log('clicking accordion')}>
									Section 1 title
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							<HStack>
								<Spacer />
								<Icon as={MdOutlineShare} color='blue' />
								<Icon as={MdOutlineDeleteForever} color='red' />
							</HStack>
							{data.map((x) =>
								<HStack>
									<Text noOfLines={1} onClick={() => console.log('clicking xml location')}>{x}</Text>
									<Spacer />
									<ChevronRightIcon />
								</HStack>)}

						</AccordionPanel>
					</AccordionItem>

					<AccordionItem>
						<h2>
							<AccordionButton>
								<Text as="span" flex='1' textAlign='left' onClick={() => console.log('clicking accordion')}>
									Section 2 title
								</Text>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						<AccordionPanel pb={4}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
							tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
							veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
							commodo consequat.
						</AccordionPanel>
					</AccordionItem>

				</Accordion>

				<Center mt='2'>
					<Button onClick={onOpen} colorScheme='blue'>Add New</Button>
				</Center>

			</Box>



			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Tabs>
							<TabList>
								<Tab>Folder</Tab>
								<Tab>URL</Tab>
								<Tab>Topic</Tab>
							</TabList>

							<TabPanels>
								<TabPanel>
									<Input type='text' placeholder='What would you like to name your folder?' onChange={(e) => setUrlFeed(e.target.value)} />
									<Button mt='1' width='full' onClick={() => createRss()}>Add Folder</Button>
								</TabPanel>
								<TabPanel>
									<Input type='text' placeholder='URL here' onChange={(e) => setUrlFeed(e.target.value)} />
									<Button mt='1' width='full' onClick={() => createRss()}>Get Feed</Button>
								</TabPanel>
								<TabPanel>
									<p>three!</p>
								</TabPanel>
							</TabPanels>
						</Tabs>


					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AppSideBarFeed