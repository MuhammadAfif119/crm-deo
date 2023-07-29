import {
  Button,
  Checkbox,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlinePermMedia, MdSchedule } from "react-icons/md";
import useUserStore from "../../Hooks/Zustand/Store";
import ApiBackend from "../../Api/ApiBackend";
import moment from "moment";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Config/firebase";

const TwitterPosts = () => {
  const [files, setFiles] = useState([]);
  const [posting, setPosting] = useState("");
  const [shortenLinks, setShotenLinks] = useState(false);
  const [platformActive, setPlatformActive] = useState(["twitter"]);
  const [scheduleActive, setScheduleActive] = useState(false);
  const [schedulePosting, setSchedulePosting] = useState();

  const toast = useToast();
  const { userDisplay } = useUserStore();

  const profileKey = userDisplay.profileKey;
  const title = userDisplay.projectTitle;

const currentUser = auth.currentUser
  const handleFileInputChange = (event) => {
    const { files: newFiles } = event.target;
    if (newFiles.length) {
      const newFileArray = [];
      for (let i = 0; i < newFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileData = {
            file: reader.result,
            fileName: newFiles[i].name,
            description: newFiles[i].type,
            isVideo: newFiles[i].type.startsWith("video/"),
          };
          newFileArray.push(fileData);
          if (i === newFiles.length - 1) {
            setFiles((prevFiles) => [...prevFiles, ...newFileArray]);
          }
        };
        reader.readAsDataURL(newFiles[i]);
      }
    }
  };

  const handlePost = async () => {

    let fileImage = [];

    if (profileKey) {
      ;
      if (files.length > 0) {
        files.forEach(async (x) => {
          try {
            const res = await ApiBackend.post("upload", {
              file: x.file,
              fileName: x.fileName,
              description: x.description,
            });
            fileImage.push(res.data.url);
            if (fileImage.length === files.length) {
              try {
                ;
                const res = await ApiBackend.post("post", {
                  post: posting,
                  platforms: platformActive,
                  mediaUrls: fileImage,
                  shortenLinks: shortenLinks,
                  scheduleDate: schedulePosting,
                  profileKey,
                });

                if (res.status === 200 && res.data.status === "error") {
                  // Menampilkan pesan error dan informasi platform yang dikirim
                  res.data.posts.forEach((post) => {
                    if (post.status === "error") {
                      post.errors.forEach((error) => {
                        toast({
                          title: "Deoapp.com",
                          description: `Error posting to ${error.platform}: ${error.message}`,
                          status: "error",
                          position: "top-right",
                          isClosable: true,
                        });
                      });
                    } else if (post.status === "success") {
                      platformActive.forEach(async (x) => {
                        let firebaseData = {
                          startDate: schedulePosting
                            ? new Date(schedulePosting)
                            : new Date(),
                          endDate: schedulePosting
                            ? new Date(moment(schedulePosting).add(1, "hour"))
                            : new Date(moment().add(1, "hour")),
                          image: fileImage,
                          uid: currentUser.uid,
                          name: title,
                          post: posting,
                          platform: x,
                          status: schedulePosting ? "schedule" : "active",
                        };
                        const ref = doc(db, "schedule", currentUser.uid);
                        await setDoc(
                          ref,
                          {
                            uid: currentUser.uid,
                            data: arrayUnion(firebaseData),
                            createdAt: new Date(),
                          },
                          { merge: true }
                        );
                      });

                      post.postIds.forEach((postId) => {
                        toast({
                          title: "Deoapp.com",
                          description: `Successfully posted to ${postId.platform}. Post ID: ${postId.id}`,
                          status: "success",
                          position: "top-right",
                          isClosable: true,
                        });
                      });
                    }
                  });

                  setPosting("");
                  setFiles([]);
                  setPlatformActive([]);
                  setShotenLinks(false);
                  setSchedulePosting("");
                } else {
                  // Menampilkan pesan error jika terjadi kesalahan saat melakukan permintaan API
                  toast({
                    title: "Deoapp.com",
                    description:
                      "Error posting: An error occurred while processing the request.",
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                  });
                }

                ;
              } catch (error) {
                console.log(error, "ini error ");
                // Menampilkan pesan error jika terjadi kesalahan saat melakukan permintaan API
                toast({
                  title: "Deoapp.com",
                  description:
                    "Error posting: An error occurred while processing the request.",
                  status: "error",
                  position: "top-right",
                  isClosable: true,
                });

                ;
              }
              ;
            }
            ;
          } catch (error) {
            console.log(error, "ini error");
          }
        });
      } else {
        if (posting !== "" || platformActive.length !== 0) {
          try {
            const res = await ApiBackend.post("post", {
              post: posting,
              platforms: platformActive,
              mediaUrls: null,
              shortenLinks: shortenLinks,
              scheduleDate: schedulePosting,
              profileKey,
            });
            if (res.status === 200) {
              if (
                res?.data?.status === "success" ||
                res?.data?.posts[0].postIds.length > 0
              ) {
                platformActive.forEach(async (x) => {
                  let firebaseData = {
                    startDate: schedulePosting
                      ? new Date(schedulePosting)
                      : new Date(),
                    endDate: schedulePosting
                      ? new Date(moment(schedulePosting).add(1, "hour"))
                      : new Date(moment().add(1, "hour")),
                    image: fileImage,
                    uid: currentUser.uid,
                    name: title,
                    post: posting,
                    platform: x,
                    status: schedulePosting ? "schedule" : "active",
                  };
                  const ref = doc(db, "schedule", currentUser.uid);
                  await setDoc(
                    ref,
                    {
                      uid: currentUser.uid,
                      data: arrayUnion(firebaseData),
                      createdAt: new Date(),
                    },
                    { merge: true }
                  );
                });
              } else {
                toast({
                  title: "Deoapp.com",
                  description: res.data.message,
                  status: "error",
                  position: "top-right",
                  isClosable: true,
                });
              }

              toast({
                title: "Deoapp.com",
                description: "Success posting.",
                status: "success",
                position: "top-right",
                isClosable: true,
              });
              setPosting("");
              setFiles([]);
              setPlatformActive([]);
              setShotenLinks(false);
              setSchedulePosting("");
              ;
            }
          } catch (error) {
            console.log(error, "ini error ");
          }
          ;
        } else {
          ;
          toast({
            title: "Deoapp.com",
            description: "please check your posting",
            status: "warning",
            position: "top-right",
            isClosable: true,
          });
        }
        ;
      }
    } else {
      toast({
        title: "Deoapp.com",
        description: "You must set billing pricing",
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      ;
    }
    ;
  };

  const handleDialogSchedule = () => {
    setSchedulePosting("");
    setScheduleActive(true);
  };
  return (
    <>
      <Stack borderRadius="lg" bgColor={"white"} shadow="md" spacing={3} p={5}>
        <Text fontSize={"sm"} color="gray.500">
          Type your post
        </Text>
        <Textarea
          placeholder="Here is a sample placeholder"
          fontSize={"sm"}
          onChange={(e) => setPosting(e.target.value)}
        />
        <Checkbox
          colorScheme="blue"
          defaultChecked
          onChange={(e) => setShotenLinks(e.target.checked)}
        >
          <Text fontSize={"sm"}>Shorten Links</Text>
        </Checkbox>
        <Checkbox
          colorScheme="blue"
          defaultChecked
          onChange={(e) => console.log(e.target.checked, "shorten")}
        >
          <Text fontSize={"sm"}>Twitter thread</Text>
        </Checkbox>
        <HStack spacing={2} alignItems="center">
          <Stack>
            <Input
              type="file"
              onChange={handleFileInputChange}
              accept="image/*,video/*" // Menentukan bahwa file yang diterima bisa berupa gambar atau video
              multiple // Mengizinkan memilih beberapa file
              display="none"
              id="fileInput"
            />
            <label htmlFor="fileInput">
              <HStack cursor={"pointer"}>
                <Stack>
                  <MdOutlinePermMedia />
                </Stack>
                <Text fontSize={"sm"}>Add Image / Video</Text>
              </HStack>
            </label>
          </Stack>
        </HStack>
        <SimpleGrid columns={[1, 2, 3]} gap={3}>
          {files.length > 0 &&
            files.map((x, index) => (
              <Stack key={index}>
                {x.isVideo ? (
                  <video controls width={300}>
                    <source src={x.file} type={x.description} />
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                ) : (
                  <Image
                    src={x.file}
                    borderRadius="xl"
                    alt={x.fileName}
                    shadow="md"
                  />
                )}
              </Stack>
            ))}
        </SimpleGrid>
        <HStack spacing={5} alignItems="center">
          <Button size={"sm"} p={5} shadow="lg" onClick={() => handlePost()}>
            <HStack spacing={2}>
              <FiSend />
              <Text fontSize={"sm"}>Post</Text>
            </HStack>
          </Button>

          <Button
            size={"sm"}
            p={5}
            shadow="lg"
            onClick={() => handleDialogSchedule()}
          >
            <HStack spacing={2}>
              <MdSchedule />
              <Text fontSize={"sm"}>Schedule</Text>
            </HStack>
          </Button>

          {schedulePosting && (
            <Stack spacing={0}>
              <Text fontSize={"xs"} color="gray.500">
                Schedule
              </Text>
              <Text fontSize={"sm"} color="gray.800">
                {moment(schedulePosting).format("LLLL")}
              </Text>
            </Stack>
          )}
        </HStack>
      </Stack>
    </>
  );
};

export default TwitterPosts;
