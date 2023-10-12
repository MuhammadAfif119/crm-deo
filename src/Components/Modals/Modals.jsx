import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  HStack,
  Spinner,
  Text,
  useToast,
  Stack,
  Center,
} from "@chakra-ui/react";
// import { UploadBlob } from "../../Utils/Upload";
import { useParams } from "react-router-dom";
import {
  addDocumentFirebase,
  deleteDocumentFirebase,
  updateDocumentFirebase,
  arrayUnionFirebase,
  getSingleDocumentFirebase,
  uploadFile,
  deleteFileFirebase,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import moment from "moment";
import { decryptToken } from "../../Utils/encrypToken";
import axios from "axios";

const Modals = (props) => {
  const { isOpen, onClose, datas, navigate, update, setUpdate, type, getData } =
    props;
  const [price, setPrice] = useState("free");
  const [input, setInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [accessTokenDb, setAccessTokenDb] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [filesImage, setFilesImage] = useState();
  const toast = useToast();
  const params = useParams();
  const globalState = useUserStore();
  const [thumbnailChange, setThumbnailChange] = useState();
  const { currentProject, currentCompany } = globalState;

  console.log(datas, "ini type");
  const handleSave = async () => {
    setLoading(true);
    let inputData = {
      ...input,
      price: price,
      projectsId: currentProject || null,
      projectId: currentProject || null,
      createdAt: new Date(),
      courseType: datas?.course_type,
    };

    if (datas?.type === "addCourse") {
      try {
        if (filesImage[0]) {
          const resImage = await uploadFile(
            `${input?.title}-${moment(new Date()).valueOf()}`,
            "course",
            filesImage[0]
          );
          inputData.thumbnail = resImage;
        }

        console.log(inputData);

        const id = await addDocumentFirebase(
          "courses",
          inputData,
          currentCompany
        );

        navigate(`/courses/${id}`);
      } catch (error) {
        console.log(error.message, "error while adding course");
      } finally {
        setLoading(false);
      }
    } else if (datas?.type === "section") {
      try {
        await arrayUnionFirebase("courses", datas?.id, "sections", [
          { title: input.title },
        ]);
        setUpdate(!update);
        onClose();
      } catch (error) {
        console.log(error.message, "error when adding section---array union");
      } finally {
        setLoading(false);
      }
    } else if (datas?.type === "lesson") {
      try {
        const res = await addDocumentFirebase(
          `courses/${datas?.id}/lessons`,
          {
            title: input.title,
            section: datas?.course,
          },
          currentCompany
        );
        arrayUnionFirebase("courses", datas?.id, "lessons", [
          {
            title: input.title,
            section: datas?.course,
            id: res,
          },
        ])
          .then(() => {})
          .catch((error) => {
            console.log(error.message, "error when array union lessons");
          });

        setUpdate(!update);
        onClose();
      } catch (error) {
        console.log(error.message, "error when adding lesson");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (type) => {
    if (type === "deleteCourse") {
      setLoading(true);

      try {
        await deleteDocumentFirebase("courses", datas?.id);
        setUpdate(!update);
        onClose();
      } catch (error) {
        toast({
          title: "Error deleting course",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: 9000,
        });
      } finally {
        getData();
        setLoading();
      }
    } else if (type === "deleteLesson") {
      setLoading(true);

      const updatedLessonArray = datas?.course?.lessons?.filter(
        (obj) => obj.id !== datas?.lesson?.id
      );

      try {
        updateDocumentFirebase("courses", params.id_course, {
          lessons: updatedLessonArray,
        })
          .then(() => {})
          .catch((error) => {
            console.log(error.message, "---error when deleting lesson");
          });
        await deleteDocumentFirebase(
          `courses/${params.id_course}/lessons`,
          datas?.lesson?.id
        );
        setUpdate(!update);
        onClose();
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error deleting lesson",
          description: error.message,
          status: "error",
          isClosable: true,
          duration: 9000,
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log(type);
    }
  };

  const handleClose = () => {
    onClose();
    setLoading(false);
  };

  const uploadFileToDropbox = async (file) => {
    const result = await getSingleDocumentFirebase("token", "dropbox");
    const resultData = decryptToken(result?.access_token);
    globalState.setAccessToken(resultData);

    console.log(result, "ini token");

    const currentMillis = moment(new Date()).valueOf();
    const fileType = file.type.split("/")[0]; // Mengambil bagian depan sebelum tanda "/"
    const fileTypeFix =
      fileType === "image"
        ? "image"
        : fileType === "video"
        ? "video"
        : fileType === "audio"
        ? "audio"
        : "file";

    const accessToken = resultData;
    const url = "https://content.dropboxapi.com/2/files/upload";

    const headers = {
      "Content-Type": "application/octet-stream",
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: `x/${fileTypeFix}/${currentMillis}-${file.name}`, // Menggunakan currentMillis dalam path
        mode: "add",
        autorename: true,
        mute: false,
      }),
    };

    console.log(headers, "ini header");

    try {
      const response = await axios.post(url, file, {
        headers: headers,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      if (response?.data?.path_lower) {
        const resultLink = await createShareLink(
          response.data.path_lower,
          fileTypeFix,
          accessToken
        );
        console.log("resultLink", resultLink);
      }
    } catch (error) {
      toast({
        title: "Oppss!",
        description: `Terjadi kesalahan saat membuat tautan berbagi: ${error.message}`,
        isClosable: true,
        duration: 9000,
        status: "error",
      });
    }
  };

  const createShareLink = async (filePath, typeFile, token) => {
    const accessToken = token;
    const url =
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const requestData = {
      path: filePath,
    };

    try {
      const response = await axios.post(url, requestData, {
        headers: headers,
      });

      const urlData = response?.data?.url;
      const dataFix = urlData.includes(".mov") || urlData.includes(".MOV");
      const urlRaw = dataFix ? urlData : `${urlData}&raw=1`;

      return { link: urlRaw, type: typeFile };
    } catch (error) {
      console.error("Terjadi kesalahan saat membuat tautan berbagi:", error);
      toast({
        title: "Oppss!",
        description: `Terjadi kesalahan saat membuat tautan berbagi: ${error.message}`,
        isClosable: true,
        duration: 9000,
        status: "error",
      });
    }
  };

  const handleSaveEditThumbnail = async () => {
    console.log(thumbnailChange);
    // if (newFiles.length) {
    //   const newFileArray = [...files];
    //   for (let i = 0; i < newFiles.length; i++) {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(newFiles[i]);
    //     reader.onload = () => {
    //       newFileArray.push({
    //         file: reader.result,
    //         fileName: newFiles[i].name,
    //         description: newFiles[i].type,
    //       });
    //       setFiles(newFileArray);
    //       console.log(files, "ini file image");
    //     };
    //   }
    //   setFilesImage(newFiles);
    // }
    if (filesImage[0]) {
      const resImage = await uploadFile(
        `${datas?.title}-${moment(new Date()).valueOf()}`,
        "course",
        filesImage[0]
      );

      datas.thumbnail = resImage;
    }
    console.log(datas);

    const id = await updateDocumentFirebase(
      "courses",
      datas.id,
      datas.thumbnail
    );
    console.log(filesImage, "ini file image");
  };

  const handleFileEditThumbnail = async (filesImage) => {
    setThumbnailChange(filesImage[0]);
    // if (newFiles.length) {
    //   const newFileArray = [...files];
    //   for (let i = 0; i < newFiles.length; i++) {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(newFiles[i]);
    //     reader.onload = () => {
    //       newFileArray.push({
    //         file: reader.result,
    //         fileName: newFiles[i].name,
    //         description: newFiles[i].type,
    //       });
    //       setFiles(newFileArray);
    //       console.log(files, "ini file image");
    //     };
    //   }
    //   setFilesImage(newFiles);
    // }
    // if (filesImage[0]) {
    //   const resImage = await uploadFile(
    //     `${input?.title}-${moment(new Date()).valueOf()}`,
    //     "course",
    //     filesImage[0]
    //   );
    //   inputData.thumbnail = resImage;
    // }
    // console.log(inputData);
    // const id = await addDocumentFirebase(
    //   "courses",
    //   inputData,
    //   currentCompany
    // );
    // console.log(filesImage, "ini file image");
  };

  console.log(thumbnailChange, "ini ganti thumbnail");

  const handleFileInputChange = (event) => {
    console.log(event);
    const { files: newFiles } = event.target;

    if (newFiles.length) {
      const newFileArray = [...files];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(newFiles[i]);
        reader.onload = () => {
          newFileArray.push({
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
          });
          setFiles(newFileArray);
          console.log(newFileArray);
        };
      }
      setFilesImage(newFiles);
    }

    console.log(filesImage, "ini file image");
  };

  // const handleUpload = async (file) => {
  // 	// if (loading) {
  // 	// }
  // 	// setIsUploading(true);

  // 	// if (datas?.type === "changeThumbnail") {
  // 	// 	UploadBlob(file, uid, "courses", file.name, setProgress).then(
  // 	// 		(uploadedImg) => {
  // 	// 			// setInput({
  // 	// 			// 	thumbnail: uploadedImg.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1'),
  // 	// 			// });
  // 	// 			const updateData = {
  // 	// 				thumbnail: uploadedImg.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1')
  // 	// 			}

  // 	// 			console.log(uploadedImg);

  // 	// 			updateDocumentFirebase('courses', params?.id_course, updateData).then(() => {
  // 	// 				setIsUploading(false);
  // 	// 				onClose();
  // 	// 				navigate(-1)
  // 	// 			})
  // 	// 				.catch((error) => {
  // 	// 					toast({
  // 	// 						title: "Error",
  // 	// 						description: "error saving thumbnail : " + error.message,
  // 	// 						isClosable: true,
  // 	// 						duration: 9000,
  // 	// 						status: "error"
  // 	// 					})
  // 	// 				})
  // 	// 			setIsUploading(false);
  // 	// 		}
  // 	// 	);
  // 	// } else {
  // 	// 	UploadBlob(file, uid, "courses", file.name, setLoading).then(
  // 	// 		(uploadedImg) => {
  // 	// 			console.log(uploadedImg, "this is data result");
  // 	// 			setInput({
  // 	// 				...input,
  // 	// 				thumbnail: uploadedImg.url.replace(/(\.[^.\/\\]+)$/i, '_800x800$1'),
  // 	// 			});
  // 	// 			setIsUploading(false);
  // 	// 		}
  // 	// 	);
  // 	// }

  // };

  const UploadingComponent = () => (
    <HStack>
      <Spinner color="teal" size="xs" />
      <Text color="teal">Uploading... ({uploadProgress}%)</Text>
    </HStack>
  );

  useEffect(() => {
    // getAccessToken();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose()} size="2xl">
      <ModalOverlay />
      <ModalContent bg="gray.100">
        <ModalHeader textTransform="capitalize">
          {type === "delete" ? `Delete course ${datas?.title}` : datas?.title}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody bg="gray.100">
          {datas?.type === "addCourse" ? (
            <Stack>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  bg="white"
                  type="text"
                  placeholder="Input your course title"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      title: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input
                  bg="white"
                  type="text"
                  placeholder="Input your course title"
                  defaultValue={
                    datas?.course_type === "full_course"
                      ? "Full Course"
                      : "Mini Course"
                  }
                  disabled
                />
              </FormControl>
              <FormControl>
                <FormLabel>Desctiption</FormLabel>
                <Textarea
                  bg="white"
                  placeholder="Input description of your course"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Select bg="white" onChange={(e) => setPrice(e.target.value)}>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Image Thumbnail (optional)</FormLabel>
                <Input
                  bg="white"
                  type="file"
                  variant="ghost"
                  onChange={handleFileInputChange}
                />
              </FormControl>
              {isUploading ? <UploadingComponent /> : null}
            </Stack>
          ) : datas?.type === "section" || datas?.type === "lesson" ? (
            <>
              <FormControl>
                <FormLabel>Input</FormLabel>
                <Input
                  bg="white"
                  type="text"
                  placeholder={`Input your ${datas?.title} title`}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      title: e.target.value,
                    })
                  }
                />
              </FormControl>
            </>
          ) : type === "deleteCourse" ? (
            <Center>
              <Text>
                Are you sure want to delete course <b> {datas?.title}</b>?
                Deleting will remove all the sections and videos inisde
                {<br />}
                {<br />}
                {<br />}
                <b style={{ color: "#cc2400" }}>WARNING!! </b>This process
                cannot be undone.
              </Text>
            </Center>
          ) : datas?.type === "deleteLesson" ? (
            <>
              <Text fontWeight="bold">Delete {datas?.lesson?.title} ?</Text>
              <Text>
                {JSON.stringify(
                  datas?.course?.lessons?.filter(
                    (obj) => obj.id !== datas?.lesson?.id
                  )
                )}
              </Text>
              <Text>remove from array lessons, remove doc lesson</Text>
            </>
          ) : datas?.type === "changeThumbnail" ? (
            <>
              <Text textAlign="center" fontWeight="bold">
                Choose Thumbnail From Your Directory:
              </Text>
              <Input
                my={2}
                type="file"
                onChange={(e) => handleFileEditThumbnail(e.target.files)}
              />
            </>
          ) : (
            <></>
          )}
        </ModalBody>

        <ModalFooter>
          {datas?.type !== "deleteCourse" ? (
            <Button
              isLoading={loading}
              isDisabled={loading}
              loadingText="Saving..."
              colorScheme="red"
              mx={3}
              onClick={() => handleClose()}
            >
              Cancel
            </Button>
          ) : null}
          {type === "deleteCourse" ? (
            <Button
              isLoading={loading}
              isDisabled={loading}
              loadingText="Deleting..."
              colorScheme="red"
              onClick={() => handleDelete("deleteCourse")}
              size="sm"
              variant="ghost"
            >
              Yes, delete
            </Button>
          ) : datas?.type === "deleteLesson" ? (
            <Button
              colorScheme="blackAlpha"
              isLoading={loading}
              isDisabled={loading}
              loadingText="Saving..."
              onClick={() => handleDelete(datas?.type)}
            >
              Delete Lesson
            </Button>
          ) : datas?.type === "changeThumbnail" ? (
            <Button
              isLoading={loading}
              isDisabled={loading}
              loadingText="Saving..."
              colorScheme="green"
              onClick={() => handleSaveEditThumbnail()}
            >
              Save
            </Button>
          ) : (
            <Button
              isLoading={loading}
              isDisabled={loading}
              loadingText="Saving..."
              colorScheme="green"
              onClick={() => handleSave()}
            >
              Save
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Modals;
