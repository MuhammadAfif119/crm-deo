import { Box, Container, Spacer, Stack, Text } from "@chakra-ui/react";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import Preloader from "./Components/Basic/Preloader";

import MainRoute from "./Routes/MainRoute";

function App() {
  return (
    <>
      <Preloader />
      <Container
        shadow="2xl"
        padding={0}
        w="full"
        alignItems={"flex-end"}
        justifyContent="space-between"
      >
        <AppHeader />
        <MainRoute />
        <AppFooter />
      </Container>
    </>
  );
}

export default App;
