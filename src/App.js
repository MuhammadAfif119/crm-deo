import { Box, Container, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import AppSideBar from "./Components/AppSideBar";
import Preloader from "./Components/Basic/Preloader";

import MainRoute from "./Routes/MainRoute";

function App() {
  const [barStatus, setBarStatus] = useState(false);

  const contentWidth = barStatus ? "85%" : "95%";
  const height = window.innerHeight;

  return (
    <>
      <Preloader />
      <Flex bgColor={"gray.100"} flex={1} flexDirection="row" spacing={3}>
        <Stack h={height} zIndex={100}>
          <AppSideBar setBarStatus={setBarStatus} />
        </Stack>
        
        <Spacer 
        />
        <Stack
          Stack
          w={["85%", null, "95%"]}
          transition={"0.2s ease-in-out"}
          minH={height}
        >
          <MainRoute />
        </Stack>
      </Flex>
    </>
  );
}

export default App;
