import { ArrowBackIcon } from "@chakra-ui/icons";
import { Text, Flex } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

function BackButtons() {
  const navigate = useNavigate();
  return (
    <Flex
      direction="row"
      alignItems="center"
      gap={2}
      onClick={() => navigate(-1)}
      sx={{ cursor: "pointer" }}
    >
      <ArrowBackIcon boxSize={5} color="#808080" />
      <Text fontWeight={500} color="#808080">
        Back
      </Text>
    </Flex>
  );
}

export default BackButtons;
