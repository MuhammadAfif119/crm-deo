import { Box, Container, Spacer, Stack, Text } from "@chakra-ui/react";
import AppFooter from "./Components/AppFooter";
import AppHeader from "./Components/AppHeader";
import Preloader from "./Components/Basic/Preloader";

import MainRoute from "./Routes/MainRoute";

function App() {
  return (
    <>
      <Preloader />
      <Stack>
        <MainRoute />
      </Stack>
    </>
  );
}

export default App;
