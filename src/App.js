import { Box, Container, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import AppSideBar from "./Components/AppSideBar";
import Preloader from "./Components/Basic/Preloader";

import MainRoute from "./Routes/MainRoute";
import Layout from "./Layouts";
import MainRouter from "./Router/MainRouter";
import AuthRouter from "./Router/AuthRouter";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Config/firebase";

function App() {
  const [barStatus, setBarStatus] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(true);
  const contentWidth = barStatus ? "85%" : "95%";
  const height = window.innerHeight;


  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedin(true);
    } else {
      setIsLoggedin(false);
    }
  });

  return (
    <>
      {/* <Preloader />
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
      </Flex> */}

     {isLoggedin ? (
        <Layout>
          <MainRouter />
        </Layout>
       ) : (
        <AuthRouter />
       )}
    </>
  );
}

export default App;
