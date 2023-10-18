import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import useUserStore from "../../Hooks/Zustand/Store";

function DropboxUploader({
  isActive,
  onClose,
  parentPath,
  setShareLink,
  shareLink,
  accessTokenDb,
  setGeneratedLink,
}) {
  const fileInputRef = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const globalState = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Deoapp",
      description: "Copy to clipboard.",
      status: "success",
    });
  };

  useEffect(() => {
    // Cleanup effect to revoke object URLs
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const uploadFileToDropbox = async (file) => {
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

    const accessToken = globalState?.accessToken || accessTokenDb;
    const url = "https://content.dropboxapi.com/2/files/upload";

    console.log(accessToken, "xxx");
    const headers = {
      "Content-Type": "application/octet-stream",
      Authorization: `Bearer ${accessToken}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: `${parentPath}/${fileTypeFix}/${currentMillis}-${file.name}`, // Menggunakan currentMillis dalam path
        mode: "add",
        autorename: true,
        mute: false,
      }),
    };

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
        createShareLink(response.data.path_lower, fileTypeFix, accessToken);
      }
    } catch (error) {
      toast({
        title: "Oppss!",
        description: `Error occured when create share links: ${error.message}`,
        isClosable: true,
        duration: 9000,
        status: "error",
      });
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Tampilkan pratinjau file saat dipilih
      displayFilePreview(file);
    }
  };

  const handleSaveButtonClick = () => {
    const file = fileInputRef.current?.files[0];
    setIsLoading(true);
    try {
      if (file) {
        // Upload file ke Dropbox ketika tombol "Save" diklik
        uploadFileToDropbox(file);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

      setShareLink({ link: urlRaw, type: typeFile });
    } catch (error) {
      console.error("Error occured when create share links:", error);
      toast({
        title: "Oppss!",
        description: `Error occured when create share links: ${error.message}`,
        isClosable: true,
        duration: 9000,
        status: "error",
      });
    }
  };

  const displayFilePreview = (file) => {
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.split("/")[0];

    switch (fileType) {
      case "image":
        setFilePreview(
          <img src={fileUrl} alt="File Preview" style={{ width: "300px" }} />
        );
        break;
      case "video":
        setFilePreview(
          <video src={fileUrl} controls style={{ width: "300px" }}>
            Your browser does not support the video tag.
          </video>
        );
        break;
      case "audio":
        setFilePreview(
          <audio src={fileUrl} controls style={{ width: "300px" }}>
            Your browser does not support the audio element.
          </audio>
        );
        break;
      case "application":
        // Jika tipe datanya adalah PDF, gunakan elemen iframe
        if (file.type === "application/pdf") {
          setFilePreview(
            <iframe
              src={fileUrl}
              title="File Preview"
              width="300"
              height="200"
            ></iframe>
          );
        } else {
          setFilePreview(null); // Kosongkan pratinjau untuk tipe datanya yang tidak didukung
        }
        break;
      default:
        setFilePreview(null); // Kosongkan pratinjau untuk tipe datanya yang tidak didukung
        break;
    }
  };

  const handleDoneButton = () => {
    // Mengatur kembali state menjadi nilai awal
    setFilePreview(null);
    setUploadProgress(0);
    setShareLink("");
    onClose();

    // Menghapus file yang dipilih dengan mengecek bahwa fileInputRef.current tidak null
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal isOpen={isActive} onClose={handleDoneButton}>
      <ModalOverlay />
      <ModalContent zIndex={10}>
        {" "}
        {/* Mengatur zIndex agar modal berada di paling depan */}
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={5} p={4}>
            {/* Isi modal, gunakan komponen DropboxUploader yang sudah Anda buat */}
            {/* Tambahkan progress dan tombol-tombol yang diperlukan */}
            {filePreview}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              style={{
                height: "300px",
                width: "300px",
                borderRadius: "md",
                border: "2px dashed #cbd5e0",
                cursor: "pointer",
                padding: "8",
                textAlign: "center",
                display: filePreview !== null ? "none" : "flex",
              }}
            />
            <Progress
              mt={2}
              value={uploadProgress}
              size="sm"
              colorScheme="blue"
            />
            <Box mt={2}>{uploadProgress}%</Box>

            {shareLink && (
              <Stack mt={4} alignItems="center" justifyContent={"center"}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Text fontSize={11} color="gray.500">
                    {shareLink?.link ? shareLink?.link : "none"}
                  </Text>
                </Box>
                <HStack>
                  <Button
                    size={"sm"}
                    colorScheme="blue"
                    onClick={() => {
                      setGeneratedLink(shareLink.link);
                      onClose();
                    }}
                    variant={"outline"}
                  >
                    Save
                  </Button>
                  <Button
                    size={"sm"}
                    colorScheme="blue"
                    onClick={() => handleCopy(shareLink.link)}
                    variant={"outline"}
                  >
                    Copy
                  </Button>

                  <a
                    href={shareLink.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size={"sm"} colorScheme="blue" variant={"outline"}>
                      Open in new tab
                    </Button>
                  </a>
                </HStack>
              </Stack>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          {uploadProgress === 0 && (
            <HStack>
              <Button isLoading={isLoading} onClick={handleSaveButtonClick}>
                Save
              </Button>
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DropboxUploader;
