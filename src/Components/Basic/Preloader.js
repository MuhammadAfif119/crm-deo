import { HStack, Image, Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";

export default function Preloader() {
  const screenHeight = window.innerHeight;

 const loading = true

  return (
    loading && (
      <HStack
        space={2}
        justifyContent="center"
        position="fixed"
        zIndex="1"
        height={screenHeight}
        width="100%"
        bg="rgba(0, 0, 0, 0.7)"
      >
        {/* <Image src={gif} width='100px'/> */}
        <Spinner accessibilityLabel="Loading..." color="white" />
      </HStack>
    ) 
  );
}
