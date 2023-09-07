import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";

const BackupPage = () => {
  const importCollection = async () => {
    const res = await axios();
  };
  return (
    <Stack>
      <Box border={"1px"}>
        <Text>Import</Text>
      </Box>
      <Box border={"1px"}>
        <Text>Export</Text>
      </Box>
    </Stack>
  );
};

export default BackupPage;
