import React, { useState } from "react";
import { auth } from "../../Config/firebase";
import {
  Avatar,
  Button,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import useUserStore from "../../Hooks/Zustand/Store";

const ProfileSettingForm = ({
  data,
  setData,
  handleDeletePhoto,
  handleUploadImage,
}) => {
  const user = auth.currentUser;

  const globalState = useUserStore();
  const [isUploading, setIsUploading] = useState();

  const searchProject = globalState?.projects?.find(
    (x) => x.id === globalState?.currentProject
  );

  console.log(searchProject);

  return (
    <>
      <Stack justifyContent={"center"} alignItems={"center"} my={2}>
        {/* <Avatar size="lg" name={userData?.name} src={user.photoURL} /> */}
        {isUploading ? (
          <Spinner />
        ) : (
          <Avatar
            size="xl"
            name={data?.name}
            src={data?.image ? data?.image : ""}
          />
        )}

        {data?.image ? (
          <Button size="xs" colorScheme="red" onClick={handleDeletePhoto}>
            Delete
          </Button>
        ) : (
          <Input
            my={3}
            // as={Text}
            size={"sm"}
            type="file"
            variant={"unstyled"}
            // onChange={(e) => handleUploadImage(e.target.files[0])}
            onChange={handleUploadImage}
          />
        )}
      </Stack>

      <Stack>
        <Stack
          border={"1px"}
          borderRadius={"md"}
          borderColor={"gray.200"}
          p={2}
        >
          <Text fontSize={"sm"}>Project name</Text>
          <Input
            isDisabled
            value={data?.name}
            borderRadius={"md"}
            size={"sm"}
            bg={"gray.50"}
          />
        </Stack>

        <Stack
          border={"1px"}
          borderRadius={"md"}
          borderColor={"gray.200"}
          p={2}
        >
          <Text fontSize={"sm"}>Display Name</Text>
          <Input
            id="displayName"
            borderRadius={"md"}
            size={"sm"}
            bg={"gray.50"}
            defaultValue={data?.displayName}
            onChange={setData}
          />
        </Stack>

        <Stack
          border={"1px"}
          borderRadius={"md"}
          borderColor={"gray.200"}
          p={2}
        >
          <Text fontSize={"sm"}>Bio</Text>
          <Textarea
            id="bio"
            borderRadius={"md"}
            size={"sm"}
            bg={"gray.50"}
            defaultValue={data?.bio}
            onChange={setData}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default ProfileSettingForm;
