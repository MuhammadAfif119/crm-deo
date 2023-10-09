import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Spacer,
	Stack,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tab,
	Text,
	Container,
	Select,
	InputGroup,
	InputRightElement,
	Progress,
	useToast,
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import {
	FiDelete,
	FiDownload,
	FiFile,
	FiVideo,
	FiVolume2,
} from "react-icons/fi";
import ReactQuill from "react-quill";
import ReactPlayer from "react-player";
import "react-quill/dist/quill.snow.css";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../Config/firebase";
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";
import { acceptStyle, baseStyle, focusedStyle, rejectStyle } from "../../Constants/constants";
import {
	deleteDocumentFirebase,
	deleteFileFirebase,
	getSingleDocumentFirebase,
	updateDocumentFirebase
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import DropboxUploader from "../../Components/DropBox/DropboxUploader";
import { decryptToken } from "../../Utils/encrypToken";
import moment from 'moment';
import axios from 'axios';
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

function EditLesson() {
	const navigate = useNavigate();
	const params = useParams();
	const uid = auth.currentUser.uid;
	const globalState = useUserStore();
	// const { currentProject } = globalState;

	const [lesson, setLesson] = useState(null);
	const [progress, setProgress] = useState(0);
	const [defaultIndex, setDefaultIndex] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [type, setType] = useState("youtube");
	const [course, setCourse] = useState(null);
	const [value, setValue] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const [shareLink, setShareLink] = useState("");
	const [accessTokenDb, setAccessTokenDb] = useState("");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [generatedLink, setGeneratedLink] = useState("");
	const toast = useToast();
	const inputRef = useRef();
	const fileRef = useRef();

	const searchCompanyName = globalState?.companies?.find((x) => x.id === globalState?.currentCompany)
	const companyName = searchCompanyName?.name
	function openModal() {
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
	}

	const uploadFileToDropbox = async (file) => {
		const currentMillis = moment(new Date()).valueOf()
		const fileType = file.type.split('/')[0]; // Mengambil bagian depan sebelum tanda "/"
		const fileTypeFix = fileType === "image" ?
			"image" : fileType === "video" ?
				"video" : fileType === "audio" ?
					"audio" : "file"


		const accessToken = globalState?.accessToken || accessTokenDb
		const url = 'https://content.dropboxapi.com/2/files/upload';

		const headers = {
			'Content-Type': 'application/octet-stream',
			Authorization: `Bearer ${accessToken}`,
			'Dropbox-API-Arg': JSON.stringify({
				path: `courses/lessons/${params?.id_lesson}/${fileTypeFix}/${currentMillis}-${file.name}`, // Menggunakan currentMillis dalam path
				mode: 'add',
				autorename: true,
				mute: false,
			}),
		};


		try {
			const response = await axios.post(url, file, {
				headers: headers,
				onUploadProgress: (progressEvent) => {
					const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setUploadProgress(progress);
				},
			});
			console.log("response", response)

			// if (response?.data?.path_lower) {
			// 	const result = await createShareLink(response.data.path_lower, fileTypeFix, accessToken);
			// 	setLesson({
			// 		...lesson,
			// 		mediaType: type,
			// 		mediaPath: result.path,
			// 		media: result.link,
			// 		mediaTitle: file?.name
			// 	})
			// 	console.log({
			// 		...lesson,
			// 		mediaType: type,
			// 		mediaPath: result.path,
			// 		media: result.link,
			// 		mediaTitle: file?.name
			// 	}, 'uploading video')
			// }


		} catch (error) {
			toast({
				title: 'Oppss!',
				description: `Terjadi kesalahan saat membuat tautan berbagi: ${error.message}`,
				isClosable: true,
				duration: 9000,
				status: "error"
			})
		}
	};

	// const createShareLink = async (filePath, typeFile, token) => {
	// 	const accessToken = token;
	// 	const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

	// 	const headers = {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${accessToken}`,
	// 	};

	// 	const requestData = {
	// 		path: filePath,
	// 	};

	// 	try {
	// 		const response = await axios.post(url, requestData, {
	// 			headers: headers,
	// 		});

	// 		const urlData = response?.data?.url;
	// 		const dataFix = urlData.includes('.mov') || urlData.includes('.MOV')
	// 		const urlRaw = dataFix ? urlData : `${urlData}&raw=1`

	// 		return { link: urlRaw, type: typeFile };
	// 	} catch (error) {
	// 		console.error('Terjadi kesalahan saat membuat tautan berbagi:', error);
	// 		toast({
	// 			title: 'Oppss!',
	// 			description: `Terjadi kesalahan saat membuat tautan berbagi: ${error.message}`,
	// 			isClosable: true,
	// 			duration: 9000,
	// 			status: 'error',
	// 		});
	// 	}
	// };

	const getAccessToken = async () => {
		try {
			const result = await getSingleDocumentFirebase("token", "dropbox");
			const resultData = decryptToken(result?.access_token);
			setAccessTokenDb(resultData);
		} catch (error) {
			console.log(error);
		};
	};

	const handleUploadVideoToStorage = async (file) => {
		// const result = await uploadFileFirebase(file, null, setProgress, null, { type: null })
		// if (result) {
		// 	setLesson({
		// 		...lesson,
		// 		mediaType: type,
		// 		mediaPath: result.path,
		// 		media: result.image_url,
		// 		mediaTitle: file?.name
		// 	})
		// 	console.log({
		// 		...lesson,
		// 		mediaType: type,
		// 		mediaPath: result.path,
		// 		media: result.image_url,
		// 		mediaTitle: file?.name
		// 	}, 'uploading video')
		// }
	};



	//================================================================================================
	//=======================================HANDLES==================================================
	//================================================================================================

	const handleShareLinkChange = (x) => {
		if (x !== "") {
			setShareLink({ link: x?.link, type: x?.type });
			const { link, type } = x;
			let htmlContent = '';

			if (type === 'image') {
				htmlContent = `<p><img src="${link}" alt="Image" width="500px" /></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(link)}</a></p>`;
			} else if (type === 'audio') {
				htmlContent = `<p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src=${link}></iframe></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(link)}</a></p>`;
			} else if (type === 'video') {
				htmlContent = `<p><iframe class="ql-audio" frameborder="0" allowfullscreen="true" src=${link}></iframe></p><br/> <p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(link)}</a></p>`;
			} else {
				htmlContent = `<p>file: <a href=${link} rel="noopener noreferrer" target="_blank">${JSON.stringify(link)}</a></p><br/> `;
			}


			setValue((prevContent) => prevContent + ` ${htmlContent}`);
		}

	};

	const handleSave = () => {
		if (isUploading) { }
		updateDocumentFirebase(`courses/${params.id_course}/lessons`, params.id_lesson, lesson).then(() => {
			navigate(-1)
		}).catch(error => {
			toast({
				title: "error",
				description: error.message,
				isClosable: true,
				status: "error",
				duration: 9000
			})
		})
	};

	const handleDeleteMedia = async () => {
		const confirmToDelete = window.confirm("Are you sure to delete the media? This process cannot be undone");

		if (confirmToDelete) {
			console.log(lesson)
			// const desertRef = ref(storage, lesson?.mediaPath);

			// // // Delete the file
			// deleteObject(desertRef).then(() => {
			// 	// File deleted successfully
			// 	console.log('success deleting from storage')
			// }).then(() => { })x
			// 	.catch(error => console.log(error.message, "error when deleting storage"))

			// //deleting from firestore
			// setDocumentFirebase(
			// 	`courses/${params.id_course}/lessons/`,
			// 	params.id_lesson,
			// 	{
			// 		...lesson,
			// 		media: null,
			// 		mediaPath: '',
			// 		mediaType: '',
			// 		mediaTitle: ''
			// 	},
			// 	currentProject.id)

			// 	.then((res) => {
			// 		console.log(res)

			// 		//deleting from state
			// 		setLesson({
			// 			...lesson,
			// 			media: null,
			// 			mediaPath: '',
			// 			mediaType: '',
			// 			mediaTitle: ''
			// 		})
			// 	}).catch(e => console.log(e.message))
		};
	};

	const getSingleLesson = async () => {
		try {
			const result = await getSingleDocumentFirebase(`courses/${params.id_course}/lessons`, params?.id_lesson);
			setLesson(result);
		} catch (error) {
			console.log('error getting lesson data', error?.message);
		};
	};

	const getCourses = async () => {
		const res = await getSingleDocumentFirebase('courses', `${params.id_course}`)
		setCourse(res);
	};

	const handleDelete = async (type) => {
		if (type === "image") {
			const splitArr = lesson?.thumbnail[0].split("?");
			const secondSplit = splitArr[0].split("%2F");
			deleteFileFirebase(uid, "lessons", secondSplit[2]).then(() => {
				updateDoc(doc(db, `courses/${params.id_course}/lessons`, `${params.id_lesson}`), {
					thumbnail: []
				}).then(() => {

				})
			})

		} else if (type === 'lesson') {
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
				if (result.isConfirmed) {



					let newFind = course?.lessons?.find(item => item?.id === params.id_lesson || item?.title === lesson?.title)
					const splitArr = lesson?.thumbnail && lesson?.thumbnail[0]?.split("?");
					const secondSplit = splitArr && splitArr[0]?.split("%2F");

					if (secondSplit && lesson?.media) {
						handleDeleteMedia()
						deleteFileFirebase(uid, "lessons", secondSplit[2]).then(() => {
							updateDoc(doc(db, `courses/${params.id_course}/lessons`, `${params.id_lesson}`), {
								thumbnail: []
							}).then(() => {
								updateDoc(doc(db, `courses`, `${params.id_course}`), {
									lessons: arrayRemove(newFind)
								}).then(() => {
									deleteDocumentFirebase(`courses/${params.id_course}/lessons`, `${params.id_lesson}`)
									navigate(-1)
								});
							})

							Swal.fire(
								'Deleted!',
								'Your file has been deleted.',
								'success'
							)
						})
					} else if (secondSplit) {
						deleteFileFirebase(uid, "lessons", secondSplit[2]).then(() => {
							updateDoc(doc(db, `courses`, `${params.id_course}`), {
								lessons: arrayRemove(newFind)
							}).then(() => {
								deleteDocumentFirebase(`courses/${params.id_course}/lessons`, `${params.id_lesson}`).then(() => {
									navigate(-1)
								})
							});
						})

					} else if (lesson?.media) {
						handleDeleteMedia().then(() => {
							updateDoc(doc(db, `courses`, `${params.id_course}`), {
								lessons: arrayRemove(newFind)
							}).then(() => {
								deleteDocumentFirebase(`courses/${params.id_course}/lessons`, `${params.id_lesson}`)
								navigate(-1)
							});
						})

					} else {
						updateDoc(doc(db, `courses`, `${params.id_course}`), {
							lessons: arrayRemove(newFind)
						}).then(() => {
							deleteDocumentFirebase(`courses/${params.id_course}/lessons`, `${params.id_lesson}`)
							navigate(-1)
						});
					}
				}
			})

		}
	};

	const handleRadioButton = (checked, value) => {
		if (checked && value === 'draft') {
			setLesson({
				...lesson,
				status: value
			})
		}
	};

	const handleSetDropboxLink = () => {
		setLesson({
			...lesson,
			media: generatedLink
		})
	};


	//================================================================================================
	//=======================================COMPONENTS===============================================
	//================================================================================================
	function MyDropzone() {
		const onDrop = useCallback(async acceptedFiles => {
			// Do something with the files
			await uploadFileToDropbox(acceptedFiles[0])
		}, [])

		const {
			getRootProps,
			getInputProps,
			isFocused,
			isDragAccept,
			isDragReject
		} = useDropzone({ accept: { 'video/*': ['.avi', '.mp4', '.mpeg', '.ogv', '.webm', '.3gp', '.mov', '.mkv'] }, onDrop });

		const style = useMemo(() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {})
		}), [
			isFocused,
			isDragAccept,
			isDragReject
		]);



		return (
			<div className="container">
				<div {...getRootProps({ style })}>
					<input {...getInputProps()} />
					<p>Drag drop you video course here, or click to select files</p>
					{progress !== 0 && progress !== 100 ? <p>progress is {progress?.toFixed(2)}%</p> : <></>}
				</div>
			</div>

		);
	};

	const MediaType = () => (
		<Stack spacing={5}>
			<HStack >
				<Text fontWeight={500}>File</Text>
				<Spacer />
				<Button onClick={openModal} colorScheme={'green'} variant='outline'>Upload File Here</Button>
			</HStack>
			<Stack>
				<Text fontWeight="bold" fontSize={12}>Please Note! Accepted file types are : </Text>
				<Text color="red" fontWeight="bold" fontSize={12}>'.avi', '.mp4', '.mpeg', '.ogv', '.webm', '.3gp', '.mov', '.mkv', '.audio'</Text>
			</Stack>
			<Tabs isFitted variant="soft-rounded" defaultIndex={defaultIndex} onChange={index => setDefaultIndex(index)}>
				<TabList>
					<Tab>
						<HStack>
							<FiVideo />
							<Text>Video</Text>
						</HStack>
					</Tab>
					<Tab>
						<HStack>
							<FiVolume2 />
							<Text>Audio</Text>
						</HStack>

					</Tab>
					<Tab>
						<HStack>
							<FiFile />
							<Text>File</Text>
						</HStack>

					</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<Container
							borderRadius="md"
							p="5"
						>

							<InputGroup size="md">
								<Input
									shadow='sm'
									bg='white' placeholder="Input link (e.g. youtube, dropbox, etc.)"
									onChange={e => {
										fileRef.current = e.target.value
									}} />
								<InputRightElement w="fit-content">
									<Button onClick={() => setLesson({
										...lesson,
										media: fileRef.current,
										sourceType: 'video',
									})}>Submit</Button>
								</InputRightElement>
							</InputGroup>

						</Container>
					</TabPanel>
					<TabPanel>
						<Container
							borderRadius="md"
							p="5"
							border="1px"
							borderColor="gray"
							borderStyle="dotted"
						>
							<InputGroup size="md">
								<Input
									shadow='sm'
									bg='white' placeholder="Input link (e.g. youtube, dropbox, etc.)"
									onChange={e => {
										fileRef.current = e.target.value
									}} />
								<InputRightElement w="fit-content">
									<Button onClick={() => setLesson({
										...lesson,
										media: fileRef.current,
										sourceType: 'audio',
									})}>Submit</Button>
								</InputRightElement>
							</InputGroup>

						</Container>
					</TabPanel>

					<TabPanel>
						<Container
							borderRadius="md"
							p="5"
							border="1px"
							borderColor="gray"
							borderStyle="dotted"
						>
							<InputGroup size="md">
								<Input
									shadow='sm'
									bg='white' placeholder="Input link (e.g. youtube, dropbox, etc.)"
									onChange={e => {
										fileRef.current = e.target.value
									}} />
								<InputRightElement w="fit-content">
									<Button onClick={() => setLesson({
										...lesson,
										media: fileRef.current,
										sourceType: 'file',
									})}>Submit</Button>
								</InputRightElement>
							</InputGroup>

						</Container>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Stack>
	);

	useEffect(() => {
		getCourses();
		getSingleLesson();
		getAccessToken();
	}, []);

	useEffect(() => {
		handleSetDropboxLink();
	}, [generatedLink]);


	return (
		<>
			<Box>
				<HStack>
					<HStack
						color="#2c698d"
						fontSize="14px"
						onClick={() => navigate(-1)}
						cursor='pointer'
					>
						<ChevronLeftIcon />
						<Text>Back</Text>
					</HStack>
					<Heading>
						{lesson?.title ? lesson.title : <></>}
					</Heading>
					<Spacer />
					<Button
						colorScheme="red"
						onClick={() => handleDelete('lesson')}
					>
						Delete
					</Button>
					<Button colorScheme="green" onClick={handleSave}>Save</Button>
				</HStack>
				<Flex mt={10}>
					<Box width="70%" bg="white">
						<Box borderRadius="md" shadow="base" p="2" m="1">
							<Text fontWeight="bold" m="1">Lesson Title :</Text>
							<Input
								shadow='sm'
								bg='white'
								type="text"
								onChange={(e) =>
									setLesson({
										...lesson,
										title: e.target.value,
									})
								}
								value={lesson?.title}
							/>

							<Text fontWeight="bold" m="1">Section :</Text>
							<Select
								bg='white'
								onChange={(e) =>
									setLesson({
										...lesson,
										section: e.target.value,
									})
								}
							>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</Select>

							<Text fontWeight="bold" m="1">Media :</Text>
							<Box
								p="5"
								border="1px"
								borderColor="gray"
								borderStyle="dotted">
								{lesson?.media ? (
									lesson?.sourceType === "file" ? (
										<Stack>
											<iframe src={lesson.media} title="File Preview" width="auto" height="200"></iframe>
											<Button my={5} colorScheme='red' onClick={handleDeleteMedia}>Delete Media</Button>
										</Stack>
									) : (
										<Stack>
											<ReactPlayer
												width="full"
												controls={true}
												url={lesson?.media}
											/>
											<Button my={5} colorScheme='red' onClick={handleDeleteMedia}>Delete Media</Button>
										</Stack>
									)


								) : (
									<MediaType />
								)}
							</Box>
							<Progress value={progress} />

							<Box
								borderRadius="md"
								p="2"
							// mr="2"
							// ml="2"
							>
								<Heading size='sm'>Description :</Heading>

								{lesson?.description ?
									<>
										{parse(lesson?.description ? lesson?.description : null)}
									</> : null}

								<ReactQuill
									ref={inputRef}
									theme="snow"
									style={{
										backgroundColor: 'white',
										boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.11), 0 3px 10px 0 rgba(0, 0, 0, 0.1)",
									}}
									onChange={e => setLesson({
										...lesson,
										description: e
									})}
								/>
							</Box>

							{/* <HStack m="2">
								<Text>Files</Text>
								<Spacer />
								<Button size="xs" colorScheme="green">
									Add Files
								</Button>
							</HStack> */}
							<Box
								borderRadius="md"
								border="1px"
								borderColor="gray.50"
								pl="2"
								pr="2"
								mr="2"
								ml="2"
							>
								{lesson?.download ? (
									<Box
										borderBottom="1px"
										borderColor="gray.50"
									>
										<HStack>
											<Text>
												{/* {getFileName(
													data.download
												)} */}
											</Text>
											<Spacer />
											<a
												href={
													lesson.download
												}
												download
												target="_blank"
												rel="noreferrer"
											>
												<FiDownload />
											</a>
											<FiDelete />
										</HStack>
									</Box>
								) : (
									<Box
										borderBottom="1px"
										borderColor="gray.50"
									></Box>
								)}
							</Box>
						</Box>
					</Box>

					<Box width="30%">
						<Box borderRadius="md" shadow="base" p="2" m="1" bg="white">
							<Heading fontSize="md">Status</Heading>
							<RadioGroup>
								<Stack direction="column">
									<RadioGroup
										onChange={(e) =>
											setLesson({
												...lesson,
												status: e,
											})
										}
									>
										<Stack>
											<Radio checked={lesson?.status === 'draft'} value="draft" onChange={e => handleRadioButton(e.target.checked, e.target.value)}>
												Draft
											</Radio>
											<Radio checked={lesson?.status === 'published'} value="published" onChange={e => handleRadioButton(e.target.checked, e.target.value)}>
												Published
											</Radio>
										</Stack>
									</RadioGroup>
								</Stack>
							</RadioGroup>
						</Box>

						{/* <Box borderRadius="md" shadow="base" p="2" m="1">
							<Heading fontSize="md">Thumbnail</Heading>
							<HStack>

								{lesson?.thumbnail?.length > 0 ? (
									<>
										<Image
											width="100px"
											height="50px"
											objectFit="cover"
											src={lesson?.thumbnail[0] || lesson?.thumbnail}
											alt={lesson?.title}
										/>
										<Button
											colorScheme="red"
											onClick={() =>
												handleDelete(
													"image"
												)
											}
										>
											Delete
										</Button>
									</>
								) : (
									<Input
										shadow='sm'
										bg='white'
										type="file"
										variant="ghost"
										onChange={(e) =>
											handleUploadThumbnail(
												e.target.files[0]
											)
										}
									/>
								)}
							</HStack>
						</Box> */}

						{/* <Box borderRadius="md" shadow="base" p="2" m="1">
							<Heading fontSize="md">Comment</Heading>
							<RadioGroup>
								<Stack direction="column">
									<RadioGroup
										onChange={(e) =>
											setLesson({
												...lesson,
												comment: e,
											})
										}
									>
										<Stack>
											<Radio value="visible">
												visible
											</Radio>
											<Radio value="hidden">
												hidden
											</Radio>
										</Stack>
									</RadioGroup>
								</Stack>
							</RadioGroup>
						</Box> */}
					</Box>
				</Flex>


				<DropboxUploader
					isActive={isModalOpen}
					onClose={closeModal}
					parentPath={`/${companyName}/lesson/${params.id_course}/${moment().format()}`}
					shareLink={shareLink} setShareLink={handleShareLinkChange}
					setGeneratedLink={setGeneratedLink}
				/>

			</Box>
		</>
	);
}
export default EditLesson;
