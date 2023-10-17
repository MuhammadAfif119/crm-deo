import { Box, Spinner, Flex } from "@chakra-ui/react";
import React from "react";

const LoadingOverlay = () => {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      backgroundColor="rgba(255, 255, 255, 0.8)"
      zIndex="9999"
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Spinner size="xl" color="blue.500" />
      </Box>
    </Flex>
  );
};

export default LoadingOverlay;
